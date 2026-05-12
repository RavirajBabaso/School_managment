import type { User } from '../../types/user.types';

import Badge from '../common/Badge';
import Button from '../common/Button';

interface UserTableProps {
  onDeactivate?: (user: User) => void;
  onEdit?: (user: User) => void;
  users: User[];
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase() ?? ''
    )
    .join('');

function UserTable({
  onDeactivate,
  onEdit,
  users
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-[24px] border border-slate-200 bg-white p-8">
        <p className="text-sm text-slate-600">
          No users found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          
          {/* Header */}
          <thead className="bg-[#F8FAFC]">
            <tr>
              {[
                'Name',
                'Role',
                'Department',
                'Email',
                'Status',
                'Actions'
              ].map((heading) => (
                <th
                  className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600"
                  key={heading}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-200">
            {users.map((user) => (
              <tr
                className="transition hover:bg-[#EEF4FF]"
                key={user.id}
              >
                {/* Name */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    
                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-[#F8FAFC] text-sm font-semibold text-slate-950">
                      {getInitials(user.name)}
                    </div>

                    {/* Name */}
                    <span className="text-sm font-semibold text-slate-950">
                      {user.name}
                    </span>
                  </div>
                </td>

                {/* Role */}
                <td className="px-5 py-4 text-sm text-slate-700">
                  {user.role}
                </td>

                {/* Department */}
                <td className="px-5 py-4 text-sm text-slate-700">
                  {user.departmentName ??
                    '--'}
                </td>

                {/* Email */}
                <td className="px-5 py-4 text-sm text-slate-700">
                  {user.email}
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <Badge
                    variant={
                      user.is_active
                        ? 'green'
                        : 'gray'
                    }
                  >
                    {user.is_active
                      ? 'Active'
                      : 'Inactive'}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    
                    {/* Edit */}
                    <Button
                      onClick={() =>
                        onEdit?.(user)
                      }
                      size="sm"
                      variant="ghost"
                    >
                      Edit
                    </Button>

                    {/* Deactivate */}
                    <Button
                      onClick={() =>
                        onDeactivate?.(user)
                      }
                      size="sm"
                      variant="danger"
                    >
                      Deactivate
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;
