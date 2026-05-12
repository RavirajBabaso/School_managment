import React from 'react';
import type { Meeting, MeetingResponse, MeetingResponseMap } from '../../types/meeting.types';

interface MeetingCardProps {
  meeting: Meeting;
  responses: MeetingResponseMap;
  onRespond: (id: number, response: MeetingResponse) => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, responses, onRespond }) => {
  const getStatusBadge = (status: string) => {
    const colors = {
      CONFIRMED: 'bg-green-100 text-green-800',
      PENDING: 'bg-amber-100 text-amber-800',
      RESCHEDULED: 'bg-amber-100 text-amber-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-800';
  };

  const hasResponded = responses[meeting.id];
  const canRespond = (meeting.status === 'PENDING' || meeting.status === 'RESCHEDULED') && !hasResponded;

  return (
    <div className="bg-[var(--surface)] rounded-lg border border-[var(--border-color)] p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">{meeting.title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(meeting.status)}`}>
          {meeting.status}
        </span>
      </div>
      <div className="text-xs text-[var(--text-secondary)] mb-2">
        {meeting.date} • {meeting.time} • {meeting.venue}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-blue-100 text-xs font-semibold text-[#0C447C] flex items-center justify-center">
          {meeting.organizerInitials}
        </div>
        <span className="text-xs text-[var(--text-primary)]">{meeting.organizer}</span>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {meeting.attendees.map((attendee, idx) => (
          <span key={idx} className="text-xs bg-[var(--panel-bg)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
            {attendee}
          </span>
        ))}
      </div>
      {canRespond && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onRespond(meeting.id, 'ACCEPTED')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1 rounded-md transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => onRespond(meeting.id, 'DECLINED')}
            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md transition-colors"
          >
            Decline
          </button>
          <button
            className="border border-amber-500 text-amber-700 text-xs px-3 py-1 rounded-md hover:bg-amber-50 transition-colors"
          >
            Reschedule
          </button>
        </div>
      )}
      {hasResponded === 'ACCEPTED' && (
        <p className="text-xs text-emerald-400 italic">✓ Meeting accepted</p>
      )}
      {hasResponded === 'DECLINED' && (
        <p className="text-xs text-red-300 italic">✗ Meeting declined</p>
      )}
    </div>
  );
};

export default MeetingCard;