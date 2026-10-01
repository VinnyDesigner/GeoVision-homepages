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
      // Find MapWorkspace element or fiber
      const mapContainer = document.querySelector('.leaflet-container');
      let fiberNode = null;
      for (const k in mapContainer) {
        if (k.startsWith('__reactFiber')) {
          fiberNode = mapContainer[k];
          break;
        }
      }
      
      let p = fiberNode;
      let mapWorkspaceFiber = null;
      while (p) {
        if (p.type && (p.type.name === 'MapWorkspace' || (typeof p.type === 'function' && p.type.toString().includes('activeRouteLayerGroupRef')))) {
          mapWorkspaceFiber = p;
          break;
        }
        p = p.return;
      }
      
      // Let's inspect the hooks of MapWorkspaceFiber
      let hooks = [];
      if (mapWorkspaceFiber) {
        let h = mapWorkspaceFiber.memoizedState;
        while (h) {
          hooks.push({
            memoizedState: typeof h.memoizedState === 'object' && h.memoizedState !== null
              ? (h.memoizedState.current ? 'ref' : Object.keys(h.memoizedState))
              : h.memoizedState
          });
          h = h.next;
        }
      }
      
      return {
        foundMapWorkspace: !!mapWorkspaceFiber,
        hooksCount: hooks.length,
        hooksSummary: hooks
      };
    })()`
  });

  console.log('Result:', JSON.stringify(res, null, 2));
  process.exit(0);
}

run();
