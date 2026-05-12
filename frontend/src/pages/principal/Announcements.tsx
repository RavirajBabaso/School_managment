import { useMemo, useState } from 'react';
import { usePrincipalAnnouncements } from '../../hooks/usePrincipal';

function Announcements() {
  const [query, setQuery] = useState('');
  const { data = [], isLoading } = usePrincipalAnnouncements();

  const filtered = useMemo(
    () => data.filter((item) => item.message.toLowerCase().includes(query.toLowerCase())),
    [data, query]
  );

  return (
    <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Communication</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">Announcements</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            View broadcast, department, academic, and urgent announcements.
          </p>
        </div>
        <input
          className="min-h-[44px] rounded-[14px] border border-slate-300 bg-[#F8FAFC] px-4 text-sm text-slate-950"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search announcements"
          value={query}
        />
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? <p className="text-sm text-slate-500">Loading announcements...</p> : null}
        {filtered.map((item) => (
          <article className="rounded-[20px] border border-[#EFF2F6] bg-[#F8FAFC] p-5" key={item.id}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#185FA5]">{item.target}</span>
              <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString('en-IN')}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{item.message}</p>
            <p className="mt-3 text-xs text-slate-500">From: {item.creator?.name ?? 'School Office'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Announcements;
