// api/contact.js — accept contact form submissions
// Preferred deployment: Vercel / Netlify Functions
// Behavior priority:
// 1) If SMTP_* env vars are set, send an email via SMTP (Nodemailer).
// 2) Else if GITHUB_TOKEN and GITHUB_MESSAGES_REPO are set, create a GitHub issue to store the message.
// 3) Else, append to a local JSON file at ./data/messages.json (useful for local dev).
//
const { URL } = require('url');
const fs = require('fs');
const path = require('path');
let nodemailer;
try { nodemailer = require('nodemailer'); } catch (e) { /* nodemailer may not be installed in some environments */ }

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // basic email validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return res.status(400).json({ error: 'Invalid email' });

    const payload = { name, email, subject, message, receivedAt: new Date().toISOString() };

    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;
    const SMTP_TO = process.env.SMTP_TO; // comma-separated or single email

    // 1) If SMTP configured and nodemailer available, send email
    if (SMTP_HOST && SMTP_USER && SMTP_PASS && SMTP_TO && nodemailer) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 587,
          secure: SMTP_PORT && String(SMTP_PORT) === '465',
          auth: { user: SMTP_USER, pass: SMTP_PASS }
        });

        const mailOptions = {
          from: SMTP_FROM,
          to: SMTP_TO,
          subject: `New contact: ${subject} — ${name}`,
          text: `From: ${name} <${email}>\n\n${message}\n\nReceived: ${payload.receivedAt}`,
          html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Subject:</strong> ${subject}</p><hr><p>${message.replace(/\n/g,'<br>')}</p><hr><p>Received: ${payload.receivedAt}</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Message sent via SMTP.', info: info.messageId });
      } catch (err) {
        console.error('SMTP send failed:', err && err.message ? err.message : err);
        // fall through to next option
      }
    }

    // 2) If GitHub token & repo provided, create GitHub issue
    const GH_TOKEN = process.env.GITHUB_TOKEN;
    const GH_REPO = process.env.GITHUB_MESSAGES_REPO; // e.g. 'owner/repo'
    if (GH_TOKEN && GH_REPO) {
      // Create a GitHub issue
      const apiUrl = `https://api.github.com/repos/${GH_REPO}/issues`;
      const title = `[Contact] ${subject} — ${name}`;
      const body = `**From:** ${name} <${email}>\n\n**Message:**\n\n${message}\n\n---\nReceived at: ${payload.receivedAt}`;

      const r = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${GH_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'PortfolioContact/1.0'
        },
        body: JSON.stringify({ title, body })
      });

      if (!r.ok) {
        const errText = await r.text().catch(()=>`${r.status}`);
        console.error('GitHub issue creation failed:', errText);
        return res.status(502).json({ error: 'Failed to create GitHub issue' });
      }

      const issue = await r.json();
      return res.status(200).json({ message: 'Message received — thank you!', issueUrl: issue.html_url });
    }

    // 3) Fallback: store in local file (useful for local dev). Note: serverless platforms may not persist files.
    const dataDir = path.join(process.cwd(), 'data');
    const outFile = path.join(dataDir, 'messages.json');

    try {
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
      let arr = [];
      if (fs.existsSync(outFile)) {
        const raw = fs.readFileSync(outFile, 'utf8');
        arr = JSON.parse(raw || '[]');
      }
      arr.push(payload);
      fs.writeFileSync(outFile, JSON.stringify(arr, null, 2));
      return res.status(200).json({ message: 'Message saved locally (dev).' });
    } catch (err) {
      console.error('File write failed:', err.message);
      return res.status(500).json({ error: 'Failed to save message' });
    }

  } catch (err) {
    console.error('Contact handler error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};
