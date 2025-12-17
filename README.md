# Home Foods - Online Food Ordering Platform

> **A MERN Stack web application for small home food vendors to manage their food business online**

## 📖 Overview

Home Foods is a web-based food ordering platform designed specifically for small-scale home food vendors. It provides a complete solution for managing an online food business with features like menu management, shopping cart, payment processing, and pickup scheduling - similar to Swiggy/Zomato but **without home delivery**.

## ✨ Key Features

- 🔐 **User Authentication** - Secure registration and login for customers and vendors
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
| **Frontend**        | React.js with Redux Toolkit        |
| **Backend**         | Node.js with Express.js            |
| **Database**        | MongoDB with Mongoose ODM          |
| **Authentication**  | JWT (JSON Web Tokens)              |
| **Payment Gateway** | Razorpay (India) / Stripe (Global) |
| **Image Storage**   | Cloudinary / AWS S3                |
| **Styling**         | CSS Modules / Material-UI          |

## 📂 Project Structure

```
Home-Foods/
├── backend/          # Express.js API server
├── frontend/         # React.js application
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
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

2. Create `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Running the Application

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend development server (from frontend directory)
npm start
```

The application will be available at:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 👥 User Roles

### Customer

- Browse menu items
- Add items to cart
- Schedule pickup time
- Make online payments
- Track order status
- View order history
- Leave reviews

### Vendor

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

- [Complete Design Document](./HOME_FOOD_VENDOR_DESIGN.md)

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

**Note:** This project is currently in the design phase. Development will begin once the design document is finalized and approved.
