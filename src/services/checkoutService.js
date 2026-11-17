const Product = require('../models/Product');
const Order = require('../models/Order');
const HttpError = require('../utils/httpError');
const { getOrCreateCart, buildCartView } = require('./cartService');
const { PAYMENT_METHODS, calculateSummary, isVipBySpending } = require('./pricing');
const { round } = require('../utils/money');

function validatePaymentMethod(paymentMethod) {
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    throw new HttpError(
      400,
      `Forma de pagamento inválida. Use uma das opções: ${PAYMENT_METHODS.join(', ')}.`
    );
  }
}

/** Prévia dos valores da compra, sem efetivá-la. */
async function getSummary(user, paymentMethod) {
  validatePaymentMethod(paymentMethod);
  const cart = await getOrCreateCart(user._id);
  const view = await buildCartView(cart);

  return {
    items: view.items,
    paymentMethod,
    isVip: user.isVip,
    ...calculateSummary({ items: view.items, isVip: user.isVip, paymentMethod })
  };
}

/** Efetiva a compra: valida estoque, baixa estoque, registra o pedido e atualiza o status VIP. */
async function checkout(user, paymentMethod) {
  validatePaymentMethod(paymentMethod);
  const cart = await getOrCreateCart(user._id);
  const view = await buildCartView(cart);

  if (view.items.length === 0) {
    throw new HttpError(422, 'O carrinho está vazio.');
  }

  for (const item of view.items) {
    if (item.quantity > item.stock) {
      throw new HttpError(
        422,
        `Estoque insuficiente para "${item.name}". Disponível: ${item.stock}.`
      );
    }
  }

  // Baixa de estoque condicional; desfaz o que já foi baixado se algum item falhar.
  const reserved = [];
  for (const item of view.items) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );
    if (!updated) {
      await Promise.all(
        reserved.map((r) => Product.updateOne({ _id: r.productId }, { $inc: { stock: r.quantity } }))
      );
      throw new HttpError(422, `Estoque insuficiente para "${item.name}".`);
    }
    reserved.push(item);
  }

  const vipAtPurchase = user.isVip;
  const summary = calculateSummary({ items: view.items, isVip: vipAtPurchase, paymentMethod });

  user.totalSpent = round(user.totalSpent + summary.total);
  const becameVip = !vipAtPurchase && isVipBySpending(user.totalSpent);
  if (becameVip) user.isVip = true;
  await user.save();

  const order = await Order.create({
    user: user._id,
    items: view.items.map((item) => ({
      product: item.productId,
      name: item.name,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal
    })),
    paymentMethod,
    ...summary,
    vipAtPurchase,
    becameVip
  });

  cart.items = [];
  await cart.save();

  return { order: order.toPublic(), user: user.toPublic() };
}

module.exports = { getSummary, checkout };
