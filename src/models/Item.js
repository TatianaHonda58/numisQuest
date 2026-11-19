const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  tipo: { type: String, enum: ['Moeda', 'Cédula'], required: true },
  pais: { type: String, required: true, trim: true },
  periodo: { type: String, required: true, trim: true },
  anoEmissao: { type: Number, required: true },
  valorFacial: { type: String, required: true },
  material: { type: String, required: true },
  peso: { type: String, default: 'N/A' },
  diametro: { type: String, default: 'N/A' },
  formato: { type: String, default: 'Circular' },
  tiragem: { type: Number, required: true, min: 1 },
  comemorativa: { type: Boolean, default: false },
  codigoCatalogo: { type: String, default: '' },
  caracteristicasVisuais: [{ type: String }],
  historico: { type: String, default: '' },
  imageFront: { type: String, default: '' },
  imageBack: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);