import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.resolve(__dirname, 'final-verification-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function run() {
  console.log('Launching Chrome for full verification...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Clear auth to test Login Screen
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.removeItem('oknexus_authenticated');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('oknexus_theme', 'light');
    localStorage.setItem('theme', 'light');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  // Screenshot 1: Login Screen Light Mode with Google, Apple, Telegram, Facebook
  await page.screenshot({ path: path.join(screenshotsDir, '01_login_screen_light.png') });
  console.log('Saved 01_login_screen_light.png');

  // Switch to Sign Up screen to check CreateAccountScreen
  await page.evaluate(() => {
    const signupBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Sign Up') || b.textContent?.includes('Create one'));
    if (signupBtn) signupBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotsDir, '02_signup_screen_light.png') });
  console.log('Saved 02_signup_screen_light.png');

  // Go back to login
  await page.evaluate(() => {
    const loginBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Log In'));
    if (loginBtn) loginBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click Telegram Social Login button
  console.log('Clicking Telegram Social Login...');
  await page.evaluate(() => {
    const tgBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Telegram'));
    if (tgBtn) tgBtn.click();
  });
  // Wait 1.8s for mock oauth resolution and auto-navigation into the app
  await new Promise(r => setTimeout(r, 2200));

  // Verify we are logged in on the Home Screen in Light Mode
  await page.screenshot({ path: path.join(screenshotsDir, '03_home_after_telegram_login_light.png') });
  console.log('Saved 03_home_after_telegram_login_light.png');

  // Navigate to Spot Trade in Light Mode
  await page.evaluate(() => {
    const tradeTab = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent?.includes('Spot Trade'));
    if (tradeTab) tradeTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotsDir, '04_trade_light.png') });
  console.log('Saved 04_trade_light.png');

  // Navigate to P2P Express
  await page.evaluate(() => {
    const p2pTab = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent?.includes('P2P Express') || b.textContent?.includes('P2P'));
    if (p2pTab) p2pTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotsDir, '05_p2p_listings_light.png') });
  console.log('Saved 05_p2p_listings_light.png');

  // Click User Center inside P2P
  await page.evaluate(() => {
    const userCenterBtn = Array.from(document.querySelectorAll('button, div')).find(b => b.textContent?.trim() === 'User Center');
    if (userCenterBtn) userCenterBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotsDir, '06_p2p_user_center_light.png') });
  console.log('Saved 06_p2p_user_center_light.png');

  // Also take dark mode screenshot of Login screen to confirm dark mode is 100% pristine
  await page.evaluate(() => {
    localStorage.removeItem('oknexus_authenticated');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    localStorage.setItem('oknexus_theme', 'dark');
    localStorage.setItem('theme', 'dark');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotsDir, '07_login_screen_dark.png') });
  console.log('Saved 07_login_screen_dark.png');

  await browser.close();
  console.log('Verification completed successfully!');
}

run().catch((err) => {
  console.error('Error running verification:', err);
  process.exit(1);
});
