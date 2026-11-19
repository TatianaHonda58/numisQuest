const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token de autenticação ausente ou inválido.' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Token expirado ou inválido.' });
  }
}

module.exports = { authRequired };
