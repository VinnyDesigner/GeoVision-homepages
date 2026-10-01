import http from 'http';

function getWebSocketUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const targets = JSON.parse(data);
        const target = targets.find(t => t.type === 'page');
        if (target && target.webSocketDebuggerUrl) {
          resolve(target.webSocketDebuggerUrl);
        } else {
          reject(new Error('Target not found'));
        }
      });
    }).on('error', reject);
  });
}

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  const wsUrl = await getWebSocketUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));

  const check = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const html = document.documentElement;
      const body = document.body;
      const htmlCS = window.getComputedStyle(html);
      const bodyCS = window.getComputedStyle(body);
      return {
        devicePixelRatio: window.devicePixelRatio,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        html: { zoom: htmlCS.zoom, transform: htmlCS.transform, height: htmlCS.height, width: htmlCS.width },
        body: { zoom: bodyCS.zoom, transform: bodyCS.transform, height: bodyCS.height, width: bodyCS.width },
      };
    })()`
  });

  console.log(JSON.stringify(check.result.value, null, 2));
  ws.close();
}

run().catch(console.error);
