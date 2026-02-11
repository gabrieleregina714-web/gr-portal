import { NextRequest, NextResponse } from 'next/server';
import { addItem, readCollection, generateId } from '@/lib/db';
import { sendNotificationEmail, NotificationType } from '@/lib/email';

// POST: Create notification + optionally send email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      athleteId,
      athleteName,
      athleteEmail,
      type,
      title,
      message,
      link,
      sendEmail = true,
    } = body as {
      athleteId: string;
      athleteName: string;
      athleteEmail?: string;
      type: NotificationType;
      title: string;
      message: string;
      link?: string;
      sendEmail?: boolean;
    };

    if (!athleteId || !title || !message || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create the in-app notification
    const notification = {
      id: generateId(),
      userId: `ath-user-${athleteId}`,
      athleteId,
      type,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
      link: link || '/athlete',
    };

    await addItem('notifications', notification);

    // 2. Send email if athlete email is provided and sendEmail is true
    let emailSent = false;
    if (sendEmail && athleteEmail) {
      emailSent = await sendNotificationEmail({
        to: athleteEmail,
        athleteName: athleteName || 'Atleta',
        type,
        title,
        message,
        ctaUrl: link,
        ctaLabel: type === 'document' ? 'Vedi documento' : type === 'appointment' ? 'Vedi appuntamento' : type === 'goal' ? 'Vedi obiettivo' : 'Apri il portale',
      });
    }

    return NextResponse.json({ notification, emailSent });
  } catch (error) {
    console.error('[Notifications] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
