const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Check if credentials exist. If not, log to console as a safe mock fallback
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('\n========================================');
    console.log('✉️  MOCK EMAIL ALERT (Local Fallback)  ✉️');
    console.log(`To:      ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.text}`);
    console.log('========================================\n');
    return { success: true, mock: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: `"DevHire Careers" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    };

    const info = await transporter.sendMail(message);
    console.log(`📧 Email sent successfully: ${info.messageId}`);
    return { success: true, info };
  } catch (error) {
    console.error(`❌ Email Send Error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
