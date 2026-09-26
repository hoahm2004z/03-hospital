const { parseListQuery, buildPageMeta } = require('../../src/utils/listQuery');

describe('listQuery', () => {
  it('applies happy-path defaults', () => {
    const q = parseListQuery({});
    expect(q.page).toBe(1);
    expect(q.limit).toBe(10);
    expect(q.skip).toBe(0);
    expect(q.sortOrder).toBe('asc');
  });

  it('clamps limit edge cases', () => {
    expect(parseListQuery({ limit: 999 }).limit).toBe(50);
    expect(parseListQuery({ limit: 0 }).limit).toBe(10);
    expect(parseListQuery({ limit: -5 }).limit).toBe(1);
  });

  it('rejects negative page by flooring to 1', () => {
    expect(parseListQuery({ page: -2 }).page).toBe(1);
  });

  it('builds page meta', () => {
    expect(buildPageMeta(25, 2, 10)).toEqual({
      total: 25,
      page: 2,
      limit: 10,
      totalPages: 3,
    });
  });

  it('totalPages is at least 1 when empty', () => {
    expect(buildPageMeta(0, 1, 10).totalPages).toBe(1);
  });
});
