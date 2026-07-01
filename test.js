const puppeteer = require('puppeteer');
const http = require('http');
const handler = require('serve-handler');

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: 'build'
  });
});

server.listen(3000, async () => {
  console.log('Running at http://localhost:3000');
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
    page.on('requestfailed', request => console.log('BROWSER_REQ_FAIL:', request.url(), request.failure()?.errorText));

    await page.goto('http://localhost:3000', {waitUntil: 'networkidle0'});
    
    await browser.close();
    server.close();
    console.log('Done testing.');
  } catch(e) {
    console.error('TEST SCRIPT ERROR:', e);
    server.close();
  }
});
