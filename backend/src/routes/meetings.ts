import { Router } from 'express';
import { MEETINGS, MEETING_RESPONSES, type MeetingStatus } from '../data/store';

const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: MEETINGS });
});

router.post('/', (req, res) => {
  const { title, date, time, venue, attendees, agenda } = req.body;
  const newMeeting = {
    id: Date.now(),
    title,
    organizer: 'Director',
    organizerInitials: 'DR',
    date,
    time,
    venue,
    status: 'PENDING' as MeetingStatus,
    attendees: attendees.split(',').map((a: string) => a.trim()),
    agenda,
  };
  MEETINGS.push(newMeeting);
  res.status(201).json({ success: true, data: newMeeting });
});

router.put('/:id/respond', (req, res) => {
  const { id } = req.params;
  const { response } = req.body;
  MEETING_RESPONSES[parseInt(id)] = response;
  res.json({ success: true });
});

export default router;