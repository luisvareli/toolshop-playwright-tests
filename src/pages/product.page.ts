import { expect, type Locator, type Page } from '@playwright/test';

export class ProductPage {
  readonly name: Locator;
  readonly unitPrice: Locator;
  readonly quantity: Locator;
  readonly increaseQuantity: Locator;
  readonly addToCart: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.name = page.getByTestId('product-name');
    this.unitPrice = page.getByTestId('unit-price');
    this.quantity = page.getByTestId('quantity');
    this.increaseQuantity = page.getByTestId('increase-quantity');
    this.addToCart = page.getByTestId('add-to-cart');
    this.cartBadge = page.getByTestId('cart-quantity');
  }

  async open(productId: string) {
    await this.page.goto(`/product/${productId}`);
    await expect(this.name).toBeVisible();
  }
}
