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
  console.log('Navigating to map...');
  await send('Runtime.evaluate', {
    expression: `window.location.hash = '#map';`
  });
  await new Promise((r) => setTimeout(r, 2000));

  // Check initial zoom
  const initial = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const map = window.geovisionMap;
      return {
        hasMap: !!map,
        zoom: map ? map.getZoom() : null,
        center: map ? map.getCenter() : null
      };
    })()`
  });
  console.log('Initial map status:', initial.result.value);

  // Click Zoom In button twice
  console.log('Clicking Zoom In button twice...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[title*="Zoom In"], button[title*="تكبير"]');
      if (btn) {
        btn.click();
        setTimeout(() => btn.click(), 300);
      }
    })()`
  });
  await new Promise((r) => setTimeout(r, 1200));

  const afterZoomIn = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const map = window.geovisionMap;
      return {
        zoom: map ? map.getZoom() : null,
      };
    })()`
  });
  console.log('After 2x Zoom In:', afterZoomIn.result.value);

  // Click Zoom Out button 3 times
  console.log('Clicking Zoom Out button 3 times...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[title*="Zoom Out"], button[title*="تصغير"]');
      if (btn) {
        btn.click();
        setTimeout(() => btn.click(), 300);
        setTimeout(() => btn.click(), 600);
      }
    })()`
  });
  await new Promise((r) => setTimeout(r, 1500));

  const afterZoomOut = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const map = window.geovisionMap;
      return {
        zoom: map ? map.getZoom() : null,
      };
    })()`
  });
  console.log('After 3x Zoom Out:', afterZoomOut.result.value);

  // Click Home button
  console.log('Clicking Home button...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[title*="Home"], button[title*="الرئيسية"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise((r) => setTimeout(r, 2000));

  const afterHome = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const map = window.geovisionMap;
      return {
        zoom: map ? map.getZoom() : null,
        center: map ? map.getCenter() : null
      };
    })()`
  });
  console.log('After Home button:', afterHome.result.value);

  // Capture final screenshot
  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/zoom_fixed_verified.png', Buffer.from(screenshotRes.data, 'base64'));
  console.log('Screenshot saved to scratch/zoom_fixed_verified.png');

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
