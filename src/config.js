module.exports = {
  port: Number(process.env.PORT) || 3030,
  jwtSecret: process.env.JWT_SECRET || 'ppp-ecommerce-dev-secret',
  jwtExpiresIn: '2h',
  // Regras de negócio
  shippingFee: 20, // valor fixo do frete (R$) para clientes não VIP
  cashDiscountRate: 0.1, // 10% de desconto para pagamento em dinheiro
  vipThreshold: 300 // total gasto (R$) para o cliente se tornar VIP
};
