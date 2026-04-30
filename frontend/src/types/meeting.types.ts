export type MeetingStatus = 'PENDING' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED';
export type MeetingResponse = 'ACCEPTED' | 'DECLINED';
export type NotifType = 'meeting' | 'task' | 'delay';
export type NotifSub = 'new' | 'reminder' | 'reschedule' | 'cancel';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ApprovalType = 'BUDGET' | 'PURCHASE' | 'POLICY' | 'EVENT';
export type CommType = 'broadcast' | 'dept' | 'chairman';
export type NotifPreference = { key: string; label: string; enabled: boolean };

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

export interface MeetingResponseMap { [meetingId: number]: MeetingResponse }

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

export interface DashboardStats {
  assignedTasks: number;
  meetingsToday: number;
  pendingApprovals: number;
  unreadAlerts: number;
}