import { useState } from 'react';
import { usePurchaseAnnouncements } from '../../hooks/usePurchase';

const targetColors: Record<string, string> = {
  ALL: 'bg-blue-100 text-blue-800',
  DEPARTMENT: 'bg-purple-100 text-purple-800',
  PURCHASE: 'bg-green-100 text-green-800',
  URGENT: 'bg-red-100 text-red-800'
};

function Announcements() {
  const { data = [], isLoading } = usePurchaseAnnouncements();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAnnouncements = data.filter(announcement =>
    announcement.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Communications</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">Announcements</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              View all broadcast messages, purchase-specific announcements, and urgent updates.
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-[16px] border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm outline-none focus:border-[#185FA5] focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-slate-500">Loading announcements...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="rounded-[26px] border border-[#EFF2F6] bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-slate-500">No announcements found.</p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`rounded-[22px] border border-[#EFF2F6] bg-white p-6 shadow-sm transition hover:shadow-md ${
                !announcement.is_read ? 'border-l-4 border-l-[#185FA5]' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${targetColors[announcement.target || 'ALL']}`}>
                      {announcement.target === 'ALL' ? 'School Wide' : announcement.target === 'DEPARTMENT' ? 'Department' : announcement.target === 'PURCHASE' ? 'Purchase Dept' : 'Urgent'}
                    </span>
                    {!announcement.is_read && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[#185FA5]"></span>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700">{announcement.message}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <span>From: {announcement.creator?.name || 'System'}</span>
                    {announcement.department && <span>• {announcement.department.name}</span>}
                    <span>• {new Date(announcement.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Announcements;
