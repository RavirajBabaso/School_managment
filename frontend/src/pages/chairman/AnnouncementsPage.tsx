import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import * as announcementService from '../../services/announcementService';
import * as userService from '../../services/userService';
import type { AnnouncementTarget } from '../../types/notification.types';
import type { User } from '../../types/user.types';

type DepartmentOption = {
  id: number;
  name: string;
};

type UserWithDepartment = User & {
  department?: {
    id: number;
    name: string;
  };
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function getAnnouncementTitle(message: string) {
  const trimmed = message.trim();
  if (!trimmed) {
    return 'Untitled announcement';
  }

  return trimmed.length > 48 ? `${trimmed.slice(0, 48)}...` : trimmed;
}

function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const [target, setTarget] = useState<AnnouncementTarget>('ALL');
  const [departmentId, setDepartmentId] = useState('');
  const [message, setMessage] = useState('');

  const announcementsQuery = useQuery({
    queryKey: ['announcements'],
    queryFn: announcementService.getAnnouncements
  });

  const usersQuery = useQuery({
    queryKey: ['users', 'announcement-departments'],
    queryFn: () => userService.getAllUsers()
  });

  const departmentOptions = useMemo(() => {
    const source = (usersQuery.data ?? []) as UserWithDepartment[];
    const uniqueDepartments = new Map<number, DepartmentOption>();

    source.forEach((user) => {
      const department = user.department;
      if (department?.id && !uniqueDepartments.has(department.id)) {
        uniqueDepartments.set(department.id, {
          id: department.id,
          name: department.name
        });
      }
    });

    return Array.from(uniqueDepartments.values()).sort((left, right) =>
      left.name.localeCompare(right.name)
    );
  }, [usersQuery.data]);

  const createAnnouncementMutation = useMutation({
    mutationFn: announcementService.createAnnouncement,
    onSuccess: async () => {
      setMessage('');
      setTarget('ALL');
      setDepartmentId('');
      toast.success('Announcement broadcast successfully.');
      await queryClient.invalidateQueries({ queryKey: ['announcements'] });
    }
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      toast.error('Enter a message before broadcasting.');
      return;
    }

    if (target === 'DEPARTMENT' && !departmentId) {
      toast.error('Choose a department for a targeted message.');
      return;
    }

    await createAnnouncementMutation.mutateAsync({
      message: message.trim(),
      target,
      department_id: target === 'DEPARTMENT' ? Number(departmentId) : undefined
    });
  };

  return (
  <div className="space-y-6">
    {/* Header */}
    <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            Communication center
          </p>

          <h1 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
            Announcements
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            Broadcast important updates, instructions and notifications across departments.
          </p>
        </div>

        <Badge variant="blue">
          Chairman Control
        </Badge>
      </div>
    </section>

    {/* Main Grid */}
    <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
      {/* Broadcast Panel */}
      <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
            Broadcast panel
          </p>

          <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
            Create Announcement
          </h2>
        </div>

        <form
          className="mt-6 space-y-5"
          onSubmit={(event) => void handleSubmit(event)}
        >
          {/* Target */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Target Audience
            </span>

            <select
              className="min-h-[46px] rounded-[14px] border border-[var(--border-color)] bg-[var(--surface)] px-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#185FA5]"
              onChange={(event) =>
                setTarget(event.target.value as AnnouncementTarget)
              }
              value={target}
            >
              <option value="ALL">All Staff</option>
              <option value="DEPARTMENT">
                Specific Department
              </option>
            </select>
          </label>

          {/* Department */}
          {target === 'DEPARTMENT' ? (
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                Department
              </span>

              <select
                className="min-h-[46px] rounded-[14px] border border-[var(--border-color)] bg-[var(--surface)] px-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#185FA5]"
                onChange={(event) =>
                  setDepartmentId(event.target.value)
                }
                value={departmentId}
              >
                <option value="">
                  Select department
                </option>

                {departmentOptions.map((department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {/* Message */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Message
            </span>

            <textarea
              className="min-h-[240px] rounded-[18px] border border-[var(--border-color)] bg-[var(--surface)] px-4 py-4 text-sm leading-6 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[#185FA5]"
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Share updates, instructions or important institutional announcements..."
              value={message}
            />
          </label>

          <div className="flex justify-end">
            <Button
              loading={createAnnouncementMutation.isPending}
              type="submit"
            >
              Broadcast Now
            </Button>
          </div>
        </form>
      </section>

      {/* Recent Announcements */}
      <section className="rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
              Communication log
            </p>

            <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
              Recent Announcements
            </h2>
          </div>

          <span className="rounded-full bg-[#EDF9F1] px-3 py-1 text-xs font-semibold text-[#1D9E75]">
            {announcementsQuery.data?.length ?? 0} items
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {announcementsQuery.data &&
          announcementsQuery.data.length > 0 ? (
            announcementsQuery.data.map(
              (announcement) => (
                <div
                  key={announcement.id}
                  className="rounded-[20px] border border-[var(--border-color)] bg-[var(--surface)] p-5 transition hover:bg-[var(--bg-tertiary)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-[var(--text-primary)]">
                        {getAnnouncementTitle(
                          announcement.message
                        )}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                        {announcement.message}
                      </p>
                    </div>

                    <Badge
                      variant={
                        announcement.target === 'ALL'
                          ? 'blue'
                          : 'amber'
                      }
                    >
                      {announcement.target === 'ALL'
                        ? 'All Staff'
                        : announcement.department?.name ??
                          'Department'}
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-[var(--text-secondary)]">
                      {formatDate(
                        announcement.created_at
                      )}
                    </p>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="rounded-[20px] border border-dashed border-[var(--border-color)] bg-[var(--surface)] px-4 py-12 text-center text-sm text-[var(--text-secondary)]">
              No announcements broadcast yet.
            </div>
          )}
        </div>
      </section>
    </div>
  </div>
);
}

export default AnnouncementsPage;
