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
      const btns = Array.from(document.querySelectorAll('button')).filter(b => b.title && (b.title.includes('Zoom') || b.title.includes('تكبير') || b.title.includes('تصغير')));
      return btns.map(b => {
        const r = b.getBoundingClientRect();
        return {
          title: b.title,
          cls: b.className,
          rect: { x: r.x, y: r.y, width: r.width, height: r.height }
        };
      });
    })()`
  });

  console.log('Found buttons:', res.result.value);

  // Now let's click the Zoom In button using CDP Input.dispatchMouseEvent
  const plusBtn = res.result.value.find(b => b.title.includes('Zoom In') || b.title.includes('تكبير'));
  if (plusBtn) {
    const x = Math.round(plusBtn.rect.x + plusBtn.rect.width / 2);
    const y = Math.round(plusBtn.rect.y + plusBtn.rect.height / 2);
    console.log('Clicking at:', x, y);

    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });

    await new Promise((r) => setTimeout(r, 600));

    const after = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => ({ zoom: window.geovisionMap ? window.geovisionMap.getZoom() : null }))()`
    });
    console.log('Zoom after mouse click:', after.result.value);
  }

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
