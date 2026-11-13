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

  /** Opens the cart the way a customer does, from the cart icon in the menu. */
  async open() {
    await this.page.getByTestId('nav-cart').click();
    await this.page.waitForURL('**/checkout');
  }
}

/** "$28.30" -> 28.3 */
export function money(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}
