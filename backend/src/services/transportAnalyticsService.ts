import { Op } from 'sequelize';
import { Department, Task, User } from '../models';

const safePercentage = (part: number, total: number) =>
  total === 0 ? 0 : Number(((part / total) * 100).toFixed(2));

interface TransportAnalytics {
  completionRate: number;
  delayPercentage: number;
  routeEfficiency: number;
  taskDistribution: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    delayed: number;
  };
  vehicleCoordination: {
    vehiclesManaged: number;
    routesOptimized: number;
    maintenanceTracking: number;
  };
  monthlyPerformance: Array<{
    month: string;
    completed: number;
    delayed: number;
    total: number;
  }>;
}

export const getTransportAnalytics = async (transportId: number): Promise<TransportAnalytics> => {
  try {
    const tasks = await Task.findAll({
      where: { assigned_to: transportId },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'assignedBy',
          attributes: ['id', 'name', 'role']
        }
      ],
      order: [['due_date', 'ASC']]
    });

    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'COMPLETED').length;
    const delayed = tasks.filter((task) => task.status === 'DELAYED' || task.status === 'ESCALATED').length;
    const inProgress = tasks.filter((task) => task.status === 'IN_PROGRESS').length;
    const pending = tasks.filter((task) => task.status === 'PENDING').length;

    const monthlyPerformance = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      const month = date.toLocaleString('en', { month: 'short' });
      const monthTasks = tasks.filter((task) => {
        const due = new Date(task.due_date);
        return due.getMonth() === date.getMonth() && due.getFullYear() === date.getFullYear();
      });
      return {
        month,
        completed: monthTasks.filter((task) => task.status === 'COMPLETED').length,
        delayed: monthTasks.filter((task) => task.status === 'DELAYED' || task.status === 'ESCALATED').length,
        total: monthTasks.length
      };
    });

    const vehiclesManaged = completed;
    const routesOptimized = completed + inProgress;
    const maintenanceTracking = delayed;

    console.log(`Transport Analytics for user ${transportId}: total=${total}, completed=${completed}, delayed=${delayed}, inProgress=${inProgress}, pending=${pending}`);

    return {
      completionRate: safePercentage(completed, total),
      delayPercentage: safePercentage(delayed, total),
      routeEfficiency: Number((safePercentage(completed, total) - safePercentage(delayed, total) * 0.15).toFixed(2)),
      taskDistribution: { total, pending, inProgress, completed, delayed },
      vehicleCoordination: {
        vehiclesManaged,
        routesOptimized,
        maintenanceTracking
      },
      monthlyPerformance
    };
  } catch (error) {
    console.error(`Error fetching Transport analytics for user ${transportId}:`, error);
    throw error;
  }
};

export const getTransportDelayAlerts = async (transportId: number) => {
  try {
    const now = new Date();
    const soon = new Date();
    soon.setDate(soon.getDate() + 3);

    const tasks = await Task.findAll({
      where: {
        assigned_to: transportId,
        status: { [Op.ne]: 'COMPLETED' },
        due_date: { [Op.lte]: soon }
      },
      include: [
        {
          model: User,
          as: 'assignedBy',
          attributes: ['id', 'name']
        }
      ],
      order: [['due_date', 'ASC']]
    });

    const alerts = tasks.map((task) => {
      const due = new Date(task.due_date);
      const overdue = due < now || task.status === 'DELAYED' || task.status === 'ESCALATED';
      return {
        id: task.id,
        title: task.title,
        dueDate: task.due_date,
        status: task.status,
        severity: task.status === 'ESCALATED' ? 'Escalated' : overdue ? 'Overdue' : 'Approaching',
        assignedBy: task.assignedBy?.name ?? 'Management'
      };
    });

    console.log(`Transport delay alerts for user ${transportId}: ${alerts.length} tasks found`);
    return alerts;
  } catch (error) {
    console.error(`Error fetching Transport delay alerts for user ${transportId}:`, error);
    throw error;
  }
};