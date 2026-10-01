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

  console.log('Connected to Chrome DevTools session.');

  // Test 1: 1920x1080
  console.log('\n--- Testing at 1920x1080 ---');
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 2000));

  // Go to Map
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const mapBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Explore Map'));
        if (mapBtn) mapBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  // Trigger hospital query
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const quickPrompt = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('hospitals') || b.textContent.includes('المستشفيات'));
        if (quickPrompt) quickPrompt.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 2500));

  // Click Print button
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const printBtn = buttons.find(b => b.title?.includes('Print') || b.textContent?.includes('Print') || b.textContent?.includes('طباعة'));
        if (printBtn) printBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  // Check footer visibility in 1920x1080
  const check1080 = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close Studio') || b.textContent.includes('إلغاء'));
        const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Print / Save PDF') || b.textContent.includes('حفظ كملف'));
        const closeRect = closeBtn ? closeBtn.getBoundingClientRect() : null;
        const printRect = printBtn ? printBtn.getBoundingClientRect() : null;

        return {
          windowHeight: window.innerHeight,
          closeBtn: closeRect ? { top: closeRect.top, bottom: closeRect.bottom, isVisible: closeRect.bottom <= window.innerHeight } : null,
          printBtn: printRect ? { top: printRect.top, bottom: printRect.bottom, isVisible: printRect.bottom <= window.innerHeight } : null
        };
      })()
    `
  });
  console.log('1080p Footer Status:', JSON.stringify(check1080.result.value, null, 2));

  const snap1080 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/printscreen_1080p_fixed.png', Buffer.from(snap1080.data, 'base64'));
  console.log('Saved scratch/printscreen_1080p_fixed.png');

  // Test 2: 1920x920 (1080p Chrome browser with taskbar, tab bar, URL bar)
  console.log('\n--- Testing at 1920x920 (Chrome inner window on 1080p) ---');
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 920,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));

  const check920 = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close Studio') || b.textContent.includes('إلغاء'));
        const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Print / Save PDF') || b.textContent.includes('حفظ كملف'));
        const closeRect = closeBtn ? closeBtn.getBoundingClientRect() : null;
        const printRect = printBtn ? printBtn.getBoundingClientRect() : null;

        return {
          windowHeight: window.innerHeight,
          closeBtn: closeRect ? { top: closeRect.top, bottom: closeRect.bottom, isVisible: closeRect.bottom <= window.innerHeight } : null,
          printBtn: printRect ? { top: printRect.top, bottom: printRect.bottom, isVisible: printRect.bottom <= window.innerHeight } : null
        };
      })()
    `
  });
  console.log('920p Footer Status:', JSON.stringify(check920.result.value, null, 2));

  const snap920 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/printscreen_920p_fixed.png', Buffer.from(snap920.data, 'base64'));
  console.log('Saved scratch/printscreen_920p_fixed.png');

  // Test 3: PrintMapModal from toolbar
  console.log('\n--- Testing PrintMapModal from Toolbar ---');
  // Close print report first
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close Studio') || b.textContent.includes('إلغاء'));
        if (closeBtn) closeBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Open PrintMapModal via toolbar button
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const printTool = Array.from(document.querySelectorAll('button')).find(b => b.title?.includes('Print') || b.getAttribute('aria-label')?.includes('Print'));
        if (printTool) printTool.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  const checkMapPrint = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close Studio') || b.textContent.includes('إلغاء'));
        const genBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Generate') || b.textContent.includes('توليد'));
        const closeRect = closeBtn ? closeBtn.getBoundingClientRect() : null;
        const genRect = genBtn ? genBtn.getBoundingClientRect() : null;

        return {
          windowHeight: window.innerHeight,
          closeBtn: closeRect ? { top: closeRect.top, bottom: closeRect.bottom, isVisible: closeRect.bottom <= window.innerHeight } : null,
          genBtn: genRect ? { top: genRect.top, bottom: genRect.bottom, isVisible: genRect.bottom <= window.innerHeight } : null
        };
      })()
    `
  });
  console.log('PrintMapModal 920p Footer Status:', JSON.stringify(checkMapPrint.result.value, null, 2));

  const snapMapPrint = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/print_map_modal_920p_fixed.png', Buffer.from(snapMapPrint.data, 'base64'));
  console.log('Saved scratch/print_map_modal_920p_fixed.png');

  ws.close();
}

run().catch(console.error);
