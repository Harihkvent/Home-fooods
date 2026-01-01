require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const createVendor = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database!');
    
    const vendorEmail = 'vendor@homefoods.com';
    
    // Check if vendor already exists
    const existingVendor = await User.findOne({ email: vendorEmail });
    if (existingVendor) {
      console.log('✓ Vendor account already exists!');
      console.log('Email:', vendorEmail);
      console.log('\nYou can login with this email and your password.');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    // Create vendor account
    const vendor = await User.create({
      name: 'Home Foods Kitchen',
      email: vendorEmail,
      password: 'vendor123', // This will be hashed automatically by the User model
      phone: '+91 9876543210',
      role: 'vendor'
    });
    
    console.log('\n✓ Vendor account created successfully!\n');
    console.log('=================================');
    console.log('Vendor Login Credentials:');
    console.log('=================================');
    console.log('Email:', vendorEmail);
    console.log('Password: vendor123');
    console.log('=================================\n');
    console.log('⚠️  IMPORTANT: Please change this password after first login!\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating vendor:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createVendor();
