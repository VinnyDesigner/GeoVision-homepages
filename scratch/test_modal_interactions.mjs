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

  // Test 1: Switch to Spatial Data Ledger tab
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const ledgerBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Spatial Data Ledger') || b.textContent.includes('سجل البيانات'));
      if (ledgerBtn) ledgerBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  let snap = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/modal_tab_ledger.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/modal_tab_ledger.png');

  // Test 2: Switch to GIS Map & Extent Canvas tab
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const mapBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('GIS Map & Extent') || b.textContent.includes('خريطة النطاق'));
      if (mapBtn) mapBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  snap = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/modal_tab_map.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/modal_tab_map.png');

  // Check footer rect in map tab
  const footerCheck = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Print / Save PDF') || b.textContent.includes('حفظ كملف'));
      const r = printBtn ? printBtn.getBoundingClientRect() : null;
      return {
        printBtnRect: r ? { top: Math.round(r.top), bottom: Math.round(r.bottom) } : null,
        windowHeight: window.innerHeight
      };
    })()`
  });
  console.log('Map tab footer check:', footerCheck.result.value);

  // Switch back to Executive Briefing
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const briefBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Executive Briefing') || b.textContent.includes('تقرير ملخص'));
      if (briefBtn) briefBtn.click();
    })()`
  });

  ws.close();
}

run().catch(console.error);
