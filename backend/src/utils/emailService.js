const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
