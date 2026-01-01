const cloudinary = require('cloudinary').v2;

// Check if credentials are provided
const hasCredentials = process.env.CLOUDINARY_CLOUD_NAME && 
                       process.env.CLOUDINARY_API_KEY && 
                       process.env.CLOUDINARY_API_SECRET;

if (hasCredentials) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✓ Cloudinary configured');
} else {
  console.log('⚠ Cloudinary credentials not found - using MOCK mode for image uploads');
  
  // Create mock Cloudinary instance for local development
  cloudinary.uploader.upload = async (file, options) => {
    console.log('[MOCK CLOUDINARY] Upload called for:', file);
    return {
      secure_url: `https://via.placeholder.com/800x600?text=Mock+Image`,
      public_id: `mock_${Date.now()}`,
      format: 'jpg',
      width: 800,
      height: 600,
    };
  };
  
  cloudinary.uploader.destroy = async (publicId) => {
    console.log('[MOCK CLOUDINARY] Delete called for:', publicId);
    return { result: 'ok' };
  };
}

module.exports = { cloudinary, hasCredentials };
