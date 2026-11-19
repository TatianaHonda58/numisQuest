const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Item = require('../models/Item');
const Challenge = require('../models/Challenge');

async function seedDatabase() {
  const existingItems = await Item.countDocuments();
  if (existingItems > 0) return;

  await Item.insertMany([
    {
      titulo: '100 Réis - República Velha (1901)',
      tipo: 'Moeda',
      pais: 'Brasil',
      periodo: 'Primeira República (1889–1930)',
      anoEmissao: 1901,
      valorFacial: '100 Réis',
      material: 'Cuproníquel',
      peso: '4,0 g',
      diametro: '21,0 mm',
      formato: 'Circular (Bordo liso)',
      tiragem: 30000000,
      comemorativa: false,
      codigoCatalogo: 'KM# 503',
      caracteristicasVisuais: ['Efígie da República', 'Barrete frígio', 'Brasão das Armas Nacionais', 'Estrelas'],
      historico: 'Cunhada no início da Primeira República do Brasil em cuproníquel, apresenta no anverso a efígie alegórica da República voltada à direita com barrete frígio.',
      imageFront: '/images/100-reis-1901-anverso.jpg',
      imageBack: '/images/100-reis-1901-reverso.jpg'
    },
    {
      titulo: '1 Real - Entrega da Bandeira Olímpica (2012)',
      tipo: 'Moeda',
      pais: 'Brasil',
      periodo: 'Plano Real (1994–Atual)',
      anoEmissao: 2012,
      valorFacial: '1 Real',
      material: 'Cuproníquel e Aço revestido de bronze (Bimetálica)',
      peso: '7,0 g',
      diametro: '27,0 mm',
      formato: 'Circular bimetálica (Bordo serrilhado intermitente)',
      tiragem: 2016000,
      comemorativa: true,
      codigoCatalogo: 'Y.REAL-BM-070',
      caracteristicasVisuais: ['Bandeira Olímpica', 'Aros olímpicos', 'Londres 2012', 'Rio 2016', 'Bimetálica'],
      historico: 'Primeira moeda comemorativa da série olímpica Rio 2016, celebrando a transição dos Jogos de Londres 2012 para o Rio de Janeiro. Possui uma das menores tiragens da família do Real.',
      imageFront: '/images/bandeira-olimpica-anverso.jpg',
      imageBack: '/images/bandeira-olimpica-reverso.jpg'
    },
    {
      titulo: '50.000 Cruzeiros Reais - Baiana (1994)',
      tipo: 'Cédula',
      pais: 'Brasil',
      periodo: 'Cruzeiro Real (1993–1994)',
      anoEmissao: 1994,
      valorFacial: '50.000 Cruzeiros Reais',
      material: 'Papel-moeda',
      peso: '1,0 g',
      diametro: '140 x 65 mm',
      formato: 'Retangular',
      tiragem: 18000000,
      comemorativa: false,
      codigoCatalogo: 'P#241',
      caracteristicasVisuais: ['Efígie da Baiana', 'Turbante', 'Baianas preparando acarajé', 'Tonalidade marrom e violácea'],
      historico: 'Emitida pouco antes da implantação do Plano Real em 1994, homenageia a cultura afro-brasileira da Bahia, trazendo a efígie da Baiana no anverso e o preparo tradicional do acarajé no reverso.',
      imageFront: '/images/50000-cruzeiros-anverso.jpg',
      imageBack: '/images/50000-cruzeiros-reverso.jpg'
    }, 
    {
      titulo: '200 Réis - Vicentina (1932)',
      tipo: 'Moeda', 
      pais: 'Brasil',
      periodo: 'Era Vargas (1930–1945)',
      anoEmissao: 1932,
      valorFacial: '200 Réis',
      material: 'Cuproníquel',
      peso: '5,0 g',
      diametro: '23,0 mm',
      formato: 'Circular (Bordo liso)',
      tiragem: 2500000,
      comemorativa: true,
      codigoCatalogo: 'KM# 531',
      caracteristicasVisuais: ['Caravela', 'Colonização do Brasil', 'Mapa do Brasil', 'Cruz da Ordem de Cristo'],
      historico: 'Série comemorativa do IV Centenário da Colonização do Brasil (1532–1932), conhecida pelos colecionadores como Série Vicentina.',
      imageFront: '/images/200-reis-1932-anverso.jpg',
      imageBack: '/images/200-reis-1932-reverso.jpg'
    },
    {
      titulo: '1 Dólar - Estados Unidos (Federal Reserve Note)',
      tipo: 'Cédula',
      pais: 'Estados Unidos',
      periodo: 'Federal Reserve Note (1963–Atual)',
      anoEmissao: 2017,
      valorFacial: '1 Dólar',
      material: 'Papel-moeda (75% algodão e 25% linho)',
      peso: '1,0 g',
      diametro: '156 x 66,3 mm',
      formato: 'Retangular',
      tiragem: 2500000000,
      comemorativa: false,
      codigoCatalogo: 'P# 541 / CE163',
      caracteristicasVisuais: [
        'George Washington',
        'Grande Selo dos Estados Unidos',
        'Pirâmide inacabada',
        'Olho da Providência',
        'Águia-de-cabeça-branca',
        'In God We Trust'
      ],
      historico: 'Emitida desde 1963 no formato atual do Federal Reserve Note, apresenta no anverso o retrato de George Washington e no reverso o Grande Selo dos Estados Unidos (anverso e reverso do selo), além do lema nacional "In God We Trust".',
      imageFront: '/images/1-dolar-eua-anverso.jpg',
      imageBack: '/images/1-dolar-eua-reverso.jpg'
    },
    {
      titulo: '10 Yuan - Panda Chinês de Prata (2011)',
      tipo: 'Moeda',
      pais: 'China',
      periodo: 'República Popular da China (1949–Atual)',
      anoEmissao: 2011,
      valorFacial: '10 Yuan',
      material: 'Prata pura (.999)',
      peso: '31,103 g (1 oz)',
      diametro: '40,0 mm',
      formato: 'Circular (Bordo serrilhado)',
      tiragem: 6000000,
      comemorativa: true,
      codigoCatalogo: 'KM# 1966',
      caracteristicasVisuais: [
        'Templo do Céu (Pequim)',
        'Panda gigante e filhote',
        'Floresta de bambu',
        'Inscrição 1oz Ag .999',
        'Ideogramas República Popular da China'
      ],
      historico: 'Cunhada pela Casa da Moeda da China em prata pura (.999) com peso de 1 onça troy (31,1 g), a série Panda Chinês é mundialmente famosa por alterar o desenho do panda no reverso a cada ano, mantendo o Templo do Céu de Pequim no anverso.',
      imageFront: '/images/panda-999-prata-2011-anverso.jpg',
      imageBack: '/images/panda-999-prata-2011-reverso.jpg'
    }
  ]);

  const challenges = await Challenge.insertMany([
    {
      titulo: 'Missão Diária: A Joia das Olimpíadas Rio 2016',
      categoria: 'Missão Diária',
      dificuldade: 'Fácil',
      enunciado: 'Qual moeda comemorativa de 1 Real teve tiragem de apenas 2.016.000 unidades e marcou a passagem dos Jogos de Londres para o Rio de Janeiro?',
      dica: 'Foi emitida em 2012 e exibe a bandeira com os cinco aros olímpicos.',
      opcoes: [
        '1 Real - Mascote Vinicius (2016)',
        '1 Real - Entrega da Bandeira Olímpica (2012)',
        '1 Real - 25 Anos do Plano Real (Beija-Flor)',
        '1 Real - Direitos Humanos (1998)'
      ],
      indiceCorreto: 1,
      explicacaoHistorica: 'A moeda da Entrega da Bandeira Olímpica (2012) teve tiragem limitada a 2.016.000 unidades em alusão ao ano dos Jogos do Rio.',
      pontosRecompensa: 25,
      medalhaId: 'primeiro_passo'
    },
    {
      titulo: 'Desafio de Identificação: Peça Mistério de 1901',
      categoria: 'Identificação',
      dificuldade: 'Médio',
      enunciado: 'Você encontrou uma moeda circular de cuproníquel, pesando 4,0 g, com 21 mm de diâmetro, datada de 1901, exibindo a efígie da República com barrete frígio. Qual é essa peça?',
      dica: 'Use a ferramenta Identificador de Moedas filtrando pelo ano 1901 e material cuproníquel.',
      opcoes: [
        '100 Réis - República Velha (1901)',
        '400 Réis - República Velha (1901)',
        '1 Cruzeiro - Mapa do Brasil (1942)',
        '50 Centavos - Marechal Dutra (1956)'
      ],
      indiceCorreto: 0,
      explicacaoHistorica: 'A moeda de 100 Réis de 1901 pertence à série de cuproníquel da Primeira República (KM# 503).',
      pontosRecompensa: 50,
      medalhaId: 'olho_de_lince'
    },
    {
      titulo: 'Quiz Histórico: A Cédula da Baiana',
      categoria: 'Quiz',
      dificuldade: 'Médio',
      enunciado: 'A cédula de 50.000 Cruzeiros Reais (1994), ilustrada com a efígie da Baiana, circulou imediatamente antes de qual padrão monetário brasileiro?',
      dica: 'Foi o último padrão monetário antes da moeda atual do Brasil.',
      opcoes: [
        'Cruzado Novo',
        'Cruzeiro Novo',
        'Plano Real (Real)',
        'Mil-Réis'
      ],
      indiceCorreto: 2,
      explicacaoHistorica: 'O Cruzeiro Real vigorou de agosto de 1993 até 30 de junho de 1994, sendo substituído pelo Real em 1º de julho de 1994.',
      pontosRecompensa: 50,
      medalhaId: 'historiador_numismatico'
    },
    {
      titulo: 'Quiz Numismático: A Moeda da Caravela',
      categoria: 'Quiz', 
      dificuldade: 'Médio', 
      enunciado: 'Qual evento histórico foi celebrado pela Série Vicentina de moedas brasileiras emitida em 1932?',
      dica: 'A série trazia caravelas e personagens ligados ao início da colonização em São Vicente.',
      opcoes: [
        'Proclamação da República',
        'IV Centenário da Colonização do Brasil',
        'Centenário da Independência',
        'Abolição da Escravatura'
      ],
      indiceCorreto: 1, 
      explicacaoHistorica: 'Emitida em 1932, a Série Vicentina celebrou os 400 anos da fundação da Vila de São Vicente (1532).',
      pontosRecompensa: 25,
      medalhaId: '' 
    },
    {
      titulo: 'Desafio Mestre: Os Símbolos Ocultos do 1 Dólar Americano',
      categoria: 'Quiz',
      dificuldade: 'Difícil',
      enunciado: 'No reverso da cédula de 1 Dólar dos Estados Unidos, a base da pirâmide inacabada exibe algarismos romanos ("MDCCLXXVI") e a faixa inferior traz a inscrição em latim "Novus Ordo Seclorum". O que essa data e esse conjunto simbólico representam?',
      dica: 'Observe o ano registrado na base da pirâmide no Grande Selo dos Estados Unidos (1776).',
      opcoes: [
        'A fundação do Federal Reserve System em 1913',
        'O ano da Declaração de Independência dos Estados Unidos (1776) e o início de uma nova era americana',
        'A data da posse de George Washington como primeiro presidente em 1789',
        'A adoção do padrão-ouro pelo Tesouro Americano em 1873'
      ],
      indiceCorreto: 1,
      explicacaoHistorica: 'Os algarismos romanos MDCCLXXVI correspondem a 1776, ano da Declaração de Independência dos EUA, enquanto "Novus Ordo Seclorum" significa "Nova Ordem dos Séculos".',
      pontosRecompensa: 75,
      medalhaId: ''
    },
    {
      titulo: 'Desafio Mestre: O Templo Sagrado e a Prata .999',
      categoria: 'Quiz',
      dificuldade: 'Difícil',
      enunciado: 'Na moeda chinesa de 10 Yuan de 2011 ("1oz Ag .999"), o anverso retrata um famoso monumento histórico de Pequim inscrito como Patrimônio Mundial da UNESCO, enquanto o reverso exibe um panda adulto e seu filhote entre bambus. Qual monumento aparece no anverso e o que significa "1oz Ag .999"?',
      dica: 'Observe a construção circular de três telhados no anverso e o símbolo químico da prata (Ag).',
      opcoes: [
        'Cidade Proibida — 1 onça de platina com 99,9% de pureza',
        'Templo do Céu — 1 onça troy (31,1 g) de prata com 99,9% de pureza',
        'Palácio de Verão — 1 onça de ouro branco com 99,9% de pureza',
        'Templo do Buda de Jade — 10 gramas de prata esterlina (.925)'
      ],
      indiceCorreto: 1,
      explicacaoHistorica: 'O anverso retrata o Salão de Oração por Boas Colheitas do Templo do Céu, em Pequim, e "1oz Ag .999" indica 1 onça troy de prata (símbolo químico Ag) com pureza de 99,9%.',
      pontosRecompensa: 75,
      medalhaId: ''
    }
  ]);

  const passwordHash = await bcrypt.hash('123456', 10);
  await User.insertMany([
    {
      name: 'Denise Moraes',
      username: 'denise_exploradora',
      email: 'denise@email.com',
      passwordHash,
      pontos: 0,
      desafiosConcluidos: [],
      conquistas: []
    },
    {
      name: 'Felipe Santos',
      username: 'felipe_curador',
      email: 'felipe@email.com',
      passwordHash,
      pontos: 125,
      desafiosConcluidos: [challenges[0]._id],
      conquistas: ['primeiro_passo']
    },
    {
      name: 'Poliana Carvalho',
      username: 'poliana_mestre',
      email: 'poliana@email.com',
      passwordHash,
      pontos: 275,
      desafiosConcluidos: [challenges[0]._id, challenges[1]._id, challenges[2]._id],
      conquistas: ['primeiro_passo', 'olho_de_lince', 'historiador_numismatico', 'mestre_numismata']
    }
  ]);
}

module.exports = { seedDatabase };