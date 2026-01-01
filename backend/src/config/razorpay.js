const Razorpay = require('razorpay');

// Mock Razorpay for local development when credentials are not provided
const createMockRazorpay = () => ({
  orders: {
    create: async (options) => {
      console.log('[MOCK RAZORPAY] Creating order:', options);
      return {
        id: `order_mock_${Date.now()}`,
        entity: 'order',
        amount: options.amount,
        currency: options.currency || 'INR',
        receipt: options.receipt,
        status: 'created',
      };
    },
    fetch: async (orderId) => {
      console.log('[MOCK RAZORPAY] Fetching order:', orderId);
      return {
        id: orderId,
        entity: 'order',
        amount: 50000,
        currency: 'INR',
        status: 'created',
      };
    },
  },
  payments: {
    fetch: async (paymentId) => {
      console.log('[MOCK RAZORPAY] Fetching payment:', paymentId);
      return {
        id: paymentId,
        entity: 'payment',
        amount: 50000,
        currency: 'INR',
        status: 'captured',
        order_id: `order_mock_${Date.now()}`,
      };
    },
  },
});

// Use real Razorpay if credentials are provided, otherwise use mock
let razorpay;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✓ Razorpay initialized with credentials');
} else {
  razorpay = createMockRazorpay();
  console.log('⚠ Razorpay credentials not found - using MOCK mode for local development');
}

module.exports = razorpay;
