const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  categoria: { type: String, enum: ['Quiz', 'Identificação', 'Missão Diária'], required: true },
  dificuldade: { type: String, enum: ['Fácil', 'Médio', 'Difícil'], default: 'Fácil' },
  enunciado: { type: String, required: true },
  dica: { type: String, default: '' },
  opcoes: [{ type: String, required: true }],
  indiceCorreto: { type: Number, required: true, min: 0 },
  explicacaoHistorica: { type: String, default: '' },
  pontosRecompensa: { type: Number, required: true, min: 10 },
  medalhaId: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
