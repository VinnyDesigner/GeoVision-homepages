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

async function verifyScreen(ws, label, width, height, isDefault = false) {
  if (!isDefault) {
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false
    });
  } else {
    await sendCommand(ws, 'Emulation.clearDeviceMetricsOverride');
  }

  await new Promise(r => setTimeout(r, 800));

  // Check rects
  const evalRes = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      // Remove any temporary test style tag if present
      const testTag = document.getElementById('test-modal-zoom-fix');
      if (testTag) testTag.remove();

      function r2o(r) {
        if (!r) return null;
        return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), height: Math.round(r.height) };
      }

      const overlay = document.querySelector('.fixed.inset-0.z-\\\\[9999\\\\]');
      const card = overlay ? overlay.firstElementChild : null;
      const header = card ? card.children[0] : null;
      const footer = card ? card.children[card.children.length - 1] : null;
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close Studio') || b.textContent.includes('إلغاء'));
      const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Print / Save PDF') || b.textContent.includes('حفظ كملف'));
      const csvBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Export Data (CSV)') || b.textContent.includes('تصدير CSV'));

      return {
        screenZoom: window.getComputedStyle(document.documentElement).getPropertyValue('--screen-zoom'),
        zoom: window.getComputedStyle(document.documentElement).zoom,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        cardRect: r2o(card ? card.getBoundingClientRect() : null),
        headerRect: r2o(header ? header.getBoundingClientRect() : null),
        footerRect: r2o(footer ? footer.getBoundingClientRect() : null),
        closeBtnRect: r2o(closeBtn ? closeBtn.getBoundingClientRect() : null),
        printBtnRect: r2o(printBtn ? printBtn.getBoundingClientRect() : null),
        csvBtnRect: r2o(csvBtn ? csvBtn.getBoundingClientRect() : null)
      };
    })()`
  });

  const snap = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`scratch/verify_${label}.png`, Buffer.from(snap.data, 'base64'));

  console.log(`\n=================== [${label}] ===================`);
  console.log(JSON.stringify(evalRes.result.value, null, 2));

  const data = evalRes.result.value;
  const h = data.windowHeight;
  const cardOk = data.cardRect && data.cardRect.top >= 0 && data.cardRect.bottom <= h;
  const footerOk = data.footerRect && data.footerRect.bottom <= h;
  const printOk = data.printBtnRect && data.printBtnRect.bottom <= h && data.printBtnRect.top >= 0;
  const closeOk = data.closeBtnRect && data.closeBtnRect.bottom <= h && data.closeBtnRect.top >= 0;

  console.log(`Card inside viewport: ${cardOk} (top: ${data.cardRect?.top}, bottom: ${data.cardRect?.bottom}, viewport: ${h})`);
  console.log(`Footer inside viewport: ${footerOk} (footer bottom: ${data.footerRect?.bottom})`);
  console.log(`Print button visible: ${printOk} (bottom: ${data.printBtnRect?.bottom})`);
  console.log(`Close button visible: ${closeOk} (bottom: ${data.closeBtnRect?.bottom})`);

  return cardOk && footerOk && printOk && closeOk;
}

async function run() {
  const wsUrl = await getWebSocketUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));

  // 1. Verify User's Large Screen Viewport (2560x1305 with zoom: 1.333)
  const largeOk = await verifyScreen(ws, 'large_screen_2560x1305', 2560, 1305, true);

  // 2. Verify 1920x1080 Viewport
  const fhdOk = await verifyScreen(ws, 'standard_1920x1080', 1920, 1080, false);

  // 3. Clear emulation override back to user's native monitor
  await sendCommand(ws, 'Emulation.clearDeviceMetricsOverride');
  await new Promise(r => setTimeout(r, 500));

  console.log('\nFINAL VERIFICATION SUMMARY:');
  console.log('Large Screen (2560x1305 / 1440p):', largeOk ? 'PASSED ✅' : 'FAILED ❌');
  console.log('Standard 1080p (1920x1080):', fhdOk ? 'PASSED ✅' : 'FAILED ❌');

  ws.close();
}

run().catch(console.error);
