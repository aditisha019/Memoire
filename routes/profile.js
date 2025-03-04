const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');
const User = require('../models/User');

// @desc  Show User Profile
// @route GET /profile/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const stories = await Story.find({ user: req.params.id, status: 'public' }).lean();

    if (!user) {
      return res.render('error/404');
    }

    res.render('profile', {
      user,
      stories
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

module.exports = router;
