const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const HttpError = require('../utils/httpError');
const { round } = require('../utils/money');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

function parseQuantity(value) {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new HttpError(400, 'A quantidade deve ser um número inteiro maior ou igual a 1.');
  }
  return quantity;
}

async function findProduct(productId) {
  if (!mongoose.isValidObjectId(productId)) {
    throw new HttpError(400, 'O productId informado é inválido.');
  }
  const product = await Product.findById(productId);
  if (!product) throw new HttpError(404, 'Produto não encontrado.');
  return product;
}

function ensureStock(product, quantity) {
  if (product.stock <= 0) {
    throw new HttpError(422, `O produto "${product.name}" está sem estoque.`);
  }
  if (quantity > product.stock) {
    throw new HttpError(
      422,
      `Estoque insuficiente para "${product.name}". Disponível: ${product.stock}.`
    );
  }
}

/** Monta a visão do carrinho com os dados atuais dos produtos. */
async function buildCartView(cart) {
  await cart.populate('items.product');
  const items = cart.items
    .filter((item) => item.product)
    .map((item) => ({
      productId: item.product._id.toString(),
      name: item.product.name,
      unitPrice: item.product.price,
      quantity: item.quantity,
      lineTotal: round(item.product.price * item.quantity),
      stock: item.product.stock
    }));

  return {
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: round(items.reduce((sum, item) => sum + item.lineTotal, 0))
  };
}

async function addItem(userId, { productId, quantity }) {
  const qty = parseQuantity(quantity ?? 1);
  const product = await findProduct(productId);
  const cart = await getOrCreateCart(userId);

  const existing = cart.items.find((item) => item.product.toString() === product._id.toString());
  const newQuantity = (existing ? existing.quantity : 0) + qty;
  ensureStock(product, newQuantity);

  if (existing) existing.quantity = newQuantity;
  else cart.items.push({ product: product._id, quantity: qty });

  await cart.save();
  return buildCartView(cart);
}

async function updateItem(userId, productId, { quantity }) {
  const qty = parseQuantity(quantity);
  const product = await findProduct(productId);
  const cart = await getOrCreateCart(userId);

  const existing = cart.items.find((item) => item.product.toString() === product._id.toString());
  if (!existing) throw new HttpError(404, 'Este produto não está no carrinho.');

  ensureStock(product, qty);
  existing.quantity = qty;
  await cart.save();
  return buildCartView(cart);
}

async function removeItem(userId, productId) {
  const cart = await getOrCreateCart(userId);
  const index = cart.items.findIndex((item) => item.product.toString() === productId);
  if (index === -1) throw new HttpError(404, 'Este produto não está no carrinho.');

  cart.items.splice(index, 1);
  await cart.save();
  return buildCartView(cart);
}

async function clear(userId) {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
  return buildCartView(cart);
}

module.exports = { getOrCreateCart, buildCartView, addItem, updateItem, removeItem, clear };
