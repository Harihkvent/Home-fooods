# Home Foods - Backend API

Backend server for the Home Foods online food ordering platform.

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- Razorpay Payment Gateway
- Cloudinary for Image Storage
- Nodemailer for Email Services

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Razorpay account
- Cloudinary account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=2h

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

FRONTEND_URL=http://localhost:3000
```

### Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)
- `GET /api/auth/logout` - Logout user

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create menu item (Vendor only)
- `PUT /api/menu/:id` - Update menu item (Vendor only)
- `DELETE /api/menu/:id` - Delete menu item (Vendor only)
- `GET /api/menu/vendor/my-items` - Get vendor's menu items (Vendor only)

### Cart
- `GET /api/cart` - Get user's cart (Protected)
- `POST /api/cart/add` - Add item to cart (Protected)
- `PUT /api/cart/update` - Update cart item (Protected)
- `DELETE /api/cart/remove/:itemId` - Remove item from cart (Protected)
- `DELETE /api/cart/clear` - Clear cart (Protected)

### Orders
- `POST /api/orders/create` - Create order (Protected)
- `POST /api/orders/verify-payment` - Verify payment (Protected)
- `GET /api/orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `POST /api/orders/:id/cancel` - Cancel order (Protected)

### Vendor
- `GET /api/vendor/dashboard` - Get dashboard stats (Vendor only)
- `GET /api/vendor/orders` - Get vendor orders (Vendor only)
- `PUT /api/vendor/orders/:id/status` - Update order status (Vendor only)
- `GET /api/vendor/settings` - Get vendor settings (Vendor only)
- `PUT /api/vendor/settings` - Update vendor settings (Vendor only)

### Pickup Slots
- `GET /api/pickup-slots` - Get available pickup slots

## Database Models

- **User** - User accounts (customers, vendors, admins)
- **MenuItem** - Food items in the menu
- **Cart** - Shopping cart for users
- **Order** - Orders placed by customers
- **VendorSettings** - Vendor business settings
- **Review** - Customer reviews and ratings

## Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcryptjs
- CORS configuration
- Helmet for HTTP headers security
- Rate limiting on API endpoints
- Input validation

## License

MIT
