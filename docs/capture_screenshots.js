const path = require('path');
const playwright = require(
  require('child_process').execSync('npm root -g').toString().trim() + '/playwright'
);

const OUT = 'c:/Users/cesar/OneDrive/Escritorio/FREELANCE/SpotU/docs/assets';

async function shot(page, url, file, opts = {}) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(opts.wait || 1500);
  await page.screenshot({
    path: path.join(OUT, file),
    fullPage: false,
    ...opts.shotOpts,
  });
  console.log('captured', file);
}

(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await shot(page, 'https://spotu.online', 'site_landing.png');
  await shot(page, 'https://spotu.online/feed', 'site_feed.png');
  await shot(page, 'https://spotu.online/pricing', 'site_pricing.png');

  // Mobile viewport for one shot
  await page.setViewportSize({ width: 390, height: 844 });
  await shot(page, 'https://spotu.online', 'site_landing_mobile.png');

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
