const express = require('express');
const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { authRequired } = require('../middlewares/auth');
const { submitChallengeAnswer, CATALOGO_MEDALHAS } = require('../services/gamification.service');

const router = express.Router();

router.get('/', authRequired, async (req, res, next) => {
  try {
    const [challenges, user] = await Promise.all([
      Challenge.find().lean(),
      User.findById(req.user.id).lean()
    ]);

    const concluidosSet = new Set((user?.desafiosConcluidos || []).map(String));

    const formatted = challenges.map(({ indiceCorreto, ...rest }) => ({
      ...rest,
      concluido: concluidosSet.has(String(rest._id))
    }));

    const medalhas = CATALOGO_MEDALHAS.map((m) => ({
      ...m,
      desbloqueada: (user?.conquistas || []).includes(m.id)
    }));

    res.json({ challenges: formatted, medalhas });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/submit', authRequired, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID do desafio inválido.' });
    }
    const result = await submitChallengeAnswer(
      req.user.id,
      req.params.id,
      req.body.selectedOptionIndex
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/progress', authRequired, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { pontos: 0, desafiosConcluidos: [], conquistas: [] } },
      { new: true }
    ).select('-passwordHash').lean();

    if (!user) {
      return res.status(404).json({ message: 'Explorador não encontrado.' });
    }

    res.json({
      message: 'Progresso, XP e medalhas resetados com sucesso.',
      user: {
        ...user,
        nivel: 'Explorador Iniciante'
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;