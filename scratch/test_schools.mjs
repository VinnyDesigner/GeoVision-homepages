import http from 'http';
import fs from 'fs';

function getWebSocketUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const targets = JSON.parse(data);
        const target = targets.find(t => t.url.includes('localhost:5173') || t.title.includes('GeoVision'));
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

  // Click the recommendation button "Show schools within 2 km of bus stations in Khalifa City"
  const clickRes = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent && b.textContent.includes('Show schools within 2 km'));
        if (btn) {
          btn.click();
          return 'Clicked button: ' + btn.textContent.trim();
        }
        return 'Not found';
      })()
    `,
    returnByValue: true
  });

  console.log('Click result:', clickRes.result.value);

  // Wait for AI response
  await new Promise(r => setTimeout(r, 2500));

  const screenshot = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/schools_bus_view.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved scratch/schools_bus_view.png');

  ws.close();
}

run().catch(console.error);
