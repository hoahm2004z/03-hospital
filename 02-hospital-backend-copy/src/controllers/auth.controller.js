const {
  registerService,
  loginService,
  refreshService,
} = require('../services/auth.service');
const { toUserResponseDto } = require('../dto/auth.dto');

async function register(req, res) {
  const user = await registerService(req.body);

  res.status(201).json({
    message: 'Register success',
    data: toUserResponseDto(user),
  });
}

async function login(req, res) {
  const { user, tokens } = await loginService(req.body);

  res.status(200).json({
    message: 'Login success',
    data: {
      user: toUserResponseDto(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: 'Bearer',
    },
  });
}

async function refresh(req, res) {
  const tokens = await refreshService(req.body.refreshToken);

  res.status(200).json({
    message: 'Token refreshed',
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: 'Bearer',
    },
  });
}

module.exports = {
  register,
  login,
  refresh,
};
