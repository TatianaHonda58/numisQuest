const config = require('../config');
const { round } = require('../utils/money');

const PAYMENT_METHODS = ['cash', 'credit_card'];

/**
 * Calcula o resumo de uma compra aplicando as regras de negócio:
 *  - Pagamento em dinheiro (cash) recebe 10% de desconto sobre o subtotal dos produtos.
 *  - Clientes VIP têm frete grátis; os demais pagam o frete fixo.
 */
function calculateSummary({ items, isVip, paymentMethod }) {
  const subtotal = round(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
  const discount = paymentMethod === 'cash' ? round(subtotal * config.cashDiscountRate) : 0;
  const shipping = isVip ? 0 : config.shippingFee;
  const total = round(subtotal - discount + shipping);

  return { subtotal, discount, shipping, total };
}

/**
 * Cliente se torna VIP quando o total gasto em compras atinge o limite configurado.
 */
function isVipBySpending(totalSpent) {
  return totalSpent >= config.vipThreshold;
}

module.exports = { PAYMENT_METHODS, calculateSummary, isVipBySpending };
