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
      // Find react fiber from root or any element
      const root = document.querySelector('#root');
      let fiberKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
      let fiber = root[fiberKey];
      
      // Let's traverse fiber to find AppStateContext or MapWorkspace
      let curr = fiber;
      let appState = null;
      let mapWorkspaceProps = null;
      
      function searchFiber(f, depth = 0) {
        if (!f || depth > 30) return;
        if (f.memoizedProps && f.memoizedProps.value && f.memoizedProps.value.navigationTarget !== undefined) {
          appState = {
            hasNavigationTarget: !!f.memoizedProps.value.navigationTarget,
            navigationTargetId: f.memoizedProps.value.navigationTarget?.id,
            navigationTargetName: f.memoizedProps.value.navigationTarget?.nameEn,
            selectedFeatureId: f.memoizedProps.value.selectedFeature?.id,
            selectedFeatureName: f.memoizedProps.value.selectedFeature?.nameEn,
            routeMode: f.memoizedProps.value.routeMode
          };
          return;
        }
        let child = f.child;
        while (child) {
          searchFiber(child, depth + 1);
          if (appState) return;
          child = child.sibling;
        }
      }
      
      searchFiber(fiber);

      return {
        appState
      };
    })()`
  });

  console.log('React State:', JSON.stringify(res, null, 2));
  process.exit(0);
}

run();
