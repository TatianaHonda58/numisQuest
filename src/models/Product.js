const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

productSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    name: this.name,
    description: this.description,
    price: this.price,
    stock: this.stock,
    imageUrl: this.imageUrl
  };
};

module.exports = mongoose.model('Product', productSchema);
