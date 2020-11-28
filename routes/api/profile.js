const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');
const { compareSync } = require('bcryptjs');
const config = require('config');
const request = require('request');

const router = express.Router();

// @route   GET api/profile/me
// @desc    Profile route
// @access  Public
router.get('/me', auth, async (req, res) => {
  try {
    const myProfile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!myProfile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this user!' })
        .send();
    }
    res.json(myProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

// @route   POST api/profile/me
// @desc    Profile creation/update route
// @access  Private
router.post(
  '/me',
  [
    auth,
    [
      check('status', 'Status must be provided!').not().isEmpty(),
      check('skills', 'Skills must be provided!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      console.log(validationErrors);
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const {
      location,
      website,
      skills,
      status,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (skills)
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    if (location) profileFields.location = location;
    if (website) profileFields.website = website;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: profileFields.user });

      //Update existing profile
      if (profile) {
        const profile = await Profile.findOneAndUpdate(
          { user: profileFields.user },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //Create new profile
      profile = new Profile(profileFields);
      profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error!');
    }
  }
);

// @route   GET api/profile/
// @desc    Get all profiles route
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.send(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error!');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user Id route
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found!' });
    }
    res.send(profile);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ error: 'Profile not found!' });
    }
    res.status(500).send('Internal Server Error!');
  }
});

// @route   DELETE api/profile/
// @desc    Delete profile, user, posts route
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // @todo- remove posts
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'Profile deleted!' });
  } catch (err) {
    res.status(500).send('Internal Server Error!');
  }
});

// @route   PUT api/profile/experience
// @desc    Add experience to profile route
// @access  Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title must be provided!').not().isEmpty(),
      check('company', 'Company must be provided!').not().isEmpty(),
      check('from', 'From date must be provided!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const {
      title,
      company,
      from,
      to,
      current,
      location,
      description,
    } = req.body;

    const newExp = { title, company, from, to, current, location, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();
      res.send(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error!');
    }
  }
);

// @route   DELETE api/profile/experience/:experience_id
// @desc    Delete experience from profile route
// @access  Private
router.delete('/experience/:experience_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found for user!' });
    }

    const indexToRemove = profile.experience
      .map((exp) => exp._id)
      .indexOf(req.params.experience_id);
    profile.experience.splice(indexToRemove, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

// @route   PUT api/profile/education
// @desc    Add education to profile route
// @access  Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School must be provided!').not().isEmpty(),
      check('degree', 'Degree must be provided!').not().isEmpty(),
      check('fieldofstudy', 'Field of study must be provided!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save();
      res.send(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error!');
    }
  }
);

// @route   DELETE api/profile/education/:education_id
// @desc    Delete education from profile route
// @access  Private
router.delete('/education/:education_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found for user!' });
    }

    const indexToRemove = profile.education
      .map((edu) => edu._id)
      .indexOf(req.params.education_id);
    profile.education.splice(indexToRemove, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

// @route   GET api/profile/github/:username
// @desc    Get Github repos route
// @access  Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=10&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(400).json({ msg: 'No Github profile found!' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

module.exports = router;
