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

      let allHooks = [];
      if (mapWorkspaceFiber) {
        let h = mapWorkspaceFiber.memoizedState;
        let idx = 0;
        while (h) {
          let val = h.memoizedState;
          if (val && val.current !== undefined) {
            val = {
              isRef: true,
              type: val.current?.constructor?.name,
              keys: val.current ? Object.keys(val.current) : null,
              layersCount: val.current?._layers ? Object.keys(val.current._layers).length : null
            };
          } else if (val && val.create !== undefined) {
            val = {
              isEffect: true,
              deps: val.deps
            };
          }
          allHooks.push({ idx, val });
          idx++;
          h = h.next;
        }
      }

      return {
        allHooks
      };
    })()`
  });

  console.log('Hooks breakdown:', JSON.stringify(res, null, 2));
  process.exit(0);
}

run();
