import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../common/Modal';
import Button from '../common/Button';
import TaskTimeline from './TaskTimeline';
import * as admissionService from '../../services/admissionService';
import type { Task, TaskStatus } from '../../types/task.types';

const statusOptions: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'];

function TaskDetailModal({
  isOpen,
  onClose,
  task
}: {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<TaskStatus>('IN_PROGRESS');
  const [comment, setComment] = useState('');
  const [attachment, setAttachment] = useState<File | undefined>();

  const mutation = useMutation({
    mutationFn: () => admissionService.updateAdmissionTask(task!.id, { status, comment, attachment }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admission-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['admission-tasks'] }),
        queryClient.invalidateQueries({ queryKey: ['admission-analytics'] })
      ]);
      setComment('');
      setAttachment(undefined);
      onClose();
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (task) {
      mutation.mutate();
    }
  };

  if (!task) {
    return null;
  }

  return (
    <Modal bodyClassName="space-y-6" isOpen={isOpen} onClose={onClose} title="Task Details">
      <div className="rounded-[20px] border border-[#EFF2F6] bg-[#F8FAFC] p-5">
        <h3 className="text-lg font-semibold text-slate-950">{task.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{task.description ?? 'No description provided.'}</p>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <p><span className="text-slate-500">Assigned by:</span> {task.assignedBy?.name ?? task.assignedByName ?? 'School Office'}</p>
          <p><span className="text-slate-500">Priority:</span> {task.priority}</p>
          <p><span className="text-slate-500">Start:</span> {new Date(task.start_date).toLocaleDateString('en-IN')}</p>
          <p><span className="text-slate-500">Due:</span> {new Date(task.due_date).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">New Status</span>
          <select
            className="min-h-[46px] rounded-[14px] border border-slate-300 bg-[#F8FAFC] px-4 text-sm text-slate-950"
            onChange={(event) => setStatus(event.target.value as TaskStatus)}
            value={status}
          >
            {statusOptions.map((item) => (
              <option key={item} value={item}>{item.replace('_', ' ')}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Comment</span>
          <textarea
            className="min-h-[110px] rounded-[16px] border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm text-slate-950"
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add update notes"
            value={comment}
          />
        </label>
        <input
          accept=".pdf,.docx,.jpg,.jpeg,.png"
          className="w-full rounded-[14px] border border-dashed border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#185FA5] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
          onChange={(event) => setAttachment(event.target.files?.[0])}
          type="file"
        />
        <Button className="w-full" loading={mutation.isPending} type="submit">Update Task</Button>
      </form>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Timeline</h3>
        <TaskTimeline history={task.history} />
      </div>
    </Modal>
  );
}

export default TaskDetailModal;
