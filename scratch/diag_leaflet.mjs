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

  const res = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      // Find leaflet map instance from DOM
      const mapEl = document.querySelector('.leaflet-container');
      let leafletLayers = [];
      if (mapEl) {
        for (const k in mapEl) {
          if (k.startsWith('_leaflet_id')) {
            // Leaflet assigns an ID
          }
        }
      }
      
      // Let's inspect all leaflet pane layers and SVGs
      const overlayPane = document.querySelector('.leaflet-overlay-pane');
      const markerPane = document.querySelector('.leaflet-marker-pane');
      const svg = overlayPane ? overlayPane.querySelector('svg') : null;
      
      return {
        hasOverlay: !!overlayPane,
        hasSvg: !!svg,
        svgInnerHtmlLength: svg ? svg.innerHTML.length : 0,
        svgChildrenTags: svg ? Array.from(svg.children).map(c => ({
          tag: c.tagName,
          stroke: c.getAttribute('stroke'),
          strokeWidth: c.getAttribute('stroke-width'),
          class: c.getAttribute('class'),
          d: c.getAttribute('d') ? c.getAttribute('d').slice(0, 50) : null
        })) : [],
        markerPaneChildren: markerPane ? markerPane.children.length : 0,
        markerPaneHtml: markerPane ? Array.from(markerPane.children).map(c => c.className) : []
      };
    })()`
  });

  console.log('Result:', JSON.stringify(res, null, 2));
  process.exit(0);
}

run();
