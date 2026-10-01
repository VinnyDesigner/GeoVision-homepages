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

      let routeEffectDeps = null;
      let routeGroupLayers = null;
      if (mapWorkspaceFiber) {
        let h = mapWorkspaceFiber.memoizedState;
        let idx = 0;
        while (h) {
          if (h.memoizedState && h.memoizedState.deps && h.memoizedState.deps.includes('driving')) {
            routeEffectDeps = {
              idx,
              deps: h.memoizedState.deps.map(d => typeof d === 'object' && d !== null ? { id: d.id, nameEn: d.nameEn } : d)
            };
          }
          if (idx === 8 && h.memoizedState?.current) {
            const group = h.memoizedState.current;
            routeGroupLayers = {
              isLayerGroup: group instanceof L.LayerGroup,
              hasMap: !!group._map,
              keys: Object.keys(group._layers || {})
            };
          }
          idx++;
          h = h.next;
        }
      }

      return {
        routeEffectDeps,
        routeGroupLayers
      };
    })()`
  });

  console.log('Result:', JSON.stringify(res, null, 2));
  process.exit(0);
}

run();
