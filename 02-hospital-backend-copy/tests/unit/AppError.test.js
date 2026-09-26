const AppError = require('../../src/errors/AppError');
const ERROR_CODES = require('../../src/errors/errorCodes');

describe('AppError', () => {
  it('creates operational error with code', () => {
    const err = new AppError('Nope', 404, ERROR_CODES.NOT_FOUND);
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.isOperational).toBe(true);
  });

  it('carries validation details', () => {
    const details = [{ path: 'email', message: 'required' }];
    const err = new AppError('bad', 400, ERROR_CODES.VALIDATION_ERROR, details);
    expect(err.details).toEqual(details);
  });
});
