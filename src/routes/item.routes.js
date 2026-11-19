const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/Item');
const { identifyItems } = require('../services/identifier.service');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { pais, tipo, ano, material, periodo, q } = req.query;
    const filter = {};

    if (tipo) filter.tipo = tipo;
    if (pais) filter.pais = new RegExp(pais, 'i');
    if (material) filter.material = new RegExp(material, 'i');
    if (periodo) filter.periodo = new RegExp(periodo, 'i');
    if (ano && !Number.isNaN(Number(ano))) filter.anoEmissao = Number(ano);
    if (q) {
      filter.$or = [
        { titulo: new RegExp(q, 'i') },
        { valorFacial: new RegExp(q, 'i') },
        { codigoCatalogo: new RegExp(q, 'i') }
      ];
    }

    const items = await Item.find(filter).sort({ anoEmissao: 1 }).lean();
    res.json({ total: items.length, items });
  } catch (err) {
    next(err);
  }
});

router.post('/identify', async (req, res, next) => {
  try {
    const matches = await identifyItems(req.body);
    res.json({ total: matches.length, matches });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID do item inválido.' });
    }
    const item = await Item.findById(req.params.id).lean();
    if (!item) {
      return res.status(404).json({ message: 'Item numismático não encontrado.' });
    }
    res.json({ item });
  } catch (err) {
    next(err);
  }
});

module.exports = router;