const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

// POST /api/contact — приема съобщение от Contact формата и го праща на admin email-а
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Категориите от формата
    const subjectMap = {
      billing: 'Billing & Premium',
      refund: 'Refund Request',
      bug: 'Bug Report',
      feature: 'Feature Request',
      account: 'Account Issue',
      other: 'Other',
    };

    const readableSubject = subjectMap[subject] || subject;

    // Изпращаме на admin email-а
    const adminEmail = 'musclemap@yahoo.com';

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px;">
        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 2px;">MUSCLE MAP</h1>
            <p style="color: #94a3b8; margin: 8px 0 0; font-size: 13px;">New Contact Form Submission</p>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; vertical-align: top; width: 100px;">Name</td>
                <td style="padding: 10px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Email</td>
                <td style="padding: 10px 0; color: #0f172a; font-size: 15px;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Subject</td>
                <td style="padding: 10px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${readableSubject}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 20px; background: #f1f5f9; border-radius: 12px; border-left: 4px solid #2563eb;">
              <p style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Message</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="background: #f1f5f9; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">Reply directly to this email to respond to the user.</p>
          </div>
        </div>
      </div>
    `;

    // Праща на admin-а, с Reply-To на потребителя
    await sendEmail({
      to: adminEmail,
      subject: `[Contact] ${readableSubject} — from ${name}`,
      html: emailHtml,
      replyTo: email,
    });

    // Праща потвърждение на потребителя
    const confirmHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px;">
        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 2px;">MUSCLE MAP</h1>
          </div>
          <div style="padding: 40px 32px; text-align: center;">
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 20px;">
              <tr>
                <td align="center" valign="middle" style="font-size: 48px; line-height: 1;">✅</td>
              </tr>
            </table>
            <h2 style="color: #0f172a; margin: 0 0 12px; font-size: 22px; font-weight: 800;">Message Received!</h2>
            <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0;">Thank you for reaching out, <strong>${name}</strong>. We've received your message about <strong>${readableSubject}</strong> and will get back to you within 1-2 business days.</p>
          </div>
          <div style="background: #f1f5f9; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Muscle Map. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    sendEmail({
      to: email,
      subject: 'Muscle Map — We received your message',
      html: confirmHtml,
    }).catch(err => console.error('Confirmation email failed:', err));

    res.json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
