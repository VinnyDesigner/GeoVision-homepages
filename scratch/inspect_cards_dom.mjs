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

  const cardsInfo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const allDivs = Array.from(document.querySelectorAll('div, button'));
      const cards = Array.from(document.querySelectorAll('.geovision-result-card'));
      return {
        cardsCount: cards.length,
        cardTexts: cards.map(c => c.innerText.slice(0, 60)),
        buttonsWithNav: Array.from(document.querySelectorAll('button')).filter(b => b.innerHTML.includes('lucide-navigation') || b.querySelector('svg.lucide-navigation')).map(b => ({
          ariaLabel: b.getAttribute('aria-label'),
          title: b.getAttribute('title'),
          parentCard: b.closest('.geovision-result-card')?.innerText?.slice(0, 40)
        }))
      };
    })()`
  });

  console.log('Cards Info:', JSON.stringify(cardsInfo, null, 2));
  process.exit(0);
}

run();
