const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const errs = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await page.route('**cdn.jsdelivr.net/**', (route) => route.abort());
  await page.goto('http://localhost:3004/', { waitUntil: 'commit', timeout: 60000 });
  await page.waitForSelector('footer', { timeout: 30000 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2600);

  const footer = await page.evaluate(() => {
    const f = document.querySelector('footer');
    const h2 = f.querySelector('.footer-header h2');
    const accent = h2?.querySelector('span');
    const cs = accent ? getComputedStyle(accent) : null;
    return {
      headerText: h2?.textContent,
      accentText: accent?.textContent,
      accentFont: cs?.fontFamily.slice(0, 20),
      accentStyle: cs?.fontStyle,
      headerCentered: h2 ? getComputedStyle(h2.parentElement).textAlign : null,
      nowGone: !f.textContent.includes('Building') && !f.textContent.includes('eBPF'),
      columns: Array.from(f.querySelectorAll('.footer-col')).length,
      footerHeight: Math.round(f.getBoundingClientRect().height),
    };
  });
  console.log('FOOTER:', JSON.stringify(footer, null, 2));
  console.log('ERRORS:', errs.length ? errs : 'none');
  await page.screenshot({ path: process.env.TEMP + '/kilo/footer-v6.png' });

  // Dark mode
  const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await d.addInitScript(() => localStorage.setItem('gy-theme', 'dark'));
  await d.goto('http://localhost:3004/', { waitUntil: 'commit', timeout: 60000 });
  await d.waitForSelector('footer', { timeout: 30000 });
  await d.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await d.waitForTimeout(2600);
  const darkAccent = await d.evaluate(() => {
    const accent = document.querySelector('footer .footer-header h2 span');
    return accent ? getComputedStyle(accent).color : null;
  });
  console.log('DARK ACCENT COLOR:', darkAccent);
  await d.screenshot({ path: process.env.TEMP + '/kilo/footer-v6-dark.png' });

  await browser.close();
  console.log('done');
})().catch((e) => { console.error('ERR:', e.message.slice(0, 300)); process.exit(1); });
