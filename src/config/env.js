module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'numisquest-dev-secret',
  JWT_EXPIRES_IN: '2h',
  NIVEIS_EXPLORADOR: {
    CURADOR_MIN: 100,
    MESTRE_MIN: 250
  }
};
