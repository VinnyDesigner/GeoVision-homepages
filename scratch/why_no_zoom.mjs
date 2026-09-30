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

  const res = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const map = window.geovisionMap;
      if (!map) return { error: 'no map' };
      
      const before = {
        zoom: map.getZoom(),
        center: map.getCenter(),
        bounds: map.getBounds(),
        maxBounds: map.options.maxBounds,
        options: {
          zoomSnap: map.options.zoomSnap,
          zoomDelta: map.options.zoomDelta,
          minZoom: map.options.minZoom,
          maxZoom: map.options.maxZoom,
        }
      };

      // Try setView with animate: false
      map.setView(map.getCenter(), 15, { animate: false });
      const afterSetView = map.getZoom();

      // Try flyTo
      map.flyTo(map.getCenter(), 16);
      const afterFlyTo = map.getZoom();

      return {
        before,
        afterSetView,
        afterFlyTo
      };
    })()`
  });

  console.log('Result:', JSON.stringify(res.result.value, null, 2));

  await new Promise((r) => setTimeout(r, 1000));

  const finalCheck = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => ({ zoom: window.geovisionMap ? window.geovisionMap.getZoom() : null }))()`
  });
  console.log('Final check after 1s:', finalCheck.result.value);

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
