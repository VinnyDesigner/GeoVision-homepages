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

  console.log('Connected to Chrome');

  // Set 1920x1080 viewport
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Navigate to localhost:5173
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 2000));

  // Switch to map view if needed
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const mapBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Explore Map'));
        if (mapBtn) mapBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  // Trigger query: click quick prompt or type
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const quickPrompt = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('hospitals') || b.textContent.includes('المستشفيات'));
        if (quickPrompt) {
          quickPrompt.click();
          return;
        }
        const textarea = document.querySelector('textarea');
        if (textarea) {
          const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
          nativeSetter.call(textarea, 'find nearest hospitals');
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          setTimeout(() => {
            const form = textarea.closest('form');
            if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            const submitBtn = textarea.parentElement.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.click();
          }, 200);
        }
      })()
    `
  });

  await new Promise(r => setTimeout(r, 3000));

  // Click print report button
  const clickPrint = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const printBtn = buttons.find(b => b.title?.includes('Print') || b.textContent?.includes('Print') || b.textContent?.includes('طباعة'));
        if (printBtn) {
          printBtn.click();
          return { found: true, text: printBtn.textContent };
        }
        return { found: false, count: buttons.length, texts: buttons.map(b => b.textContent?.trim()).filter(Boolean).slice(0, 15) };
      })()
    `
  });
  console.log('Click print result:', clickPrint);

  await new Promise(r => setTimeout(r, 1500));

  // Check footer visibility
  const footerCheck = await sendCommand(ws, 'Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close Studio') || b.textContent.includes('إلغاء'));
        if (!closeBtn) return { error: 'Close Studio button not found' };
        const rect = closeBtn.getBoundingClientRect();
        return {
          closeBtnText: closeBtn.textContent,
          rect: { top: rect.top, bottom: rect.bottom, left: rect.left, height: rect.height },
          windowHeight: window.innerHeight,
          isVisible: rect.bottom <= window.innerHeight && rect.top >= 0
        };
      })()
    `
  });
  console.log('Footer check:', footerCheck);

  const screenshot = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/printscreen_1080p_repro.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved scratch/printscreen_1080p_repro.png');
  ws.close();
}

run().catch(console.error);
