import { FormEvent, useMemo, useState } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { useSocket } from '../../hooks/useSocket';

type AdminRole =
  | 'Super Admin'
  | 'Office Admin'
  | 'Principal'
  | 'HOD'
  | 'Teacher'
  | 'Non-teaching staff';

type StaffStatus = 'Active' | 'Inactive';
type TaskPriority = 'High' | 'Medium' | 'Low';
type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

interface StaffMember {
  id: number;
  employeeId: string;
  name: string;
  department: string;
  role: AdminRole;
  email: string;
  phone: string;
  joiningDate: string;
  qualification: string;
  status: StaffStatus;
}

interface OfficeTask {
  id: number;
  title: string;
  assignee: string;
  department: string;
  priority: TaskPriority;
  deadline: string;
  status: TaskStatus;
  attachment: string;
  comments: string[];
  history: string[];
}

interface AttendanceRecord {
  id: number;
  staff: string;
  department: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'On Leave';
}

interface LeaveRequest {
  id: number;
  staff: string;
  type: 'Casual' | 'Sick' | 'Paid' | 'Emergency';
  dates: string;
  balance: number;
  status: LeaveStatus;
}

interface DepartmentRecord {
  id: number;
  name: string;
  hod: string;
  staffCount: number;
  completion: number;
}

interface DocumentRecord {
  id: number;
  title: string;
  category: string;
  owner: string;
  access: string;
  updated: string;
}

const initialStaff: StaffMember[] = [
  {
    id: 1,
    employeeId: 'ADM-001',
    name: 'Anita Rao',
    department: 'Admin Office',
    role: 'Office Admin',
    email: 'anita.rao@adhira.edu',
    phone: '9876543210',
    joiningDate: '2021-06-14',
    qualification: 'MBA',
    status: 'Active'
  },
  {
    id: 2,
    employeeId: 'TCH-114',
    name: 'Karthik Menon',
    department: 'Mathematics',
    role: 'Teacher',
    email: 'karthik.menon@adhira.edu',
    phone: '9876543211',
    joiningDate: '2020-07-02',
    qualification: 'M.Sc, B.Ed',
    status: 'Active'
  },
  {
    id: 3,
    employeeId: 'NST-021',
    name: 'Ravi Kumar',
    department: 'Transport',
    role: 'Non-teaching staff',
    email: 'ravi.kumar@adhira.edu',
    phone: '9876543212',
    joiningDate: '2019-03-18',
    qualification: 'Diploma',
    status: 'Inactive'
  }
];

const officeTasks: OfficeTask[] = [
  {
    id: 1,
    title: 'Prepare staff ID distribution list',
    assignee: 'Anita Rao',
    department: 'Admin Office',
    priority: 'High',
    deadline: 'May 14, 2026',
    status: 'In Progress',
    attachment: 'id-card-list.xlsx',
    comments: ['Verify new joiners before final print.'],
    history: ['Created by Super Admin', 'Assigned to Admin Office']
  },
  {
    id: 2,
    title: 'Collect monthly attendance corrections',
    assignee: 'Karthik Menon',
    department: 'Mathematics',
    priority: 'Medium',
    deadline: 'May 18, 2026',
    status: 'Pending',
    attachment: 'attendance-format.pdf',
    comments: ['HOD review pending.'],
    history: ['Reminder scheduled for May 16']
  },
  {
    id: 3,
    title: 'Renew transport document register',
    assignee: 'Ravi Kumar',
    department: 'Transport',
    priority: 'Low',
    deadline: 'May 08, 2026',
    status: 'Overdue',
    attachment: 'transport-register.docx',
    comments: ['Waiting for vehicle list.'],
    history: ['Deadline crossed', 'Escalated to office admin']
  }
];

const attendanceRecords: AttendanceRecord[] = [
  { id: 1, staff: 'Anita Rao', department: 'Admin Office', checkIn: '08:42 AM', checkOut: '04:45 PM', status: 'Present' },
  { id: 2, staff: 'Karthik Menon', department: 'Mathematics', checkIn: '09:18 AM', checkOut: '04:30 PM', status: 'Late' },
  { id: 3, staff: 'Ravi Kumar', department: 'Transport', checkIn: '--', checkOut: '--', status: 'On Leave' }
];

const leaveRequests: LeaveRequest[] = [
  { id: 1, staff: 'Anita Rao', type: 'Casual', dates: 'May 17', balance: 8, status: 'Pending' },
  { id: 2, staff: 'Karthik Menon', type: 'Sick', dates: 'May 10-11', balance: 5, status: 'Approved' },
  { id: 3, staff: 'Ravi Kumar', type: 'Emergency', dates: 'May 12', balance: 2, status: 'Pending' }
];

const departments: DepartmentRecord[] = [
  { id: 1, name: 'Admin Office', hod: 'Anita Rao', staffCount: 12, completion: 86 },
  { id: 2, name: 'Mathematics', hod: 'Karthik Menon', staffCount: 18, completion: 74 },
  { id: 3, name: 'Transport', hod: 'Ravi Kumar', staffCount: 9, completion: 61 },
  { id: 4, name: 'Finance', hod: 'Meera Shah', staffCount: 7, completion: 79 }
];

const documents: DocumentRecord[] = [
  { id: 1, title: 'Staff joining checklist', category: 'HR', owner: 'Anita Rao', access: 'Office Admin', updated: 'May 10, 2026' },
  { id: 2, title: 'Attendance correction format', category: 'Attendance', owner: 'Karthik Menon', access: 'HOD', updated: 'May 09, 2026' },
  { id: 3, title: 'Transport compliance file', category: 'Compliance', owner: 'Ravi Kumar', access: 'Super Admin', updated: 'May 07, 2026' }
];

const activities = [
  'Anita Rao approved staff document verification',
  'Monthly attendance report generated',
  'New circular sent to all HODs',
  'Leave request received from Transport department'
];

const notifications = [
  { title: 'Two leave approvals pending', tone: 'amber' },
  { title: 'Transport task overdue', tone: 'red' },
  { title: 'New staff profile activated', tone: 'green' }
];

const roleOptions: AdminRole[] = [
  'Super Admin',
  'Office Admin',
  'Principal',
  'HOD',
  'Teacher',
  'Non-teaching staff'
];

const statusClass = (status: string) => {
  if (status === 'Active' || status === 'Completed' || status === 'Approved' || status === 'Present') {
    return 'bg-[#F0FDF4] text-[#16A34A]';
  }

  if (status === 'Overdue' || status === 'Rejected' || status === 'Late') {
    return 'bg-[#FEF2F2] text-[#DC2626]';
  }

  if (status === 'In Progress') {
    return 'bg-[#EFF6FF] text-[#2563EB]';
  }

  return 'bg-[#FFFBEB] text-[#D97706]';
};

const priorityClass = (priority: TaskPriority) => {
  if (priority === 'High') {
    return 'bg-[#FEF2F2] text-[#DC2626]';
  }

  if (priority === 'Medium') {
    return 'bg-[#FFFBEB] text-[#D97706]';
  }

  return 'bg-[#F0FDF4] text-[#16A34A]';
};

function ShellCard({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[26px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
  action
}: {
  action?: React.ReactNode;
  description?: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--text-secondary)]">{eyebrow}</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function MiniBarChart({ values }: { values: Array<{ label: string; value: number; color: string }> }) {
  return (
    <div className="flex h-44 items-end gap-3 rounded-[20px] border border-[var(--border-color)] bg-[var(--surface)] p-4">
      {values.map((item) => (
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={item.label}>
          <div className="flex h-28 w-full items-end rounded-full bg-white">
            <div
              className="w-full rounded-full transition-all"
              style={{ backgroundColor: item.color, height: `${item.value}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function AdminOverview({
  staff
}: {
  staff: StaffMember[];
}) {
  const activeTasks = officeTasks.filter((task) => task.status !== 'Completed').length;
  const pendingLeaves = leaveRequests.filter((leave) => leave.status === 'Pending').length;
  const presentCount = attendanceRecords.filter((item) => item.status === 'Present').length;

  const kpis = [
    { label: 'Total staff', value: staff.length, sub: 'Active directory', color: '#185FA5' },
    { label: 'Active tasks', value: activeTasks, sub: 'Open workflow', color: '#2563EB' },
    { label: 'Pending approvals', value: pendingLeaves, sub: 'Leave queue', color: '#D97706' },
    { label: 'Attendance', value: `${presentCount}/${attendanceRecords.length}`, sub: 'Present today', color: '#16A34A' }
  ];

  return (
    <div className="space-y-6">
      <ShellCard>
        <SectionTitle
          eyebrow="Admin office dashboard"
          title="Office operations command center"
          description="Manage staff records, task flow, attendance, leave approvals, circulars, reports, and secure documents from one role-based office panel."
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((metric) => (
            <div className="rounded-[22px] border border-[var(--border-color)] bg-[var(--surface)] p-4" key={metric.label}>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">{metric.label}</p>
              <p className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{metric.value}</p>
              <p className="mt-1 text-xs" style={{ color: metric.color }}>{metric.sub}</p>
            </div>
          ))}
        </div>
      </ShellCard>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ShellCard>
          <SectionTitle eyebrow="Task progress" title="Workflow analytics" />
          <div className="mt-5">
            <MiniBarChart
              values={[
                { label: 'Tasks', value: 78, color: '#185FA5' },
                { label: 'Attend', value: 84, color: '#16A34A' },
                { label: 'Leaves', value: 42, color: '#D97706' },
                { label: 'Docs', value: 66, color: '#0EA5A4' }
              ]}
            />
          </div>
        </ShellCard>

        <ShellCard>
          <SectionTitle eyebrow="Calendar" title="May 2026" />
          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <span className="font-semibold text-[var(--text-secondary)]" key={`${day}-${index}`}>{day}</span>
            ))}
            {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
              <span
                className={`rounded-full py-2 ${[12, 17, 20].includes(day) ? 'bg-[#185FA5] font-semibold text-white' : 'bg-[var(--surface)] text-[var(--text-primary)]'}`}
                key={day}
              >
                {day}
              </span>
            ))}
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ShellCard className="xl:col-span-1">
          <SectionTitle eyebrow="Departments" title="Department statistics" />
          <div className="mt-5 space-y-4">
            {departments.map((department) => (
              <div key={department.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--text-primary)]">{department.name}</span>
                  <span className="text-[var(--text-secondary)]">{department.completion}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[var(--surface)]">
                  <div className="h-full rounded-full bg-[#185FA5]" style={{ width: `${department.completion}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard>
          <SectionTitle eyebrow="Activity log" title="Recent activities" />
          <div className="mt-5 space-y-4">
            {activities.map((activity, index) => (
              <div className="flex items-start gap-3" key={activity}>
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#185FA5]" />
                <p className="text-sm text-[var(--text-secondary)]">{activity}</p>
                <span className="ml-auto text-xs text-[var(--text-secondary)]">{index + 1}h</span>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard>
          <SectionTitle eyebrow="Notifications" title="Office alerts" />
          <div className="mt-5 space-y-3">
            {notifications.map((item) => (
              <div className="rounded-[18px] border border-[var(--border-color)] bg-[var(--surface)] p-4" key={item.title}>
                <p className="text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass(item.tone === 'red' ? 'Overdue' : item.tone === 'green' ? 'Approved' : 'Pending')}`}>
                  {item.tone}
                </span>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function StaffManagement({
  onAddStaff,
  staff
}: {
  onAddStaff: (staff: StaffMember) => void;
  staff: StaffMember[];
}) {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('All');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(staff[0] ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    employeeId: '',
    name: '',
    department: 'Admin Office',
    role: 'Teacher' as AdminRole,
    email: '',
    phone: '',
    joiningDate: '',
    qualification: '',
    status: 'Active' as StaffStatus
  });

  const departmentOptions = ['All', ...Array.from(new Set(staff.map((item) => item.department)))];
  const filteredStaff = staff.filter((member) => {
    const matchesQuery = `${member.employeeId} ${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase());
    const matchesDepartment = department === 'All' || member.department === department;
    return matchesQuery && matchesDepartment;
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextStaff = {
      id: Date.now(),
      ...form
    };
    onAddStaff(nextStaff);
    setSelectedStaff(nextStaff);
    setIsOpen(false);
    setForm({
      employeeId: '',
      name: '',
      department: 'Admin Office',
      role: 'Teacher',
      email: '',
      phone: '',
      joiningDate: '',
      qualification: '',
      status: 'Active'
    });
  };

  return (
    <>
      <div className="space-y-6">
        <ShellCard>
          <SectionTitle
            eyebrow="Staff management"
            title="Staff directory and role assignment"
            description="Create, edit, filter, import, export, activate, and review staff profiles from the office directory."
            action={<Button onClick={() => setIsOpen(true)}>Add Staff</Button>}
          />

          <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_220px_auto_auto]">
            <Input label="Search staff" onChange={(event) => setQuery(event.target.value)} placeholder="Employee ID, name, or email" value={query} />
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">Department</span>
              <select
                className="min-h-[46px] rounded-[14px] border border-slate-300 bg-[#F8FAFC] px-4 text-sm text-slate-950"
                onChange={(event) => setDepartment(event.target.value)}
                value={department}
              >
                {departmentOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <Button className="self-end" variant="ghost">Bulk Import</Button>
            <Button className="self-end" variant="ghost">Export</Button>
          </div>
        </ShellCard>

        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <ShellCard>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--border-color)] text-left text-sm">
                <thead className="bg-[var(--surface)] text-[var(--text-secondary)]">
                  <tr>
                    {['Employee', 'Department', 'Role', 'Contact', 'Status', 'Actions'].map((heading) => (
                      <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.22em]" key={heading}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {filteredStaff.map((member) => (
                    <tr className="hover:bg-[var(--surface)]" key={member.id}>
                      <td className="px-4 py-4">
                        <button className="text-left" onClick={() => setSelectedStaff(member)} type="button">
                          <span className="block font-semibold text-[var(--text-primary)]">{member.name}</span>
                          <span className="text-xs text-[var(--text-secondary)]">{member.employeeId}</span>
                        </button>
                      </td>
                      <td className="px-4 py-4 text-[var(--text-secondary)]">{member.department}</td>
                      <td className="px-4 py-4 text-[var(--text-secondary)]">{member.role}</td>
                      <td className="px-4 py-4 text-[var(--text-secondary)]">{member.email}</td>
                      <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(member.status)}`}>{member.status}</span></td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">Edit</Button>
                          <Button size="sm" variant={member.status === 'Active' ? 'danger' : 'ghost'}>
                            {member.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ShellCard>

          <ShellCard>
            <SectionTitle eyebrow="Profile" title={selectedStaff?.name ?? 'Select staff'} />
            {selectedStaff ? (
              <div className="mt-5 space-y-4 text-sm">
                {[
                  ['Employee ID', selectedStaff.employeeId],
                  ['Role', selectedStaff.role],
                  ['Department', selectedStaff.department],
                  ['Phone', selectedStaff.phone],
                  ['Joining date', selectedStaff.joiningDate],
                  ['Qualification', selectedStaff.qualification],
                  ['Status', selectedStaff.status]
                ].map(([label, value]) => (
                  <div className="flex justify-between gap-4 border-b border-[var(--border-color)] pb-3" key={label}>
                    <span className="text-[var(--text-secondary)]">{label}</span>
                    <span className="font-medium text-[var(--text-primary)]">{value}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </ShellCard>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Staff">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Employee ID" onChange={(event) => setForm({ ...form, employeeId: event.target.value })} required value={form.employeeId} />
            <Input label="Name" onChange={(event) => setForm({ ...form, name: event.target.value })} required value={form.name} />
            <Input label="Email" onChange={(event) => setForm({ ...form, email: event.target.value })} required type="email" value={form.email} />
            <Input label="Phone" onChange={(event) => setForm({ ...form, phone: event.target.value })} required value={form.phone} />
            <Input label="Department" onChange={(event) => setForm({ ...form, department: event.target.value })} required value={form.department} />
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <select
                className="min-h-[46px] rounded-[14px] border border-slate-300 bg-[#F8FAFC] px-4 text-sm text-slate-950"
                onChange={(event) => setForm({ ...form, role: event.target.value as AdminRole })}
                value={form.role}
              >
                {roleOptions.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>
            <Input label="Joining date" onChange={(event) => setForm({ ...form, joiningDate: event.target.value })} required type="date" value={form.joiningDate} />
            <Input label="Qualification" onChange={(event) => setForm({ ...form, qualification: event.target.value })} required value={form.qualification} />
          </div>
          <Button className="w-full">Save Staff</Button>
        </form>
      </Modal>
    </>
  );
}

function StudentsPage() {
  const students = [
    { id: 'STU-1001', name: 'Nila Sharma', className: 'Grade 8A', guardian: 'Raj Sharma', status: 'Active' },
    { id: 'STU-1002', name: 'Arjun Pillai', className: 'Grade 9B', guardian: 'Leena Pillai', status: 'Active' },
    { id: 'STU-1003', name: 'Sara Khan', className: 'Grade 7C', guardian: 'Imran Khan', status: 'Transfer Pending' }
  ];

  return (
    <ShellCard>
      <SectionTitle eyebrow="Student records" title="Student information register" description="Search student records, guardian details, status, and class mapping from the admin office." />
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-color)] text-left text-sm">
          <thead className="bg-[var(--surface)] text-[var(--text-secondary)]">
            <tr>{['Student ID', 'Name', 'Class', 'Guardian', 'Status'].map((heading) => <th className="px-4 py-3 text-[11px] uppercase tracking-[0.22em]" key={heading}>{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-4 font-semibold text-[var(--text-primary)]">{student.id}</td>
                <td className="px-4 py-4 text-[var(--text-secondary)]">{student.name}</td>
                <td className="px-4 py-4 text-[var(--text-secondary)]">{student.className}</td>
                <td className="px-4 py-4 text-[var(--text-secondary)]">{student.guardian}</td>
                <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(student.status === 'Active' ? 'Active' : 'Pending')}`}>{student.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ShellCard>
  );
}

function TaskManagement() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const filteredTasks = statusFilter === 'All' ? officeTasks : officeTasks.filter((task) => task.status === statusFilter);

  return (
    <div className="space-y-6">
      <ShellCard>
        <SectionTitle eyebrow="Task management" title="Task workflow system" description="Create assignments, track priority, deadlines, reminders, attachments, comments, and history logs." action={<Button>Create Task</Button>} />
        <div className="mt-5 flex flex-wrap gap-2">
          {(['All', 'Pending', 'In Progress', 'Completed', 'Overdue'] as const).map((status) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium ${statusFilter === status ? 'bg-[#185FA5] text-white' : 'border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)]'}`}
              key={status}
              onClick={() => setStatusFilter(status)}
              type="button"
            >
              {status}
            </button>
          ))}
        </div>
      </ShellCard>

      <ShellCard>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-color)] text-left text-sm">
            <thead className="bg-[var(--surface)] text-[var(--text-secondary)]">
              <tr>{['Task', 'Assignee', 'Priority', 'Deadline', 'Status', 'Attachment'].map((heading) => <th className="px-4 py-3 text-[11px] uppercase tracking-[0.22em]" key={heading}>{heading}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-[var(--text-primary)]">{task.title}</p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{task.comments[0]} History: {task.history[0]}</p>
                  </td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">{task.assignee}</td>
                  <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClass(task.priority)}`}>{task.priority}</span></td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">{task.deadline}</td>
                  <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(task.status)}`}>{task.status}</span></td>
                  <td className="px-4 py-4 text-[#185FA5]">{task.attachment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ShellCard>
    </div>
  );
}

function AttendancePage() {
  return (
    <div className="space-y-6">
      <ShellCard>
        <SectionTitle eyebrow="Attendance" title="Daily and monthly attendance monitoring" description="Monitor check-in, check-out, late entries, leave integration, and attendance analytics." />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ['Present', '86%', '#16A34A'],
            ['Late entries', '7', '#D97706'],
            ['On leave', '4', '#DC2626']
          ].map(([label, value, color]) => (
            <div className="rounded-[20px] border border-[var(--border-color)] bg-[var(--surface)] p-4" key={label}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)]">{label}</p>
              <p className="mt-3 text-2xl font-semibold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      </ShellCard>
      <RecordsTable
        headings={['Staff', 'Department', 'Check In', 'Check Out', 'Status']}
        rows={attendanceRecords.map((item) => [item.staff, item.department, item.checkIn, item.checkOut, item.status])}
      />
    </div>
  );
}

function LeavePage() {
  const [items, setItems] = useState(leaveRequests);

  const updateLeave = (id: number, status: LeaveStatus) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  };

  return (
    <ShellCard>
      <SectionTitle eyebrow="Leave management" title="Leave approvals and balance tracking" description="Review casual, sick, paid, and emergency leave requests with history and balances." />
      <div className="mt-6 space-y-3">
        {items.map((leave) => (
          <div className="flex flex-col gap-4 rounded-[20px] border border-[var(--border-color)] bg-[var(--surface)] p-4 lg:flex-row lg:items-center" key={leave.id}>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[var(--text-primary)]">{leave.staff}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{leave.type} leave - {leave.dates} - Balance: {leave.balance}</p>
            </div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClass(leave.status)}`}>{leave.status}</span>
            <div className="flex gap-2">
              <Button disabled={leave.status !== 'Pending'} onClick={() => updateLeave(leave.id, 'Approved')} size="sm">Approve</Button>
              <Button disabled={leave.status !== 'Pending'} onClick={() => updateLeave(leave.id, 'Rejected')} size="sm" variant="danger">Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </ShellCard>
  );
}

function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <ShellCard>
        <SectionTitle eyebrow="Department management" title="Departments, HODs, and staff mapping" action={<Button>Add Department</Button>} />
      </ShellCard>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {departments.map((department) => (
          <ShellCard key={department.id}>
            <p className="text-lg font-semibold text-[var(--text-primary)]">{department.name}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">HOD: {department.hod}</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{department.staffCount} staff mapped</p>
            <div className="mt-4 h-2 rounded-full bg-[var(--surface)]">
              <div className="h-full rounded-full bg-[#185FA5]" style={{ width: `${department.completion}%` }} />
            </div>
          </ShellCard>
        ))}
      </div>
    </div>
  );
}

function CircularsPage() {
  const circulars = [
    ['Exam duty circular', 'All HODs', 'Email, Push', '84% read'],
    ['Transport route update', 'Non-teaching staff', 'SMS, Push', '62% read'],
    ['Staff meeting notice', 'All staff', 'Email', '91% read']
  ];

  return (
    <ShellCard>
      <SectionTitle eyebrow="Notifications and circulars" title="Announcements and delivery tracking" description="Create announcements and send via email, SMS, push notifications, with read and unread tracking." action={<Button>Create Circular</Button>} />
      <div className="mt-6">
        <RecordsTable headings={['Circular', 'Audience', 'Channels', 'Read status']} rows={circulars} />
      </div>
    </ShellCard>
  );
}

function ReportsPage() {
  const reports = [
    ['Attendance report', 'May 2026', 'PDF, Excel'],
    ['Task completion report', 'This month', 'PDF, Excel'],
    ['Staff performance report', 'Quarterly', 'PDF'],
    ['Leave report', 'May 2026', 'Excel'],
    ['Department report', 'Academic year', 'PDF, Excel']
  ];

  return (
    <div className="space-y-6">
      <ShellCard>
        <SectionTitle eyebrow="Reports" title="Graphical analytics and exports" description="Generate attendance, task completion, staff performance, leave, and department reports with date filters." />
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <Input label="From" type="date" />
          <Input label="To" type="date" />
          <Button className="self-end">Generate</Button>
        </div>
      </ShellCard>
      <RecordsTable headings={['Report', 'Period', 'Export']} rows={reports} />
    </div>
  );
}

function DocumentsPage() {
  return (
    <ShellCard>
      <SectionTitle eyebrow="Document management" title="Secure staff-wise document access" description="Upload, categorize, download, and control access to office and staff documents." action={<Button>Upload Document</Button>} />
      <div className="mt-6">
        <RecordsTable headings={['Document', 'Category', 'Owner', 'Access', 'Updated']} rows={documents.map((item) => [item.title, item.category, item.owner, item.access, item.updated])} />
      </div>
    </ShellCard>
  );
}

function RecordsTable({
  headings,
  rows
}: {
  headings: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[var(--border-color)] bg-[var(--card-bg)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-color)] text-left text-sm">
          <thead className="bg-[var(--surface)] text-[var(--text-secondary)]">
            <tr>
              {headings.map((heading) => (
                <th className="px-4 py-3 text-[11px] uppercase tracking-[0.22em]" key={heading}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {rows.map((row, rowIndex) => (
              <tr key={row.join('-') || rowIndex}>
                {row.map((cell, index) => (
                  <td className={`px-4 py-4 ${index === 0 ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`} key={`${cell}-${index}`}>
                    {index === row.length - 1 && ['Pending', 'Approved', 'Rejected', 'Present', 'Late', 'On Leave'].includes(cell) ? (
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(cell)}`}>{cell}</span>
                    ) : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminDashboard() {
  useSocket();
  const [staff, setStaff] = useState(initialStaff);

  const addStaff = (member: StaffMember) => {
    setStaff((current) => [member, ...current]);
  };

  const activeStaff = useMemo(() => staff.filter((member) => member.status === 'Active'), [staff]);

  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Navbar />
        <div className="h-full overflow-y-auto p-6">
          <Routes>
            <Route index element={<AdminOverview staff={activeStaff} />} />
            <Route path="staff" element={<StaffManagement onAddStaff={addStaff} staff={staff} />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="tasks" element={<TaskManagement />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="leave" element={<LeavePage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="circulars" element={<CircularsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="notifications" element={<CircularsPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
