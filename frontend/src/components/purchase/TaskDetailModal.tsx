import { useState } from 'react';
import Modal from '../common/Modal';
import { useUpdatePurchaseTask } from '../../hooks/usePurchase';
import type { Task, TaskStatus, TaskHistory } from '../../types/task.types';
import toast from 'react-hot-toast';

const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'PENDING', label: 'Pending', color: 'bg-[#EFF6FF] text-[#185FA5]' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-[#FFFBEB] text-[#BA7517]' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-[#F0FDF4] text-[#639922]' },
  { value: 'DELAYED', label: 'Delayed', color: 'bg-[#FEF2F2] text-[#E24B4A]' }
];

const tone = (value: string) => {
  if (value === 'COMPLETED' || value === 'LOW') return 'bg-[#F0FDF4] text-[#639922]';
  if (value === 'DELAYED' || value === 'ESCALATED' || value === 'HIGH') return 'bg-[#FEF2F2] text-[#E24B4A]';
  if (value === 'IN_PROGRESS' || value === 'MEDIUM') return 'bg-[#FFFBEB] text-[#BA7517]';
  return 'bg-[#EFF6FF] text-[#185FA5]';
};

function TaskDetailModal({ isOpen, onClose, task }: { isOpen: boolean; onClose: () => void; task: Task | null }) {
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [comment, setComment] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const updateTask = useUpdatePurchaseTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !status) return;

    try {
      await updateTask.mutateAsync({
        id: task.id,
        payload: { status, comment: comment || undefined, attachment: attachment || undefined }
      });
      toast.success('Task updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleOpenChange = () => {
    setStatus('');
    setComment('');
    setAttachment(null);
    onClose();
  };

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleOpenChange} title="Task Details">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Task Title</label>
            <p className="mt-1 text-sm font-semibold text-slate-950">{task.title}</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Assigned By</label>
            <p className="mt-1 text-sm text-slate-700">{task.assignedBy?.name || task.assignedByName || 'Management'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Priority</label>
            <p className="mt-1">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                task.priority === 'HIGH' ? 'bg-[#FEF2F2] text-[#E24B4A]' :
                task.priority === 'MEDIUM' ? 'bg-[#FFFBEB] text-[#BA7517]' :
                'bg-[#F0FDF4] text-[#639922]'
              }`}>
                {task.priority}
              </span>
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Current Status</label>
            <p className="mt-1">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${tone(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Start Date</label>
            <p className="mt-1 text-sm text-slate-700">
              {new Date(task.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Due Date</label>
            <p className={`mt-1 text-sm font-semibold ${
              new Date(task.due_date) < new Date() && task.status !== 'COMPLETED' ? 'text-[#E24B4A]' : 'text-slate-700'
            }`}>
              {new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {new Date(task.due_date) < new Date() && task.status !== 'COMPLETED' && ' (Overdue)'}
            </p>
          </div>
        </div>

        {task.description && (
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Description</label>
            <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        {task.attachment_path && (
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Attachment</label>
            <div className="mt-1">
              <a
                href={`/${task.attachment_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#185FA5] hover:underline"
              >
                📎 View Attachment
              </a>
            </div>
          </div>
        )}

        {task.history && task.history.length > 0 && (
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Task History</label>
            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
              {task.history
                .slice()
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                .map((h: TaskHistory) => (
                  <div key={h.id} className="rounded-[12px] border border-[#EFF2F6] bg-[#F8FAFC] p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`rounded-full px-2 py-1 font-semibold ${tone(h.new_status)}`}>
                        {h.new_status.replace('_', ' ')}
                      </span>
                      <span className="text-slate-500">
                        {new Date(h.updated_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {h.comment && <p className="mt-1 text-slate-600">{h.comment}</p>}
                    {h.updatedBy && <p className="mt-2 text-xs text-slate-500">Updated by: {h.updatedBy.name}</p>}
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="border-t border-[#EFF2F6] pt-6">
          <h3 className="text-base font-semibold text-slate-950">Update Task Status</h3>
          <p className="mt-1 text-sm text-slate-600">Change status and add notes</p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">New Status</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`rounded-[12px] px-4 py-2 text-sm font-medium transition ${
                      status === opt.value
                        ? opt.color + ' ring-2 ring-offset-2 ring-[#185FA5]'
                        : 'border border-slate-300 bg-[#F8FAFC] text-slate-600 hover:bg-[#EEF4FF]'
                    }`}
                    onClick={() => setStatus(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Comment (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment about this update..."
                rows={3}
                className="mt-2 w-full rounded-[16px] border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#185FA5] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Upload Attachment (optional)</label>
              <input
                type="file"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-[12px] file:border-0 file:bg-[#185FA5] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#226fc0]"
              />
              <p className="mt-1 text-xs text-slate-500">PDF, DOCX, JPG, PNG (max 10MB)</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleOpenChange}
            className="rounded-[14px] border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-[#F8FAFC]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!status || updateTask.isPending}
            className="rounded-[14px] bg-[#185FA5] px-6 py-3 text-sm font-semibold text-white hover:bg-[#226fc0] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {updateTask.isPending ? 'Updating...' : 'Update Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default TaskDetailModal;
