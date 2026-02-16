const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await Order.deleteMany();
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    await User.create({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: hashedPassword,
      isAdmin: true,
    });

    const products = [
      {
        name: 'Classic Chocolate Cake',
        image: 'https://images.unsplash.com/photo-1578985543813-28b3a1532098?auto=format&fit=crop&q=80&w=1000',
        description: 'Rich and moist chocolate cake with premium dark chocolate ganache.',
        category: 'Cakes',
        price: 850,
        stock: 15,
        badge: 'Best Seller'
      },
      {
        name: 'Butter Croissant',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=1000',
        description: 'Flaky, buttery, and golden-brown French pastry.',
        category: 'Pastries',
        price: 95,
        stock: 40,
        badge: 'Fresh'
      },
      {
        name: 'Assorted Cookies Box',
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=1000',
        description: 'A mix of chocolate chip, oatmeal, and almond cookies.',
        category: 'Cookies',
        price: 450,
        stock: 25,
        badge: 'New'
      },
      {
        name: 'Whole Wheat Bread',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1000',
        description: 'Healthy and nutritious fresh baked whole wheat bread.',
        category: 'Breads',
        price: 65,
        stock: 20
      }
    ];

    await Product.insertMany(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
