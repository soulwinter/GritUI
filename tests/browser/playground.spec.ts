import { expect, test } from '@playwright/test';

test('pointer dragging, keyboard input, and focus containment work in the browser', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const slider = page.getByRole('slider', { name: 'Playground value' });
  const bounds = (await slider.boundingBox())!;
  await page.mouse.move(bounds.x + 15 + 300 * .1, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await expect(slider.locator('..')).toHaveAttribute('data-phase', 'active');
  await page.mouse.move(bounds.x + 15 + 300 * .75, bounds.y + bounds.height / 2, { steps: 8 });
  await page.mouse.up();
  expect(Number(await slider.inputValue())).toBeCloseTo(.75, 1);
  await expect(slider.locator('..')).toHaveAttribute('data-phase', 'release');
  await slider.focus();
  await page.keyboard.press('End');
  await expect(slider).toHaveValue('1');
  const toggle = page.getByRole('switch');
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'true');
  const trigger = page.getByRole('button', { name: 'Open a little window', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Say hello', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveAttribute('data-open', 'false');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('button highlight, banner, and dialog keep their animation sequences', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Hello, world!' });
  const bounds = (await button.boundingBox())!;
  await page.mouse.move(bounds.x + 15, bounds.y + 15);
  await page.mouse.down();
  await expect(button.locator('.grit-button__highlight')).toHaveAttribute('data-pressed', 'true');
  const timing = await button.locator('.grit-button__ripple').evaluate(node => getComputedStyle(node).animationDuration);
  expect(timing).toBe('0.2s');
  await page.mouse.up();
  await expect(button.locator('.grit-button__highlight')).toHaveAttribute('data-pressed', 'false');
  await expect(page.getByText('01 presses')).toBeVisible();
  const toggle = page.getByRole('switch');
  await toggle.click();
  await toggle.click();
  const switchFrames = await toggle.locator('.grit-switch__dot').evaluate(node => {
    const animation = node.getAnimations()[0];
    animation.pause();
    return [0, 100, 150, 250].map(time => {
      animation.currentTime = time;
      return getComputedStyle(node).transform;
    });
  });
  expect(switchFrames).toEqual(['matrix(0, 0, 0, 0, 0, 0)', 'matrix(0.85, 0, 0, 0.85, 0, 0)', 'matrix(0.625, 0, 0, 0.625, 0, 0)', 'matrix(0.75, 0, 0, 0.75, 0, 0)']);
  await page.getByRole('button', { name: 'Say hello ↑' }).click();
  const banner = page.locator('.grit-top-alert');
  await expect(banner).toContainText('Hello from GritUI!');
  const frames = await banner.evaluate(node => {
    const animation = node.getAnimations()[0];
    animation.pause();
    return [200, 400].map(time => { animation.currentTime = time; return getComputedStyle(node).transform; });
  });
  expect(frames).toEqual(['matrix(1, 0, 0, 1, 0, 6)', 'matrix(1, 0, 0, 1, 0, 0)']);
  await expect(banner).toHaveCount(0, { timeout: 5000 });
  await page.getByRole('button', { name: 'Open a little window' }).click();
  const dialogFrames = await page.getByRole('dialog').evaluate(node => {
    const animation = node.getAnimations()[0];
    animation.pause();
    return [300, 500].map(time => { animation.currentTime = time; return getComputedStyle(node).transform; });
  });
  expect(dialogFrames).toEqual(['matrix(1, 0, 0, 1, 0, 10)', 'matrix(1, 0, 0, 1, 0, 0)']);
});

test('mobile layout, touch interaction, and reduced motion remain usable', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4174', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Use blue accent' }).tap();
  await expect(page.getByRole('button', { name: 'Use blue accent' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('switch').tap();
  await expect(page.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('button', { name: 'Open a little window' }).tap();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(node => parseFloat(getComputedStyle(node).animationDuration))).toBeLessThan(.01);
  const bounds = (await dialog.boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  await dialog.getByRole('button', { name: 'Say hello', exact: true }).tap();
  await expect(page.locator('.grit-top-alert')).toBeVisible();
  await expect(dialog).toHaveCount(0);
  await context.close();
});

test('captures the desktop playground and original popup treatment', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'screenshots/playground-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Open a little window' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.evaluate(node => { for (const animation of node.getAnimations()) animation.finish(); });
  await page.screenshot({ path: 'screenshots/popup-desktop.png' });
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'screenshots/playground-mobile.png', fullPage: true });
});
