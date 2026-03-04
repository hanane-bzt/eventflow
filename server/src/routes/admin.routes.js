const router = require('express').Router();
const { requireAuth, requireRole } = require('../middlewares/auth');
const User = require('../models/User');

router.get('/users', requireAuth, requireRole('admin'), async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json(users);
});

module.exports = router;