const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    lineTotal: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    paymentMethod: { type: String, enum: ['cash', 'credit_card'], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    vipAtPurchase: { type: Boolean, required: true },
    becameVip: { type: Boolean, default: false }
  },
  { timestamps: true }
);

orderSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    items: this.items.map((item) => ({
      productId: item.product.toString(),
      name: item.name,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal
    })),
    paymentMethod: this.paymentMethod,
    subtotal: this.subtotal,
    discount: this.discount,
    shipping: this.shipping,
    total: this.total,
    vipAtPurchase: this.vipAtPurchase,
    becameVip: this.becameVip,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Order', orderSchema);
