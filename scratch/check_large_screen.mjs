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

  console.log('Connected to Chrome DevTools session.');

  // Check what's on screen
  const snap = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/large_screen_user_view.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/large_screen_user_view.png');

  // Check if print modal is open or if we need to open it
  const evalResult = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const modal = document.querySelector('#sdi-printable-report');
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close Studio') || b.textContent.includes('إلغاء'));
      const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Print / Save PDF') || b.textContent.includes('حفظ كملف'));
      const modalCard = modal ? modal.closest('.bg-white, .dark\\\\:bg-slate-900') : null;
      
      return {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        hasModal: !!modal,
        hasCloseBtn: !!closeBtn,
        closeRect: closeBtn ? closeBtn.getBoundingClientRect() : null,
        printRect: printBtn ? printBtn.getBoundingClientRect() : null,
        modalCardRect: modalCard ? modalCard.getBoundingClientRect() : null,
        documentRect: modal ? modal.getBoundingClientRect() : null
      };
    })()`
  });

  console.log('DOM check:', JSON.stringify(evalResult.result.value, null, 2));

  // If modal not open, open it
  if (!evalResult.result.value.hasModal) {
    await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.title?.includes('Print') || b.textContent?.includes('Print') || b.textContent?.includes('طباعة'));
        if (printBtn) printBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    const snap2 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/large_screen_print_modal.png', Buffer.from(snap2.data, 'base64'));
    console.log('Saved scratch/large_screen_print_modal.png');
  }

  ws.close();
}

run().catch(console.error);
