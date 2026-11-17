const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const HttpError = require('../utils/httpError');

const router = express.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (typeof name !== 'string' || name.trim().length < 2) {
    throw new HttpError(400, 'Informe um nome com pelo menos 2 caracteres.');
  }
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    throw new HttpError(400, 'Informe um e-mail válido.');
  }
  if (typeof password !== 'string' || password.length < 6) {
    throw new HttpError(400, 'A senha deve ter pelo menos 6 caracteres.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) {
    throw new HttpError(409, 'Já existe um usuário cadastrado com este e-mail.');
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10)
  });

  res.status(201).json({ user: user.toPublic() });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    throw new HttpError(400, 'Informe e-mail e senha.');
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new HttpError(401, 'E-mail ou senha inválidos.');
  }

  const token = jwt.sign({ sub: user._id.toString() }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });

  res.json({ token, user: user.toPublic() });
});

module.exports = router;
