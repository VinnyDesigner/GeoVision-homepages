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

  // Close AI panel
  console.log('Closing AI panel...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const closeBtn = document.querySelector('button[title="Close AI Assistant"]');
      if (closeBtn) closeBtn.click();
    })()`
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Capture screenshot of Full Screen Map
  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.resolve('scratch/map_fullscreen_floating_header.png');
  fs.writeFileSync(outPath, Buffer.from(screenshotRes.data, 'base64'));
  console.log('Screenshot saved to:', outPath);

  // Re-open AI panel so state stays preserved
  await send('Runtime.evaluate', {
    expression: `(() => {
      const toggleBtn = document.querySelector('button[title="Open GeoVision AI Assistant"]');
      if (toggleBtn) toggleBtn.click();
    })()`
  });

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
