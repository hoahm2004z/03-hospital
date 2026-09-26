const {
  cacheGet,
  cacheSet,
  cacheDelPrefix,
  _clearMemoryCache,
} = require('../../src/lib/cache');

describe('cache (memory fallback)', () => {
  beforeEach(() => {
    _clearMemoryCache();
  });

  it('SET / GET roundtrip', async () => {
    await cacheSet('k1', { a: 1 }, 5_000);
    await expect(cacheGet('k1')).resolves.toEqual({ a: 1 });
  });

  it('miss returns null', async () => {
    await expect(cacheGet('missing')).resolves.toBeNull();
  });

  it('TTL expiry', async () => {
    await cacheSet('ttl', 'x', 30);
    await new Promise((r) => setTimeout(r, 50));
    await expect(cacheGet('ttl')).resolves.toBeNull();
  });

  it('del prefix invalidates', async () => {
    await cacheSet('appointments:1', 1, 5_000);
    await cacheSet('appointments:2', 2, 5_000);
    await cacheSet('other', 3, 5_000);
    await cacheDelPrefix('appointments:');
    await expect(cacheGet('appointments:1')).resolves.toBeNull();
    await expect(cacheGet('other')).resolves.toBe(3);
  });
});
