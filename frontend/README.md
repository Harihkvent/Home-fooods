# Home Foods - Frontend

React frontend for the Home Foods online food ordering platform.

## Tech Stack

- React 18
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- React Toastify for notifications
- Vite as build tool

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Backend API running on http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=your_razorpay_key_id
```

### Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

The application will start on `http://localhost:3000`

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── common/       # Common components (Navbar, Footer, Loader)
│   ├── customer/     # Customer-specific components
│   └── vendor/       # Vendor-specific components
├── pages/            # Page components
│   ├── Auth/         # Login and Register pages
│   ├── customer/     # Customer pages (Home, Menu, Cart, etc.)
│   └── vendor/       # Vendor pages (Dashboard, Orders, etc.)
├── redux/            # Redux store and slices
│   ├── slices/       # Redux slices (auth, menu, cart, orders)
│   └── store.js      # Redux store configuration
├── services/         # API service functions
├── styles/           # Global styles
└── App.jsx           # Main app component
```

## Features

### Customer Features
- Browse menu items with search and filters
- Add items to shopping cart
- Manage cart (update quantities, remove items)
- Secure authentication (login/register)
- Place orders with pickup scheduling
- Online payment integration
- Track order status

### Vendor Features
- Vendor dashboard with stats
- Menu management (CRUD operations)
- Order management
- Update order status
- Business settings configuration

## Routes

### Public Routes
- `/` - Home page
- `/menu` - Browse menu items
- `/login` - User login
- `/register` - User registration

### Customer Protected Routes
- `/cart` - Shopping cart
- `/checkout` - Checkout and payment
- `/orders` - Order history
- `/orders/:id` - Order details

### Vendor Protected Routes
- `/vendor/dashboard` - Vendor dashboard
- `/vendor/menu` - Menu management
- `/vendor/orders` - Order management
- `/vendor/settings` - Business settings

## State Management

The application uses Redux Toolkit with the following slices:

- **auth** - User authentication and profile
- **menu** - Menu items and filters
- **cart** - Shopping cart items and totals
- **orders** - Order history and current order

## API Integration

All API calls are handled through service functions in `/src/services/`:

- `authService` - Authentication endpoints
- `menuService` - Menu CRUD operations
- `cartService` - Cart management
- `orderService` - Order operations
- `vendorService` - Vendor dashboard and settings
- `pickupSlotsService` - Pickup slot availability

## Styling

- CSS Modules for component-specific styles
- Global styles in `/src/styles/global.css`
- CSS variables for theming
- Responsive design for mobile, tablet, and desktop

## License

MIT
