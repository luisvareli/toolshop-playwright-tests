import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

/**
 * Scans key pages with axe against WCAG 2 A and AA.
 * Each page has a baseline of rules it is already known to break. The baseline is
 * empty today, so any serious or critical violation fails the test. If a known issue
 * has to be accepted for a while, add its rule id to the page's baseline with a note
 * in docs/findings.md instead of deleting the test.
 */
const pages: { name: string; path: string; baseline: string[] }[] = [
  { name: 'home', path: '/', baseline: [] },
  { name: 'contact', path: '/contact', baseline: [] },
  { name: 'sign in', path: '/auth/login', baseline: [] },
];

for (const target of pages) {
  test(`${target.name} page has no new serious accessibility violations`, { tag: '@a11y' }, async ({ page }, testInfo) => {
    await page.goto(target.path);
    await page.getByTestId('nav-home').waitFor();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');

    await testInfo.attach('axe-violations.json', {
      body: JSON.stringify(serious.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length })), null, 2),
      contentType: 'application/json',
    });

    const newRules = serious.map((v) => v.id).filter((id) => !target.baseline.includes(id));
    expect(newRules, 'rules broken that are not in the baseline').toEqual([]);
  });
}
