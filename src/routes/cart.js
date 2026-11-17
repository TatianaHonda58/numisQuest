const express = require('express');
const authenticate = require('../middleware/auth');
const cartService = require('../services/cartService');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  const cart = await cartService.getOrCreateCart(req.user._id);
  res.json(await cartService.buildCartView(cart));
});

router.post('/items', async (req, res) => {
  res.status(201).json(await cartService.addItem(req.user._id, req.body || {}));
});

router.patch('/items/:productId', async (req, res) => {
  res.json(await cartService.updateItem(req.user._id, req.params.productId, req.body || {}));
});

router.delete('/items/:productId', async (req, res) => {
  res.json(await cartService.removeItem(req.user._id, req.params.productId));
});

router.delete('/', async (req, res) => {
  res.json(await cartService.clear(req.user._id));
});

module.exports = router;
