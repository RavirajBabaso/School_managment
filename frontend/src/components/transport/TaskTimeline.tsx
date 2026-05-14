import type { Task, TaskHistory } from '../../types/task.types';

const tone = (value: string) => {
  if (value === 'COMPLETED' || value === 'LOW') return 'bg-[#F0FDF4] text-[#639922]';
  if (value === 'DELAYED' || value === 'ESCALATED' || value === 'HIGH') return 'bg-[#FEF2F2] text-[#E24B4A]';
  if (value === 'IN_PROGRESS' || value === 'MEDIUM') return 'bg-[#FFFBEB] text-[#BA7517]';
  return 'bg-[#EFF6FF] text-[#185FA5]';
};

function TransportTaskTimeline({ history }: { history: TaskHistory[] }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-slate-700 mb-3">Task Timeline</h4>
      <div className="relative">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-[#EFF2F6]" />
        <div className="space-y-4">
          {history.map((h) => (
            <div className="relative flex items-start gap-4" key={h.id}>
              <div className="absolute left-0 w-5 h-5 rounded-full bg-[#185FA5] border-2 border-white shadow-sm" />
              <div className="ml-8">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tone(h.new_status)}`}>
                    {h.old_status ?? 'Created'} → {h.new_status}
                  </span>
                  <span className="text-xs text-slate-500">{new Date(h.updated_at).toLocaleDateString('en-IN')}</span>
                </div>
                {h.comment ? <p className="mt-1 text-xs text-slate-600">{h.comment}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TransportTaskTimeline;