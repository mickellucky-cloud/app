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
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000));

    // 1. Test Trade tab (renamed to Trade and Chart)
    console.log('Navigating to Trade tab...');
    await page.click('#nav-tab-trade');
    await new Promise(r => setTimeout(r, 1200));

    // Capture mobile trade split
    await page.screenshot({ path: 'scripts/mobile-trade-split-updated.png' });
    console.log('Captured scripts/mobile-trade-split-updated.png');

    // Switch to Chart tab (renamed to Chart)
    console.log('Switching to Chart mode...');
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.trim() === 'Chart') {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1200));

    // Capture mobile chart with minimal floating pill
    await page.screenshot({ path: 'scripts/mobile-chart-minimal-floating.png' });
    console.log('Captured scripts/mobile-chart-minimal-floating.png');

    // 2. Test Earn tab banner
    console.log('Navigating to Earn tab...');
    await page.click('#nav-tab-earn');
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'scripts/mobile-earn-banner-updated.png' });
    console.log('Captured scripts/mobile-earn-banner-updated.png');

    // 3. Test P2P tab announcement banner
    console.log('Navigating to P2P tab via desktop viewport...');
    await page.setViewport({ width: 1440, height: 900, isMobile: false });
    await new Promise(r => setTimeout(r, 800));
    const allButtons = await page.$$('button');
    for (const b of allButtons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('P2P Express')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'scripts/desktop-p2p-announcement.png' });
    console.log('Captured scripts/desktop-p2p-announcement.png');

    // Also capture mobile P2P announcement
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'scripts/mobile-p2p-announcement.png' });
    console.log('Captured scripts/mobile-p2p-announcement.png');

    console.log('All verification screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
