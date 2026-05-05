import api from './api';
import type {
  DirectorModuleRecord,
  DirectorModuleRecordInput,
  DirectorModulesResponse,
} from '../types/directorModule.types';

export const getDirectorModules = async (): Promise<DirectorModulesResponse> => {
  const res = await api.get('/director-modules');
  return res.data.data;
};

export const createDirectorModuleRecord = async (
  moduleKey: string,
  payload: DirectorModuleRecordInput
): Promise<DirectorModuleRecord> => {
  const res = await api.post(`/director-modules/${moduleKey}/records`, payload);
  return res.data.data;
};

export const updateDirectorModuleRecord = async (
  moduleKey: string,
  recordId: number,
  payload: Partial<DirectorModuleRecordInput>
): Promise<DirectorModuleRecord> => {
  const res = await api.patch(`/director-modules/${moduleKey}/records/${recordId}`, payload);
  return res.data.data;
};
