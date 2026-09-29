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

  // Navigate to root default page
  console.log('Navigating to http://localhost:5173/ ...');
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise((r) => setTimeout(r, 1500));

  // Check DOM state
  const stateRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const h1 = document.querySelector('h1')?.innerText || '';
      const hasGeoPulse = !!document.querySelector('#geoPulseGrad5');
      const searchInput = !!document.querySelector('input[placeholder*="Search"]');
      const cards = document.querySelectorAll('.translate-y-\\\\[15px\\\\] > div, [style*="translateY(15px)"] > div').length;
      const htmlClasses = document.documentElement.className;
      const rootClasses = document.querySelector('#root > div')?.className || '';
      return {
        h1,
        hasGeoPulse,
        searchInput,
        cardCount: cards,
        htmlClasses,
        rootClasses,
        location: window.location.href
      };
    })()`,
    returnByValue: true
  });
  console.log('Home Default State:', JSON.stringify(stateRes.result.value, null, 2));

  // Capture screenshot of Default Home
  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.resolve('scratch/default_home_verified.png');
  fs.writeFileSync(outPath, Buffer.from(screenshotRes.data, 'base64'));
  console.log('Screenshot saved to:', outPath);

  // Test Navigation to Map and back to Home
  console.log('Testing Navigation to Map and back...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const mapBtn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.includes('Explore Map'));
      if (mapBtn) mapBtn.click();
    })()`
  });
  await new Promise((r) => setTimeout(r, 1200));

  const mapStateRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const isMapWorkspace = !!document.querySelector('.leaflet-container');
      const hash = window.location.hash;
      return { isMapWorkspace, hash };
    })()`,
    returnByValue: true
  });
  console.log('After clicking Explore Map:', JSON.stringify(mapStateRes.result.value, null, 2));

  // Click Home logo / button
  await send('Runtime.evaluate', {
    expression: `(() => {
      const homeBtn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.includes('Home'));
      if (homeBtn) homeBtn.click();
    })()`
  });
  await new Promise((r) => setTimeout(r, 1200));

  const afterHomeRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const hasGeoPulse = !!document.querySelector('#geoPulseGrad5');
      const hash = window.location.hash;
      return { backToHome: hasGeoPulse, hash };
    })()`,
    returnByValue: true
  });
  console.log('After clicking Home:', JSON.stringify(afterHomeRes.result.value, null, 2));

  // Test suggestion pills More/Less zero shift
  const moreShiftRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const cardsBefore = document.querySelector('.translate-y-\\\\[15px\\\\]')?.getBoundingClientRect();
      const moreBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('More +'));
      if (moreBtn) moreBtn.click();
      const cardsAfter = document.querySelector('.translate-y-\\\\[15px\\\\]')?.getBoundingClientRect();
      return {
        cardsTopBefore: cardsBefore?.top,
        cardsTopAfter: cardsAfter?.top,
        shift: cardsAfter ? cardsAfter.top - cardsBefore.top : null
      };
    })()`,
    returnByValue: true
  });
  console.log('More/Less Toggle Shift Test:', JSON.stringify(moreShiftRes.result.value, null, 2));

  ws.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
