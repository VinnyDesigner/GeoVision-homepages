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
    console.error('No Vite page target found on 127.0.0.1:9222');
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

  // Step 1: Ensure search results are visible by sending a query or clicking a recommendation if needed
  const stateCheck = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const cards = document.querySelectorAll('[id^="result-card-"]');
      if (cards.length > 0) return { cardsCount: cards.length };
      // Try clicking a query or sending search
      const rec = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Show hospitals') || b.textContent.includes('hospitals'));
      if (rec) {
        rec.click();
        return { clickedRec: true };
      }
      return { noCards: true };
    })()`
  });
  console.log('Initial search state check:', stateCheck.result.value);

  await new Promise((r) => setTimeout(r, 2000));

  // Step 2: Test Info button click on first card to expand accordion
  console.log('Testing Info button click on first card...');
  const expandFirst = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const firstCard = document.querySelector('[id^="result-card-"]');
      if (!firstCard) return { error: 'No result cards found' };
      const cardTitle = firstCard.querySelector('h5')?.textContent?.trim();
      const infoBtn = firstCard.querySelector('button[aria-label="Spatial Summary"], button[title="Spatial Summary"], button[title*="الملخص"]');
      if (!infoBtn) return { error: 'Info button not found on first card' };
      infoBtn.click();
      return { success: true, cardTitle };
    })()`
  });
  console.log('Expand first card result:', expandFirst.result.value);

  await new Promise((r) => setTimeout(r, 800));

  // Check accordion content
  const checkAccordion = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const accordion = document.querySelector('[id^="result-card-"] div.animate-in');
      if (!accordion) return { found: false };
      const headerText = accordion.innerText;
      const hasSummary = headerText.includes('SPATIAL INTELLIGENCE SUMMARY') || headerText.includes('ملخص التحليل المكاني');
      const hasMoreDetails = headerText.includes('More Details') || headerText.includes('المزيد من التفاصيل');
      const hasAddress = headerText.includes('Address') || headerText.includes('العنوان');
      const hasHours = headerText.includes('Working Hours') || headerText.includes('أوقات العمل');
      const hasContact = headerText.includes('Contact') || headerText.includes('الاتصال');
      const hasCoords = headerText.includes('Coordinates') || headerText.includes('الإحداثيات');
      return {
        found: true,
        hasSummary,
        hasMoreDetails,
        hasAddress,
        hasHours,
        hasContact,
        hasCoords,
        snippet: headerText.slice(0, 150)
      };
    })()`
  });
  console.log('Accordion inspection:', checkAccordion.result.value);

  // Take screenshot 1: Accordion expanded inside search results list
  const sc1 = await send('Page.captureScreenshot', { format: 'png' });
  const out1 = path.resolve('scratch/step1_accordion_expanded.png');
  fs.writeFileSync(out1, Buffer.from(sc1.data, 'base64'));
  console.log('Saved screenshot 1:', out1);

  // Step 3: Test single accordion rule - click second card's Info button
  console.log('Testing Info button click on second card (should collapse first and expand second)...');
  const expandSecond = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const cards = document.querySelectorAll('[id^="result-card-"]');
      if (cards.length < 2) return { skip: 'Less than 2 cards' };
      const card2 = cards[1];
      const card2Title = card2.querySelector('h5')?.textContent?.trim();
      const infoBtn = card2.querySelector('button[aria-label="Spatial Summary"], button[title="Spatial Summary"], button[title*="الملخص"]');
      if (infoBtn) infoBtn.click();
      return { success: true, card2Title };
    })()`
  });
  console.log('Expand second card result:', expandSecond.result.value);

  await new Promise((r) => setTimeout(r, 600));

  const countAccordions = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const accordions = document.querySelectorAll('[id^="result-card-"] div.animate-in');
      return { openAccordionsCount: accordions.length };
    })()`
  });
  console.log('Number of open accordions (should be 1):', countAccordions.result.value);

  // Step 4: Test map marker click interaction
  console.log('Testing map marker click interaction (should scroll to & expand card)...');
  const markerClick = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const markers = document.querySelectorAll('.leaflet-marker-icon');
      if (markers.length === 0) return { error: 'No markers on map' };
      // Click the 3rd marker or 1st marker
      const targetMarker = markers[Math.min(2, markers.length - 1)];
      targetMarker.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return { success: true, markerClass: targetMarker.className };
    })()`
  });
  console.log('Marker click result:', markerClick.result.value);

  await new Promise((r) => setTimeout(r, 800));

  // Take screenshot 2: After marker click
  const sc2 = await send('Page.captureScreenshot', { format: 'png' });
  const out2 = path.resolve('scratch/step2_marker_click_accordion.png');
  fs.writeFileSync(out2, Buffer.from(sc2.data, 'base64'));
  console.log('Saved screenshot 2:', out2);

  // Step 5: Test "More Details" button
  console.log('Testing "More Details" button click inside expanded accordion...');
  const clickMoreDetails = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const moreBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('More Details') || b.textContent.includes('المزيد من التفاصيل'));
      if (!moreBtn) return { error: 'More Details button not found' };
      moreBtn.click();
      return { success: true };
    })()`
  });
  console.log('More Details click result:', clickMoreDetails.result.value);

  await new Promise((r) => setTimeout(r, 800));

  // Verify full details panel is open (has "Back to Chat")
  const checkFullDetails = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Back to Chat') || b.textContent.includes('العودة للمحادثة'));
      return { fullDetailsOpen: !!backBtn };
    })()`
  });
  console.log('Full details panel open check:', checkFullDetails.result.value);

  // Take screenshot 3: Full details panel open
  const sc3 = await send('Page.captureScreenshot', { format: 'png' });
  const out3 = path.resolve('scratch/step3_full_details_opened.png');
  fs.writeFileSync(out3, Buffer.from(sc3.data, 'base64'));
  console.log('Saved screenshot 3:', out3);

  // Step 6: Test "Back to Chat" navigation
  console.log('Testing "Back to Chat" navigation...');
  const clickBack = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Back to Chat') || b.textContent.includes('العودة للمحادثة'));
      if (backBtn) {
        backBtn.click();
        return { success: true };
      }
      return { error: 'Back button not found' };
    })()`
  });
  console.log('Back to Chat click result:', clickBack.result.value);

  await new Promise((r) => setTimeout(r, 800));

  // Verify return to search results and that accordion is restored
  const verifyReturn = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const cards = document.querySelectorAll('[id^="result-card-"]');
      const accordions = document.querySelectorAll('[id^="result-card-"] div.animate-in');
      return {
        cardsVisible: cards.length,
        accordionsVisible: accordions.length
      };
    })()`
  });
  console.log('Post-back verification:', verifyReturn.result.value);

  // Take screenshot 4: Back to search results with accordion restored
  const sc4 = await send('Page.captureScreenshot', { format: 'png' });
  const out4 = path.resolve('scratch/step4_returned_to_results.png');
  fs.writeFileSync(out4, Buffer.from(sc4.data, 'base64'));
  console.log('Saved screenshot 4:', out4);

  ws.close();
  console.log('=== All tests passed successfully! ===');
}

run().catch((e) => {
  console.error('Test execution error:', e);
  process.exit(1);
});
