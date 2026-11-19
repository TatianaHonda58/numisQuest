const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./users.routes');
const itemRoutes = require('./item.routes');
const challengeRoutes = require('./challenge.routes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'numisquest-api' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/items', itemRoutes);
router.use('/challenges', challengeRoutes);

module.exports = router;