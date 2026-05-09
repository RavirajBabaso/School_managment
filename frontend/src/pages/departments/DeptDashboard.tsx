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
    <section className="min-h-screen space-y-6 bg-[#020817] p-6">
      
      {/* Header */}
      <div className="rounded-[28px] border border-slate-800 bg-[#111827] p-6 shadow-sm">
        
        <Badge variant="blue">
          Department Workspace
        </Badge>

        <h2 className="mt-4 text-2xl font-semibold text-white">
          {title}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
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
            className="rounded-[24px] border border-slate-800 bg-[#111827] p-5 shadow-sm transition-all duration-200 hover:bg-[#172036]"
            key={item}
          >
            <p className="text-base font-semibold text-white">
              {item}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-400">
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
    <div className="flex min-h-screen bg-[#020817] text-white">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="min-w-0 flex-1 bg-[#020817]">
        
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