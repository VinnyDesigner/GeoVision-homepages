import http from 'http';
import fs from 'fs';

function getWebSocketUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const targets = JSON.parse(data);
        const target = targets.find(t => t.type === 'page');
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

  const res = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const overlay = document.querySelector('.fixed.inset-0.z-\\\\[9999\\\\]');
      const card = overlay ? overlay.firstElementChild : null;
      if (!overlay || !card) return { error: 'elements not found' };

      const results = {};

      // Test 1: overlay zoom = 1
      overlay.style.zoom = '1';
      results.test1_overlay_zoom_1 = {
        overlayRect: overlay.getBoundingClientRect(),
        cardRect: card.getBoundingClientRect(),
        computedOverlayZoom: window.getComputedStyle(overlay).zoom
      };

      // Test 2: overlay zoom = 0.75 (1 / 1.333333)
      overlay.style.zoom = '0.75';
      results.test2_overlay_zoom_075 = {
        overlayRect: overlay.getBoundingClientRect(),
        cardRect: card.getBoundingClientRect(),
        computedOverlayZoom: window.getComputedStyle(overlay).zoom
      };

      // Test 3: reset overlay zoom, test card maxHeight = calc(100vh / 1.333 - 3rem)
      overlay.style.zoom = '';
      card.style.maxHeight = 'calc(100vh / 1.333 - 3rem)';
      card.style.height = 'auto';
      results.test3_card_maxHeight_calc = {
        cardRect: card.getBoundingClientRect(),
        cardCssMaxHeight: window.getComputedStyle(card).maxHeight,
        windowHeight: window.innerHeight
      };

      // Test 4: card maxHeight = calc((100vh - 4rem) / 1.333)
      card.style.maxHeight = 'calc((100vh - 4rem) / 1.333)';
      const r4 = card.getBoundingClientRect();
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close Studio') || b.textContent.includes('إلغاء'));
      const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Print / Save PDF') || b.textContent.includes('حفظ كملف'));
      results.test4_card_maxHeight_perfect = {
        cardRect: { top: r4.top, bottom: r4.bottom, height: r4.height },
        closeRect: closeBtn ? closeBtn.getBoundingClientRect() : null,
        printRect: printBtn ? printBtn.getBoundingClientRect() : null,
        windowHeight: window.innerHeight
      };

      // Test 5: Can we use flex on overlay with overflow-y-auto on overlay?
      // What if overlay itself has overflow-y-auto and card has max-h-none?
      
      // Reset card styles for now
      card.style.maxHeight = '';
      card.style.height = '';

      return results;
    })()`
  });

  console.log(JSON.stringify(res.result.value, null, 2));

  // Now let's test what happens if we set card.style.maxHeight = 'calc((100vh - 4rem) / var(--app-zoom, 1.333))'
  // and take a screenshot!
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const overlay = document.querySelector('.fixed.inset-0.z-\\\\[9999\\\\]');
      const card = overlay ? overlay.firstElementChild : null;
      if (card) {
        card.style.maxHeight = 'calc((100vh - 4rem) / 1.333)';
      }
    })()`
  });

  const snap = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/test_calc_zoom_snap.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/test_calc_zoom_snap.png');

  ws.close();
}

run().catch(console.error);
