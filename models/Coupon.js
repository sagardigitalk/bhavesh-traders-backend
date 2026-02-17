const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Percentage', 'Flat'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    validUntil: {
      type: Date,
    },
    usageLimit: {
      type: Number,
      default: 0,
      min: 0,
    },
    used: {
      type: Number,
      default: 0,
      min: 0,
    },
    label: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    startDate: {
      type: Date,
    },
    bannerBackground: {
      type: String,
      default: '#1E293B',
    },
    bannerTextColor: {
      type: String,
      default: '#FACC15',
    },
    bannerAccentColor: {
      type: String,
      default: '#F97316',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
