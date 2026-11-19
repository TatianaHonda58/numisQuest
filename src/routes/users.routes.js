const express = require('express');
const User = require('../models/User');
const { authRequired } = require('../middlewares/auth');
const { calcularNivel, CATALOGO_MEDALHAS } = require('../services/gamification.service');

const router = express.Router();

router.get('/me', authRequired, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash').lean();
    if (!user) {
      return res.status(404).json({ message: 'Explorador não encontrado.' });
    }

    const medalhasDetalhadas = CATALOGO_MEDALHAS.map((m) => ({
      ...m,
      desbloqueada: (user.conquistas || []).includes(m.id)
    }));

    res.json({
      user: {
        ...user,
        nivel: calcularNivel(user.pontos || 0),
        totalDesafiosConcluidos: (user.desafiosConcluidos || []).length,
        medalhas: medalhasDetalhadas
      }
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/me', authRequired, async (req, res, next) => {
  try {
    const { name, username } = req.body;
    if (!name && !username) {
      return res.status(400).json({ message: 'Informe ao menos name ou username para atualizar.' });
    }

    const updates = {};
    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({ message: 'O nome não pode ficar vazio.' });
      }
      updates.name = String(name).trim();
    }

    if (username !== undefined) {
      const normalizedUsername = String(username).toLowerCase().trim();
      if (!normalizedUsername) {
        return res.status(400).json({ message: 'O username não pode ficar vazio.' });
      }
      const existing = await User.findOne({
        username: normalizedUsername,
        _id: { $ne: req.user.id }
      });
      if (existing) {
        return res.status(409).json({ message: 'Este nome de usuário já está em uso.' });
      }
      updates.username = normalizedUsername;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-passwordHash').lean();

    res.json({
      user: {
        ...updatedUser,
        nivel: calcularNivel(updatedUser.pontos || 0)
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
