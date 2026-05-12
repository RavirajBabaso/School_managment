import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import TaskTable from '../../components/tables/TaskTable';
import { DEPARTMENT_HEAD_ROLES } from '../../constants/roles';
import * as taskService from '../../services/taskService';
import * as userService from '../../services/userService';
import { setUsers } from '../../store/userSlice';
import { addTask, setTasks } from '../../store/taskSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { CreateTaskPayload, TaskStatus } from '../../types/task.types';

const statusTabs: Array<{ label: string; value: TaskStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Delayed', value: 'DELAYED' }
];

const initialForm: CreateTaskPayload = {
  title: '',
  description: '',
  assigned_to: 0,
  priority: 'MEDIUM',
  start_date: '',
  due_date: ''
};

function TaskAssignment() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const users = useAppSelector((state) => state.users.users);
  const [activeStatus, setActiveStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateTaskPayload>(initialForm);

  const taskQuery = useQuery({
    queryKey: ['tasks', 'chairman-assignment'],
    queryFn: () => taskService.getAllTasks()
  });

  const usersQuery = useQuery({
    queryKey: ['users', 'department-heads'],
    queryFn: () => userService.getAllUsers()
  });

  useEffect(() => {
    if (taskQuery.data) {
      dispatch(setTasks(taskQuery.data));
    }
  }, [dispatch, taskQuery.data]);

  useEffect(() => {
    if (usersQuery.data) {
      dispatch(setUsers(usersQuery.data));
    }
  }, [dispatch, usersQuery.data]);

  const departmentHeads = users.filter(
    (user) => DEPARTMENT_HEAD_ROLES.includes(user.role) && user.is_active
  );
  const filteredTasks =
    activeStatus === 'ALL' ? tasks : tasks.filter((task) => task.status === activeStatus);

  const handleChange = <K extends keyof CreateTaskPayload>(key: K, value: CreateTaskPayload[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.assigned_to) {
      setError('Please select a department head before creating the task.');
      return;
    }

    if (!form.title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    const startDate = form.start_date ? new Date(form.start_date) : new Date();
    const dueDate = new Date(form.due_date);

    if (dueDate <= startDate) {
      setError('Due date must be after the start date.');
      return;
    }

    setSubmitting(true);

    try {
      const createdTask = await taskService.createTask(form, file);
      dispatch(addTask(createdTask));
      queryClient.invalidateQueries({ queryKey: ['chairman-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'chairman-assignment'] });
      setForm(initialForm);
      setFile(undefined);
      setCreateModalOpen(false);
    } catch (submitError) {
      if (axios.isAxiosError(submitError)) {
        const errors = submitError.response?.data?.errors;
        const firstValidationMessage =
          Array.isArray(errors) && errors.length > 0 && typeof errors[0]?.message === 'string'
            ? errors[0].message
            : undefined;

        setError(
          firstValidationMessage ??
            submitError.response?.data?.message ??
            'Unable to create task right now. Please verify the form and try again.'
        );
      } else {
        setError('Unable to create task right now. Please verify the form and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    setError(null);
  };

  return (
  <>
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
              Dashboard Module
            </p>

            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              Task Assignment
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Create work items for department heads and track active assignments from the workflow queue.
            </p>
          </div>

          <Button
            className="h-fit"
            loading={taskQuery.isFetching && tasks.length === 0}
            onClick={() => setCreateModalOpen(true)}
          >
            Create New Task
          </Button>
        </div>
      </div>

      {/* Queue */}
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        {/* Top */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
              Assignment Queue
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Active Task Queue
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3">
            {statusTabs.map((tab) => (
              <button
                className={[
                  'rounded-full px-4 py-2 text-sm font-medium transition-all',
                  activeStatus === tab.value
                    ? 'bg-[#185FA5] text-white shadow-sm'
                    : 'border border-slate-300 bg-[#F8FAFC] text-slate-600 hover:bg-[#EEF4FF]'
                ].join(' ')}
                key={tab.value}
                onClick={() => setActiveStatus(tab.value)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white">
          <TaskTable
            emptyMessage="Newly assigned tasks will appear here."
            onRowClick={(task) => navigate(`/task/${task.id}`)}
            tasks={filteredTasks.filter(
              (task) => task.status !== 'COMPLETED'
            )}
          />
        </div>
      </div>
    </section>

    {/* Create Modal */}
    <Modal
      bodyClassName="max-h-[75vh] overflow-y-auto"
      isOpen={isCreateModalOpen}
      onClose={handleCloseCreateModal}
      title="Create New Task"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Assign To */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">
            Assign To
          </span>

          <select
            className="min-h-[46px] rounded-[14px] border border-slate-300 bg-[#F8FAFC] px-4 text-sm text-slate-950 outline-none transition focus:border-[#185FA5]"
            onChange={(event) => {
              const selectedUser = departmentHeads.find(
                (user) =>
                  user.id === Number(event.target.value)
              );

              handleChange(
                'assigned_to',
                Number(event.target.value)
              );

              handleChange(
                'department_id',
                selectedUser?.department_id ?? null
              );
            }}
            required
            value={form.assigned_to || ''}
          >
            <option value="">
              Select department head
            </option>

            {departmentHeads.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </label>

        {/* Title */}
        <Input
          label="Task Title"
          onChange={(event) =>
            handleChange('title', event.target.value)
          }
          placeholder="Enter task title"
          required
          value={form.title}
        />

        {/* Description */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">
            Description
          </span>

          <textarea
            className="min-h-[140px] rounded-[16px] border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#185FA5]"
            onChange={(event) =>
              handleChange(
                'description',
                event.target.value
              )
            }
            placeholder="Describe the task scope and expected outcome"
            value={form.description ?? ''}
          />
        </label>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Priority */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">
              Priority
            </span>

            <select
              className="min-h-[46px] rounded-[14px] border border-slate-300 bg-[#F8FAFC] px-4 text-sm text-slate-950 outline-none transition focus:border-[#185FA5]"
              onChange={(event) =>
                handleChange(
                  'priority',
                  event.target
                    .value as CreateTaskPayload['priority']
                )
              }
              value={form.priority}
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </label>

          {/* Start Date */}
          <Input
            label="Start Date"
            onChange={(event) =>
              handleChange(
                'start_date',
                event.target.value
              )
            }
            required
            type="date"
            value={form.start_date}
          />
        </div>

        {/* Due Date */}
        <Input
          label="Due Date"
          onChange={(event) =>
            handleChange(
              'due_date',
              event.target.value
            )
          }
          required
          type="date"
          value={form.due_date}
        />

        {/* Attachment */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">
            Attachment
          </span>

          <input
            accept=".pdf,.docx,.jpg,.jpeg,.png"
            className="rounded-[14px] border border-dashed border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#185FA5] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
            onChange={(event) =>
              setFile(event.target.files?.[0])
            }
            type="file"
          />
        </label>

        {error ? (
          <p className="text-sm text-red-400">
            {error}
          </p>
        ) : null}

        <Button
          className="w-full justify-center"
          loading={isSubmitting}
          type="submit"
        >
          Submit Task
        </Button>
      </form>
    </Modal>
  </>
);
}

export default TaskAssignment;
