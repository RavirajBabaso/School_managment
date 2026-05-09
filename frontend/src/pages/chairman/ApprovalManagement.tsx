import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import { approveApproval, getAllApprovals, rejectApproval } from '../../services/approvalService';
import type { Approval } from '../../types/meeting.types';

type ApprovalTab = 'ALL' | Approval['status'];

const tabs: Array<{ key: ApprovalTab; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'REJECTED', label: 'Rejected' }
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const getDepartmentColor = (type: Approval['type']) => {
  const colors: Record<Approval['type'], string> = {
    BUDGET: 'bg-blue-500',
    PURCHASE: 'bg-green-500',
    POLICY: 'bg-purple-500',
    EVENT: 'bg-orange-500'
  };

  return colors[type];
};

function ApprovalManagement() {
  const [activeTab, setActiveTab] = useState<ApprovalTab>('ALL');
  const [activeType, setActiveType] = useState<Approval['type'] | 'ALL'>('ALL');
  const queryClient = useQueryClient();

  const { data: approvals = [], isLoading, isError } = useQuery({
    queryKey: ['approvals', activeTab, activeType],
    queryFn: () => getAllApprovals(activeTab === 'ALL' ? undefined : activeTab, activeType === 'ALL' ? undefined : activeType)
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveApproval(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['chairman-dashboard'] });
      toast.success('Approval granted successfully');
    },
    onError: () => {
      toast.error('Failed to approve request');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectApproval(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['chairman-dashboard'] });
      toast.success('Approval rejected');
    },
    onError: () => {
      toast.error('Failed to reject request');
    }
  });

  const filteredApprovals = approvals.filter((approval) => {
    const statusMatch = activeTab === 'ALL' ? true : approval.status === activeTab;
    const typeMatch = activeType === 'ALL' ? true : approval.type === activeType;
    return statusMatch && typeMatch;
  });

  const getStatusCount = (status: Approval['status']) =>
    approvals.filter((approval) => approval.status === status).length;

  const pendingCount = getStatusCount('PENDING');
  const approvedCount = getStatusCount('APPROVED');
  const rejectedCount = getStatusCount('REJECTED');

  const getPendingTypeCount = (type: Approval['type']) =>
    approvals.filter((approval) => approval.type === type && approval.status === 'PENDING').length;

  const formatAmount = (amount?: string) => {
    if (!amount) return 'No amount';

    const parsed = Number.parseFloat(amount);
    if (Number.isNaN(parsed)) return amount;

    return `Rs. ${parsed.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? '--' : date.toLocaleDateString('en-IN');
  };

  const isProcessing = approveMutation.isPending || rejectMutation.isPending;

  return (
  <div className="space-y-6">
    {/* Top Stats */}
    <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
            Approval analytics
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
            Approval Management
          </h1>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: 'Budget',
            type: 'BUDGET' as const,
            count: getPendingTypeCount('BUDGET'),
            color: 'bg-[#EFF6FF] text-[#2563EB]'
          },
          {
            label: 'Purchase',
            type: 'PURCHASE' as const,
            count: getPendingTypeCount('PURCHASE'),
            color: 'bg-[#F0FDF4] text-[#16A34A]'
          },
          {
            label: 'Policy',
            type: 'POLICY' as const,
            count: getPendingTypeCount('POLICY'),
            color: 'bg-[#F5F3FF] text-[#7C3AED]'
          },
          {
            label: 'Event',
            type: 'EVENT' as const,
            count: getPendingTypeCount('EVENT'),
            color: 'bg-[#FFF7ED] text-[#EA580C]'
          }
        ].map((item) => {
          const isActiveType = activeType === item.type;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveType(isActiveType ? 'ALL' : item.type)}
              className={`rounded-[22px] border p-5 text-left transition-all ${
                isActiveType
                  ? 'border-[var(--border-color)] bg-[var(--surface)] shadow-sm'
                  : 'border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold ${item.color}`}
              >
                {item.count}
              </div>

              <div className="mt-4">
                <p className="text-base font-semibold text-[var(--text-primary)]">
                  {item.label}
                </p>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Pending approvals
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>

    {/* Main Section */}
    <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const count =
            tab.key === 'ALL'
              ? approvals.length
              : tab.key === 'PENDING'
              ? pendingCount
              : tab.key === 'APPROVED'
              ? approvedCount
              : rejectedCount;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[#185FA5] text-white'
                  : 'border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-10 text-center text-sm text-[var(--text-secondary)]">
            Loading approvals...
          </div>
        ) : isError ? (
          <div className="py-10 text-center text-sm text-[#DC2626]">
            Unable to load approvals right now.
          </div>
        ) : filteredApprovals.length > 0 ? (
          filteredApprovals.map((approval) => {
            const requesterName =
              approval.requestedBy?.name ?? 'Unknown';

            return (
              <div
                key={approval.id}
                className="flex flex-col gap-5 rounded-[22px] border border-[var(--border-color)] bg-[var(--surface)] p-5 transition-all hover:bg-[var(--bg-tertiary)] lg:flex-row lg:items-center lg:justify-between"
              >
                {/* Left */}
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${getDepartmentColor(
                      approval.type
                    )}`}
                  >
                    {getInitials(requesterName)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-[var(--text-primary)]">
                      {approval.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <span>{requesterName}</span>
                      <span>•</span>
                      <span>{formatAmount(approval.amount)}</span>
                      <span>•</span>
                      <span>{approval.type}</span>
                    </div>

                    <p className="mt-2 text-xs text-[var(--text-secondary)]">
                      Submitted: {formatDate(approval.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Right */}
                {approval.status === 'PENDING' ? (
                  <div className="flex items-center gap-3">
                    <Button
                      className="bg-[#16A34A] text-white hover:bg-[#15803D]"
                      disabled={isProcessing}
                      onClick={() => approveMutation.mutate(approval.id)}
                      variant="primary"
                    >
                      {approveMutation.isPending
                        ? 'Approving...'
                        : 'Approve'}
                    </Button>

                    <Button
                      disabled={isProcessing}
                      onClick={() => rejectMutation.mutate(approval.id)}
                      variant="danger"
                    >
                      {rejectMutation.isPending
                        ? 'Rejecting...'
                        : 'Reject'}
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      approval.status === 'APPROVED'
                        ? 'bg-[#EDF9F1] text-[#16A34A]'
                        : 'bg-[#FEF2F2] text-[#DC2626]'
                    }`}
                  >
                    {approval.status}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center text-sm text-[var(--text-secondary)]">
            No approvals found.
          </div>
        )}
      </div>
    </section>
  </div>
);
}

export default ApprovalManagement;
