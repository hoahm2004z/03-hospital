const logger = require('../../src/lib/logger');

describe('logger redaction', () => {
  it('redacts password and tokens', () => {
    const out = logger.redact({
      password: 'secret123',
      accessToken: 'abc',
      nested: { refreshToken: 'xyz', email: 'a@b.com' },
    });
    expect(out.password).toBe('[REDACTED]');
    expect(out.accessToken).toBe('[REDACTED]');
    expect(out.nested.refreshToken).toBe('[REDACTED]');
    expect(out.nested.email).toBe('a@b.com');
  });

  it('redacts Bearer header values', () => {
    expect(logger.redact({ authorization: 'Bearer tok' }).authorization).toBe(
      '[REDACTED]'
    );
  });
});
