const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { calcularNivel } = require('../services/gamification.service');

const router = express.Router();

function buildAuthResponse(user) {
  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      pontos: user.pontos || 0,
      nivel: calcularNivel(user.pontos || 0),
      conquistas: user.conquistas || []
    }
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Nome, username, e-mail e senha são obrigatórios.' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedUsername = String(username).toLowerCase().trim();

    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
    });

    if (existing) {
      return res.status(409).json({ message: 'E-mail ou nome de usuário já cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name).trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      pontos: 0,
      desafiosConcluidos: [],
      conquistas: []
    });

    res.status(201).json(buildAuthResponse(user));
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    const valid = await bcrypt.compare(String(password), user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    res.json(buildAuthResponse(user));
  } catch (err) {
    next(err);
  }
});

module.exports = router;