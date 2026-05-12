import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/common/Button';
import { usePrincipalNotifications } from '../../hooks/usePrincipal';
import * as principalService from '../../services/principalService';

function Notifications() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = usePrincipalNotifications();

  const markRead = useMutation({
    mutationFn: principalService.markPrincipalNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['principal-notifications'] })
  });

  const markAllRead = useMutation({
    mutationFn: principalService.markAllPrincipalNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['principal-notifications'] })
  });

  return (
    <section className="rounded-[26px] border border-[#EFF2F6] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Real-time notifications</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">Principal Notifications</h1>
        </div>
        <Button onClick={() => markAllRead.mutate()} size="sm" variant="ghost">Mark all as read</Button>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? <p className="text-sm text-slate-500">Loading notifications...</p> : null}
        {data.map((item) => (
          <div className={`rounded-[20px] border p-4 ${item.is_read ? 'border-[#EFF2F6] bg-[#F8FAFC]' : 'border-[#185FA5]/30 bg-[#185FA5]/5'}`} key={item.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-slate-950">{item.message}</p>
                <p className="mt-1 text-xs text-slate-500">{item.type} - {new Date(item.created_at).toLocaleString('en-IN')}</p>
              </div>
              {!item.is_read ? (
                <Button onClick={() => markRead.mutate(item.id)} size="sm" variant="ghost">Mark read</Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Notifications;
