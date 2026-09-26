import { test, expect } from '@playwright/test';

test('global search follows the editable combobox pattern', async ({ page }) => {
  await page.goto('/#/home');

  const input = page.locator('#globalSearch');
  const results = page.locator('#searchResults');
  const status = page.locator('#searchStatus');

  await expect(input).toHaveAttribute('role', 'combobox');
  await expect(input).toHaveAttribute('aria-controls', 'searchResults');
  await expect(input).toHaveAttribute('aria-autocomplete', 'list');
  await expect(input).toHaveAttribute('aria-expanded', 'false');

  await input.fill('公丁香');
  await expect(results.locator('[role="option"]').first()).toContainText('丁香');
  await expect(status).toContainText(/“公丁香”有 \d+ 条结果/);
  await expect(input).toHaveAttribute('aria-busy', 'false');

  await page.keyboard.press('ArrowDown');
  const activeId = await input.getAttribute('aria-activedescendant');
  expect(activeId).toMatch(/^search-option-/);
  await expect(page.locator('#' + activeId)).toHaveClass(/active/);

  await page.keyboard.press('Escape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).not.toHaveAttribute('aria-activedescendant', /.+/);
  await expect(input).toBeFocused();
});
