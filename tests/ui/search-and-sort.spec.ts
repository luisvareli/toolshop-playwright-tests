import { test, expect } from '../../src/fixtures';

test.describe('Finding a product', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('search shows only products that match the term', async ({ homePage }) => {
    await homePage.search('pliers');

    const names = await homePage.productNames.allInnerTexts();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.toLowerCase()).toContain('pliers');
    }
  });

  test('search results match what the API returns for the same term', async ({ homePage, request, apiUrl }) => {
    const api = await (await request.get(`${apiUrl}/products/search`, { params: { q: 'hammer' } })).json();
    const expected = api.data.map((p: { name: string }) => p.name).sort();

    await homePage.search('hammer');

    await expect(homePage.productNames).toHaveCount(expected.length);
    expect((await homePage.productNames.allInnerTexts()).map((n) => n.trim()).sort()).toEqual(expected);
  });

  test('sorting by price low to high puts the cheapest product first', async ({ homePage }) => {
    await homePage.sortBy('Price (Low - High)');

    await expect
      .poll(async () => {
        const prices = await homePage.prices();
        return prices.length > 1 && prices.every((p, i) => i === 0 || prices[i - 1] <= p);
      }, { message: 'prices should be in ascending order' })
      .toBe(true);
  });

  test('a category page lists products under its heading', async ({ page, homePage }) => {
    await page.getByTestId('nav-categories').click();
    await page.getByTestId('nav-hand-tools').click();

    await expect(page.getByRole('heading', { name: 'Category: Hand Tools' })).toBeVisible();
    await expect(homePage.productNames.first()).toBeVisible();
  });
});
