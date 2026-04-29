import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DepartmentHealthBar from '../../components/charts/DepartmentHealthBar';
import TaskTable from '../../components/tables/TaskTable';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { getChairmanDashboard, type ChairmanDashboardData } from '../../services/dashboardService';
import { approveApproval, rejectApproval } from '../../services/approvalService';

type ResultView = 'total' | 'completed' | 'delayed' | 'pendingApprovals';

const ChairmanOverview: React.FC = () => {
  const [activeResult, setActiveResult] = useState<ResultView | null>(null);
  const [alertFilter, setAlertFilter] = useState<'all' | 'Critical' | 'Warning' | 'Escalated'>('all');
  const [processingApproval, setProcessingApproval] = useState<number | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useQuery({
    queryKey: ['chairman-dashboard'],
    queryFn: getChairmanDashboard,
    refetchInterval: 30000,
    refetchOnWindowFocus: true
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-sm text-[#8A99B0]">
        Loading dashboard...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-[#F3C7C5] bg-[#FFF4F4] p-5 text-sm text-[#C13F3A]">
        Unable to load chairman dashboard right now.
      </div>
    );
  }

  const dashboardData = data as ChairmanDashboardData & {
    activeAlerts?: Array<{ id: number; title: string; department?: { name: string }; status?: string }>;
    departmentHealth?: ChairmanDashboardData['departments'];
    completionRate?: number;
  };

  const departmentItems = dashboardData.departments ?? dashboardData.departmentHealth ?? [];
  const alerts = dashboardData.alerts ??
    dashboardData.activeAlerts?.map((task) => ({
      id: task.id,
      title: task.title,
      subLabel: task.department ? `Dept: ${task.department.name}` : 'No department',
      severity: task.status === 'DELAYED' ? 'Delay' : 'Escalated'
    })) ?? [];
  const completionPercentage = dashboardData.completionPercentage ?? dashboardData.completionRate ?? 0;
  const pendingApprovalsList = dashboardData.pendingApprovalsList ?? [];
  const taskLists = dashboardData.taskLists ?? {
    total: dashboardData.recentTasks ?? [],
    completed: (dashboardData.recentTasks ?? []).filter((task) => task.status === 'COMPLETED'),
    delayed: (dashboardData.recentTasks ?? []).filter((task) => task.status === 'DELAYED')
  };

  const activeResultTitle: Record<ResultView, string> = {
    total: 'Total Tasks',
    completed: 'Completed Tasks',
    delayed: 'Delayed Tasks',
    pendingApprovals: 'Pending Approvals'
  };

  const statCards: Array<{
    key: ResultView;
    label: string;
    value: number;
    detail?: string;
    color: string;
  }> = [
    { key: 'total', label: 'Total tasks', value: data.totalTasks, color: 'text-blue-600' },
    {
      key: 'completed',
      label: 'Completed',
      value: data.completedTasks,
      detail: `${completionPercentage}%`,
      color: 'text-green-600'
    },
    { key: 'delayed', label: 'Delayed', value: data.delayedTasks, detail: 'Needs action', color: 'text-red-600' },
    {
      key: 'pendingApprovals',
      label: 'Pending approvals',
      value: data.pendingApprovals,
      detail: 'Awaiting you',
      color: 'text-amber-600'
    }
  ];

  const activeTasks =
    activeResult === 'total'
      ? taskLists.total
      : activeResult === 'completed'
        ? taskLists.completed
        : activeResult === 'delayed'
          ? taskLists.delayed
          : [];

  const filteredAlerts = alertFilter === 'all' ? alerts : alerts.filter(a => a.severity === alertFilter);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'red';
      case 'Warning':
        return 'amber';
      case 'Escalated':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getSeverityIcon = (severity: string) => {
    // Placeholder icons, replace with actual icons
    return '⚠️';
  };

  const handleApprove = async (id: number) => {
    setProcessingApproval(id);
    try {
      await approveApproval(id);
      await queryClient.invalidateQueries({ queryKey: ['chairman-dashboard'] });
    } catch (error) {
      console.error('Failed to approve:', error);
      alert('Failed to approve the request. Please try again.');
    } finally {
      setProcessingApproval(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingApproval(id);
    try {
      await rejectApproval(id);
      await queryClient.invalidateQueries({ queryKey: ['chairman-dashboard'] });
    } catch (error) {
      console.error('Failed to reject:', error);
      alert('Failed to reject the request. Please try again.');
    } finally {
      setProcessingApproval(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const isActive = activeResult === card.key;

          return (
            <button
              className={[
                'rounded-lg border p-4 text-left transition',
                isActive
                  ? 'border-[#185FA5] bg-[#EFF6FF] shadow-sm'
                  : 'border-transparent bg-gray-50 hover:border-[#DCE2EA] hover:bg-white'
              ].join(' ')}
              key={card.key}
              onClick={() => setActiveResult(isActive ? null : card.key)}
              type="button"
            >
              <h3 className="text-sm font-medium text-gray-500">{card.label}</h3>
              <p className={`text-2xl font-bold ${card.color}`}>
                {card.value}
                {card.key === 'completed' ? ` (${card.detail})` : ''}
              </p>
              {card.key !== 'completed' && card.detail ? (
                <p className={`text-xs ${card.color}`}>{card.detail}</p>
              ) : null}
            </button>
          );
        })}
      </div>

      {activeResult ? (
        <div className="rounded-lg border border-[#EFF2F6] bg-white p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-[#1E293B]">{activeResultTitle[activeResult]}</h3>
            <Button size="sm" variant="ghost" onClick={() => setActiveResult(null)}>
              Close
            </Button>
          </div>

          {activeResult === 'pendingApprovals' ? (
            <div className="space-y-3">
              {pendingApprovalsList.length > 0 ? (
                pendingApprovalsList.map((approval) => (
                  <div className="flex items-center justify-between rounded-lg border border-[#EFF2F6] p-3" key={approval.id}>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                        {approval.submitter.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{approval.title}</p>
                        <p className="text-xs text-gray-500">{approval.submitter} | {approval.amount}</p>
                      </div>
                    </div>
                    <Badge variant="amber">Pending</Badge>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-[#8A99B0]">No pending approvals found.</p>
              )}
            </div>
          ) : (
            <TaskTable
              emptyMessage={`No ${activeResultTitle[activeResult].toLowerCase()} found.`}
              tasks={activeTasks}
            />
          )}
        </div>
      ) : null}

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Health */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Department Health</h3>
            <button className="text-xs text-blue-600 bg-transparent" onClick={() => navigate('/chairman/mis-reports')}>Full report</button>
          </div>
          <DepartmentHealthBar departments={departmentItems} />
        </div>

        {/* Active Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Active Alerts</h3>
            <button className="text-xs text-blue-600 bg-transparent" onClick={() => navigate('/chairman/alerts')}>View all</button>
          </div>
          <div className="flex space-x-2 mb-4">
            <button
              className={`px-3 py-1 text-xs rounded ${alertFilter === 'all' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setAlertFilter('all')}
            >
              All ({alerts.length})
            </button>
            <button
              className={`px-3 py-1 text-xs rounded ${alertFilter === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setAlertFilter('Critical')}
            >
              Critical ({alerts.filter(a => a.severity === 'Critical').length})
            </button>
            <button
              className={`px-3 py-1 text-xs rounded ${alertFilter === 'Warning' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setAlertFilter('Warning')}
            >
              Warning ({alerts.filter(a => a.severity === 'Warning').length})
            </button>
            <button
              className={`px-3 py-1 text-xs rounded ${alertFilter === 'Escalated' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setAlertFilter('Escalated')}
            >
              Escalated ({alerts.filter(a => a.severity === 'Escalated').length})
            </button>
          </div>
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center space-x-3">
                <div className="text-lg">{getSeverityIcon(alert.severity)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-xs text-gray-500">{alert.subLabel}</p>
                </div>
                <Badge variant={getSeverityColor(alert.severity) as any}>{alert.severity}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent task assignments */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent task assignments</h3>
            <Button size="sm" onClick={() => navigate('/chairman/task-assignment')}>Assign task +</Button>
          </div>
          <TaskTable tasks={data.recentTasks.slice(0, 5)} />
        </div>

        {/* Pending approvals */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4">Pending approvals</h3>
          <div className="space-y-3">
            {pendingApprovalsList.map((approval) => (
              <div key={approval.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    {approval.submitter.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{approval.title}</p>
                    <p className="text-xs text-gray-500">{approval.submitter} • {approval.amount}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="primary" 
                    onClick={() => handleApprove(approval.id)}
                    disabled={processingApproval === approval.id}
                    loading={processingApproval === approval.id}
                  >
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger" 
                    onClick={() => handleReject(approval.id)}
                    disabled={processingApproval === approval.id}
                    loading={processingApproval === approval.id}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChairmanOverview;
