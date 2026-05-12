import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import TaskTable from '../../components/tables/TaskTable';

import * as taskService from '../../services/taskService';

import { setTasks } from '../../store/taskSlice';
import {
  useAppDispatch,
  useAppSelector
} from '../../store/hooks';

function AssignedTasks() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const tasks = useAppSelector(
    (state) => state.tasks.tasks
  );

  const tasksQuery = useQuery({
    queryKey: ['tasks', 'my-tasks'],
    queryFn: taskService.getMyTasks
  });

  useEffect(() => {
    if (tasksQuery.data) {
      dispatch(setTasks(tasksQuery.data));
    }
  }, [dispatch, tasksQuery.data]);

  return (
    <section className="min-h-screen space-y-6 bg-[#F5F7FB] p-6">
      
      {/* Header */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
          Department Tasks
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-slate-950">
          Assigned Tasks
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Review your queue and open any task to inspect the full history timeline.
        </p>
      </div>

      {/* Table */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <TaskTable
          emptyMessage="Tasks assigned to your department will appear here."
          onRowClick={(task) =>
            navigate(`/task/${task.id}`)
          }
          tasks={tasks}
        />
      </div>
    </section>
  );
}

export default AssignedTasks;
