const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('Navigated to localhost:3000');
    
    // Attempt Login
    try {
      await page.type('input[type="email"]', 'admin@maakaushalya.com');
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      console.log('Login successful.');
    } catch (e) {
      console.log('Maybe already logged in or login failed:', e.message);
    }
    
    // Visit routes
    const routes = ['/admin', '/directory', '/finance', '/complaints', '/notices'];
    for (const route of routes) {
      console.log('Visiting', route);
      await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 500));
    }
    
    await browser.close();
  } catch (err) {
    console.error('SCRIPT ERROR:', err.message);
  }
})();
