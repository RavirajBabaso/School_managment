import type { TaskHistory } from '../../types/task.types';

const statusColors: Record<string, string> = {
  PENDING: '#185FA5',
  IN_PROGRESS: '#BA7517',
  COMPLETED: '#639922',
  DELAYED: '#E24B4A',
  ESCALATED: '#DC2626'
};

function TaskTimeline({ history }: { history: TaskHistory[] }) {
  const sortedHistory = history
    .slice()
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return (
    <div className="relative pl-4">
      {/* Vertical line */}
      <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-[#EFF2F6]"></div>

      <div className="space-y-6">
        {sortedHistory.map((item, idx) => (
          <div key={idx} className="relative">
            {/* Timeline node */}
            <div
              className="absolute left-[-5px] top-2 h-3 w-3 rounded-full border-2 border-white"
              style={{ backgroundColor: statusColors[item.new_status] || '#64748B' }}
            ></div>

            <div className="rounded-[16px] border border-[#EFF2F6] bg-[#F8FAFC] p-4">
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: `${statusColors[item.new_status] || '#64748B'}20`,
                    color: statusColors[item.new_status] || '#64748B'
                  }}
                >
                  {item.new_status.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(item.updated_at).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {item.comment && (
                <p className="mt-2 text-sm text-slate-700">{item.comment}</p>
              )}
              {item.updatedBy && (
                <p className="mt-2 text-xs text-slate-500">Updated by: {item.updatedBy.name}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskTimeline;
