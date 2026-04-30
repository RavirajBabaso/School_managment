import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { getCommunications } from '../../services/communicationService';
import type { Communication } from '../../types/meeting.types';

type TabType = 'all' | 'broadcast' | 'dept' | 'chairman';

const CommunicationsPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = React.useState<TabType>('all');

  const { data: communications = [], isLoading } = useQuery({
    queryKey: ['communications'],
    queryFn: getCommunications,
  });

  const filteredCommunications = communications.filter(comm => {
    if (activeTab === 'all') return true;
    return comm.type === activeTab;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#F1F4F9] text-[#1E293B]">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Navbar />
          <div className="p-6 space-y-6">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F1F4F9] text-[#1E293B]">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Navbar />
        <div className="p-6 space-y-6">
          <div className="flex border-b border-gray-200 mb-4">
            {(['all', 'broadcast', 'dept', 'chairman'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'dept' ? 'Department' : tab === 'chairman' ? 'From Chairman' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredCommunications.map(comm => (
              <div key={comm.id} className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                <div className="flex items-start gap-3">
                  {!comm.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                  {comm.unread && <div className="w-2 h-2 flex-shrink-0" />}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0" style={{ backgroundColor: comm.avatarBg, color: comm.avatarColor }}>
                    {comm.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium flex-1">{comm.title}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: comm.tagBg, color: comm.tagColor }}>
                        {comm.tag}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {comm.from} · {comm.time}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{comm.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunicationsPage;