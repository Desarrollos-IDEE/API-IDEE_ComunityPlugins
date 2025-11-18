import { test, expect } from '@playwright/test';

test('Click Basic', async ({ page }) => {
  await page.goto('/test/playwright/ol/basic-ol.html');
  await page.evaluate(() => {
    window.mapjs = IDEE.map({
      container: 'mapjs',
    });
    window.mp = new IDEE.plugin.Basic({});
  });
  
  await page.waitForFunction(() => window.mapjs.isFinished());

  await page.evaluate(() => {
    window.mapjs.addPlugin(window.mp);
  });

  const position = await page.evaluate(() => window.mp.position);
  expect(position).toBe('TR');
});
