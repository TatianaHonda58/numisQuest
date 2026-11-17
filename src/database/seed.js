const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const config = require('../config');

// Dados de teste carregados a cada inicialização (o banco é em memória)
const products = [
  {
    name: 'Teclado Mecânico',
    description: 'Teclado mecânico ABNT2 com switches blue e iluminação RGB.',
    price: 250,
    stock: 10
  },
  {
    name: 'Mouse Sem Fio',
    description: 'Mouse sem fio ergonômico com 1600 DPI e bateria de longa duração.',
    price: 89.9,
    stock: 5
  },
  {
    name: 'Monitor 24" Full HD',
    description: 'Monitor IPS de 24 polegadas, resolução 1920x1080 e 75 Hz.',
    price: 899,
    stock: 0
  }
];

const users = [
  { name: 'Ana Silva', email: 'ana@email.com', password: '123456', totalSpent: 0 },
  { name: 'Bruno Souza', email: 'bruno@email.com', password: '123456', totalSpent: 280 },
  { name: 'Carla Lima', email: 'carla@email.com', password: '123456', totalSpent: 450 }
];

async function seed() {
  await Product.insertMany(products);

  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
      isVip: user.totalSpent >= config.vipThreshold
    }))
  );
  await User.insertMany(hashedUsers);

  return { products: products.length, users: users.length };
}

module.exports = { seed, products, users };
