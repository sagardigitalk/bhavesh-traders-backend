const asyncHandler = require('express-async-handler');
const FranchiseLead = require('../models/FranchiseLead');

const getLeads = asyncHandler(async (req, res) => {
  const leads = await FranchiseLead.find({}).sort({ createdAt: -1 });
  res.json(leads);
});

const createLead = asyncHandler(async (req, res) => {
  const { name, companyName, phone, email, city, message, type } = req.body;

  const lead = await FranchiseLead.create({
    businessName: companyName || name,
    contactPerson: name,
    companyName: companyName || '',
    phone,
    email,
    type: type || 'Franchise',
    location: city || '',
    status: 'New',
    message: message || '',
  });

  res.status(201).json(lead);
});

const updateLead = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const lead = await FranchiseLead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  if (status) {
    lead.status = status;
  }
  if (notes !== undefined) {
    lead.notes = notes;
  }

  const updated = await lead.save();
  res.json(updated);
});

const deleteLead = asyncHandler(async (req, res) => {
  const lead = await FranchiseLead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  await FranchiseLead.deleteOne({ _id: lead._id });
  res.json({ message: 'Lead removed' });
});

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
};

