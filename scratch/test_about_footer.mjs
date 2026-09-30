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

  // Navigate to About Us
  console.log('Navigating to About Us...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.location.hash = '#about';
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('About Us') || b.textContent.includes('من نحن'));
      if (btn) btn.click();
    })()`
  });
  await new Promise((r) => setTimeout(r, 1500));

  // Scroll to bottom
  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });`
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Capture screenshot of footer
  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.resolve('scratch/about_footer_verified.png');
  fs.writeFileSync(outPath, Buffer.from(screenshotRes.data, 'base64'));
  console.log('Screenshot saved to:', outPath);

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
