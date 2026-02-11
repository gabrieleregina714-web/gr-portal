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

const TYPE_LABEL: Record<NotificationType, string> = {
  document: 'DOCUMENTO',
  appointment: 'APPUNTAMENTO',
  goal: 'OBIETTIVO',
  message: 'MESSAGGIO',
  system: 'SISTEMA',
};

const TYPE_EMOJI: Record<NotificationType, string> = {
  document: '📄',
  appointment: '📅',
  goal: '🎯',
  message: '💬',
  system: '⚙️',
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
  const label = TYPE_LABEL[type] || 'NOTIFICA';
  const portalUrl = process.env.NEXTAUTH_URL || 'https://gr-perform.vercel.app';
  const finalCtaUrl = ctaUrl ? `${portalUrl}${ctaUrl}` : `${portalUrl}/athlete`;
  const btnLabel = ctaLabel || 'Apri il portale';
  const now = new Date();
  const dateStr = now.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

  const html = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <!--[if mso]><style>*{font-family:Arial,sans-serif!important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A;">
    <tr><td align="center" style="padding:0;">

      <!-- Container -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Top accent bar -->
        <tr><td style="height:3px;background:linear-gradient(90deg,#C8102E 0%,#C8102E 40%,#222222 100%);font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- Spacer -->
        <tr><td style="height:40px;background-color:#0A0A0A;font-size:0;">&nbsp;</td></tr>

        <!-- Logo row -->
        <tr>
          <td align="center" style="padding:0 32px;background-color:#0A0A0A;">
            <img src="https://cdn.shopify.com/s/files/1/0969/1801/2243/files/Black_White_Bold_Modern_Clothing_Brand_Logo_97389bbf-665b-4465-82ec-d71a0fa4b35e.png?v=1758700090" alt="GR Perform" width="100" style="display:block;border:0;" />
          </td>
        </tr>

        <!-- Spacer -->
        <tr><td style="height:32px;background-color:#0A0A0A;font-size:0;">&nbsp;</td></tr>

        <!-- Main card -->
        <tr>
          <td style="padding:0 24px;background-color:#0A0A0A;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#141414;border:1px solid #222222;">

              <!-- Card top accent line -->
              <tr><td style="height:2px;background-color:#C8102E;font-size:0;line-height:0;">&nbsp;</td></tr>

              <!-- Card content -->
              <tr>
                <td style="padding:32px 32px 36px 32px;">

                  <!-- Date + Type row -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:10px;text-transform:uppercase;letter-spacing:3px;color:#777777;font-weight:500;">
                        ${dateStr}
                      </td>
                      <td align="right">
                        <span style="display:inline-block;background-color:#1E1E1E;color:#A0A0A0;font-size:10px;text-transform:uppercase;letter-spacing:2px;padding:5px 12px;font-weight:600;">
                          ${emoji}&nbsp; ${label}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <!-- Divider -->
                  <div style="height:1px;background-color:#222222;margin:20px 0;"></div>

                  <!-- Greeting -->
                  <p style="color:#777777;font-size:11px;text-transform:uppercase;letter-spacing:3px;font-weight:500;margin:0 0 16px 0;">
                    Ciao ${athleteName}
                  </p>

                  <!-- Title -->
                  <h1 style="color:#F5F5F5;font-family:'Bebas Neue','Impact','Arial Black',sans-serif;font-size:32px;font-weight:400;text-transform:uppercase;letter-spacing:1px;line-height:1;margin:0 0 20px 0;">
                    ${title}
                  </h1>

                  <!-- Message -->
                  <p style="color:#A0A0A0;font-size:14px;line-height:1.7;margin:0 0 32px 0;font-weight:400;">
                    ${message}
                  </p>

                  <!-- CTA Button -->
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background-color:#FFFFFF;">
                        <a href="${finalCtaUrl}" target="_blank" style="display:inline-block;background-color:#FFFFFF;color:#0A0A0A;text-decoration:none;font-size:11px;text-transform:uppercase;letter-spacing:2.5px;font-weight:600;padding:14px 32px;line-height:1;">
                          ${btnLabel}&nbsp;&nbsp;→
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Spacer -->
        <tr><td style="height:24px;background-color:#0A0A0A;font-size:0;">&nbsp;</td></tr>

        <!-- Secondary info strip -->
        <tr>
          <td style="padding:0 24px;background-color:#0A0A0A;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111111;border:1px solid #1A1A1A;">
              <tr>
                <td style="padding:20px 28px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="vertical-align:top;">
                        <p style="color:#555555;font-size:9px;text-transform:uppercase;letter-spacing:2px;font-weight:600;margin:0 0 4px 0;">Portale</p>
                        <a href="${portalUrl}" style="color:#A0A0A0;font-size:12px;text-decoration:none;font-weight:500;">gr-perform.vercel.app</a>
                      </td>
                      <td width="50%" style="vertical-align:top;text-align:right;">
                        <p style="color:#555555;font-size:9px;text-transform:uppercase;letter-spacing:2px;font-weight:600;margin:0 0 4px 0;">Coach</p>
                        <p style="color:#A0A0A0;font-size:12px;margin:0;font-weight:500;">GR Perform Team</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Spacer -->
        <tr><td style="height:32px;background-color:#0A0A0A;font-size:0;">&nbsp;</td></tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding:0 32px;background-color:#0A0A0A;">
            <!-- Accent dot -->
            <div style="width:4px;height:4px;background-color:#C8102E;margin:0 auto 16px auto;"></div>
            <p style="color:#555555;font-size:9px;text-transform:uppercase;letter-spacing:3px;font-weight:600;margin:0 0 8px 0;">
              GR Perform · Performance Coaching
            </p>
            <p style="color:#333333;font-size:10px;margin:0 0 6px 0;line-height:1.5;">
              Ricevi questa email perché sei registrato su GR Perform.
            </p>
            <p style="color:#333333;font-size:10px;margin:0;">
              <a href="${portalUrl}/athlete" style="color:#555555;text-decoration:underline;">Accedi al portale</a>
            </p>
          </td>
        </tr>

        <!-- Bottom spacer -->
        <tr><td style="height:40px;background-color:#0A0A0A;font-size:0;">&nbsp;</td></tr>

        <!-- Bottom accent bar -->
        <tr><td style="height:2px;background:linear-gradient(90deg,#222222 0%,#C8102E 60%,#C8102E 100%);font-size:0;line-height:0;">&nbsp;</td></tr>

      </table>
    </td></tr>
  </table>

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
