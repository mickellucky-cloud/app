import puppeteer from 'puppeteer-core';

async function testLiquidNav() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Capture dark mode (default) floating liquid nav
  await page.screenshot({ path: 'scripts/floating-liquid-nav-dark.png' });
  console.log('Saved scripts/floating-liquid-nav-dark.png');

  // Check bounding box of the floating nav
  const box = await page.$eval('#bottom-navigation-bar', el => {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      distanceFromWindowBottom: 844 - rect.bottom
    };
  });
  console.log('iPhone 12 Nav Position:', box);

  // Click Market tab
  const marketBtn = await page.$('#nav-tab-market');
  if (marketBtn) {
    await marketBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'scripts/floating-liquid-nav-market.png' });
    console.log('Saved scripts/floating-liquid-nav-market.png');
  }

  // Switch to Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('oknexus_theme', 'light');
  });
  await new Promise(r => setTimeout(r, 1000));

  // Capture light mode floating liquid nav on Home
  const homeBtn = await page.$('#nav-tab-home');
  if (homeBtn) {
    await homeBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  }
  await page.screenshot({ path: 'scripts/floating-liquid-nav-light.png' });
  console.log('Saved scripts/floating-liquid-nav-light.png');

  // Inspect computed style of nav
  const navStyle = await page.$eval('#bottom-navigation-bar', el => {
    const cs = getComputedStyle(el);
    return {
      width: cs.width,
      borderRadius: cs.borderRadius,
      position: cs.position,
    };
  });
  console.log('Nav style:', navStyle);

  await browser.close();
}

testLiquidNav().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
