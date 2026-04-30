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
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Budget', type: 'BUDGET' as const, count: getPendingTypeCount('BUDGET'), color: 'text-blue-600' },
          { label: 'Purchase', type: 'PURCHASE' as const, count: getPendingTypeCount('PURCHASE'), color: 'text-green-600' },
          { label: 'Policy', type: 'POLICY' as const, count: getPendingTypeCount('POLICY'), color: 'text-purple-600' },
          { label: 'Event', type: 'EVENT' as const, count: getPendingTypeCount('EVENT'), color: 'text-orange-600' }
        ].map((item) => {
          const isActiveType = activeType === item.type;

          return (
            <button
              className={['rounded-[20px] border p-4 text-center transition',
                isActiveType
                  ? 'border-[#185FA5] bg-[#EFF6FF] shadow-sm'
                  : 'border-[#EFF2F6] bg-white hover:bg-gray-50'
              ].join(' ')}
              key={item.label}
              type="button"
              onClick={() => setActiveType(isActiveType ? 'ALL' : item.type)}
            >
              <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
              <div className="text-sm text-[#5B6E8C]">{item.label}</div>
            </button>
          );
        })}
      </div>

      <div className="rounded-[20px] border border-[#EFF2F6] bg-white p-6">
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
                className={[
                  'rounded-lg px-4 py-2 font-medium transition',
                  activeTab === tab.key
                    ? 'bg-[#185FA5] text-white'
                    : 'bg-gray-100 text-[#5B6E8C] hover:bg-gray-200'
                ].join(' ')}
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : isError ? (
            <div className="py-8 text-center text-[#C13F3A]">
              Unable to load approvals right now.
            </div>
          ) : filteredApprovals.length > 0 ? (
            filteredApprovals.map((approval) => {
              const requesterName = approval.requestedBy?.name ?? 'Unknown';

              return (
                <div
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#EFF2F6] p-4"
                  key={approval.id}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white ${getDepartmentColor(approval.type)}`}>
                      {getInitials(requesterName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[#1E293B]">{approval.title}</div>
                      <div className="text-sm text-[#5B6E8C]">
                        {requesterName} | {formatAmount(approval.amount)} | {approval.type.toLowerCase()}
                      </div>
                      <div className="text-xs text-[#8A99B0]">
                        Submitted: {formatDate(approval.createdAt)}
                      </div>
                    </div>
                  </div>

                  {approval.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <Button
                        className="bg-green-500 text-white hover:bg-green-600"
                        disabled={isProcessing}
                        onClick={() => approveMutation.mutate(approval.id)}
                        size="sm"
                        variant="primary"
                      >
                        {approveMutation.isPending ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        disabled={isProcessing}
                        onClick={() => rejectMutation.mutate(approval.id)}
                        size="sm"
                        variant="danger"
                      >
                        {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={[
                        'rounded-full px-3 py-1 text-sm font-medium',
                        approval.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      ].join(' ')}
                    >
                      {approval.status}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-[#5B6E8C]">
              No {activeTab.toLowerCase()} approvals found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApprovalManagement;
