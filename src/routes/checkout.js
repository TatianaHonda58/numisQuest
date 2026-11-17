const express = require('express');
const authenticate = require('../middleware/auth');
const checkoutService = require('../services/checkoutService');

const router = express.Router();
router.use(authenticate);

router.get('/summary', async (req, res) => {
  res.json(await checkoutService.getSummary(req.user, req.query.paymentMethod));
});

router.post('/', async (req, res) => {
  const { paymentMethod } = req.body || {};
  res.status(201).json(await checkoutService.checkout(req.user, paymentMethod));
});

module.exports = router;
