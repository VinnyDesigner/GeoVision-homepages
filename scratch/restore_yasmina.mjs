import http from 'http';

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

  // Find the button for Al Yasmina Academy
  await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('button[aria-label="Directions & Route"]'));
      let targetBtn = null;
      for (const btn of buttons) {
        let parent = btn.parentElement;
        while (parent && parent !== document.body) {
          if (parent.innerText && parent.innerText.includes('Al Yasmina Academy')) {
            targetBtn = btn;
            break;
          }
          parent = parent.parentElement;
        }
        if (targetBtn) break;
      }
      if (targetBtn) targetBtn.click();
    })()`
  });

  // Wait 1.5s for route calculation
  await new Promise((r) => setTimeout(r, 1500));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const fs = await import('fs');
  fs.writeFileSync('scratch/al_yasmina_directions_restored.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved scratch/al_yasmina_directions_restored.png');
  process.exit(0);
}

run();
