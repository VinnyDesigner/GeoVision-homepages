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

  console.log('Connected to Chrome DevTools session.');

  // Test 1: Click the card body (NOT the info icon)
  console.log('Test 1: Clicking the card body directly...');
  const cardBodyClick = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const cards = document.querySelectorAll('[id^="result-card-"]');
      if (cards.length === 0) return { error: 'No cards found' };
      // Click the title or body area of the first card
      const titleEl = cards[0].querySelector('h5');
      if (titleEl) titleEl.click();
      else cards[0].click();
      return { success: true, title: titleEl?.textContent?.trim() };
    })()`
  });
  console.log('Card body click result:', cardBodyClick.result.value);

  await new Promise((r) => setTimeout(r, 600));

  // Check if any accordion opened
  const checkAfterCardClick = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const accordions = document.querySelectorAll('[id^="result-card-"] div.animate-in');
      return { openAccordionsCount: accordions.length };
    })()`
  });
  console.log('Open accordions after CARD click (MUST BE 0):', checkAfterCardClick.result.value);

  const sc1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.resolve('scratch/test_card_click_no_accordion.png'), Buffer.from(sc1.data, 'base64'));

  // Test 2: Click the Info icon on the card
  console.log('Test 2: Clicking the Info icon on the card...');
  const infoClick = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const cards = document.querySelectorAll('[id^="result-card-"]');
      const infoBtn = cards[0].querySelector('button[aria-label="Spatial Summary"], button[title="Spatial Summary"], button[title*="الملخص"]');
      if (!infoBtn) return { error: 'Info button not found' };
      infoBtn.click();
      return { success: true };
    })()`
  });
  console.log('Info click result:', infoClick.result.value);

  await new Promise((r) => setTimeout(r, 600));

  // Check if accordion opened
  const checkAfterInfoClick = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const accordions = document.querySelectorAll('[id^="result-card-"] div.animate-in');
      return { openAccordionsCount: accordions.length };
    })()`
  });
  console.log('Open accordions after INFO ICON click (MUST BE 1):', checkAfterInfoClick.result.value);

  const sc2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.resolve('scratch/test_info_click_accordion_opened.png'), Buffer.from(sc2.data, 'base64'));

  // Test 3: Click Info icon again on the same card (collapse it)
  console.log('Test 3: Clicking Info icon again on same card (collapse)...');
  const infoClickAgain = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const cards = document.querySelectorAll('[id^="result-card-"]');
      const infoBtn = cards[0].querySelector('button[aria-label*="Summary"], button[title*="Summary"], button[title*="الملخص"]');
      if (infoBtn) infoBtn.click();
      return { success: true };
    })()`
  });
  console.log('Info toggle collapse result:', infoClickAgain.result.value);

  await new Promise((r) => setTimeout(r, 600));

  const checkAfterCollapse = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const accordions = document.querySelectorAll('[id^="result-card-"] div.animate-in');
      return { openAccordionsCount: accordions.length };
    })()`
  });
  console.log('Open accordions after COLLAPSE click (MUST BE 0):', checkAfterCollapse.result.value);

  // Test 4: Click card 2 body
  console.log('Test 4: Clicking card 2 body...');
  const card2BodyClick = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const cards = document.querySelectorAll('[id^="result-card-"]');
      if (cards.length > 1) {
        cards[1].querySelector('h5')?.click() || cards[1].click();
        return { success: true };
      }
      return { skip: true };
    })()`
  });
  console.log('Card 2 body click:', card2BodyClick.result.value);

  await new Promise((r) => setTimeout(r, 600));

  const checkCard2Body = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const accordions = document.querySelectorAll('[id^="result-card-"] div.animate-in');
      return { openAccordionsCount: accordions.length };
    })()`
  });
  console.log('Open accordions after CARD 2 click (MUST BE 0):', checkCard2Body.result.value);

  ws.close();

  if (checkAfterCardClick.result.value.openAccordionsCount === 0 &&
      checkAfterInfoClick.result.value.openAccordionsCount === 1 &&
      checkAfterCollapse.result.value.openAccordionsCount === 0 &&
      checkCard2Body.result.value.openAccordionsCount === 0) {
    console.log('=== VERIFICATION PASSED: Accordion opens ONLY on Info icon click! ===');
  } else {
    console.error('=== VERIFICATION FAILED: Unexpected accordion state ===');
    process.exit(1);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
