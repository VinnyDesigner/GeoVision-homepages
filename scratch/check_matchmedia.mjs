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

  const res = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        zoom: window.getComputedStyle(document.documentElement).zoom,
        m_2100_900: window.matchMedia('(min-width: 2100px) and (min-height: 900px)').matches,
        m_2500_1050: window.matchMedia('(min-width: 2500px) and (min-height: 1050px)').matches,
        m_2000: window.matchMedia('(min-width: 2000px)').matches,
        m_2500: window.matchMedia('(min-width: 2500px)').matches,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        screenAvailWidth: window.screen.availWidth,
        screenAvailHeight: window.screen.availHeight,
        devicePixelRatio: window.devicePixelRatio
      };
    })()`
  });

  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}

run().catch(console.error);
