const asyncHandler = require('express-async-handler');
const Banner = require('../models/Banner');

const getBanners = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.page) {
    filter.page = req.query.page;
  }
  if (req.query.active === 'true') {
    filter.status = 'Active';
  }

  const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(banners);
});

const createBanner = asyncHandler(async (req, res) => {
  const { name, page, link, image, status, order } = req.body;

  const banner = await Banner.create({
    name,
    page,
    link: link || '',
    image,
    status: status || 'Active',
    order: typeof order === 'number' ? order : 0,
  });

  res.status(201).json(banner);
});

const updateBanner = asyncHandler(async (req, res) => {
  const { name, page, link, image, status, order } = req.body;

  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }

  if (name !== undefined) banner.name = name;
  if (page !== undefined) banner.page = page;
  if (link !== undefined) banner.link = link;
  if (image !== undefined) banner.image = image;
  if (status !== undefined) banner.status = status;
  if (order !== undefined) banner.order = order;

  const updated = await banner.save();
  res.json(updated);
});

const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }

  await Banner.deleteOne({ _id: banner._id });
  res.json({ message: 'Banner removed' });
});

module.exports = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};

