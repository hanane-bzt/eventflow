const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { requireAuth } = require('../middlewares/auth');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(120).required(),
  role: Joi.string().valid('admin', 'organizer', 'participant').default('participant'),
});

router.post('/register', async (req, res) => {

  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const exists = await User.findOne({ email: value.email });
  if (exists) return res.status(409).json({ message: 'Email déjà utilisé' });

  const hashedPassword = await bcrypt.hash(value.password, 10);

  const user = await User.create({
    name: value.name,
    email: value.email,
    password: hashedPassword,
    role: value.role
  });

  const token = signToken(user);

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role
    }
  });
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/login', async (req, res) => {

  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

  const ok = await bcrypt.compare(value.password, user.password);
  if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });

  const token = signToken(user);

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role
    }
  });
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;