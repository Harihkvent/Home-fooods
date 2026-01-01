const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, hasCredentials } = require('../config/cloudinary');
const path = require('path');

let storage;

if (hasCredentials) {
  // Use Cloudinary storage when credentials are available
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'home-foods',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, height: 600, crop: 'limit' }],
    },
  });
} else {
  // Use memory storage for mock mode
  storage = multer.memoryStorage();
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  },
});

// Middleware to handle mock uploads
const handleMockUpload = (req, res, next) => {
  if (!hasCredentials && req.files) {
    // Mock the file objects to look like Cloudinary responses
    req.files = req.files.map(file => ({
      ...file,
      path: `https://via.placeholder.com/800x600?text=${encodeURIComponent(file.originalname)}`,
      filename: `mock_${Date.now()}_${file.originalname}`,
    }));
  }
  next();
};

module.exports = upload;
module.exports.handleMockUpload = handleMockUpload;
