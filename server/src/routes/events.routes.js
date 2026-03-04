const router = require('express').Router();
const Joi = require('joi');

const Event = require('../models/Event');
const { requireAuth, requireRole } = require('../middlewares/auth');

const eventSchema = Joi.object({
  title: Joi.string().min(3).max(120).required(),
  description: Joi.string().min(10).max(2000).required(),
  date: Joi.date().required(),
  location: Joi.string().min(2).max(120).required(),
  totalSeats: Joi.number().integer().min(1).max(100000).required(),
});

// LIST (PUBLIC)
router.get('/', async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
});

// DETAILS (PUBLIC)
router.get('/:id', async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Événement introuvable' });
  res.json(ev);
});

// CREATE
router.post('/', requireAuth, requireRole('organizer', 'admin'), async (req, res) => {
  const { error, value } = eventSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const ev = await Event.create({
    ...value,
    remainingSeats: value.totalSeats,
    organizerId: req.user._id,
    participants: [],
  });

  res.status(201).json(ev);
});

// UPDATE
router.put('/:id', requireAuth, requireRole('organizer', 'admin'), async (req, res) => {
  const { error, value } = eventSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Événement introuvable' });

  const isOwner = ev.organizerId.toString() === req.user._id.toString();
  if (req.user.role === 'organizer' && !isOwner) {
    return res.status(403).json({ message: 'Interdit: événement non propriétaire' });
  }

  const used = ev.totalSeats - ev.remainingSeats;
  const newRemaining = Math.max(0, value.totalSeats - used);

  ev.title = value.title;
  ev.description = value.description;
  ev.date = value.date;
  ev.location = value.location;
  ev.totalSeats = value.totalSeats;
  ev.remainingSeats = newRemaining;

  await ev.save();
  res.json(ev);
});

// DELETE
router.delete('/:id', requireAuth, requireRole('organizer', 'admin'), async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Événement introuvable' });

  const isOwner = ev.organizerId.toString() === req.user._id.toString();
  if (req.user.role === 'organizer' && !isOwner) {
    return res.status(403).json({ message: 'Interdit: événement non propriétaire' });
  }

  await ev.deleteOne();
  res.json({ ok: true });
});

// REGISTER
router.post('/:id/register', requireAuth, async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Événement introuvable' });

  const already = ev.participants.some((p) => p.toString() === req.user._id.toString());
  if (already) return res.status(409).json({ message: 'Déjà inscrit' });

  if (ev.remainingSeats <= 0) return res.status(400).json({ message: 'Plus de places disponibles' });

  ev.participants.push(req.user._id);
  ev.remainingSeats -= 1;
  await ev.save();

  res.json({ ok: true, remainingSeats: ev.remainingSeats });
});

module.exports = router;