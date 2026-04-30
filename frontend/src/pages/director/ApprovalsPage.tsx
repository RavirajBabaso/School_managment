import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatGrid from '../../components/common/StatGrid';
import { getApprovals, createApproval } from '../../services/approvalService';
import type { Approval, ApprovalType } from '../../types/meeting.types';

type TabType = 'ALL' | 'PENDING' | 'APPROVED';

const ApprovalsPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [showNewForm, setShowNewForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState({ sent: false, draft: false });
  const [newApproval, setNewApproval] = useState({
    type: 'BUDGET' as ApprovalType,
    priority: 'Medium',
    title: '',
    justification: '',
    amount: '',
    requiredBy: '',
  });

  const { data: approvals = [], isLoading } = useQuery({
    queryKey: ['approvals'],
    queryFn: getApprovals,
  });

  const createMutation = useMutation({
    mutationFn: createApproval,
    onSuccess: () => {
      setFormSuccess({ sent: true, draft: false });
      setNewApproval({
        type: 'BUDGET',
        priority: 'Medium',
        title: '',
        justification: '',
        amount: '',
        requiredBy: '',
      });
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      setTimeout(() => setFormSuccess({ sent: false, draft: false }), 2000);
    },
  });

  const handleCreate = () => {
    createMutation.mutate(newApproval);
  };

  const filteredApprovals = approvals.filter(approval => {
    if (activeTab === 'ALL') return true;
    return approval.status === activeTab;
  });

  const getTypeBadge = (type: ApprovalType) => {
    const colors = {
      BUDGET: 'bg-green-100 text-green-800',
      PURCHASE: 'bg-blue-100 text-blue-800',
      POLICY: 'bg-purple-100 text-purple-800',
      EVENT: 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      APPROVED: 'bg-green-100 text-green-800',
      PENDING: 'bg-amber-100 text-amber-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const stats = [
    { label: 'Total', value: approvals.length, color: '#185FA5' },
    { label: 'Pending', value: approvals.filter(a => a.status === 'PENDING').length, color: '#BA7517' },
    { label: 'Approved', value: approvals.filter(a => a.status === 'APPROVED').length, color: '#3B6D11' },
    { label: 'Rejected', value: approvals.filter(a => a.status === 'REJECTED').length, color: '#A32D2D' },
  ];

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
          <StatGrid items={stats} />

          <div className="flex border-b border-gray-200 mb-4">
            {(['ALL', 'PENDING', 'APPROVED'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={() => setShowNewForm(true)}
              className={`px-4 py-2 text-sm font-medium ml-auto ${
                showNewForm
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              + New Request
            </button>
          </div>

          {showNewForm ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">New Approval Request</h3>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                  Sent to Chairman
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
                  <select
                    value={newApproval.type}
                    onChange={(e) => setNewApproval(prev => ({ ...prev, type: e.target.value as ApprovalType }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BUDGET">Budget</option>
                    <option value="PURCHASE">Purchase</option>
                    <option value="POLICY">Policy</option>
                    <option value="EVENT">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newApproval.priority}
                    onChange={(e) => setNewApproval(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newApproval.title}
                  onChange={(e) => setNewApproval(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Justification</label>
                <textarea
                  value={newApproval.justification}
                  onChange={(e) => setNewApproval(prev => ({ ...prev, justification: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ₹</label>
                  <input
                    type="text"
                    value={newApproval.amount}
                    onChange={(e) => setNewApproval(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required By</label>
                  <input
                    type="date"
                    value={newApproval.requiredBy}
                    onChange={(e) => setNewApproval(prev => ({ ...prev, requiredBy: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setFormSuccess({ sent: false, draft: true })}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50"
                >
                  Save Draft
                </button>
                <button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Sending...' : 'Send to Chairman ↗'}
                </button>
              </div>

              {formSuccess.sent && (
                <div className="mt-4 bg-green-50 border border-green-300 text-green-800 p-3 rounded-md text-sm">
                  Approval request sent successfully!
                </div>
              )}

              {formSuccess.draft && (
                <div className="mt-4 bg-blue-50 border border-blue-300 text-blue-800 p-3 rounded-md text-sm">
                  Draft saved successfully!
                </div>
              )}

              <div className="mt-4 text-right">
                <button
                  onClick={() => setShowNewForm(false)}
                  className="text-sm text-gray-500 underline"
                >
                  ← Back to list
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Approvals</h3>
                <button
                  onClick={() => setShowNewForm(true)}
                  className="text-gray-600 hover:text-gray-800 text-sm underline"
                >
                  New ↗
                </button>
              </div>

              <div className="space-y-3">
                {filteredApprovals.map(approval => (
                  <div key={approval.id} className="border-b border-gray-100 py-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium flex-1">{approval.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${getTypeBadge(approval.type)}`}>
                        {approval.type}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(approval.status)}`}>
                        {approval.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {approval.id} · ₹{approval.amount} · {approval.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ApprovalsPage;