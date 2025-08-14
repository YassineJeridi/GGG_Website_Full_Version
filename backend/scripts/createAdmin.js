const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ggg-store');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'pexa' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(1);
    }

    // Create admin user
    const adminUser = new User({
      username: 'pexa',
      password: 'pexa123' // ✅ FIXED: Now 7 characters (meets 6+ requirement)
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully');
    console.log('Username: pexa');
    console.log('Password: pexa123'); // ✅ Updated to show correct password
    console.log('⚠️  Please change the default password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
