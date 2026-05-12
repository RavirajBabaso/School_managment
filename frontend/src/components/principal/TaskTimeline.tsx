import type { TaskHistory } from '../../types/task.types';

const statusTone = (status?: string | null) => {
  if (status === 'COMPLETED') return 'bg-[#F0FDF4] text-[#639922]';
  if (status === 'DELAYED' || status === 'ESCALATED') return 'bg-[#FEF2F2] text-[#E24B4A]';
  if (status === 'IN_PROGRESS') return 'bg-[#FFFBEB] text-[#BA7517]';
  return 'bg-[#EFF6FF] text-[#185FA5]';
};

function TaskTimeline({ history = [] }: { history?: TaskHistory[] }) {
  if (history.length === 0) {
    return <p className="py-6 text-sm text-slate-500">No task history yet.</p>;
  }

  return (
    <div className="space-y-5">
      {history.map((item) => (
        <div className="relative pl-7" key={item.id}>
          <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[#185FA5]" />
          <span className="absolute bottom-[-22px] left-[5px] top-5 w-px bg-[#EFF2F6]" />
          <div className="rounded-[18px] border border-[#EFF2F6] bg-[#F8FAFC] p-4">
            <div className="flex flex-wrap items-center gap-2">
              {item.old_status ? (
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusTone(item.old_status)}`}>
                  {item.old_status.replace('_', ' ')}
                </span>
              ) : null}
              <span className="text-xs text-slate-500">to</span>
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusTone(item.new_status)}`}>
                {item.new_status.replace('_', ' ')}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-700">{item.comment ?? 'Status updated'}</p>
            <p className="mt-2 text-xs text-slate-500">
              {item.updatedBy?.name ?? item.updatedByName ?? 'Principal'} - {new Date(item.updated_at).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskTimeline;
