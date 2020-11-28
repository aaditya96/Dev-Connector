const express = require('express');
const middlewareAuth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const router = express.Router();

// @route   GET api/auth
// @desc    Get user info
// @access  Public
const authGet = router.get('/', middlewareAuth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).select('-password');
    res.json({ currentUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Internal Server error!');
  }
});

// @route   POST api/auth
// @desc    Login
// @access  Public
const authPost = router.post(
  '/',
  [
    check('email', 'Valid email needs to be provided!').isEmail(),
    check('password', 'Password must be provided!').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid credentials!' }],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid credentials!' }],
        });
      }

      const jwtPayload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        jwtPayload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Internal Server error!' });
    }
  }
);

module.exports = [authGet, authPost];
