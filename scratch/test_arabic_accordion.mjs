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

  console.log('Testing Arabic mode...');
  // Switch to Arabic
  await send('Runtime.evaluate', {
    expression: `(() => {
      const langBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('العربية'));
      if (langBtn) langBtn.click();
    })()`
  });

  await new Promise((r) => setTimeout(r, 600));

  // Click Info button on a card in Arabic mode
  await send('Runtime.evaluate', {
    expression: `(() => {
      const firstCard = document.querySelector('[id^="result-card-"]');
      if (firstCard) {
        const infoBtn = firstCard.querySelector('button[aria-label="Spatial Summary"], button[title="Spatial Summary"], button[title*="الملخص"]');
        if (infoBtn) infoBtn.click();
      }
    })()`
  });

  await new Promise((r) => setTimeout(r, 600));

  const sc = await send('Page.captureScreenshot', { format: 'png' });
  const out = path.resolve('scratch/arabic_accordion_verified.png');
  fs.writeFileSync(out, Buffer.from(sc.data, 'base64'));
  console.log('Saved Arabic screenshot:', out);

  // Switch back to English
  await send('Runtime.evaluate', {
    expression: `(() => {
      const enBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('English'));
      if (enBtn) enBtn.click();
    })()`
  });

  ws.close();
  console.log('Done testing Arabic!');
}

run().catch(console.error);
