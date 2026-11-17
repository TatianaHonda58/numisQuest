const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const HttpError = require('../utils/httpError');

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find().sort({ name: 1 });
  res.json({ products: products.map((p) => p.toPublic()) });
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new HttpError(400, 'O id informado é inválido.');
  }
  const product = await Product.findById(req.params.id);
  if (!product) throw new HttpError(404, 'Produto não encontrado.');
  res.json({ product: product.toPublic() });
});

module.exports = router;
