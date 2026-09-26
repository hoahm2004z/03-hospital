jest.mock('../../src/repositories/user.repository', () => ({
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  createUser: jest.fn(),
}));

jest.mock('../../src/lib/password', () => ({
  hashPassword: jest.fn(async () => 'hashed'),
  verifyPassword: jest.fn(async () => true),
}));

const {
  registerService,
  loginService,
  refreshService,
} = require('../../src/services/auth.service');
const userRepo = require('../../src/repositories/user.repository');
const password = require('../../src/lib/password');

describe('auth.service (unit + mocks)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('register happy path', async () => {
    userRepo.findUserByEmail.mockResolvedValue(null);
    userRepo.createUser.mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      name: 'A',
      role: 'patient',
    });

    const user = await registerService({
      email: 'a@b.com',
      password: 'password1',
      name: 'A',
    });

    expect(user.email).toBe('a@b.com');
    expect(password.hashPassword).toHaveBeenCalled();
  });

  it('register negative — email exists', async () => {
    userRepo.findUserByEmail.mockResolvedValue({ id: 1 });
    await expect(
      registerService({ email: 'a@b.com', password: 'password1', name: 'A' })
    ).rejects.toMatchObject({ statusCode: 409, code: 'EMAIL_EXISTS' });
  });

  it('login negative — bad password', async () => {
    userRepo.findUserByEmail.mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      passwordHash: 'x',
      role: 'patient',
    });
    password.verifyPassword.mockResolvedValueOnce(false);

    await expect(
      loginService({ email: 'a@b.com', password: 'wrong' })
    ).rejects.toMatchObject({ statusCode: 401, code: 'INVALID_CREDENTIALS' });
  });

  it('refresh negative — missing token', async () => {
    await expect(refreshService(undefined)).rejects.toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    });
  });
});
