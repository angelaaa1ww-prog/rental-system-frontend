const { chromium } = require('playwright');

(async () => {
  const out = { console: [], pageErrors: [], requestsFailed: [], navigatorSW: null, windowGoogle: null, rootHTML: null, bodyText: null };

  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    try { out.console.push({ type: msg.type(), text: msg.text() }); } catch(e) { out.console.push({ type: 'console', text: String(msg) }); }
  });
  page.on('pageerror', err => { out.pageErrors.push(String(err)); });
  page.on('requestfailed', req => { out.requestsFailed.push({ url: req.url(), error: req.failure() && req.failure().errorText }); });

  try {
    await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle', timeout: 30000 });
  } catch (err) {
    out.navigationError = String(err);
  }

  try { out.bodyText = (await page.textContent('body')) || null; } catch(e) { out.bodyText = null; }
  try { out.rootHTML = await page.$eval('#root', el => el.innerHTML).catch(() => null); } catch(e) { out.rootHTML = null; }

  try {
    out.windowGoogle = await page.evaluate(() => {
      return {
        hasGoogle: Boolean(window.google && window.google.accounts && window.google.accounts.id),
        googleExists: Boolean(window.google),
        userAgent: navigator.userAgent
      };
    });
  } catch (e) { out.windowGoogle = { error: String(e) }; }

  try {
    out.navigatorSW = await page.evaluate(async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations().catch(() => []);
        return regs.map(r => ({ scope: r.scope, active: !!r.active, scriptURL: r.active?.scriptURL || r.installing?.scriptURL || null }));
      } catch (err) { return { error: String(err) }; }
    });
  } catch (e) { out.navigatorSW = { error: String(e) }; }

  console.log('---INSPECT-OUTPUT-START---');
  console.log(JSON.stringify(out, null, 2));
  console.log('---INSPECT-OUTPUT-END---');

  await browser.close();
})();
