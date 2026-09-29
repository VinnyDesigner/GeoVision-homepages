import http from 'http';
import fs from 'fs';
import path from 'path';

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

  // Navigate to map view
  console.log('Navigating to http://localhost:5173/#map ...');
  await send('Page.navigate', { url: 'http://localhost:5173/#map' });
  await new Promise((r) => setTimeout(r, 2000));

  // Check DOM geometry
  const geometryRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const mapContainer = document.querySelector('.leaflet-container');
      const mapRect = mapContainer ? mapContainer.getBoundingClientRect() : null;
      const header = document.querySelector('header');
      const headerRect = header ? header.getBoundingClientRect() : null;
      const toolbar = document.querySelector('.glass-level-3.bg-white\\\\/85');
      const toolbarRect = toolbar ? toolbar.getBoundingClientRect() : null;
      const aiPanelHeader = document.querySelector('.border-b.border-slate-200\\\\/80');
      const aiPanelHeaderRect = aiPanelHeader ? aiPanelHeader.getBoundingClientRect() : null;

      return {
        mapTop: mapRect?.top,
        mapHeight: mapRect?.height,
        headerTop: headerRect?.top,
        headerBottom: headerRect?.bottom,
        toolbarTop: toolbarRect?.top,
        aiPanelHeaderTop: aiPanelHeaderRect?.top
      };
    })()`,
    returnByValue: true
  });
  console.log('Map Geometry:', JSON.stringify(geometryRes.result.value, null, 2));

  // Capture screenshot of Map
  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.resolve('scratch/map_floating_header_verified.png');
  fs.writeFileSync(outPath, Buffer.from(screenshotRes.data, 'base64'));
  console.log('Screenshot saved to:', outPath);

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
