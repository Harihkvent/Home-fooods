# Vendor Account Setup

Since this application has only one vendor, the vendor account needs to be created directly in the database.

## Option 1: Using MongoDB Shell or Compass

1. Open MongoDB Shell or MongoDB Compass
2. Connect to your database
3. Select the `home-foods` database (or your database name)
4. Insert a vendor user:

```javascript
db.users.insertOne({
  name: "Home Foods Kitchen",
  email: "vendor@homefoods.com",
  password: "$2a$10$rKp5qVQjH9YvXxF5X5x5xuYvqGK5X5x5X5x5X5x5X5x5X5x5X5x5X", // Change this!
  phone: "+91 9876543210",
  role: "vendor",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Important:** The password above is hashed. You need to hash your desired password using bcrypt.

## Option 2: Create Script (Recommended)

Create a file `backend/scripts/createVendor.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const createVendor = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const vendorEmail = 'vendor@homefoods.com';
    
    // Check if vendor already exists
    const existingVendor = await User.findOne({ email: vendorEmail });
    if (existingVendor) {
      console.log('Vendor already exists!');
      process.exit(0);
    }
    
    // Create vendor account
    const vendor = await User.create({
      name: 'Home Foods Kitchen',
      email: vendorEmail,
      password: 'vendor123', // Change this password!
      phone: '+91 9876543210',
      role: 'vendor'
    });
    
    console.log('Vendor account created successfully!');
    console.log('Email:', vendorEmail);
    console.log('Password: vendor123 (PLEASE CHANGE THIS!)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating vendor:', error);
    process.exit(1);
  }
};

createVendor();
```

Run the script:
```bash
node backend/scripts/createVendor.js
```

## Option 3: Using API (Temporary Route)

You can temporarily enable vendor creation through the API by:

1. Temporarily modify the register controller to accept role
2. Register the vendor account
3. Revert the changes

## Vendor Login

Once created, the vendor can login at:
- Frontend: Login with vendor email/password
- The system will automatically redirect to vendor dashboard

## Default Vendor Credentials (if using script)

- **Email:** vendor@homefoods.com
- **Password:** vendor123 (Change immediately after first login!)

## Security Notes

1. Always use a strong password for the vendor account
2. Never commit vendor credentials to version control
3. Consider adding 2FA for vendor account in production
4. Regularly rotate vendor passwords
