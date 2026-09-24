export const triggerPrintDocument = (
  title: string,
  contentHtml: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
) => {
  let iframe = document.getElementById('sdi-print-iframe') as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'sdi-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '1024px';
    iframe.style.height = '1440px';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-9999';
    document.body.appendChild(iframe);
  }

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) return;

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
          @page {
            size: ${orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'};
            margin: 10mm;
          }
          html, body {
            width: 100%;
            height: auto;
            margin: 0;
            padding: 16px;
            color: #0f172a;
            background: #ffffff !important;
            font-family: 'Plus Jakarta Sans', 'Noto Kufi Arabic', system-ui, -apple-system, sans-serif;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          * { box-sizing: border-box; }
          .header-banner { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
          .badge { background: #215A9E; color: white; padding: 4px 8px; border-radius: 6px; font-weight: 900; font-size: 11px; }
          .security-stamp { background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-weight: 900; font-size: 10px; border: 1px solid #bbf7d0; }
          .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
          .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 10px; text-align: center; }
          .kpi-val { font-size: 18px; font-weight: 900; color: #215A9E; }
          .kpi-lbl { font-size: 10px; color: #64748b; font-weight: 900; text-transform: uppercase; margin-top: 2px; }
          .insights-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 14px; border-radius: 10px; margin-bottom: 20px; font-size: 12px; line-height: 1.6; }
          .table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
          .table th { background: #0f172a; color: white; padding: 10px 8px; text-align: left; font-weight: 900; text-transform: uppercase; font-size: 10px; }
          .table td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
          .map-frame { background: #0f172a; color: white; border-radius: 14px; padding: 24px; margin-bottom: 20px; border: 2px solid #334155; position: relative; }
          .footer-block { margin-top: 30px; border-top: 2px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${contentHtml}
        </div>
      </body>
    </html>
  `;

  iframeDoc.open();
  iframeDoc.write(fullHtml);
  iframeDoc.close();

  const triggerPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('Print window error:', e);
      window.print();
    }
  };

  setTimeout(triggerPrint, 300);
};
