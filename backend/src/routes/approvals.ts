import { Router } from 'express';
import { APPROVALS, type Approval } from '../data/store';

const router = Router();

router.get('/', (req, res) => {
  const { status } = req.query;
  let filtered = APPROVALS;

  if (status) {
    filtered = filtered.filter(a => a.status === status);
  }

  res.json({ success: true, data: filtered });
});

router.post('/', (req, res) => {
  const { type, priority, title, justification, amount, requiredBy } = req.body;
  const newApproval: Approval = {
    id: `APR-${Date.now()}`,
    title,
    type,
    amount,
    date: new Date().toISOString().split('T')[0],
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    requestedBy: {
      id: 1,
      name: 'Anonymous User',
      email: 'user@school.edu',
      role: 'Staff'
    },
  };
  APPROVALS.push(newApproval);
  res.status(201).json({ success: true, data: newApproval });
});

export default router;