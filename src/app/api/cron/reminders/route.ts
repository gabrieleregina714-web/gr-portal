import { NextRequest, NextResponse } from 'next/server';
import { readCollection } from '@/lib/db';
import { sendNotificationEmail } from '@/lib/email';

// Vercel Cron: runs daily at 08:00 UTC (09:00 IT)
// Sends reminder emails for appointments happening tomorrow

interface Appointment {
  id: string;
  athleteId: string;
  athleteName: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  notes?: string;
  status: string;
  sport?: string;
}

interface AthleteUser {
  id: string;
  athleteId: string;
  email: string;
  status: string;
}

const TYPE_LABELS: Record<string, string> = {
  training: 'Sessione di allenamento',
  call: 'Videochiamata',
  assessment: 'Valutazione',
  review: 'Review',
};

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sets this automatically)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD

    // Fetch appointments and athlete users
    const appointments = await readCollection<Appointment>('appointments', []);
    const athleteUsers = await readCollection<AthleteUser>('athleteUsers', []);

    // Filter appointments for tomorrow that are still scheduled
    const tomorrowAppointments = appointments.filter(
      (a) => a.date === tomorrowStr && a.status === 'scheduled'
    );

    if (tomorrowAppointments.length === 0) {
      return NextResponse.json({ message: 'No appointments tomorrow', sent: 0 });
    }

    let sent = 0;

    for (const apt of tomorrowAppointments) {
      // Find the athlete's email
      const user = athleteUsers.find((u) => u.athleteId === apt.athleteId && u.status === 'active');
      if (!user) continue;

      const typeLabel = TYPE_LABELS[apt.type] || apt.type;

      const emailSent = await sendNotificationEmail({
        to: user.email,
        athleteName: apt.athleteName.split(' ')[0], // First name only
        type: 'appointment',
        title: `${typeLabel} domani`,
        message: `Promemoria: hai ${typeLabel.toLowerCase()} domani ${apt.date.split('-').reverse().join('/')} alle ${apt.time}${apt.duration ? ` (${apt.duration} min)` : ''}.${apt.notes ? ` Note: ${apt.notes}` : ''}`,
        ctaUrl: '/athlete/appuntamenti',
        ctaLabel: 'Vedi appuntamento',
      });

      if (emailSent) sent++;
    }

    return NextResponse.json({
      message: `Reminders sent for ${tomorrowStr}`,
      total: tomorrowAppointments.length,
      sent,
    });
  } catch (error) {
    console.error('[Cron Reminders] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
