const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const jwtToken = req.header('x-auth-token');
  if (!jwtToken) {
    return res.status(401).json({ msg: 'No token present, cannot authorize!' });
  }

  try {
    const decodedValue = jwt.verify(jwtToken, config.get('jwtSecret'));
    req.user = decodedValue.user;
    next();
  } catch (err) {
    console.error('Invalid token!');
    res.status(401).json({ msg: 'Token is invalid!' });
  }
};
