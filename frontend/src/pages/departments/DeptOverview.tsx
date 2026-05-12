import { Route, Routes } from 'react-router-dom';

import { useSocket } from '../../hooks/useSocket';

import Announcements from './Announcements';
import AssignedTasks from './AssignedTasks';
import DeptOverview from './DeptOverview';

import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';

function DepartmentPage({
  text,
  title
}: {
  text: string;
  title: string;
}) {
  return (
    <section className="min-h-screen space-y-6 bg-[#F5F7FB] p-6">
      
      {/* Header */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        
        <Badge variant="blue">
          Department Workspace
        </Badge>

        <h2 className="mt-4 text-2xl font-semibold text-slate-950">
          {title}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          {text}
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {[
          'Daily Focus',
          'Latest Updates'
        ].map((item) => (
          <article
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:bg-[#EEF4FF]"
            key={item}
          >
            <p className="text-base font-semibold text-slate-950">
              {item}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Department-head routes are now wrapped in the shared shell and ready for data wiring.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DeptDashboard() {
  useSocket();

  return (
    <div className="flex min-h-screen bg-[#F5F7FB] text-slate-950">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="min-w-0 flex-1 bg-[#F5F7FB]">
        
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route
            index
            element={<DeptOverview />}
          />

          <Route
            element={<AssignedTasks />}
            path="my-tasks"
          />

          <Route
            element={
              <DepartmentPage
                text="Track the latest operational notifications and system-generated reminders."
                title="Notifications"
              />
            }
            path="notifications"
          />

          <Route
            element={<Announcements />}
            path="announcements"
          />
        </Routes>
      </main>
    </div>
  );
}

export default DeptDashboard;
