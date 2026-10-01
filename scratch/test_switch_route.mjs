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

  // Find the first result card's directions button and click it
  const clickRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const dirButtons = Array.from(document.querySelectorAll('button[aria-label="Directions & Route"], button[title*="Directions"], button[title*="الاتجاهات"]'));
      if (dirButtons.length > 0) {
        dirButtons[0].click();
        return { clicked: true, totalButtons: dirButtons.length };
      }
      return { clicked: false };
    })()`
  });

  console.log('Clicked first result directions:', JSON.stringify(clickRes, null, 2));

  // Wait 600ms for route calculation
  await new Promise((r) => setTimeout(r, 800));

  const afterClick = await send('Runtime.evaluate', {
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
        polylinesCount: polylines.length,
        polylines
      };
    })()`
  });

  console.log('Polylines after clicking first result:', JSON.stringify(afterClick, null, 2));

  // Now click Al Yasmina Academy directions again so it returns to the user's expected view
  await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.geovision-result-card'));
      const yasminaCard = cards.find(c => c.innerText.includes('Al Yasmina'));
      if (yasminaCard) {
        const dirBtn = yasminaCard.querySelector('button[aria-label="Directions & Route"], button[title*="Directions"], button[title*="الاتجاهات"]');
        if (dirBtn) dirBtn.click();
      }
    })()`
  });

  await new Promise((r) => setTimeout(r, 800));

  const finalCheck = await send('Runtime.evaluate', {
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
        polylinesCount: polylines.length,
        polylines
      };
    })()`
  });

  console.log('Polylines after returning to Al Yasmina:', JSON.stringify(finalCheck, null, 2));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const fs = await import('fs');
  fs.writeFileSync('scratch/final_directions_verified.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved scratch/final_directions_verified.png');
  process.exit(0);
}

run();
