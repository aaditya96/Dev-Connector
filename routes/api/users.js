const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   POST api/users
// @desc    Users route
// @access  Public
const usersRouter = router.post(
  '/',
  [
    check('name', 'Name needs to be populated!').not().isEmpty(),
    check('email', 'Valid email needs to be populated!').isEmail(),
    check('password', 'Password needs to be populated!').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const body = req.body;
    console.log(body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { name, email, password } = req.body;

    try {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          errors: [{ msg: `User with email ${email} already exists!` }],
        });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      const newUser = new User({
        name,
        email,
        avatar,
        password,
      });

      await newUser.save();

      const jwtPayload = {
        user: {
          id: newUser.id,
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
      console.error(`Error occured!: ${err.message}`);
      return res.status(500).json({ msg: 'Server error occured!' });
    }
  }
);

module.exports = usersRouter;
