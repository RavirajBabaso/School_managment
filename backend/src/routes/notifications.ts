import { Router } from 'express';
import { NOTIFICATIONS } from '../data/store';

const router = Router();

router.get('/', (req, res) => {
  const { type, read } = req.query;
  let filtered = NOTIFICATIONS;

  if (type) {
    filtered = filtered.filter(n => n.type === type);
  }

  if (read !== undefined) {
    const isRead = read === 'true';
    filtered = filtered.filter(n => n.read === isRead);
  }

  res.json({ success: true, data: filtered });
});

router.put('/mark-all-read', (req, res) => {
  NOTIFICATIONS.forEach(n => n.read = true);
  res.json({ success: true });
});

router.put('/:id/read', (req, res) => {
  const { id } = req.params;
  const notification = NOTIFICATIONS.find(n => n.id === parseInt(id));
  if (notification) {
    notification.read = true;
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: 'Notification not found' });
  }
});

export default router;