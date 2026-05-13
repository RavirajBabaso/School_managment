import type { TaskHistory } from '../../types/task.types';

const statusColor = (status: string) => {
  if (status === 'COMPLETED') return 'bg-[#639922]';
  if (status === 'DELAYED' || status === 'ESCALATED') return 'bg-[#E24B4A]';
  if (status === 'IN_PROGRESS') return 'bg-[#BA7517]';
  return 'bg-[#185FA5]';
};

function TaskTimeline({ history }: { history: TaskHistory[] }) {
  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div className="flex items-start gap-4" key={item.id}>
          <div className="flex flex-col items-center">
            <span className={`h-3 w-3 rounded-full ${statusColor(item.new_status)}`} />
            {index < history.length - 1 ? <span className="h-8 w-px bg-[#EFF2F6]" /> : null}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-950">{item.old_status ?? 'Created'}</span>
              <span className="text-slate-400">→</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor(item.new_status)} text-white`}>
                {item.new_status}
              </span>
            </div>
            <p className="text-sm text-slate-600">{item.comment}</p>
            <p className="text-xs text-slate-500">{new Date(item.updated_at).toLocaleString('en-IN')}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskTimeline;