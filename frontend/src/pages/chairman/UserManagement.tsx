import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserTable from '../../components/tables/UserTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import type { User } from '../../types/user.types';
import { ROLES, ROLE_LABELS, DEPARTMENT_HEAD_ROLES } from '../../constants/roles';
import api from '../../services/api';

interface AddUserForm {
  name: string;
  email: string;
  role: string;
  department_id: number | null;
  password: string;
}

interface EditUserForm {
  name: string;
  email: string;
  department_id: number | null;
  password?: string;
}

interface Department {
  id: number;
  name: string;
}

const UserManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addForm, setAddForm] = useState<AddUserForm>({
    name: '',
    email: '',
    role: '',
    department_id: null,
    password: '',
  });
  const [editForm, setEditForm] = useState<EditUserForm>({
    name: '',
    email: '',
    department_id: null,
  });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data.data as User[];
    },
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.get('/departments');
      return response.data.data as Department[];
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (userData: AddUserForm) => {
      const response = await api.post('/users', userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsAddModalOpen(false);
      setAddForm({ name: '', email: '', role: '', department_id: null, password: '' });
      setAddErrors({});
      alert('User added successfully');
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setAddErrors(error.response.data.errors);
      } else {
        alert('Failed to add user');
      }
    },
  });

  const editUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: number; userData: EditUserForm }) => {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setEditErrors({});
      alert('User updated successfully');
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setEditErrors(error.response.data.errors);
      } else {
        alert('Failed to update user');
      }
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeactivateModalOpen(false);
      setSelectedUser(null);
      alert('User deactivated successfully');
    },
    onError: () => {
      alert('Failed to deactivate user');
    },
  });

  const handleAddUser = () => {
    addUserMutation.mutate(addForm);
  };

  const handleEditUser = () => {
    if (selectedUser) {
      editUserMutation.mutate({ id: selectedUser.id, userData: editForm });
    }
  };

  const handleDeactivateUser = () => {
    if (selectedUser) {
      deactivateUserMutation.mutate(selectedUser.id);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      department_id: user.department_id,
    });
    setIsEditModalOpen(true);
  };

  const openDeactivateModal = (user: User) => {
    setSelectedUser(user);
    setIsDeactivateModalOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto rounded-[22px] border border-slate-800 bg-[#111827]">
  <table className="min-w-full divide-y divide-slate-800 text-left">
    {/* Header */}
    <thead className="bg-[#0F172A]">
      <tr>
        <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Name
        </th>

        <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Role
        </th>

        <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Department
        </th>

        <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Email
        </th>

        <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Status
        </th>

        <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Actions
        </th>
      </tr>
    </thead>

    {/* Body */}
    <tbody className="divide-y divide-slate-800 bg-[#111827]">
      {users.map((user) => (
        <tr
          key={user.id}
          className="transition hover:bg-[#172036]"
        >
          {/* Name */}
          <td className="px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1E293B] text-sm font-semibold text-white">
                {user.name
                  .split(' ')
                  .map((word) => word[0])
                  .join('')
                  .slice(0, 2)}
              </div>

              <div>
                <p className="font-medium text-white">
                  {user.name}
                </p>
              </div>
            </div>
          </td>

          {/* Role */}
          <td className="px-6 py-5 text-sm font-medium text-slate-300">
            {user.role}
          </td>

          {/* Department */}
          <td className="px-6 py-5 text-sm text-slate-400">
            {user.department?.name || '--'}
          </td>

          {/* Email */}
          <td className="px-6 py-5 text-sm text-slate-300">
            {user.email}
          </td>

          {/* Status */}
          <td className="px-6 py-5">
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
              Active
            </span>
          </td>

          {/* Actions */}
          <td className="px-6 py-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onEdit(user)}
                className="rounded-xl bg-[#1E293B] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#334155]"
              >
                Edit
              </button>

              <button
                onClick={() => onDeactivate(user)}
                className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
              >
                Deactivate
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
};

export default UserManagement;
