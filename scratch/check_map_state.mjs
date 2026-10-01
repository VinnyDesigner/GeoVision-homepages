import http from 'http';
import WebSocket from 'ws';

http.get('http://localhost:9222/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const targets = JSON.parse(data);
    const page = targets.find(t => t.url.includes('5173'));
    if (!page) {
      console.log('Page not found');
      return;
    }
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            const mapEl = document.querySelector(".leaflet-container");
            const svgs = document.querySelectorAll("path");
            const svgDetails = Array.from(svgs).map(s => ({
              stroke: s.getAttribute("stroke"),
              strokeWidth: s.getAttribute("stroke-width"),
              d: (s.getAttribute("d") || "").slice(0, 40),
              strokeDasharray: s.getAttribute("stroke-dasharray")
            }));
            const gmapsHud = !!document.querySelector(".gmaps-directions-hud");
            const gmapsEta = !!document.querySelector(".gmaps-eta-pill-icon");
            const gmapsOrigin = !!document.querySelector(".gmaps-origin-marker");
            const gmapsDest = !!document.querySelector(".gmaps-dest-marker");
            const resultCards = Array.from(document.querySelectorAll(".geovision-result-card")).map(c => ({
              text: c.innerText.slice(0, 50),
              hasBlueBorder: c.className.includes("border-blue") || c.className.includes("ring-")
            }));
            return {
              svgCount: svgs.length,
              svgDetails,
              gmapsHud,
              gmapsEta,
              gmapsOrigin,
              gmapsDest,
              resultCardsCount: resultCards.length,
              resultCards
            };
          })()`,
          returnByValue: true
        }
      }));
    });
    ws.on('message', (msg) => {
      console.log('DOM State:', JSON.stringify(JSON.parse(msg), null, 2));
      ws.close();
    });
  });
});
