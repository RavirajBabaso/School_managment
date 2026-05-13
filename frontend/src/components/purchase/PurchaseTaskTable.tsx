import type { Task } from '../../types/task.types';

const tone = (value: string) => {
  if (value === 'COMPLETED' || value === 'LOW') return 'bg-[#F0FDF4] text-[#639922]';
  if (value === 'DELAYED' || value === 'ESCALATED' || value === 'HIGH') return 'bg-[#FEF2F2] text-[#E24B4A]';
  if (value === 'IN_PROGRESS' || value === 'MEDIUM') return 'bg-[#FFFBEB] text-[#BA7517]';
  return 'bg-[#EFF6FF] text-[#185FA5]';
};

function PurchaseTaskTable({
  onView,
  tasks
}: {
  onView: (task: Task) => void;
  tasks: Task[];
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#EFF2F6] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#EFF2F6] text-left text-sm">
          <thead className="bg-[#F8FAFC] text-slate-500">
            <tr>
              {['Task Title', 'Assigned By', 'Priority', 'Start Date', 'Due Date', 'Status', 'Attachment', 'Actions'].map((heading) => (
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]" key={heading}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFF2F6]">
            {tasks.map((task) => (
              <tr className="hover:bg-[#F8FAFC]" key={task.id}>
                <td className="px-4 py-4 font-semibold text-slate-950">{task.title}</td>
                <td className="px-4 py-4 text-slate-600">{task.assignedBy?.name ?? task.assignedByName ?? 'Management'}</td>
                <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone(task.priority)}`}>{task.priority}</span></td>
                <td className="px-4 py-4 text-slate-600">{new Date(task.start_date).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-4 text-slate-600">{new Date(task.due_date).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone(task.status)}`}>{task.status.replace('_', ' ')}</span></td>
                <td className="px-4 py-4 text-[#185FA5]">{task.attachment_path ? '📎 File' : '--'}</td>
                <td className="px-4 py-4">
                  <button
                    className="rounded-[12px] border border-slate-300 bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#EEF4FF]"
                    onClick={() => onView(task)}
                    type="button"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={8}>No tasks found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PurchaseTaskTable;
