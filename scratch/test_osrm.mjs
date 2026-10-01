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

  // Evaluate fetch to OSRM from browser context
  const testFetch = await send('Runtime.evaluate', {
    returnByValue: true,
    awaitPromise: true,
    expression: `(async () => {
      const origin = [24.4539, 54.3773];
      const dest = [24.4239, 54.5801];
      const url = "https://router.project-osrm.org/route/v1/driving/" + origin[1] + "," + origin[0] + ";" + dest[1] + "," + dest[0] + "?overview=full&geometries=geojson&steps=true";
      try {
        const res = await fetch(url);
        const data = await res.json();
        return {
          ok: res.ok,
          code: data.code,
          coordsLength: data.routes?.[0]?.geometry?.coordinates?.length
        };
      } catch (e) {
        return { error: e.message };
      }
    })()`
  });

  console.log('OSRM test fetch:', JSON.stringify(testFetch.result.value, null, 2));

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
