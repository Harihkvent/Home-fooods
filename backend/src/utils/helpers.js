const jwt = require('jsonwebtoken');

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '2h',
  });
};

exports.sendTokenResponse = (user, statusCode, res) => {
  const token = this.generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
};
