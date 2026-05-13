import { useITAnnouncements } from '../../hooks/useIT';

function Announcements() {
  const { data: announcements = [], isLoading } = useITAnnouncements();

  return (
    <div className="space-y-6">
      <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">IT Announcements</h2>
        {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading...</p> : null}

        <div className="mt-4 space-y-3">
          {announcements.map((announcement) => (
            <div className="rounded-[16px] border border-[#EFF2F6] bg-[#F8FAFC] p-4" key={announcement.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{announcement.target}</p>
                  <p className="mt-1 font-semibold text-slate-950">{announcement.title || 'IT Announcement'}</p>
                  <p className="mt-1 text-sm text-slate-600">{announcement.message}</p>
                </div>
                <p className="text-xs text-slate-500">{new Date(announcement.created_at).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          ))}
          {announcements.length === 0 && !isLoading ? <p className="text-sm text-slate-500">No announcements found.</p> : null}
        </div>
      </div>
    </div>
  );
}

export default Announcements;