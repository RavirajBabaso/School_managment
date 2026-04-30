import { Router } from 'express';
import { COMMUNICATIONS } from '../data/store';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, (req, res) => {
  const { type } = req.query;
  let filtered = COMMUNICATIONS;

  if (type) {
    filtered = filtered.filter(c => c.type === type);
  }

  res.json({ success: true, data: filtered });
});

export default router;