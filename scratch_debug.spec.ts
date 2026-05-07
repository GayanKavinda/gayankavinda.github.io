import { test } from '@playwright/test';

test('get model bounds', async ({ page }) => {
  let size = '';
  let center = '';
  
  page.on('console', msg => {
    const text = msg.text();
    if (text.startsWith('MODEL_DEBUG|')) {
      console.log('CAPTURED_LOG:', text);
    }
  });

  await page.goto('http://localhost:3004');
  await page.waitForTimeout(6000); // Give it time to load the model
});
