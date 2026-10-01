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

  // Find the button for Al Yasmina Academy
  const clickRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('button[aria-label="Directions & Route"]'));
      // Find the button inside the card containing Al Yasmina Academy
      let targetBtn = null;
      for (const btn of buttons) {
        let parent = btn.parentElement;
        while (parent && parent !== document.body) {
          if (parent.innerText && parent.innerText.includes('Al Yasmina Academy')) {
            targetBtn = btn;
            break;
          }
          parent = parent.parentElement;
        }
        if (targetBtn) break;
      }
      if (!targetBtn && buttons.length > 5) targetBtn = buttons[5];
      if (targetBtn) {
        targetBtn.click();
        return { clicked: true, btnText: targetBtn.outerHTML.slice(0, 80) };
      }
      return { clicked: false };
    })()`
  });

  console.log('Click target:', JSON.stringify(clickRes, null, 2));

  // Wait 1.2s for route calculation
  await new Promise((r) => setTimeout(r, 1200));

  const check = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      let polylines = [];
      window.geovisionMap.eachLayer(l => {
        if (l instanceof L.Polyline && !(l instanceof L.Polygon)) {
          polylines.push({
            color: l.options.color,
            weight: l.options.weight,
            coordsLength: (l.getLatLngs() || []).length
          });
        }
      });
      return {
        hasHud: !!document.querySelector('.gmaps-directions-hud') || document.body.innerText.includes('Driving Directions') || document.body.innerText.includes('DRIVING DIRECTIONS'),
        hasEtaPill: !!document.querySelector('.gmaps-eta-pill-icon'),
        hasOriginMarker: !!document.querySelector('.gmaps-origin-marker'),
        hasDestMarker: !!document.querySelector('.gmaps-dest-marker'),
        polylinesCount: polylines.length,
        polylines
      };
    })()`
  });

  console.log('Directions Check after click:', JSON.stringify(check, null, 2));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const fs = await import('fs');
  fs.writeFileSync('scratch/yasmina_active_verified.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved scratch/yasmina_active_verified.png');
  process.exit(0);
}

run();
