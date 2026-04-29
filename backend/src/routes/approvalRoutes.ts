import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  createApproval,
  getAllApprovals,
  getMyApprovals,
  processApproval
} from '../controllers/approvalController';

const router = Router();

// POST /approvals - Create approval request (authenticated users)
router.post('/', authenticate, createApproval);

// GET /approvals - Get all approvals (Chairman only)
router.get('/', authenticate, requireRole('CHAIRMAN'), getAllApprovals);

// GET /approvals/my - Get user's own approvals (authenticated users)
router.get('/my', authenticate, getMyApprovals);

// PUT /approvals/:id - Process approval (Chairman only)
router.put('/:id', authenticate, requireRole('CHAIRMAN'), processApproval);

export default router;
