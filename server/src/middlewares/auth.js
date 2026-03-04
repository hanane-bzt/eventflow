const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Non authentifié' });

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Utilisateur introuvable' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide/expiré' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Non authentifié' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Accès interdit' });
    next();
  };
}

module.exports = { requireAuth, requireRole };