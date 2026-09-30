import http from 'http';
import fs from 'fs';
import path from 'path';

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
  if (!target) {
    console.error('No Vite page target found');
    process.exit(1);
  }

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

  // Navigate to map
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.location.hash = '#map';
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Explore Map') || b.textContent.includes('استكشف الخريطة'));
      if (btn) btn.click();
    })()`
  });
  await new Promise((r) => setTimeout(r, 2000));

  // Take screenshot 1: initial state
  const s1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/zoom_s1_initial.png', Buffer.from(s1.data, 'base64'));
  console.log('Saved scratch/zoom_s1_initial.png');

  // Click Zoom In button
  console.log('Clicking Zoom In (+)...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[title*="Zoom In"], button[title*="تكبير"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Take screenshot 2: after zoom in
  const s2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/zoom_s2_after_plus.png', Buffer.from(s2.data, 'base64'));
  console.log('Saved scratch/zoom_s2_after_plus.png');

  // Click Zoom Out button 3 times
  console.log('Clicking Zoom Out (-)...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[title*="Zoom Out"], button[title*="تصغير"]');
      if (btn) {
        btn.click();
        setTimeout(() => btn.click(), 400);
        setTimeout(() => btn.click(), 800);
      }
    })()`
  });
  await new Promise((r) => setTimeout(r, 2000));

  // Take screenshot 3: after zoom out
  const s3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/zoom_s3_after_minus.png', Buffer.from(s3.data, 'base64'));
  console.log('Saved scratch/zoom_s3_after_minus.png');

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
