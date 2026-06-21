// api/contact.js
// Vercel serverless function — sends the contact form via Resend.
// Sends ONE email containing exactly what the visitor entered, to every
// address in CONTACT_TO.
//
// Setup:
//   npm i resend
//   Vercel → Project → Settings → Environment Variables:
//     RESEND_API_KEY   re_xxxxxxxx
//     CONTACT_TO       comma-separated inboxes where enquiries should land
//                       e.g. dcraftwebdev@gmail.com,thiralbuilders@gmail.com
//     CONTACT_FROM     Thiral Builders <enquiries@thiralbuilders.com>
//
//   IMPORTANT: thiralbuilders.com must be a verified domain in
//   Resend → Domains before this FROM address will work. The test sender
//   onboarding@resend.dev is no longer used — it only delivers to your own
//   Resend account email, which is why it's been replaced.

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Default recipients: both inboxes get every enquiry. Override by setting
// CONTACT_TO in Vercel env vars to a comma-separated list.
const TO = (process.env.CONTACT_TO || 'dcraftwebdev@gmail.com,thiralbuilders@gmail.com')
  .split(',')
  .map((addr) => addr.trim())
  .filter(Boolean);

// Sender must be on the verified thiralbuilders.com domain — Resend will
// reject a FROM address on a domain it hasn't verified (e.g. a Gmail
// address can never be used here, even if it's a real inbox).
const FROM = process.env.CONTACT_FROM || 'Thiral Builders <enquiries@thiralbuilders.com>';

// ---------- palette (kept minimal — mostly ink + one neutral grey + brass accent) ----------
const INK = '#181714';        // primary text
const INK_SOFT = '#5b5750';   // secondary text
const LINE = '#e7e4dd';       // hairline borders
const PANEL = '#f8f7f4';      // very light warm grey panel
const BRASS = '#9a7b4f';      // single accent colour, used sparingly
const WHITE = '#ffffff';

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

const isEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/* ---------- email shell ----------
   A single restrained card on a light grey background. No heavy colour
   blocks — structure comes from spacing and hairlines, not fills. */
function shell(inner) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:${PANEL};-webkit-text-size-adjust:100%;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PANEL};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0"
            style="width:600px;max-width:100%;background:${WHITE};border:1px solid ${LINE};border-radius:8px;font-family:${FONT};">

            <!-- header -->
            <tr>
              <td style="padding:28px 36px;border-bottom:1px solid ${LINE};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font:600 16px/1.2 ${FONT};color:${INK};letter-spacing:.2px;">
                      Thiral Builders
                    </td>
                    <td align="right" style="font:500 11px/1.2 ${FONT};color:${INK_SOFT};letter-spacing:.6px;text-transform:uppercase;">
                      Architecture &amp; Construction
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            ${inner}

            <!-- footer -->
            <tr>
              <td style="padding:20px 36px;border-top:1px solid ${LINE};">
                <p style="margin:0;font:400 12px/1.6 ${FONT};color:${INK_SOFT};">
                  Thiral Builders &amp; Developers · 4th Floor, Marina Towers, Chennai
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/* A single labelled row inside the details table — label left, value right,
   separated by a hairline so it reads like a simple form summary. */
function row(label, value, isLast) {
  if (!value) return '';
  const border = isLast ? '' : `border-bottom:1px solid ${LINE};`;
  return `<tr>
    <td style="padding:13px 0;${border}width:120px;vertical-align:top;font:500 12px/1.5 ${FONT};letter-spacing:.3px;color:${INK_SOFT};">
      ${esc(label)}
    </td>
    <td style="padding:13px 0;${border}font:400 14px/1.55 ${FONT};color:${INK};">
      ${value}
    </td>
  </tr>`;
}

/* ---------- enquiry email (the only one we send) ---------- */
function enquiryEmail({ name, email, type, budget, message }) {
  const rows = [
    row('Name', esc(name)),
    row('Email', `<a href="mailto:${esc(email)}" style="color:${INK};text-decoration:underline;">${esc(email)}</a>`),
    row('Project type', esc(type) || '—'),
    row('Budget', esc(budget) || '—', true),
  ].join('');

  const inner = `
    <!-- title -->
    <tr>
      <td style="padding:32px 36px 4px;">
        <p style="margin:0 0 6px;font:600 11px/1.2 ${FONT};letter-spacing:1px;text-transform:uppercase;color:${BRASS};">
          New website enquiry
        </p>
        <p style="margin:0;font:600 22px/1.3 ${FONT};color:${INK};">
          ${esc(name)}
        </p>
      </td>
    </tr>

    <!-- details table -->
    <tr>
      <td style="padding:20px 36px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${rows}
        </table>
      </td>
    </tr>

    <!-- message -->
    <tr>
      <td style="padding:24px 36px 32px;">
        <p style="margin:0 0 8px;font:500 12px/1.5 ${FONT};letter-spacing:.3px;color:${INK_SOFT};">
          Message
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PANEL};border-radius:6px;">
          <tr>
            <td style="padding:16px 18px;font:400 14px/1.65 ${FONT};color:${INK};white-space:pre-wrap;">
              ${esc(message)}
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font:400 12px/1.6 ${FONT};color:${INK_SOFT};">
          Reply directly to this email to respond to ${esc(name)}.
        </p>
      </td>
    </tr>`;
  return shell(inner);
}

function enquiryText({ name, email, type, budget, message }) {
  return `New website enquiry — ${name}

Name: ${name}
Email: ${email}
Project type: ${type || '—'}
Budget: ${budget || '—'}

Message
${message}

Reply directly to this email to respond.`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const type = (body.type || '').trim();
    const budget = (body.budget || '').trim();
    const message = (body.message || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please fill in your name, email and message.' });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Send the enquiry email (with the entered data) to every configured inbox.
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: [email],
      subject: `New enquiry — ${name}${type ? ' · ' + type : ''}`,
      html: enquiryEmail({ name, email, type, budget, message }),
      text: enquiryText({ name, email, type, budget, message }),
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(502).json({ error: error.message || 'Could not send your message.' });
    }

    return res.status(200).json({ ok: true, id: data?.id });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: err?.message || 'Server error. Please try again.' });
  }
}