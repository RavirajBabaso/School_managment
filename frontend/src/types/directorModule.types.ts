export type DirectorModuleStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
export type DirectorModulePriority = 'High' | 'Medium' | 'Low';

export interface DirectorModuleRecord {
  id: number;
  title: string;
  owner: string;
  dueDate: string;
  status: DirectorModuleStatus;
  priority: DirectorModulePriority;
  completionPct: number;
  remarks: string;
  updatedAt: string;
}

export interface DirectorModule {
  key: string;
  code: string;
  name: string;
  category: string;
  submodule: string;
  cadence: string;
  description: string;
  ownerRole: string;
  nextDueDate: string;
  status: DirectorModuleStatus;
  completionPct: number;
  records: DirectorModuleRecord[];
}

export interface DirectorModuleSummary {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  averageCompletion: number;
}

export interface DirectorModulesResponse {
  summary: DirectorModuleSummary;
  categories: string[];
  submodules: string[];
  modules: DirectorModule[];
}

export interface DirectorModuleRecordInput {
  title: string;
  owner: string;
  dueDate: string;
  status: DirectorModuleStatus;
  priority: DirectorModulePriority;
  completionPct: number;
  remarks: string;
}
