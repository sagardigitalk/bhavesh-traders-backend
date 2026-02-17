const asyncHandler = require('express-async-handler');
const Setting = require('../models/Setting');

const getOrCreateSettings = async () => {
  let setting = await Setting.findOne({});
  if (!setting) {
    setting = await Setting.create({});
  }
  return setting;
};

// @desc    Get settings
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = asyncHandler(async (req, res) => {
  const setting = await getOrCreateSettings();
  res.json(setting);
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  const setting = await getOrCreateSettings();

  const { business, notifications, shipping } = req.body;

  if (business) {
    setting.business = {
      ...setting.business.toObject(),
      ...business,
    };
  }

  if (notifications) {
    setting.notifications = {
      ...setting.notifications.toObject(),
      ...notifications,
    };
  }

  if (shipping) {
    setting.shipping = {
      ...(setting.shipping ? setting.shipping.toObject() : {}),
      ...shipping,
    };
  }

  const updated = await setting.save();
  res.json(updated);
});

// @desc    Get public settings (for website)
// @route   GET /api/settings/public
// @access  Public
const getPublicSettings = asyncHandler(async (req, res) => {
  const setting = await getOrCreateSettings();
  res.json({
    shipping: {
      baseCharge: setting.shipping?.baseCharge ?? 50,
      freeAbove: setting.shipping?.freeAbove ?? 500,
    },
  });
});

module.exports = {
  getSettings,
  updateSettings,
  getPublicSettings,
};
