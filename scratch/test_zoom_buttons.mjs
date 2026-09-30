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
  console.log('Navigating to map...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.location.hash = '#map';
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Explore Map') || b.textContent.includes('استكشف الخريطة'));
      if (btn) btn.click();
    })()`
  });
  await new Promise((r) => setTimeout(r, 2000));

  // Check buttons and test zoom
  const res = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      // Find all buttons in the toolbar capsule
      const buttons = Array.from(document.querySelectorAll('button[title*="Zoom"], button[title*="تكبير"], button[title*="تصغير"]'));
      const details = buttons.map(b => ({
        title: b.getAttribute('title'),
        html: b.innerHTML.slice(0, 100),
        rect: b.getBoundingClientRect(),
        disabled: b.disabled
      }));

      // Find Leaflet map
      const leafletContainer = document.querySelector('.leaflet-container');
      let currentZoom = null;
      let minZoom = null;
      let maxZoom = null;
      if (leafletContainer && (leafletContainer)._leaflet_id) {
        // try to find map
        for (const key in window) {
          try {
            if (window[key] && window[key]._zoom !== undefined) {
              currentZoom = window[key].getZoom();
            }
          } catch(e) {}
        }
      }

      return {
        buttonCount: buttons.length,
        details,
        hasLeaflet: !!leafletContainer,
        currentZoom
      };
    })()`
  });

  // Inspect Leaflet map instance directly
  const zoomTest = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      // Find leaflet map instance from container
      const container = document.querySelector('.leaflet-container');
      // In Leaflet, the map instance is usually attached to container._leaflet_id or stored in Leaflet internal
      // Let's find L
      let map = null;
      if (window.L && window.L.Map) {
        // find map
      }
      // Alternatively, let's find any object with getZoom
      const plusBtn = document.querySelector('button[title*="Zoom In"], button[title*="تكبير"]');
      const minusBtn = document.querySelector('button[title*="Zoom Out"], button[title*="تصغير"]');
      
      return {
        hasPlus: !!plusBtn,
        hasMinus: !!minusBtn,
      };
    })()`
  });
  console.log('Zoom buttons exist:', zoomTest.result.value);

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
