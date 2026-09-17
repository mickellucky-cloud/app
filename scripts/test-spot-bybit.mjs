import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    console.log('Navigating to app...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));

    // Switch to Trade tab
    console.log('Clicking Trade tab...');
    await page.click('#nav-tab-trade');
    await new Promise(r => setTimeout(r, 1500));

    // 1. Capture Mobile Trade Split View (58% Order Entry + 42% Compact Orderbook)
    await page.screenshot({ path: 'scripts/bybit-mobile-trade-split.png' });
    console.log('Captured scripts/bybit-mobile-trade-split.png');

    // Click on Chart & Depth mode toggle
    console.log('Switching to Chart & Depth mode...');
    const chartToggleButtons = await page.$$('button');
    for (const btn of chartToggleButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Chart & Depth')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1500));

    // 2. Capture Mobile Chart View with Floating Bybit Action Bar
    await page.screenshot({ path: 'scripts/bybit-mobile-chart-floating.png' });
    console.log('Captured scripts/bybit-mobile-chart-floating.png');

    // Click the floating "Buy" button to verify it auto-switches back to Trade mode in Buy side
    console.log('Testing floating Buy button click...');
    const buyBtns = await page.$$('button');
    for (const btn of buyBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Buy') && text.includes('$')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1200));

    // 3. Capture switched state back to trade terminal
    await page.screenshot({ path: 'scripts/bybit-mobile-trade-switched-buy.png' });
    console.log('Captured scripts/bybit-mobile-trade-switched-buy.png');

    // Test Desktop view as well
    console.log('Testing desktop viewport (1440x900)...');
    await page.setViewport({ width: 1440, height: 900, isMobile: false });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'scripts/bybit-desktop-terminal.png' });
    console.log('Captured scripts/bybit-desktop-terminal.png');

    // Switch to Light Mode and capture both views
    console.log('Switching to light mode via reload...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.evaluate(() => {
      localStorage.setItem('oknexus_theme', 'light');
      window.location.reload();
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.click('#nav-tab-trade');
    await new Promise(r => setTimeout(r, 1200));

    // Capture light mode trade split
    await page.screenshot({ path: 'scripts/bybit-mobile-trade-split-light.png' });
    console.log('Captured scripts/bybit-mobile-trade-split-light.png');

    // Switch to Chart & Depth in light mode
    const lightButtons = await page.$$('button');
    for (const btn of lightButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Chart & Depth')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'scripts/bybit-mobile-chart-floating-light.png' });
    console.log('Captured scripts/bybit-mobile-chart-floating-light.png');

    // Reset back to dark mode
    await page.evaluate(() => {
      localStorage.setItem('oknexus_theme', 'dark');
    });

    console.log('All spot trading test captures succeeded!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
