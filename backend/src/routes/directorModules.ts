import { Router } from 'express';
import {
  DIRECTOR_MODULES,
  DirectorModulePriority,
  DirectorModuleStatus,
} from '../data/store';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

const statuses: DirectorModuleStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'];
const priorities: DirectorModulePriority[] = ['High', 'Medium', 'Low'];

function getSummary() {
  return {
    total: DIRECTOR_MODULES.length,
    pending: DIRECTOR_MODULES.filter((module) => module.status === 'PENDING').length,
    inProgress: DIRECTOR_MODULES.filter((module) => module.status === 'IN_PROGRESS').length,
    completed: DIRECTOR_MODULES.filter((module) => module.status === 'COMPLETED').length,
    overdue: DIRECTOR_MODULES.filter((module) => module.status === 'OVERDUE').length,
    averageCompletion: Math.round(
      DIRECTOR_MODULES.reduce((total, module) => total + module.completionPct, 0) /
        DIRECTOR_MODULES.length
    ),
  };
}

function findModule(key: string) {
  return DIRECTOR_MODULES.find((module) => module.key === key);
}

router.get('/', authenticate, (req, res) => {
  const { category, submodule, status } = req.query;
  let modules = DIRECTOR_MODULES;

  if (category && category !== 'ALL') {
    modules = modules.filter((module) => module.category === category);
  }

  if (submodule && submodule !== 'ALL') {
    modules = modules.filter((module) => module.submodule === submodule);
  }

  if (status && status !== 'ALL') {
    modules = modules.filter((module) => module.status === status);
  }

  res.json({
    success: true,
    data: {
      summary: getSummary(),
      categories: Array.from(new Set(DIRECTOR_MODULES.map((module) => module.category))).sort(),
      submodules: Array.from(new Set(DIRECTOR_MODULES.map((module) => module.submodule))).sort(),
      modules,
    },
  });
});

router.get('/:key', authenticate, (req, res) => {
  const module = findModule(req.params.key);

  if (!module) {
    return res.status(404).json({ success: false, message: 'Director module not found' });
  }

  return res.json({ success: true, data: module });
});

router.patch('/:key', authenticate, (req, res) => {
  const module = findModule(req.params.key);

  if (!module) {
    return res.status(404).json({ success: false, message: 'Director module not found' });
  }

  const { status, completionPct, nextDueDate } = req.body;

  if (status && !statuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid module status' });
  }

  if (status) {
    module.status = status;
  }

  if (completionPct !== undefined) {
    module.completionPct = Math.min(100, Math.max(0, Number(completionPct)));
  }

  if (nextDueDate) {
    module.nextDueDate = String(nextDueDate);
  }

  return res.json({ success: true, data: module });
});

router.post('/:key/records', authenticate, (req, res) => {
  const module = findModule(req.params.key);

  if (!module) {
    return res.status(404).json({ success: false, message: 'Director module not found' });
  }

  const { title, owner, dueDate, status, priority, completionPct, remarks } = req.body;

  if (!title || !owner || !dueDate) {
    return res.status(400).json({
      success: false,
      message: 'Title, owner, and due date are required',
    });
  }

  if (status && !statuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid record status' });
  }

  if (priority && !priorities.includes(priority)) {
    return res.status(400).json({ success: false, message: 'Invalid priority' });
  }

  const record = {
    id: Date.now(),
    title: String(title),
    owner: String(owner),
    dueDate: String(dueDate),
    status: (status ?? 'PENDING') as DirectorModuleStatus,
    priority: (priority ?? 'Medium') as DirectorModulePriority,
    completionPct: Math.min(100, Math.max(0, Number(completionPct ?? 0))),
    remarks: String(remarks ?? ''),
    updatedAt: new Date().toISOString(),
  };

  module.records.unshift(record);
  module.status = record.status;
  module.completionPct = record.completionPct;
  module.nextDueDate = record.dueDate;

  return res.status(201).json({ success: true, data: record });
});

router.patch('/:key/records/:recordId', authenticate, (req, res) => {
  const module = findModule(req.params.key);

  if (!module) {
    return res.status(404).json({ success: false, message: 'Director module not found' });
  }

  const record = module.records.find((item) => item.id === Number(req.params.recordId));

  if (!record) {
    return res.status(404).json({ success: false, message: 'Director module record not found' });
  }

  const { title, owner, dueDate, status, priority, completionPct, remarks } = req.body;

  if (status && !statuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid record status' });
  }

  if (priority && !priorities.includes(priority)) {
    return res.status(400).json({ success: false, message: 'Invalid priority' });
  }

  if (title !== undefined) record.title = String(title);
  if (owner !== undefined) record.owner = String(owner);
  if (dueDate !== undefined) record.dueDate = String(dueDate);
  if (status !== undefined) record.status = status;
  if (priority !== undefined) record.priority = priority;
  if (completionPct !== undefined) {
    record.completionPct = Math.min(100, Math.max(0, Number(completionPct)));
  }
  if (remarks !== undefined) record.remarks = String(remarks);
  record.updatedAt = new Date().toISOString();

  module.status = record.status;
  module.completionPct = record.completionPct;
  module.nextDueDate = record.dueDate;

  return res.json({ success: true, data: record });
});

export default router;
