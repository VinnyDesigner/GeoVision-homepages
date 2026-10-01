import http from 'http';

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const list = await getJson('http://127.0.0.1:9222/json/list');
  const target = list.find((t) => t.type === 'page' && t.url.includes('localhost:5173'));
  const ws = new globalThis.WebSocket(target.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  const debugInfo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const layers = [];
      const map = window.geovisionMap;
      if (map) {
        map.eachLayer(l => {
          if (l instanceof L.Polyline && !(l instanceof L.Polygon)) {
            layers.push({
              type: 'Polyline',
              latlngsCount: (l.getLatLngs() || []).length,
              color: l.options.color,
              weight: l.options.weight,
              opacity: l.options.opacity
            });
          } else if (l instanceof L.Polygon) {
            layers.push({
              type: 'Polygon',
              color: l.options.color
            });
          } else if (l instanceof L.Marker) {
            layers.push({
              type: 'Marker',
              latlng: l.getLatLng()
            });
          }
        });
      }

      return {
        mapExists: Boolean(map),
        layerCount: layers.length,
        layers
      };
    })()`
  });

  console.log('Debug info:', JSON.stringify(debugInfo.result.value, null, 2));
  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
