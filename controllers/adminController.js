const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const FranchiseLead = require('../models/FranchiseLead');

const getAdminCustomers = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });

  const map = new Map();

  for (const order of orders) {
    const { name, email } = order.customer;
    if (!email) continue;
    const key = email.toLowerCase();
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name,
        email,
        phone: '',
        orders: 0,
        spent: 0,
        joined: order.createdAt,
      });
    }
    const entry = map.get(key);
    entry.orders += 1;
    entry.spent += order.totalPrice || 0;
    if (order.createdAt && order.createdAt < entry.joined) {
      entry.joined = order.createdAt;
    }
  }

  const customers = Array.from(map.values());
  res.json(customers);
});

const getAdminPayments = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });

  const payments = orders.map((order) => ({
    id: order._id,
    orderId: `#ORD-${order._id.toString().slice(-4).toUpperCase()}`,
    customer: order.customer?.name || '',
    amount: order.totalPrice || 0,
    method: order.paymentMethod || 'COD',
    status: order.isPaid ? 'Paid' : 'Pending',
    date: order.createdAt,
    transactionId: order.paymentResult?.id || '-',
  }));

  res.json(payments);
});

const getAdminReports = asyncHandler(async (req, res) => {
  const range = req.query.range || '6m';

  const now = new Date();
  let startDate;
  if (range === '1m') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  } else if (range === '3m') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  }

  const orders = await Order.find({ createdAt: { $gte: startDate } }).sort({ createdAt: 1 });

  const monthlyMap = new Map();
  let totalRevenue = 0;
  let totalOrders = 0;

  for (const order of orders) {
    const d = order.createdAt || new Date();
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, { month: d.toLocaleString('default', { month: 'short' }), sales: 0, orders: 0 });
    }
    const entry = monthlyMap.get(key);
    entry.sales += order.totalPrice || 0;
    entry.orders += 1;
    totalRevenue += order.totalPrice || 0;
    totalOrders += 1;
  }

  const monthlySales = Array.from(monthlyMap.values());

  const products = await Product.find({});
  const categoryMap = new Map();
  for (const p of products) {
    const cat = p.category || 'Others';
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, { name: cat, value: 0 });
    }
    const entry = categoryMap.get(cat);
    entry.value += 1;
  }
  const colors = ['#FF9966', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6'];
  const categoryData = Array.from(categoryMap.values()).map((c, index) => ({
    ...c,
    color: colors[index % colors.length],
  }));

  const productSalesMap = new Map();
  for (const order of orders) {
    for (const item of order.orderItems || []) {
      const key = item.name;
      if (!productSalesMap.has(key)) {
        productSalesMap.set(key, { name: item.name, sales: 0, revenue: 0 });
      }
      const entry = productSalesMap.get(key);
      entry.sales += item.qty || 0;
      entry.revenue += (item.price || 0) * (item.qty || 0);
    }
  }

  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      sales: p.sales,
      revenue: `₹${p.revenue.toLocaleString('en-IN')}`,
    }));

  res.json({
    summary: {
      totalRevenue,
      totalOrders,
    },
    monthlySales,
    categoryData,
    topProducts,
  });
});

const getAdminNotifications = asyncHandler(async (req, res) => {
  const notifications = [];

  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(5);
  for (const order of orders) {
    notifications.push({
      id: `order-${order._id}`,
      type: 'order',
      title: 'New Order Received',
      message: `${order.customer?.name || 'Customer'} placed an order of ₹${(order.totalPrice || 0).toLocaleString(
        'en-IN'
      )}`,
      createdAt: order.createdAt || new Date(),
      link: '/orders',
    });
  }

  const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
    .sort({ stock: 1 })
    .limit(5);
  for (const product of lowStockProducts) {
    notifications.push({
      id: `stock-${product._id}`,
      type: 'stock',
      title: 'Low Stock Alert',
      message: `${product.name} has only ${product.stock} units left`,
      createdAt: product.updatedAt || product.createdAt || new Date(),
      link: '/inventory',
    });
  }

  const leads = await FranchiseLead.find({}).sort({ createdAt: -1 }).limit(5);
  for (const lead of leads) {
    notifications.push({
      id: `lead-${lead._id}`,
      type: 'franchise',
      title: 'New Franchise / B2B Lead',
      message: `${lead.businessName || 'New business'} from ${lead.location || 'Unknown location'}`,
      createdAt: lead.createdAt || new Date(),
      link: '/franchise',
    });
  }

  notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(notifications.slice(0, 10));
});

module.exports = {
  getAdminCustomers,
  getAdminPayments,
  getAdminReports,
  getAdminNotifications,
};
