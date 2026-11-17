const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    totalSpent: { type: Number, default: 0 },
    isVip: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    totalSpent: this.totalSpent,
    isVip: this.isVip
  };
};

module.exports = mongoose.model('User', userSchema);
