import { test, expect } from '@playwright/test';

test.describe('Products API', () => {
  test('lists products in pages of nine with the fields the shop needs', async ({ request }) => {
    const res = await request.get('/products?page=1');
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.current_page).toBe(1);
    expect(body.per_page).toBe(9);
    expect(body.total).toBeGreaterThan(0);
    expect(body.data).toHaveLength(9);

    for (const product of body.data) {
      expect(product.id, 'id').toBeTruthy();
      expect(product.name, 'name').toBeTruthy();
      expect(typeof product.price, `price of ${product.name}`).toBe('number');
      expect(product.price).toBeGreaterThan(0);
      expect(typeof product.in_stock).toBe('boolean');
    }
  });

  test('returns one product by id, matching what the list returned', async ({ request }) => {
    const list = await (await request.get('/products?page=1')).json();
    const expected = list.data[0];

    const res = await request.get(`/products/${expected.id}`);
    expect(res.status()).toBe(200);

    const product = await res.json();
    expect(product.id).toBe(expected.id);
    expect(product.name).toBe(expected.name);
    expect(product.price).toBe(expected.price);
  });

  test('answers 404 for a product id that does not exist', async ({ request }) => {
    const res = await request.get('/products/this-id-does-not-exist');
    expect(res.status()).toBe(404);
  });

  test('search only returns products whose name matches the term', async ({ request }) => {
    const res = await request.get('/products/search', { params: { q: 'pliers' } });
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.data.length).toBeGreaterThan(0);
    for (const product of body.data) {
      expect(product.name.toLowerCase()).toContain('pliers');
    }
  });

  test('search for a term nothing matches returns an empty list, not an error', async ({ request }) => {
    const res = await request.get('/products/search', { params: { q: 'zzzz-no-such-tool' } });
    expect(res.status()).toBe(200);
    expect((await res.json()).data).toEqual([]);
  });
});
