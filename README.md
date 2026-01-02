# Home Foods - Online Food Ordering Platform

> **A MERN Stack web application for small home food vendors to manage their food business online**

## 📖 Overview

Home Foods is a web-based food ordering platform designed for a single home food vendor to manage their online food business. It provides a complete solution for managing an online food business with features like menu management, shopping cart, payment processing, and pickup scheduling - similar to Swiggy/Zomato but **without home delivery**.

**Note:** This application is designed for **one vendor only**. Customers can register and order, but there is only one vendor account that manages all menu items and orders.

## ✨ Key Features

- 🔐 **Customer Registration** - Simple signup for customers (vendor account is pre-configured)
- 🍽️ **Menu Browsing** - View food items with images, descriptions, prices, and dietary information
- 🛒 **Shopping Cart** - Add/remove items, modify quantities with real-time price calculation
- 📅 **Pickup Scheduling** - Select preferred date and time slots for order pickup
- 💳 **Online Payments** - Integrated payment gateway (Razorpay/Stripe)
- 📦 **Order Management** - Complete order lifecycle tracking for customers and vendors
- 📊 **Vendor Dashboard** - Manage menu items, view orders, update availability, and business settings
- ⭐ **Reviews & Ratings** - Customer feedback and vendor responses

## 🛠️ Technology Stack

| Layer               | Technology                         |
| ------------------- | ---------------------------------- |
| **Frontend**        | React.js 18 + Vite                 |
| **State Management**| Redux Toolkit                      |
| **Backend**         | Node.js with Express.js            |
| **Database**        | MongoDB with Mongoose ODM          |
| **Authentication**  | JWT with HTTP-only Cookies         |
| **Payment Gateway** | Razorpay                           |
| **Image Storage**   | Cloudinary                         |
| **Styling**         | CSS Modules                        |
| **Form Handling**   | React Hook Form                    |
| **Notifications**   | React Toastify                     |

## 📂 Project Structure

```
Home-Foods/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── config/         # Database, Cloudinary, Razorpay config
│   │   └── utils/          # Helper functions
│   └── scripts/            # Utility scripts (vendor setup)
├── frontend/         # React.js + Vite application
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Customer and Vendor pages
│       ├── redux/          # State management (Redux Toolkit)
│       ├── services/       # API integration
│       └── styles/         # CSS files
└── docs/            # Documentation files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager
- Razorpay/Stripe account for payment integration
- Cloudinary account for image storage

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Home-fooods

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Configuration

1. Create `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

2. Create `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Running the Application

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend development server (from frontend directory)
npm run dev
```

The application will be available at:

- Frontend: `http://localhost:5173` (Vite dev server)
- Backend API: `http://localhost:5000`

### Setting Up the Vendor Account

Since this application supports only one vendor, you need to create the vendor account manually:

```bash
# Run the vendor creation script
cd backend
node scripts/createVendor.js
```

This will create a vendor account with:
- **Email:** vendor@homefoods.com
- **Password:** vendor123

**⚠️ Important:** Change the password after first login!

See [docs/VENDOR_SETUP.md](docs/VENDOR_SETUP.md) for more details.

## 👥 User Roles

### Customer (Public Registration)

- Browse menu items
- Add items to cart
- Schedule pickup time
- Make online payments
- Track order status
- View order history
- Leave reviews

### Vendor (Single Pre-configured Account)

- Manage menu items (Create, Update, Delete)
- View and manage orders
- Update order status
- Set business hours and pickup slots
- Configure business settings
- View analytics and reports

## 📱 Core Workflows

### Customer Journey

1. Browse menu and select items
2. Add items to cart
3. Proceed to checkout
4. Select pickup date and time slot
5. Make payment
6. Receive order confirmation
7. Track order status
8. Pick up order at scheduled time

### Vendor Journey

1. Login to dashboard
2. View new orders
3. Confirm and prepare order
4. Update order status
5. Notify customer when ready
6. Complete order on pickup

## 📋 Development Phases

### Phase 1: MVP (Essential Features)

- User authentication
- Menu browsing and management
- Shopping cart
- Order placement with pickup scheduling
- Payment integration
- Basic order tracking

### Phase 2: Enhanced Features

- Email/SMS notifications
- Rating and review system
- Advanced analytics
- Inventory management
- Discount and offers

### Phase 3: Advanced Features

- Multi-vendor support
- Loyalty program
- Progressive Web App (PWA)
- Advanced reporting

## 📄 Documentation

For detailed technical documentation, design specifications, and implementation guidelines, please refer to:

- [Complete Design Document](docs/HOME_FOOD_VENDOR_DESIGN.md)
- [Vendor Setup Guide](docs/VENDOR_SETUP.md)

## 🔒 Security

- JWT-based authentication with HTTP-only cookies
- Bcrypt password hashing
- Input validation and sanitization
- CORS configuration
- Rate limiting on APIs
- Secure payment processing (PCI compliant)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions or support, please contact [your-email@example.com]

---

**Built with ❤️ for home food vendors**
