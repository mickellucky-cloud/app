import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.resolve(__dirname, 'light-mode-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Switch to light mode via documentElement class or settings
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('oknexus_theme', 'light');
    localStorage.setItem('theme', 'light');
  });
  await new Promise(r => setTimeout(r, 1000));

  // Screenshot 1: Home page in light mode
  await page.screenshot({ path: path.join(screenshotsDir, '01_home_light.png') });
  console.log('01_home_light.png captured');

  // Click on Spot Trade tab
  await page.evaluate(() => {
    const el = document.querySelector('[data-tab="trade"]') || 
               Array.from(document.querySelectorAll('button, a')).find(b => b.textContent?.includes('Spot Trade'));
    if (el) (el).click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '02_trade_light.png') });
  console.log('02_trade_light.png captured');

  // Click on P2P Express
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent?.includes('P2P Express') || b.textContent?.includes('P2P'));
    if (el) (el).click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '03_p2p_light.png') });
  console.log('03_p2p_light.png captured');

  // Click User Center inside P2P if present
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button, div')).find(b => b.textContent?.trim() === 'User Center');
    if (el) (el).click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '04_p2p_user_center_light.png') });
  console.log('04_p2p_user_center_light.png captured');

  // Click on Profile / Avatar to view Profile
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button, div')).find(b => b.textContent?.includes('@Mickel_Lucky'));
    if (el) (el).click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '05_profile_light.png') });
  console.log('05_profile_light.png captured');

  // Navigate to Login screen (simulate sign out or unauth)
  await page.evaluate(() => {
    localStorage.removeItem('oknexus_authenticated');
    window.location.reload();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  // Ensure light mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotsDir, '06_login_light.png') });
  console.log('06_login_light.png captured');

  await browser.close();
  console.log('All screenshots captured successfully.');
}

run().catch((err) => {
  console.error('Error in inspect-light-mode:', err);
  process.exit(1);
});
