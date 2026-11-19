const { NIVEIS_EXPLORADOR } = require('../config/env');
const User = require('../models/User');
const Challenge = require('../models/Challenge');

const CATALOGO_MEDALHAS = [
  {
    id: 'primeiro_passo',
    titulo: 'Primeiro Passo',
    descricao: 'Concluiu seu primeiro desafio na plataforma NumisQuest.',
    icone: '🧭'
  },
  {
    id: 'olho_de_lince',
    titulo: 'Olho de Lince',
    descricao: 'Acertou um desafio de identificação de moedas e cédulas.',
    icone: '🔍'
  },
  {
    id: 'historiador_numismatico',
    titulo: 'Historiador Numismático',
    descricao: 'Dominou fatos históricos sobre a numismática brasileira.',
    icone: '📜'
  },
  {
    id: 'mestre_numismata',
    titulo: 'Mestre Numismata',
    descricao: 'Alcançou 250 pontos ou mais de experiência (XP).',
    icone: '👑'
  }
];

function calcularNivel(pontos) {
  if (pontos >= NIVEIS_EXPLORADOR.MESTRE_MIN) return 'Mestre Numismata';
  if (pontos >= NIVEIS_EXPLORADOR.CURADOR_MIN) return 'Curador de Museu';
  return 'Explorador Iniciante';
}

function avaliarNovasMedalhas(user, challenge) {
  const atuais = new Set(user.conquistas || []);

  if (user.desafiosConcluidos.length >= 1) {
    atuais.add('primeiro_passo');
  }
  if (challenge && challenge.medalhaId) {
    atuais.add(challenge.medalhaId);
  }
  if (user.pontos >= NIVEIS_EXPLORADOR.MESTRE_MIN) {
    atuais.add('mestre_numismata');
  }

  return Array.from(atuais);
}

async function submitChallengeAnswer(userId, challengeId, selectedOptionIndex) {
  if (selectedOptionIndex === undefined || selectedOptionIndex === null || Number.isNaN(Number(selectedOptionIndex))) {
    const err = new Error('Informe o índice da opção escolhida (selectedOptionIndex).');
    err.status = 400;
    throw err;
  }

  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('Usuário não encontrado.');
    err.status = 404;
    throw err;
  }

  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    const err = new Error('Desafio não encontrado.');
    err.status = 404;
    throw err;
  }

  const jaConcluido = user.desafiosConcluidos.some((id) => String(id) === String(challenge._id));
  if (jaConcluido) {
    const err = new Error('Este desafio já foi concluído por você anteriormente.');
    err.status = 422;
    throw err;
  }

  const opcaoNum = Number(selectedOptionIndex);
  if (opcaoNum < 0 || opcaoNum >= challenge.opcoes.length) {
    const err = new Error('Opção selecionada inválida.');
    err.status = 400;
    throw err;
  }

  const acertou = opcaoNum === challenge.indiceCorreto;

  if (!acertou) {
    return {
      acertou: false,
      pontosGanhos: 0,
      pontosTotais: user.pontos,
      nivel: calcularNivel(user.pontos),
      mensagem: 'Resposta incorreta! Revise a dica histórica e tente novamente.'
    };
  }

  user.pontos += challenge.pontosRecompensa;
  user.desafiosConcluidos.push(challenge._id);
  user.conquistas = avaliarNovasMedalhas(user, challenge);
  await user.save();

  return {
    acertou: true,
    pontosGanhos: challenge.pontosRecompensa,
    pontosTotais: user.pontos,
    nivel: calcularNivel(user.pontos),
    explicacaoHistorica: challenge.explicacaoHistorica,
    conquistasDesbloqueadas: user.conquistas,
    mensagem: `Parabéns! Você ganhou +${challenge.pontosRecompensa} XP!`
  };
}

module.exports = {
  CATALOGO_MEDALHAS,
  calcularNivel,
  submitChallengeAnswer
};