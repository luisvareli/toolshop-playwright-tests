import { test, expect } from '@playwright/test';
import { BrandSchema, ProductPageSchema, ProductSchema } from '../../src/api/schemas';

test.describe('API contracts', { tag: '@contract' }, () => {
  test('product list matches the contract on every page', async ({ request }) => {
    const first = ProductPageSchema.parse(await (await request.get('/products?page=1')).json());

    // Walk all pages: a contract that only holds for page 1 is not a contract.
    let seen = first.data.length;
    for (let page = 2; page <= first.last_page; page++) {
      const res = await request.get(`/products?page=${page}`);
      expect(res.status(), `page ${page}`).toBe(200);
      const body = ProductPageSchema.parse(await res.json());
      expect(body.current_page).toBe(page);
      seen += body.data.length;
    }
    expect(seen, 'sum of all pages equals the reported total').toBe(first.total);
  });

  test('single product matches the contract', async ({ request }) => {
    const list = ProductPageSchema.parse(await (await request.get('/products?page=1')).json());
    const res = await request.get(`/products/${list.data[0].id}`);
    expect(res.status()).toBe(200);
    ProductSchema.parse(await res.json());
  });

  test('brands match the contract and have unique slugs', async ({ request }) => {
    const brands = BrandSchema.array().nonempty().parse(await (await request.get('/brands')).json());
    const slugs = brands.map((b) => b.slug);
    expect(new Set(slugs).size, 'slugs are used in URLs, so they must be unique').toBe(slugs.length);
  });

  test('sorting by price returns products in ascending order', async ({ request }) => {
    const res = await request.get('/products', { params: { sort: 'price,asc', page: 1 } });
    expect(res.status()).toBe(200);
    const prices = ProductPageSchema.parse(await res.json()).data.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
