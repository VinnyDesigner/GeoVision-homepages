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
      const zBefore = map ? map.getZoom() : null;
      const btn = document.querySelector('button[title*="Zoom In"]');
      let clickHandlerFired = false;
      let windowEventFired = false;
      
      window.addEventListener('geovision:zoomIn', () => { windowEventFired = true; }, { once: true });
      
      if (btn) {
        btn.click();
      }

      return {
        zBefore,
        hasBtn: !!btn,
        windowEventFired
      };
    })()`
  });

  console.log('Result right after click:', res.result.value);

  await new Promise((r) => setTimeout(r, 800));

  const after = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => ({ zoom: window.geovisionMap ? window.geovisionMap.getZoom() : null }))()`
  });

  console.log('Result 800ms after click:', after.result.value);

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
