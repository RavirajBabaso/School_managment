import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import StatGrid from '../../components/common/StatGrid';
import {
  createDirectorModuleRecord,
  getDirectorModules,
  updateDirectorModuleRecord,
} from '../../services/directorModuleService';
import type {
  DirectorModule,
  DirectorModulePriority,
  DirectorModuleRecordInput,
  DirectorModuleStatus,
} from '../../types/directorModule.types';

type StatusFilter = DirectorModuleStatus | 'ALL';

const statusLabels: Record<DirectorModuleStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  OVERDUE: 'Overdue',
};

const statusClasses: Record<DirectorModuleStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
};

const emptyForm: DirectorModuleRecordInput = {
  title: '',
  owner: '',
  dueDate: '',
  status: 'PENDING',
  priority: 'Medium',
  completionPct: 0,
  remarks: '',
};

function AcademicOperationsPage() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('ALL');
  const [submodule, setSubmodule] = useState('ALL');
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [selectedKey, setSelectedKey] = useState('');
  const [form, setForm] = useState<DirectorModuleRecordInput>(emptyForm);
  const [searchParams] = useSearchParams();

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['director-modules'],
    queryFn: getDirectorModules,
    retry: 1,
  });

  useEffect(() => {
    const moduleKey = searchParams.get('module');
    if (moduleKey) {
      setSelectedKey(moduleKey);
    }

    const submoduleQuery = searchParams.get('submodule');
    if (submoduleQuery) {
      setSubmodule(submoduleQuery);
    }
  }, [searchParams]);

  const modules = useMemo(() => {
    const list = data?.modules ?? [];
    return list.filter((module) => {
      const categoryMatch = category === 'ALL' || module.category === category;
      const submoduleMatch = submodule === 'ALL' || module.submodule === submodule;
      const statusMatch = status === 'ALL' || module.status === status;
      return categoryMatch && submoduleMatch && statusMatch;
    });
  }, [category, data?.modules, status, submodule]);

  const availableSubmodules = useMemo(() => {
    const list = data?.modules ?? [];
    if (category === 'ALL') {
      return data?.submodules ?? [];
    }
    return Array.from(
      new Set(list.filter((module) => module.category === category).map((module) => module.submodule))
    ).sort();
  }, [category, data?.modules, data?.submodules]);

  const selectedModule = useMemo<DirectorModule | undefined>(() => {
    const list = modules.length > 0 ? modules : data?.modules ?? [];
    return list.find((module) => module.key === selectedKey) ?? list[0];
  }, [data?.modules, modules, selectedKey]);

  const createMutation = useMutation({
    mutationFn: ({ moduleKey, payload }: { moduleKey: string; payload: DirectorModuleRecordInput }) =>
      createDirectorModuleRecord(moduleKey, payload),
    onSuccess: () => {
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ['director-modules'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      moduleKey,
      recordId,
      payload,
    }: {
      moduleKey: string;
      recordId: number;
      payload: Partial<DirectorModuleRecordInput>;
    }) => updateDirectorModuleRecord(moduleKey, recordId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['director-modules'] });
    },
  });

  const handleSelectModule = (module: DirectorModule) => {
    setSelectedKey(module.key);
    setForm({
      ...emptyForm,
      title: `${module.name} follow-up`,
      owner: module.ownerRole,
      dueDate: module.nextDueDate,
      completionPct: module.completionPct,
      status: module.status,
    });
  };

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedModule) {
      return;
    }

    createMutation.mutate({ moduleKey: selectedModule.key, payload: form });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)]">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Navbar title="Director Module" />
          <div className="p-6">Loading...</div>
        </main>
      </div>
    );
  }

  if (isError || !data || !selectedModule) {
    return (
      <div className="flex min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)]">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Navbar title="Director Module" />
          <div className="p-6">
            <div className="rounded-lg border border-red-200 bg-[var(--card-bg)] p-5">
              <h1 className="text-lg font-semibold text-red-700">Director module could not be opened</h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Please make sure the backend is running and your Director login session is active.
              </p>
              {error instanceof Error ? (
                <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{error.message}</p>
              ) : null}
              <button
                type="button"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['director-modules'] })}
                className="mt-4 rounded-md bg-[#185FA5] px-4 py-2 text-sm font-medium text-white"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const stats = [
    { label: 'Tasks', value: data.summary.total, color: '#185FA5' },
    { label: 'In Progress', value: data.summary.inProgress, color: '#BA7517' },
    { label: 'Overdue', value: data.summary.overdue, color: '#A32D2D' },
    { label: 'Avg Complete', value: `${data.summary.averageCompletion}%`, color: '#3B6D11' },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Navbar title="Director Module" />
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-2xl font-semibold">School Director Module</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Track the eight Director submodules in one place and filter them as separate module items.
            </p>
          </div>

          <StatGrid items={stats} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(360px,440px)_1fr]">
            <section className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]">
              <div className="border-b border-[var(--border-color)] p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="rounded-md border border-[var(--border-color)] px-3 py-2 text-sm"
                  >
                    <option value="ALL">All Categories</option>
                    {data.categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <select
                    value={submodule}
                    onChange={(event) => setSubmodule(event.target.value)}
                    className="rounded-md border border-[var(--border-color)] px-3 py-2 text-sm"
                  >
                    <option value="ALL">All Submodules</option>
                    {availableSubmodules.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value as StatusFilter)}
                    className="rounded-md border border-[var(--border-color)] px-3 py-2 text-sm"
                  >
                    <option value="ALL">All Status</option>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="max-h-[680px] overflow-y-auto p-3">
                {modules.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-[var(--border-color)] bg-[var(--surface)] p-6 text-center text-sm text-[var(--text-secondary)]">
                    No director submodules match the current filters.
                  </div>
                ) : (
                  modules.map((module) => (
                    <button
                      key={module.key}
                      type="button"
                      onClick={() => handleSelectModule(module)}
                      className={`mb-2 w-full rounded-lg border p-3 text-left transition ${
                       selectedModule?.key === module.key
                            ? 'border-[#185FA5] bg-[#DBEAFE]'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-[#EEF4FF]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#185FA5] text-xs font-semibold text-white">
                              {module.code}
                            </span>
                            <p className="truncate text-sm font-semibold">{module.name}</p>
                          </div>
                          <p className="mt-1 text-xs text-[var(--text-secondary)]">{module.submodule}</p>
                          <p className="mt-1 text-xs text-[var(--text-secondary)]">{module.cadence}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${statusClasses[module.status]}`}>
                          {statusLabels[module.status]}
                        </span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-[var(--surface)]">
                        <div
                          className="h-2 rounded-full bg-[#185FA5]"
                          style={{ width: `${module.completionPct}%` }}
                        />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>

            {selectedModule ? (
              <section className="space-y-6">
                <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {selectedModule.category} - {selectedModule.submodule}
                      </p>
                      <h2 className="mt-1 text-xl font-semibold">{selectedModule.name}</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                        {selectedModule.description}
                      </p>
                    </div>
                  <span className={`rounded-full px-3 py-1 text-xs ${statusClasses[selectedModule.status]}`}>
                    {statusLabels[selectedModule.status]}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-md bg-[var(--surface)] p-3">
                    <p className="text-xs text-[var(--text-secondary)]">Owner</p>
                    <p className="text-sm font-semibold">{selectedModule.ownerRole}</p>
                  </div>
                  <div className="rounded-md bg-[var(--surface)] p-3">
                    <p className="text-xs text-[var(--text-secondary)]">Next Due</p>
                    <p className="text-sm font-semibold">{selectedModule.nextDueDate}</p>
                  </div>
                  <div className="rounded-md bg-[var(--surface)] p-3">
                    <p className="text-xs text-[var(--text-secondary)]">Completion</p>
                    <p className="text-sm font-semibold">{selectedModule.completionPct}%</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCreate} className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
                <h3 className="text-lg font-semibold">Add Update</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                    required
                    placeholder="Update title"
                    className="rounded-md border border-[var(--border-color)] px-3 py-2 text-sm"
                  />
                  <input
                    value={form.owner}
                    onChange={(event) => setForm((prev) => ({ ...prev, owner: event.target.value }))}
                    required
                    placeholder="Owner"
                    className="rounded-md border border-[var(--border-color)] px-3 py-2 text-sm"
                  />
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
                    required
                    className="rounded-md border border-[var(--border-color)] px-3 py-2 text-sm"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, status: event.target.value as DirectorModuleStatus }))
                      }
                      className="rounded-md border border-[var(--border-color)] px-3 py-2 text-sm"
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={form.priority}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, priority: event.target.value as DirectorModulePriority }))
                      }
                      className="rounded-md border border-[var(--border-color)] px-3 py-2 text-sm"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.completionPct}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, completionPct: Number(event.target.value) }))
                      }
                      className="rounded-md border border-[var(--border-color)] px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <textarea
                  value={form.remarks}
                  onChange={(event) => setForm((prev) => ({ ...prev, remarks: event.target.value }))}
                  placeholder="Remarks, blockers, next action"
                  rows={3}
                  className="mt-4 w-full rounded-md border border-[var(--border-color)] px-3 py-2 text-sm"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="rounded-md bg-[#185FA5] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {createMutation.isPending ? 'Saving...' : 'Save Update'}
                  </button>
                </div>
              </form>

              <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
                <h3 className="text-lg font-semibold">Tracking Records</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--border-color)] text-sm">
                    <thead className="bg-[var(--surface)] text-left text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                      <tr>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Owner</th>
                        <th className="px-4 py-3">Due</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Complete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {selectedModule.records.map((record) => (
                        <tr key={record.id}>
                          <td className="px-4 py-3">
                            <p className="font-medium">{record.title}</p>
                            <p className="mt-1 max-w-md text-xs text-[var(--text-secondary)]">{record.remarks}</p>
                          </td>
                          <td className="px-4 py-3 text-[var(--text-secondary)]">{record.owner}</td>
                          <td className="px-4 py-3 text-[var(--text-secondary)]">{record.dueDate}</td>
                          <td className="px-4 py-3">
                            <select
                              value={record.status}
                              onChange={(event) =>
                                updateMutation.mutate({
                                  moduleKey: selectedModule.key,
                                  recordId: record.id,
                                  payload: { status: event.target.value as DirectorModuleStatus },
                                })
                              }
                              className={`rounded-full border-0 px-2 py-1 text-xs ${statusClasses[record.status]}`}
                            >
                              {Object.entries(statusLabels).map(([key, label]) => (
                                <option key={key} value={key}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={record.completionPct}
                              onChange={(event) =>
                                updateMutation.mutate({
                                  moduleKey: selectedModule.key,
                                  recordId: record.id,
                                  payload: { completionPct: Number(event.target.value) },
                                })
                              }
                              className="w-20 rounded-md border border-[var(--border-color)] px-2 py-1 text-sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : (
            <section className="space-y-6">
              <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-6 text-center text-sm text-[var(--text-secondary)]">
                Select a director submodule from the list to view details and add updates.
              </div>
            </section>
          )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AcademicOperationsPage;
