import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly sortSelect: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.sortSelect = page.getByTestId('sort');
    this.productNames = page.getByTestId('product-name');
    this.productPrices = page.getByTestId('product-price');
  }

  async open() {
    await this.page.goto('/');
    await expect(this.productNames.first()).toBeVisible();
  }

  /** Searches and waits for the search request, so the list is the new one. */
  async search(term: string) {
    await this.searchInput.fill(term);
    await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/products/search') && r.ok()),
      this.searchButton.click(),
    ]);
    await expect(this.page.getByTestId('search-caption')).toContainText(term);
  }

  async sortBy(label: string) {
    await Promise.all([
      this.page.waitForResponse((r) => /\/products(\?|$)/.test(r.url()) && r.ok()),
      this.sortSelect.selectOption({ label }),
    ]);
  }

  async prices(): Promise<number[]> {
    const texts = await this.productPrices.allInnerTexts();
    return texts.map((t) => Number(t.replace(/[^0-9.]/g, '')));
  }
}
