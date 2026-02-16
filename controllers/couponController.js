const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

const buildStatusFilter = (query) => {
  const filter = {};
  if (query.active === 'true') {
    filter.isActive = true;
  }
  return filter;
};

const getCoupons = asyncHandler(async (req, res) => {
  const filter = buildStatusFilter(req.query);
  const coupons = await Coupon.find(filter).sort({ createdAt: -1 });
  res.json(coupons);
});

const createCoupon = asyncHandler(async (req, res) => {
  const { code, type, discountValue, minOrder, validUntil, usageLimit, label } = req.body;

  const existing = await Coupon.findOne({ code: code.trim().toUpperCase() });
  if (existing) {
    res.status(400);
    throw new Error('Coupon code already exists');
  }

  const coupon = await Coupon.create({
    code: code.trim().toUpperCase(),
    type,
    discountValue,
    minOrder: minOrder || 0,
    validUntil: validUntil ? new Date(validUntil) : undefined,
    usageLimit: usageLimit || 0,
    used: 0,
    label: label || '',
    isActive: true,
  });

  res.status(201).json(coupon);
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { code, type, discountValue, minOrder, validUntil, usageLimit, label, isActive } =
    req.body;

  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  if (code && code.trim().toUpperCase() !== coupon.code) {
    const existing = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
      res.status(400);
      throw new Error('Coupon code already exists');
    }
    coupon.code = code.trim().toUpperCase();
  }

  if (type) coupon.type = type;
  if (discountValue !== undefined) coupon.discountValue = discountValue;
  if (minOrder !== undefined) coupon.minOrder = minOrder;
  if (validUntil !== undefined) {
    coupon.validUntil = validUntil ? new Date(validUntil) : undefined;
  }
  if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
  if (label !== undefined) coupon.label = label;
  if (typeof isActive === 'boolean') coupon.isActive = isActive;

  const updated = await coupon.save();
  res.json(updated);
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  await Coupon.deleteOne({ _id: coupon._id });
  res.json({ message: 'Coupon removed' });
});

const validateCoupon = asyncHandler(async (req, res) => {
  const { code, amount } = req.body;

  if (!code) {
    res.status(400);
    throw new Error('Coupon code is required');
  }

  const coupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    res.status(400);
    throw new Error('Invalid coupon code');
  }

  const now = new Date();
  if (coupon.validUntil && coupon.validUntil < now) {
    res.status(400);
    throw new Error('Coupon has expired');
  }

  if (coupon.usageLimit && coupon.used >= coupon.usageLimit) {
    res.status(400);
    throw new Error('Coupon usage limit reached');
  }

  const baseAmount = typeof amount === 'number' ? amount : 0;
  if (baseAmount && coupon.minOrder && baseAmount < coupon.minOrder) {
    res.status(400);
    throw new Error('Minimum order value not reached for this coupon');
  }

  let discount = 0;
  if (coupon.type === 'Percentage') {
    discount = (baseAmount * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  if (discount < 0) discount = 0;

  res.json({
    coupon,
    discount,
  });
});

module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
