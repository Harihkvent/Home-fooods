const nodemailer = require('nodemailer');

// Mock transporter for local development when email credentials are not provided
const createMockTransporter = () => ({
  sendMail: async (mailOptions) => {
    console.log('[MOCK EMAIL] Sending email:');
    console.log('  To:', mailOptions.to);
    console.log('  Subject:', mailOptions.subject);
    console.log('  From:', mailOptions.from);
    return {
      messageId: `mock_${Date.now()}@localhost`,
      accepted: [mailOptions.to],
      response: '250 Mock email sent',
    };
  },
});

// Use real nodemailer if credentials are provided, otherwise use mock
let transporter;

if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  try {
    transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('✓ Email transporter initialized with credentials');
  } catch (error) {
    console.log('⚠ Email transporter failed, using MOCK mode:', error.message);
    transporter = createMockTransporter();
  }
} else {
  transporter = createMockTransporter();
  console.log('⚠ Email credentials not found - using MOCK mode for local development');
}

exports.sendEmail = async (options) => {
  const mailOptions = {
    from: `Home Foods <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

exports.sendOrderConfirmation = async (order, user) => {
  const html = `
    <h1>Order Confirmation</h1>
    <p>Dear ${user.name},</p>
    <p>Your order #${order.orderNumber} has been placed successfully.</p>
    <h3>Order Details:</h3>
    <ul>
      ${order.items.map(item => `<li>${item.name} x ${item.quantity} - ₹${item.subtotal}</li>`).join('')}
    </ul>
    <p><strong>Total: ₹${order.pricing.total}</strong></p>
    <p><strong>Pickup Date:</strong> ${new Date(order.pickupDetails.date).toLocaleDateString()}</p>
    <p><strong>Pickup Time:</strong> ${order.pickupDetails.timeSlot}</p>
    <p>Thank you for your order!</p>
  `;

  await this.sendEmail({
    email: user.email,
    subject: 'Order Confirmation - Home Foods',
    html,
  });
};

exports.sendOrderStatusUpdate = async (order, user, status) => {
  const html = `
    <h1>Order Status Update</h1>
    <p>Dear ${user.name},</p>
    <p>Your order #${order.orderNumber} status has been updated to: <strong>${status}</strong></p>
    <p>Thank you for choosing Home Foods!</p>
  `;

  await this.sendEmail({
    email: user.email,
    subject: 'Order Status Update - Home Foods',
    html,
  });
};
