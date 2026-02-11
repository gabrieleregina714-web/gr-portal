import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export type NotificationType = 'document' | 'appointment' | 'goal' | 'message' | 'system';

interface SendNotificationEmailParams {
  to: string;
  athleteName: string;
  type: NotificationType;
  title: string;
  message: string;
  ctaUrl?: string;
  ctaLabel?: string;
}

const TYPE_EMOJI: Record<NotificationType, string> = {
  document: '📄',
  appointment: '📅',
  goal: '🎯',
  message: '💬',
  system: '⚙️',
};

const TYPE_COLOR: Record<NotificationType, string> = {
  document: '#3B82F6',
  appointment: '#10B981',
  goal: '#F59E0B',
  message: '#8B5CF6',
  system: '#6B7280',
};

export async function sendNotificationEmail({
  to,
  athleteName,
  type,
  title,
  message,
  ctaUrl,
  ctaLabel,
}: SendNotificationEmailParams): Promise<boolean> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('[Email] Gmail credentials not configured, skipping email');
    return false;
  }

  const emoji = TYPE_EMOJI[type] || '🔔';
  const color = TYPE_COLOR[type] || '#FFFFFF';
  const portalUrl = process.env.NEXTAUTH_URL || 'https://gr-perform.vercel.app';
  const finalCtaUrl = ctaUrl ? `${portalUrl}${ctaUrl}` : `${portalUrl}/athlete`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:'Inter',-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.shopify.com/s/files/1/0969/1801/2243/files/Black_White_Bold_Modern_Clothing_Brand_Logo_97389bbf-665b-4465-82ec-d71a0fa4b35e.png?v=1758700090" alt="GR Perform" width="120" style="display:inline-block;" />
    </div>
    
    <!-- Card -->
    <div style="background-color:#141414;border:1px solid #222;padding:32px 28px;">
      <!-- Type badge -->
      <div style="margin-bottom:20px;">
        <span style="display:inline-block;background-color:${color}20;color:${color};font-size:11px;text-transform:uppercase;letter-spacing:2px;padding:6px 12px;font-weight:600;">
          ${emoji} ${type === 'document' ? 'Documento' : type === 'appointment' ? 'Appuntamento' : type === 'goal' ? 'Obiettivo' : type === 'message' ? 'Messaggio' : 'Sistema'}
        </span>
      </div>
      
      <!-- Greeting -->
      <p style="color:#777;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px 0;">
        Ciao ${athleteName},
      </p>
      
      <!-- Title -->
      <h1 style="color:#F5F5F5;font-size:22px;font-weight:700;margin:0 0 16px 0;line-height:1.3;">
        ${title}
      </h1>
      
      <!-- Message -->
      <p style="color:#A0A0A0;font-size:14px;line-height:1.6;margin:0 0 28px 0;">
        ${message}
      </p>
      
      <!-- CTA Button -->
      <a href="${finalCtaUrl}" style="display:inline-block;background-color:#FFFFFF;color:#000000;text-decoration:none;font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:600;padding:14px 28px;">
        ${ctaLabel || 'Apri il portale'} →
      </a>
    </div>
    
    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#555;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;">
        GR Perform · Performance coaching
      </p>
      <p style="color:#444;font-size:10px;margin-top:8px;">
        Ricevi questa email perché sei registrato su GR Perform
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"GR Perform" <${process.env.GMAIL_USER}>`,
      to,
      subject: `${emoji} ${title} — GR Perform`,
      html,
    });
    console.log(`[Email] Sent to ${to}: ${title}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return false;
  }
}
