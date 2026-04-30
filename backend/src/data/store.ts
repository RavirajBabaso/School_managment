export type MeetingStatus = 'PENDING' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED';
export type MeetingResponse = 'ACCEPTED' | 'DECLINED';
export type NotifType = 'meeting' | 'task' | 'delay';
export type NotifSub = 'new' | 'reminder' | 'reschedule' | 'cancel';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ApprovalType = 'BUDGET' | 'PURCHASE' | 'POLICY' | 'EVENT';
export type CommType = 'broadcast' | 'dept' | 'chairman';

export interface Meeting {
  id: number;
  title: string;
  organizer: string;
  organizerInitials: string;
  date: string;
  time: string;
  venue: string;
  status: MeetingStatus;
  attendees: string[];
  agenda?: string;
}

export interface Notification {
  id: number;
  type: NotifType;
  sub?: NotifSub;
  title: string;
  detail: string;
  time: string;
  tag: string;
  read: boolean;
  mId?: number;
  iconBg: string;
  tagBg: string;
  tagColor: string;
}

export interface Approval {
  id: string;
  title: string;
  type: ApprovalType;
  amount: string;
  date: string;
  status: ApprovalStatus;
  requestedBy?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

export interface Communication {
  id: number;
  type: CommType;
  title: string;
  from: string;
  time: string;
  body: string;
  tag: string;
  unread: boolean;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  tagBg: string;
  tagColor: string;
}

export const MEETINGS: Meeting[] = [
  {
    id: 1,
    title: 'Monthly Department Review',
    organizer: 'Director',
    organizerInitials: 'DR',
    date: '2026-04-30',
    time: '10:00 AM',
    venue: 'Conference Room A',
    status: 'CONFIRMED',
    attendees: ['All Department Heads', 'Teaching Staff'],
    agenda: 'Review monthly progress and discuss upcoming initiatives',
  },
  {
    id: 2,
    title: 'Curriculum Planning Session',
    organizer: 'Director',
    organizerInitials: 'DR',
    date: '2026-05-02',
    time: '2:00 PM',
    venue: 'Library Hall',
    status: 'PENDING',
    attendees: ['Academic Department', 'Curriculum Committee'],
    agenda: 'Plan curriculum updates for next semester',
  },
  {
    id: 3,
    title: 'Parent-Teacher Meeting',
    organizer: 'Director',
    organizerInitials: 'DR',
    date: '2026-05-05',
    time: '9:00 AM',
    venue: 'Auditorium',
    status: 'PENDING',
    attendees: ['All Teachers', 'Parents'],
    agenda: 'Discuss student progress and address concerns',
  },
  {
    id: 4,
    title: 'Budget Review Meeting',
    organizer: 'Director',
    organizerInitials: 'DR',
    date: '2026-05-08',
    time: '11:00 AM',
    venue: 'Board Room',
    status: 'RESCHEDULED',
    attendees: ['Finance Department', 'Department Heads'],
    agenda: 'Review departmental budgets and allocations',
  },
  {
    id: 5,
    title: 'Staff Development Workshop',
    organizer: 'Director',
    organizerInitials: 'DR',
    date: '2026-05-10',
    time: '1:00 PM',
    venue: 'Training Center',
    status: 'CANCELLED',
    attendees: ['All Staff'],
    agenda: 'Professional development and skill enhancement',
  },
];

export const MEETING_RESPONSES: { [meetingId: number]: MeetingResponse } = {};

export const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'meeting',
    sub: 'new',
    title: 'New Meeting Invitation',
    detail: 'Monthly Department Review scheduled for April 30th',
    time: '2 hours ago',
    tag: 'Meeting',
    read: false,
    mId: 1,
    iconBg: '#3B82F6',
    tagBg: '#DBEAFE',
    tagColor: '#1E40AF',
  },
  {
    id: 2,
    type: 'meeting',
    sub: 'reminder',
    title: 'Meeting Reminder',
    detail: 'Curriculum Planning Session starts in 30 minutes',
    time: '30 min ago',
    tag: 'Reminder',
    read: false,
    mId: 2,
    iconBg: '#8B5CF6',
    tagBg: '#EDE9FE',
    tagColor: '#6D28D9',
  },
  {
    id: 3,
    type: 'meeting',
    sub: 'reschedule',
    title: 'Meeting Rescheduled',
    detail: 'Budget Review Meeting moved to May 10th',
    time: '1 hour ago',
    tag: 'Update',
    read: true,
    mId: 4,
    iconBg: '#F59E0B',
    tagBg: '#FEF3C7',
    tagColor: '#D97706',
  },
  {
    id: 4,
    type: 'meeting',
    sub: 'cancel',
    title: 'Meeting Cancelled',
    detail: 'Staff Development Workshop has been cancelled',
    time: '3 hours ago',
    tag: 'Cancelled',
    read: true,
    mId: 5,
    iconBg: '#EF4444',
    tagBg: '#FEE2E2',
    tagColor: '#DC2626',
  },
  {
    id: 5,
    type: 'task',
    title: 'Task Assignment',
    detail: 'New task assigned: Review department reports',
    time: '4 hours ago',
    tag: 'Task',
    read: false,
    iconBg: '#3B82F6',
    tagBg: '#DBEAFE',
    tagColor: '#1E40AF',
  },
  {
    id: 6,
    type: 'task',
    title: 'Task Update',
    detail: 'Task "Update curriculum" is now overdue',
    time: '6 hours ago',
    tag: 'Update',
    read: false,
    iconBg: '#3B82F6',
    tagBg: '#DBEAFE',
    tagColor: '#1E40AF',
  },
  {
    id: 7,
    type: 'delay',
    title: 'Task Delay Alert',
    detail: 'Mathematics department report is 2 days late',
    time: '1 day ago',
    tag: 'Delay',
    read: false,
    iconBg: '#EF4444',
    tagBg: '#FEE2E2',
    tagColor: '#DC2626',
  },
  {
    id: 8,
    type: 'delay',
    title: 'Critical Delay',
    detail: 'Budget approval pending for 5 days',
    time: '2 days ago',
    tag: 'Critical',
    read: true,
    iconBg: '#EF4444',
    tagBg: '#FEE2E2',
    tagColor: '#DC2626',
  },
];

export const APPROVALS: Approval[] = [
  {
    id: 'APR-001',
    title: 'New Computer Lab Equipment',
    type: 'PURCHASE',
    amount: '₹2,50,000',
    date: '2026-04-25',
    status: 'PENDING',
    requestedBy: {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@school.edu',
      role: 'IT Manager'
    },
    createdAt: '2026-04-25T10:00:00Z',
  },
  {
    id: 'APR-002',
    title: 'Annual Sports Budget',
    type: 'BUDGET',
    amount: '₹1,00,000',
    date: '2026-04-20',
    status: 'APPROVED',
    requestedBy: {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      role: 'Sports Coordinator'
    },
    createdAt: '2026-04-20T14:30:00Z',
  },
  {
    id: 'APR-003',
    title: 'Library Renovation Policy',
    type: 'POLICY',
    amount: '₹5,00,000',
    date: '2026-04-15',
    status: 'APPROVED',
    requestedBy: {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@school.edu',
      role: 'Librarian'
    },
    createdAt: '2026-04-15T09:15:00Z',
  },
  {
    id: 'APR-004',
    title: 'Teacher Training Program',
    type: 'EVENT',
    amount: '₹75,000',
    date: '2026-04-10',
    status: 'REJECTED',
    requestedBy: {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@school.edu',
      role: 'HR Manager'
    },
    createdAt: '2026-04-10T11:45:00Z',
  },
  {
    id: 'APR-005',
    title: 'Student Scholarship Fund',
    type: 'BUDGET',
    amount: '₹3,00,000',
    date: '2026-04-05',
    status: 'PENDING',
    requestedBy: {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@school.edu',
      role: 'Finance Officer'
    },
    createdAt: '2026-04-05T16:20:00Z',
  },
];

export const COMMUNICATIONS: Communication[] = [
  {
    id: 1,
    type: 'broadcast',
    title: 'School Holiday Notice',
    from: 'Administration',
    time: '2 hours ago',
    body: 'Due to the upcoming festival, the school will remain closed from May 1st to May 3rd. Classes will resume on May 4th.',
    tag: 'Holiday',
    unread: false,
    initials: 'AD',
    avatarBg: '#3B82F6',
    avatarColor: '#FFFFFF',
    tagBg: '#DBEAFE',
    tagColor: '#1E40AF',
  },
  {
    id: 2,
    type: 'dept',
    title: 'Department Meeting Update',
    from: 'Academic Department',
    time: '4 hours ago',
    body: 'The curriculum review meeting has been rescheduled to next Tuesday. Please confirm your availability.',
    tag: 'Academic',
    unread: false,
    initials: 'AC',
    avatarBg: '#10B981',
    avatarColor: '#FFFFFF',
    tagBg: '#D1FAE5',
    tagColor: '#047857',
  },
  {
    id: 3,
    type: 'chairman',
    title: 'Board Meeting Minutes',
    from: 'Chairman',
    time: '1 day ago',
    body: 'The minutes from yesterday\'s board meeting are now available. Key decisions include budget allocations and policy updates.',
    tag: 'Board',
    unread: true,
    initials: 'CH',
    avatarBg: '#F59E0B',
    avatarColor: '#FFFFFF',
    tagBg: '#FEF3C7',
    tagColor: '#D97706',
  },
  {
    id: 4,
    type: 'broadcast',
    title: 'Parent-Teacher Conference',
    from: 'Administration',
    time: '2 days ago',
    body: 'Parent-teacher conferences will be held next week. Please schedule appointments through the school portal.',
    tag: 'PTC',
    unread: true,
    initials: 'AD',
    avatarBg: '#3B82F6',
    avatarColor: '#FFFFFF',
    tagBg: '#DBEAFE',
    tagColor: '#1E40AF',
  },
  {
    id: 5,
    type: 'dept',
    title: 'Sports Department Update',
    from: 'Sports Department',
    time: '3 days ago',
    body: 'The inter-house sports competition schedule has been finalized. Teams should prepare for the opening ceremony.',
    tag: 'Sports',
    unread: false,
    initials: 'SP',
    avatarBg: '#EF4444',
    avatarColor: '#FFFFFF',
    tagBg: '#FEE2E2',
    tagColor: '#DC2626',
  },
  {
    id: 6,
    type: 'chairman',
    title: 'Annual Report Distribution',
    from: 'Chairman',
    time: '1 week ago',
    body: 'The school\'s annual report for 2025-2026 is now available. Please review and provide feedback by the end of the month.',
    tag: 'Report',
    unread: false,
    initials: 'CH',
    avatarBg: '#F59E0B',
    avatarColor: '#FFFFFF',
    tagBg: '#FEF3C7',
    tagColor: '#D97706',
  },
];