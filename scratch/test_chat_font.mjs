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

  // Reload page to ensure new Google Fonts load cleanly
  console.log('Reloading page on http://localhost:5173/#map ...');
  await send('Page.navigate', { url: 'http://localhost:5173/#map' });
  await new Promise((r) => setTimeout(r, 2000));

  // Check font styles computed on chat panel
  const fontInfoRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const bodyFont = window.getComputedStyle(document.body).fontFamily;
      const messageElem = document.querySelector('.border-slate-200\\\\/80 p') || document.querySelector('.border-slate-200\\\\/80');
      const messageFont = messageElem ? window.getComputedStyle(messageElem).fontFamily : '';
      const messageWeight = messageElem ? window.getComputedStyle(messageElem).fontWeight : '';
      const headerTitle = document.querySelector('h2');
      const headerTitleText = headerTitle?.innerText || '';
      const recButton = document.querySelector('button .leading-snug');
      const recText = recButton?.innerText || '';
      const recFont = recButton ? window.getComputedStyle(recButton).fontFamily : '';
      const recWeight = recButton ? window.getComputedStyle(recButton).fontWeight : '';

      return {
        bodyFont,
        messageFont,
        messageWeight,
        headerTitleText,
        recText,
        recFont,
        recWeight
      };
    })()`,
    returnByValue: true
  });
  console.log('Font & Typography Info:', JSON.stringify(fontInfoRes.result.value, null, 2));

  // Capture screenshot of the chat panel
  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.resolve('scratch/chat_panel_font_verified.png');
  fs.writeFileSync(outPath, Buffer.from(screenshotRes.data, 'base64'));
  console.log('Screenshot saved to:', outPath);

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
