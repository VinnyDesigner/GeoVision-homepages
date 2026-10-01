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

  const diag = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const overlay = document.querySelector('.fixed.inset-0.z-\\\\[9999\\\\]');
      const card = overlay ? overlay.firstElementChild : null;
      const header = card ? card.children[0] : null;
      const body = card ? card.children[1] : null;
      const footer = card ? card.children[2] : null;
      const report = document.querySelector('#sdi-printable-report');

      function getInfo(el, name) {
        if (!el) return { name, exists: false };
        const r = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        return {
          name,
          rect: { top: r.top, bottom: r.bottom, height: r.height, left: r.left, width: r.width },
          css: {
            height: cs.height,
            maxHeight: cs.maxHeight,
            minHeight: cs.minHeight,
            overflow: cs.overflow,
            overflowY: cs.overflowY,
            flex: cs.flex,
            display: cs.display,
            position: cs.position
          }
        };
      }

      return {
        window: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
        overlay: getInfo(overlay, 'overlay'),
        card: getInfo(card, 'card'),
        header: getInfo(header, 'header'),
        body: getInfo(body, 'body'),
        footer: getInfo(footer, 'footer'),
        report: getInfo(report, 'report')
      };
    })()`
  });

  console.log(JSON.stringify(diag.result.value, null, 2));
  ws.close();
}

run().catch(console.error);
