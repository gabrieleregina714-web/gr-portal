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

  const label = TYPE_LABEL[type] || 'NOTIFICA';
  const portalUrl = process.env.NEXTAUTH_URL || 'https://gr-perform.vercel.app';
  const finalCtaUrl = ctaUrl ? `${portalUrl}${ctaUrl}` : `${portalUrl}/athlete`;
  const btnLabel = ctaLabel || 'Apri il portale';
  const now = new Date();
  const dateStr = now.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

  const html = `
<!DOCTYPE html>
<html lang="it" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark only">
<meta name="supported-color-schemes" content="dark only">
<title>GR Perform</title>
<style>
:root{color-scheme:dark only}
html,body{margin:0!important;padding:0!important;width:100%!important;background:#0A0A0A!important}
*{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}
table,td{mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse}
div[style*="margin:16px 0"]{margin:0!important}
u+.body .full-wrap{width:100%!important;min-width:100vw!important}
u+#body,u+.body{background:#0A0A0A!important}
#MessageViewBody,#MessageWebViewDiv{background:#0A0A0A!important}
.dark-bg{background:#0A0A0A!important;background-color:#0A0A0A!important}
</style>
</head>
<body id="body" class="body dark-bg" bgcolor="#0A0A0A" style="margin:0;padding:0;word-spacing:normal;background-color:#0A0A0A;">
<div role="article" aria-roledescription="email" lang="it" class="dark-bg" style="font-size:medium;font-size:max(16px,1rem);background-color:#0A0A0A;">
<!--[if mso]><table role="presentation" align="center" width="600" style="width:600px;" bgcolor="#0A0A0A"><tr><td bgcolor="#0A0A0A"><![endif]-->
<table class="full-wrap dark-bg" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0A0A0A" style="margin:0;padding:0;background:#0A0A0A;background-color:#0A0A0A;">
<tr><td class="dark-bg" bgcolor="#0A0A0A" align="center" valign="top" style="background:#0A0A0A;background-color:#0A0A0A;padding:0;">

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" bgcolor="#0A0A0A" style="max-width:600px;width:100%;margin:0 auto;background:#0A0A0A;background-color:#0A0A0A;">

<!-- Spacer -->
<tr><td bgcolor="#0A0A0A" style="height:48px;background:#0A0A0A;">&zwnj;</td></tr>

<!-- Logo -->
<tr><td bgcolor="#0A0A0A" align="center" style="padding:0 40px;background:#0A0A0A;">
<img src="https://cdn.shopify.com/s/files/1/0969/1801/2243/files/Black_White_Bold_Modern_Clothing_Brand_Logo_97389bbf-665b-4465-82ec-d71a0fa4b35e.png?v=1758700090" alt="GR Perform" width="90" style="display:block;border:0;outline:none;" />
</td></tr>

<!-- Spacer -->
<tr><td bgcolor="#0A0A0A" style="height:40px;background:#0A0A0A;">&zwnj;</td></tr>

<!-- Type label -->
<tr><td bgcolor="#0A0A0A" align="center" style="padding:0 40px;background:#0A0A0A;">
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#555555;font-weight:600;">
${label}
</p>
</td></tr>

<!-- Spacer -->
<tr><td bgcolor="#0A0A0A" style="height:24px;background:#0A0A0A;">&zwnj;</td></tr>

<!-- Title -->
<tr><td bgcolor="#0A0A0A" align="center" style="padding:0 40px;background:#0A0A0A;">
<h1 style="margin:0;font-family:Impact,'Arial Black',Arial,sans-serif;font-size:36px;font-weight:400;text-transform:uppercase;letter-spacing:1px;line-height:1;color:#FFFFFF;mso-line-height-rule:exactly;">
${title}
</h1>
</td></tr>

<!-- Spacer -->
<tr><td bgcolor="#0A0A0A" style="height:20px;background:#0A0A0A;">&zwnj;</td></tr>

<!-- Thin line -->
<tr><td bgcolor="#0A0A0A" style="padding:0 40px;background:#0A0A0A;">
<div style="height:1px;background-color:#222222;font-size:1px;line-height:1px;">&nbsp;</div>
</td></tr>

<!-- Spacer -->
<tr><td bgcolor="#0A0A0A" style="height:20px;background:#0A0A0A;">&zwnj;</td></tr>

<!-- Greeting -->
<tr><td bgcolor="#0A0A0A" align="center" style="padding:0 40px;background:#0A0A0A;">
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#666666;font-weight:500;">
Ciao ${athleteName}
</p>
</td></tr>

<!-- Spacer -->
<tr><td bgcolor="#0A0A0A" style="height:16px;background:#0A0A0A;">&zwnj;</td></tr>

<!-- Message -->
<tr><td bgcolor="#0A0A0A" align="center" style="padding:0 40px;background:#0A0A0A;">
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;color:#999999;font-weight:400;">
${message}
</p>
</td></tr>

<!-- Spacer -->
<tr><td bgcolor="#0A0A0A" style="height:36px;background:#0A0A0A;">&zwnj;</td></tr>

<!-- CTA Button -->
<tr><td bgcolor="#0A0A0A" align="center" style="padding:0 40px;background:#0A0A0A;">
<table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
<tr>
<td bgcolor="#FFFFFF" style="background:#FFFFFF;">
<a href="${finalCtaUrl}" target="_blank" style="display:inline-block;padding:14px 36px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:#000000;text-decoration:none;background:#FFFFFF;mso-padding-alt:14px 36px;">
${btnLabel}
</a>
</td>
</tr>
</table>
</td></tr>

<!-- Spacer -->
<tr><td bgcolor="#0A0A0A" style="height:56px;background:#0A0A0A;">&zwnj;</td></tr>

<!-- Footer line -->
<tr><td bgcolor="#0A0A0A" style="padding:0 40px;background:#0A0A0A;">
<div style="height:1px;background-color:#1A1A1A;font-size:1px;line-height:1px;">&nbsp;</div>
</td></tr>

<!-- Spacer -->
<tr><td bgcolor="#0A0A0A" style="height:24px;background:#0A0A0A;">&zwnj;</td></tr>

<!-- Footer text -->
<tr><td bgcolor="#0A0A0A" align="center" style="padding:0 40px;background:#0A0A0A;">
<p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#444444;font-weight:600;">
GR Perform
</p>
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#333333;line-height:18px;">
<a href="${portalUrl}" style="color:#444444;text-decoration:none;">gr-perform.vercel.app</a>
</p>
</td></tr>

<!-- Bottom spacer -->
<tr><td bgcolor="#0A0A0A" style="height:48px;background:#0A0A0A;">&zwnj;</td></tr>

</table>

</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"GR Perform" <${process.env.GMAIL_USER}>`,
      to,
      subject: `${title} — GR Perform`,
      html,
    });
    console.log(`[Email] Sent to ${to}: ${title}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return false;
  }
}
