import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'docs', 'screenshots');
const BASE = 'http://localhost:3003';

async function shot(page, name, extra = '') {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`✅  Saved: ${name}${extra}`);
}

async function waitForLoad(page) {
  // wait for fonts + animations to settle
  await page.waitForTimeout(3000);
}

const browser = await chromium.launch({ headless: true });
const ctx    = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page   = await ctx.newPage();

// ── 1. Hero Dark ─────────────────────────────────────────────
await page.goto(BASE, { waitUntil: 'networkidle' });
// ensure dark mode (set localStorage before reload)
await page.evaluate(() => {
  localStorage.setItem('portfolio-theme', 'dark');
  document.documentElement.classList.add('dark');
});
await page.reload({ waitUntil: 'networkidle' });
await waitForLoad(page);
await shot(page, 'hero-dark.png', ' — Hero Dark Mode');

// ── 2. Hero Light ────────────────────────────────────────────
await page.evaluate(() => {
  localStorage.setItem('portfolio-theme', 'light');
  document.documentElement.classList.remove('dark');
});
await page.reload({ waitUntil: 'networkidle' });
await waitForLoad(page);
await shot(page, 'hero-light.png', ' — Hero Light Mode');

// ── 3. Projects section (dark) ───────────────────────────────
await page.evaluate(() => {
  localStorage.setItem('portfolio-theme', 'dark');
  document.documentElement.classList.add('dark');
});
await page.reload({ waitUntil: 'networkidle' });
await waitForLoad(page);
await page.evaluate(() => {
  document.getElementById('projects')?.scrollIntoView({ behavior: 'instant' });
});
await page.waitForTimeout(1500);
await shot(page, 'projects.png', ' — Projects Section');

// ── 4. Project Detail ─────────────────────────────────────────
await page.goto(`${BASE}/projects/distributed-task-engine`, { waitUntil: 'networkidle' });
await waitForLoad(page);
await shot(page, 'project-detail.png', ' — Project Detail');

// ── 5. About section ─────────────────────────────────────────
await page.goto(BASE, { waitUntil: 'networkidle' });
await waitForLoad(page);
await page.evaluate(() => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'instant' });
});
await page.waitForTimeout(1500);
await shot(page, 'about.png', ' — About Section');

// ── 6. Chatbot open ──────────────────────────────────────────
await page.goto(BASE, { waitUntil: 'networkidle' });
await waitForLoad(page);
// try to click the chatbot FAB — common selectors
const chatBtn = page.locator('button[aria-label*="chat" i], button[aria-label*="assistant" i], button[data-testid*="chat" i]').first();
const hasChatBtn = await chatBtn.count() > 0;
if (hasChatBtn) {
  await chatBtn.click();
  await page.waitForTimeout(1200);
  await shot(page, 'chatbot.png', ' — Chatbot Open');
} else {
  // fallback: scroll to bottom where FAB usually lives and screenshot as-is
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await shot(page, 'chatbot.png', ' — Chatbot (FAB area)');
}

await browser.close();
console.log('\n🎉  All screenshots captured!');
