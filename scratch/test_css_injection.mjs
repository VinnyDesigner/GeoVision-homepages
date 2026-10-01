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
      // Remove any previous test style tag
      const existing = document.getElementById('test-modal-zoom-fix');
      if (existing) existing.remove();

      const style = document.createElement('style');
      style.id = 'test-modal-zoom-fix';
      style.innerHTML = \`
        :root {
          --screen-zoom: 1;
        }
        @media (min-width: 2100px) and (min-height: 900px) {
          html {
            --screen-zoom: 1.25;
          }
        }
        @media (min-width: 2500px) and (min-height: 1050px) {
          html {
            --screen-zoom: 1.333;
          }
        }
        @media (min-width: 2900px) and (min-height: 1200px) {
          html {
            --screen-zoom: 1.6;
          }
        }
        @media (min-width: 3400px) and (min-height: 1400px) {
          html {
            --screen-zoom: 2.0;
          }
        }
        @media (min-width: 4600px) and (min-height: 1800px) {
          html {
            --screen-zoom: 2.666;
          }
        }

        .fixed.inset-0.z-\\\\[9999\\\\] > div,
        .fixed.inset-0[class*="z-[9999]"] > div {
          max-height: calc((100vh - 3rem) / var(--screen-zoom, 1)) !important;
          height: auto !important;
        }
      \`;
      document.head.appendChild(style);

      const overlay = document.querySelector('.fixed.inset-0.z-\\\\[9999\\\\]');
      const card = overlay ? overlay.firstElementChild : null;
      const header = card ? card.children[0] : null;
      const footer = card ? card.children[card.children.length - 1] : null;
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close Studio') || b.textContent.includes('إلغاء'));
      const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Print / Save PDF') || b.textContent.includes('حفظ كملف'));
      const csvBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Export Data (CSV)') || b.textContent.includes('تصدير CSV'));

      return {
        screenZoomVar: window.getComputedStyle(document.documentElement).getPropertyValue('--screen-zoom'),
        cardRect: card ? card.getBoundingClientRect() : null,
        headerRect: header ? header.getBoundingClientRect() : null,
        footerRect: footer ? footer.getBoundingClientRect() : null,
        closeBtnRect: closeBtn ? closeBtn.getBoundingClientRect() : null,
        printBtnRect: printBtn ? printBtn.getBoundingClientRect() : null,
        csvBtnRect: csvBtn ? csvBtn.getBoundingClientRect() : null,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
      };
    })()`
  });

  console.log('Test CSS injection result:', JSON.stringify(res.result.value, null, 2));

  const snap = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/verified_large_screen_fix.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/verified_large_screen_fix.png');

  ws.close();
}

run().catch(console.error);
