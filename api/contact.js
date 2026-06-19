// api/contact.js
// Vercel serverless function — sends the contact form via Resend.
// Sends ONE email containing exactly what the visitor entered, to CONTACT_TO.
//
// Setup:
//   npm i resend
//   Vercel → Project → Settings → Environment Variables:
//     RESEND_API_KEY   re_xxxxxxxx
//     CONTACT_TO       the inbox where you want enquiries to land
//     CONTACT_FROM     Thiral Builders <enquiries@yourdomain.com>
//
//   IMPORTANT: with the test sender onboarding@resend.dev, Resend will ONLY
//   deliver to your own Resend account email. So set CONTACT_TO to that email
//   for now. To send to any address, verify your domain (Resend → Domains)
//   and set CONTACT_FROM to an address on that domain.

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const TO = process.env.CONTACT_TO || 'dcraftwebdev@gmail.com';
const FROM = process.env.CONTACT_FROM || 'Thiral Builders <onboarding@resend.dev>';

const BRASS = '#9a7b4f';
const INK = '#181714';
const STONE = '#e9e7e1';

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

const isEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ---------- email shell ---------- */
function shell(inner) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${STONE};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${STONE};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
          style="width:600px;max-width:100%;background:#ffffff;border:1px solid rgba(24,23,20,.08);border-radius:18px;overflow:hidden;font-family:'Helvetica Neue',Arial,sans-serif;">
          <tr>
            <td style="background:${INK};padding:22px 32px;">
              <table role="presentation" width="100%"><tr>
                <td style="font:600 18px/1 Georgia,serif;color:#ffffff;letter-spacing:.4px;">Thiral&nbsp;Builders</td>
                <td align="right" style="font:600 11px/1 'Helvetica Neue',Arial,sans-serif;letter-spacing:2px;color:${BRASS};text-transform:uppercase;">Architecture &amp; Construction</td>
              </tr></table>
            </td>
          </tr>
          ${inner}
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(24,23,20,.08);font:400 12px/1.6 'Helvetica Neue',Arial,sans-serif;color:rgba(24,23,20,.5);">
              Thiral Builders &amp; Developers · 4th Floor, Marina Towers, Chennai
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function row(label, value) {
  if (!value) return '';
  return `<tr>
    <td style="padding:10px 0;width:140px;vertical-align:top;font:600 12px/1.5 'Helvetica Neue',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:${BRASS};">${esc(label)}</td>
    <td style="padding:10px 0;font:400 15px/1.6 'Helvetica Neue',Arial,sans-serif;color:${INK};">${value}</td>
  </tr>`;
}

/* ---------- enquiry email (the only one we send) ---------- */
function enquiryEmail({ name, email, type, budget, message }) {
  const inner = `
    <tr><td style="padding:32px 32px 8px;">
      <p style="margin:0 0 4px;font:600 11px/1 'Helvetica Neue',Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:${BRASS};">New enquiry</p>
      <h1 style="margin:0;font:400 28px/1.2 Georgia,serif;color:${INK};">${esc(name)} got in touch</h1>
    </td></tr>
    <tr><td style="padding:8px 32px 0;">
      <table role="presentation" width="100%" style="border-collapse:collapse;">
        ${row('Name', esc(name))}
        ${row('Email', `<a href="mailto:${esc(email)}" style="color:${BRASS};text-decoration:none;">${esc(email)}</a>`)}
        ${row('Project type', esc(type) || '—')}
        ${row('Budget', esc(budget) || '—')}
      </table>
    </td></tr>
    <tr><td style="padding:18px 32px 32px;">
      <div style="background:${STONE};border-radius:14px;padding:20px 22px;font:400 15px/1.7 'Helvetica Neue',Arial,sans-serif;color:${INK};white-space:pre-wrap;">${esc(message)}</div>
      <p style="margin:18px 0 0;font:400 13px/1.6 'Helvetica Neue',Arial,sans-serif;color:rgba(24,23,20,.55);">Reply directly to this email to respond to ${esc(name)}.</p>
    </td></tr>`;
  return shell(inner);
}

function enquiryText({ name, email, type, budget, message }) {
  return `New enquiry from ${name}
Email: ${email}
Project type: ${type || '—'}
Budget: ${budget || '—'}

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

    // Send only the enquiry email (with the entered data) to your inbox.
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [TO],
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