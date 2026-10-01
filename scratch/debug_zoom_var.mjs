import http from 'http';
import fs from 'fs';

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
      function r2o(r) {
        if (!r) return null;
        return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), height: Math.round(r.height) };
      }

      const overlay = document.querySelector('.fixed.inset-0.z-\\\\[9999\\\\]');
      const card = overlay ? overlay.firstElementChild : null;
      const header = card ? card.children[0] : null;
      const footer = card ? card.children[card.children.length - 1] : null;
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close Studio') || b.textContent.includes('إلغاء'));
      const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Print / Save PDF') || b.textContent.includes('حفظ كملف'));
      const csvBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Export Data (CSV)') || b.textContent.includes('تصدير CSV'));

      return {
        computedScreenZoom: window.getComputedStyle(document.documentElement).getPropertyValue('--screen-zoom'),
        cardRect: r2o(card ? card.getBoundingClientRect() : null),
        headerRect: r2o(header ? header.getBoundingClientRect() : null),
        footerRect: r2o(footer ? footer.getBoundingClientRect() : null),
        closeBtnRect: r2o(closeBtn ? closeBtn.getBoundingClientRect() : null),
        printBtnRect: r2o(printBtn ? printBtn.getBoundingClientRect() : null),
        csvBtnRect: r2o(csvBtn ? csvBtn.getBoundingClientRect() : null),
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
      };
    })()`
  });

  console.log(JSON.stringify(res.result.value, null, 2));

  const snap = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/perfect_large_screen_fix.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/perfect_large_screen_fix.png');

  ws.close();
}

run().catch(console.error);
