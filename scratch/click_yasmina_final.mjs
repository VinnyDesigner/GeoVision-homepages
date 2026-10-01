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

  const res = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      // Find all divs that contain "Al Yasmina Academy"
      const allElems = Array.from(document.querySelectorAll('*'));
      const yasminaHeaders = allElems.filter(el => el.children.length === 0 && el.innerText === 'Al Yasmina Academy');
      if (yasminaHeaders.length > 0) {
        // Find nearest parent card
        let parent = yasminaHeaders[0].parentElement;
        while (parent && !parent.querySelector('button[aria-label="Directions & Route"]')) {
          parent = parent.parentElement;
        }
        if (parent) {
          const btn = parent.querySelector('button[aria-label="Directions & Route"]');
          if (btn) {
            btn.click();
            return { clicked: true };
          }
        }
      }
      return { clicked: false, count: yasminaHeaders.length };
    })()`
  });

  console.log('Click result:', JSON.stringify(res, null, 2));

  // Wait 1.5s for calculation
  await new Promise((r) => setTimeout(r, 1500));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const fs = await import('fs');
  fs.writeFileSync('scratch/al_yasmina_final_verified.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved scratch/al_yasmina_final_verified.png');
  process.exit(0);
}

run();
