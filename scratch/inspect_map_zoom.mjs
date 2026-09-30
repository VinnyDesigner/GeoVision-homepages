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
  if (!target) {
    console.error('No Vite page target found');
    process.exit(1);
  }

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
      // Find the map container
      const container = document.querySelector('.leaflet-container');
      if (!container) return { error: 'No leaflet container' };
      
      // Let's find map instance by checking keys or leaflet id
      let map = null;
      // In leaflet, map._container === container
      // Or in container._leaflet_events or similar
      const allProps = Object.keys(container);
      let leafletId = container._leaflet_id;

      // Let's also check if we can dispatch geovision:zoomIn and see what happens
      return {
        leafletId,
        containerClass: container.className,
        containerStyle: container.getAttribute('style')
      };
    })()`
  });

  console.log('Result:', res.result.value);

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
