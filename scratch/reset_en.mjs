import http from 'http';

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    const targets = JSON.parse(data);
    const target = targets.find(t => t.url.includes('localhost:5173'));
    if (!target) return;
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r, { once: true }));
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `
          const btns = Array.from(document.querySelectorAll('button, a'));
          const enBtn = btns.find(b => b.textContent && b.textContent.includes('English'));
          if (enBtn) enBtn.click();
        `
      }
    }));
    setTimeout(() => {
      ws.close();
      console.log('Switched to English');
    }, 1000);
  });
});
