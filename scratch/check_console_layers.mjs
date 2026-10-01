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

  // Enable Log and Runtime
  await send('Log.enable');
  await send('Runtime.enable');

  const logs = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        errors: window.__ERRORS__ || [],
        leafletId: (window.geovisionMap ? window.geovisionMap._leaflet_id : null),
        activeRouteGroup: window.geovisionMap ? (function() {
          let count = 0;
          let layerTypes = [];
          window.geovisionMap.eachLayer(l => {
            count++;
            if (l instanceof L.Polyline) {
              layerTypes.push({
                type: 'polyline',
                latlngsCount: (l.getLatLngs() || []).length,
                options: l.options
              });
            } else if (l instanceof L.Marker) {
              layerTypes.push({
                type: 'marker',
                pos: l.getLatLng(),
                iconHtml: l.options?.icon?.options?.html ? l.options.icon.options.html.slice(0, 40) : null
              });
            }
          });
          return { count, layerTypes };
        })() : null
      };
    })()`
  });

  console.log('Console and Layers:', JSON.stringify(logs, null, 2));
  process.exit(0);
}

run();
