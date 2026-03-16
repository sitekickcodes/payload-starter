import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const NOTIFICATION_TO = process.env.FORM_NOTIFICATION_EMAIL || "hello@example.com";
const FROM = process.env.RESEND_FROM_EMAIL || "Website <notifications@mail.sitekick.co>";
const REPLY_TO = process.env.FORM_NOTIFICATION_EMAIL || "hello@example.com";

interface SendNotificationOptions {
  subject: string;
  html: string;
}

export async function sendFormNotification({ subject, html }: SendNotificationOptions) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping notification");
    return;
  }

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: NOTIFICATION_TO,
      replyTo: REPLY_TO,
      subject,
      html,
    });
    console.log("[email] Send result:", JSON.stringify(result));
  } catch (error) {
    console.error("[email] Failed to send notification:", error);
  }
}

/* ------------------------------------------------------------------ */
/*  Notification templates                                             */
/* ------------------------------------------------------------------ */

const INQUIRY_LABELS: Record<string, string> = {
  general: "General Inquiry",
  support: "Support",
  sales: "Sales",
  partnership: "Partnership",
  other: "Other",
};

export function contactNotificationHtml(data: {
  name: string;
  email: string;
  inquiry: string;
  message: string;
}) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="margin: 0 0 16px; font-size: 20px; color: #111;">New Contact Form Submission</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 12px; color: #666; width: 100px; vertical-align: top;">Name</td>
          <td style="padding: 8px 12px; color: #111;">${escapeHtml(data.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; color: #666; vertical-align: top;">Email</td>
          <td style="padding: 8px 12px;"><a href="mailto:${escapeHtml(data.email)}" style="color: #2563eb;">${escapeHtml(data.email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; color: #666; vertical-align: top;">Type</td>
          <td style="padding: 8px 12px; color: #111;">${INQUIRY_LABELS[data.inquiry] || data.inquiry}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; color: #666; vertical-align: top;">Message</td>
          <td style="padding: 8px 12px; color: #111; white-space: pre-line;">${escapeHtml(data.message)}</td>
        </tr>
      </table>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e5e5;" />
      <p style="font-size: 12px; color: #999; margin: 0;">This notification was sent from your website.</p>
    </div>
  `;
}

export function newsletterNotificationHtml(data: { email: string }) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="margin: 0 0 16px; font-size: 20px; color: #111;">New Newsletter Signup</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 12px; color: #666; width: 100px;">Email</td>
          <td style="padding: 8px 12px;"><a href="mailto:${escapeHtml(data.email)}" style="color: #2563eb;">${escapeHtml(data.email)}</a></td>
        </tr>
      </table>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e5e5;" />
      <p style="font-size: 12px; color: #999; margin: 0;">This notification was sent from your website.</p>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
