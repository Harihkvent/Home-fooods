const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('⚠ MONGODB_URI not found in environment variables');
      console.log('⚠ Please create a .env file with MONGODB_URI');
      console.log('⚠ Server will continue without database connection (API calls will fail)');
      console.log('');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✗ MongoDB Error: ${error.message}`);
    console.log('⚠ Server will continue without database connection (API calls will fail)');
    console.log('');
  }
};

module.exports = connectDB;
