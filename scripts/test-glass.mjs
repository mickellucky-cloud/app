import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setContent(`
    <html><body>
      <div style="background: repeating-linear-gradient(45deg, #f06, #f06 10px, #ff0 10px, #ff0 20px); width: 300px; height: 300px; position: relative;">
        <svg style="position: absolute; width: 0; height: 0;">
          <defs>
            <filter id="liquid-warp">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <div id="glass1" style="width: 150px; height: 100px; backdrop-filter: url(#liquid-warp) blur(10px); position: absolute; top: 50px; left: 50px;"></div>
        <div id="glass2" style="width: 150px; height: 100px; backdrop-filter: blur(20px) saturate(180%); position: absolute; top: 160px; left: 50px;"></div>
      </div>
    </body></html>
  `);
  const bf1 = await page.$eval('#glass1', el => getComputedStyle(el).backdropFilter);
  const bf2 = await page.$eval('#glass2', el => getComputedStyle(el).backdropFilter);
  console.log('glass1 backdropFilter:', bf1);
  console.log('glass2 backdropFilter:', bf2);
  await page.screenshot({ path: 'scripts/glass-test.png' });
  await browser.close();
}
run();
