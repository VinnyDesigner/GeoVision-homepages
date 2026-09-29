import http from 'http';
import fs from 'fs';

function getWebSocketUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const targets = JSON.parse(data);
        const target = targets.find(t => t.url.includes('localhost:5173') || t.title.includes('GeoVision'));
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

  // Reload page to ensure clean state
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:5173/#map' });
  await new Promise(r => setTimeout(r, 2000));

  // Click the recommendation button "Show hospitals within 5 km of my location"
  const clickRes = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        // Find recommendation button with text containing "hospitals within 5 km"
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent && b.textContent.includes('Show hospitals within 5 km'));
        if (btn) {
          btn.click();
          return 'Clicked button: ' + btn.textContent.trim();
        }
        return 'Button not found. Buttons: ' + buttons.map(b => b.textContent.trim().slice(0, 30)).join(' | ');
      })()
    `,
    returnByValue: true
  });

  console.log('Click result:', clickRes.result.value);

  // Wait for AI response and state update
  await new Promise(r => setTimeout(r, 2500));

  // Capture screenshot of the chat panel or the viewport
  const screenshot = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/chat_formatted_view.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved scratch/chat_formatted_view.png');

  // Also take a cropped screenshot of the chat panel if possible
  const chatBoxRes = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        // Look for the chat panel container
        const all = Array.from(document.querySelectorAll('div, aside, section'));
        const chatContainer = all.find(el => el.classList && (el.classList.contains('w-[420px]') || el.classList.contains('w-[380px]') || (el.textContent && el.textContent.includes('GeoVision Spatial AI') && el.textContent.includes('Nearest hospitals'))));
        if (chatContainer) {
          const rect = chatContainer.getBoundingClientRect();
          return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        }
        return null;
      })()
    `,
    returnByValue: true
  });

  if (chatBoxRes.result.value) {
    const rect = chatBoxRes.result.value;
    console.log('Panel rect:', rect);
    const cropped = await sendCommand(ws, 'Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.max(0, rect.x - 5),
        y: Math.max(0, rect.y),
        width: Math.min(rect.width + 10, 500),
        height: Math.min(rect.height, 930),
        scale: 1
      }
    });
    fs.writeFileSync('scratch/chat_panel_cropped.png', Buffer.from(cropped.data, 'base64'));
    console.log('Saved scratch/chat_panel_cropped.png');
  }

  ws.close();
}

run().catch(console.error);
