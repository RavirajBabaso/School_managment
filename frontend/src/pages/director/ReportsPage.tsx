import React from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

function ReportsPage() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Navbar title="MIS Reports" />
        <div className="p-6">
          <h1 className="text-2xl font-semibold">MIS Reports</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Reports functionality moved to Director module.</p>
          {/* Add reports content here */}
        </div>
      </main>
    </div>
  );
}

export default ReportsPage;