const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    business: {
      name: { type: String, default: 'Bhavesh Traders' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      gst: { type: String, default: '' },
    },
    notifications: {
      newOrder: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      franchiseLeads: { type: Boolean, default: true },
      emailReports: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;

