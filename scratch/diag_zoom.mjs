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
    expression: `window.location.hash = '#map';`
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Find map and test zoom
  const res = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const plusBtn = document.querySelector('button[title*="Zoom In"], button[title*="تكبير"]');
      const minusBtn = document.querySelector('button[title*="Zoom Out"], button[title*="تصغير"]');
      
      // Let's attach a listener to see geovision:zoomIn events
      let receivedEvents = [];
      window.addEventListener('geovision:zoomIn', () => receivedEvents.push('geovision:zoomIn'));
      window.addEventListener('geovision:zoomOut', () => receivedEvents.push('geovision:zoomOut'));
      
      // Let's find map zoom from scale text or coordinates at bottom left
      const scaleEl = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('Scale:'));
      const scaleBefore = scaleEl ? scaleEl.textContent : 'none';

      // Click plus 3 times
      if (plusBtn) {
        plusBtn.click();
        plusBtn.click();
        plusBtn.click();
      }

      return {
        hasPlusBtn: !!plusBtn,
        hasMinusBtn: !!minusBtn,
        scaleBefore,
        receivedEvents
      };
    })()`
  });

  console.log('Test result:', res.result.value);

  await new Promise((r) => setTimeout(r, 1500));

  const after = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const scaleEl = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('Scale:'));
      return {
        scaleAfter: scaleEl ? scaleEl.textContent : 'none',
      };
    })()`
  });
  console.log('After clicks:', after.result.value);

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
