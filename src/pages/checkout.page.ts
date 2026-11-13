import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly productTitles: Locator;
  readonly linePrices: Locator;
  readonly total: Locator;

  constructor(private readonly page: Page) {
    this.productTitles = page.getByTestId('product-title');
    this.linePrices = page.getByTestId('line-price');
    this.total = page.getByTestId('cart-total');
  }

  async open() {
    await this.page.goto('/checkout');
  }
}

/** "$28.30" -> 28.3 */
export function money(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}
