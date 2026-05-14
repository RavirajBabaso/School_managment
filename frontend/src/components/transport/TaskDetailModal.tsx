import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import * as transportService from '../../services/transportService';
import type { Task, TaskStatus, TaskHistory } from '../../types/task.types';
import TransportTaskTimeline from './TaskTimeline';

function TaskDetailModal({ isOpen, onClose, task }: { isOpen: boolean; onClose: () => void; task: Task | null }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'PENDING');
  const [comment, setComment] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const updateMutation = useMutation({
    mutationFn: (payload: { status: TaskStatus; comment?: string; attachment?: File }) =>
      transportService.updateTransportTask(task!.id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['transport-tasks'] });
      void queryClient.invalidateQueries({ queryKey: ['transport-dashboard'] });
      onClose();
    }
  });

  if (!isOpen || !task) return null;

  const handleSubmit = async () => {
    await updateMutation.mutateAsync({ status, comment, attachment: attachment ?? undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-[24px] border border-[#EFF2F6] bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-950">{task.title}</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="status">New Status</label>
            <select
              id="status"
              className="mt-1 w-full rounded-[12px] border border-slate-300 bg-[#F8FAFC] px-4 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="DELAYED">Delayed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              className="mt-1 w-full rounded-[12px] border border-slate-300 bg-[#F8FAFC] px-4 py-2 text-sm"
              rows={3}
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="attachment">Attachment</label>
            <input
              id="attachment"
              type="file"
              className="mt-1"
              accept=".pdf,.docx,.jpg,.png"
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
          </div>

          {task.history && task.history.length > 0 ? (
            <TransportTaskTimeline history={task.history} />
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-[12px] border border-slate-300 bg-[#F8FAFC] px-5 py-2 text-sm font-semibold text-slate-600"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-[12px] bg-[#185FA5] px-5 py-2 text-sm font-semibold text-white disabled:opacity-70"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            type="button"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;