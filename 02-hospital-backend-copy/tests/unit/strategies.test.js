const { getStrategy } = require('../../src/notifications/strategies');

describe('notification strategies', () => {
  it('resolves notify-appointment strategy', async () => {
    const fn = getStrategy('notify-appointment');
    const result = await fn({ patientId: 1, doctorId: 2, time: '10:00' });
    expect(result).toEqual({ ok: true });
  });

  it('throws on unknown strategy', () => {
    expect(() => getStrategy('unknown-job')).toThrow(/Unknown/);
  });
});
