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

async function testCss(name, fn) {
  const wsUrl = await getWebSocketUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));

  const res = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `(${fn.toString()})()`
  });

  console.log(`=== ${name} ===`);
  console.log(JSON.stringify(res.result.value, null, 2));

  const snap = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`scratch/modal_test_${name}.png`, Buffer.from(snap.data, 'base64'));
  console.log(`Saved scratch/modal_test_${name}.png`);

  ws.close();
}

async function run() {
  // Test Option A: max-height: calc(100% - 2rem) or min(100%, ...)
  await testCss('opt_percentage_height', () => {
    const overlay = document.querySelector('.fixed.inset-0.z-\\[9999\\]');
    const card = overlay ? overlay.firstElementChild : null;
    if (!card) return 'no card';

    // Apply inline test styles
    card.style.maxHeight = 'calc(100% - 2rem)';
    card.style.height = 'auto';

    const r = card.getBoundingClientRect();
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close Studio') || b.textContent.includes('إلغاء'));
    const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Print / Save PDF') || b.textContent.includes('حفظ كملف'));

    return {
      cardRect: { top: r.top, bottom: r.bottom, height: r.height },
      closeRect: closeBtn ? closeBtn.getBoundingClientRect() : null,
      printRect: printBtn ? printBtn.getBoundingClientRect() : null,
      windowHeight: window.innerHeight
    };
  });
}

run().catch(console.error);
