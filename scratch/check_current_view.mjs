import http from 'http';
import fs from 'fs';

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

  // Capture current state of the page
  const pageState = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const map = window.geovisionMap;
      const paths = Array.from(document.querySelectorAll('path')).map(p => ({
        stroke: p.getAttribute('stroke'),
        strokeWidth: p.getAttribute('stroke-width'),
        class: p.getAttribute('class'),
        d: (p.getAttribute('d') || '').substring(0, 40)
      }));

      const hud = document.querySelector('.glass-level-3, [class*="animate-slide-in"]');
      const etaPill = document.querySelector('.gmaps-eta-pill-icon');
      const originMarker = document.querySelector('.gmaps-origin-marker');
      const destMarker = document.querySelector('.gmaps-dest-marker');

      return {
        pathCount: paths.length,
        paths,
        hasHud: Boolean(hud),
        hudText: hud ? hud.textContent.substring(0, 100) : null,
        hasEtaPill: Boolean(etaPill),
        hasOriginMarker: Boolean(originMarker),
        hasDestMarker: Boolean(destMarker),
      };
    })()`
  });

  console.log('Current Page State:', JSON.stringify(pageState.result.value, null, 2));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\VinodhKumarMandhala\\.gemini\\antigravity-ide\\brain\\b162200b-e421-437e-9fe0-2177575accc6\\current_user_view.png';
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log('Saved current view screenshot to:', outPath);

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
