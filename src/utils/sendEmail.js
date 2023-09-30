//send email utils
const nodemailer = require('nodemailer');

const sendEmail = async (recipients, subject, text, userId, userName, userEmail) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define email options
  const mailOptions = {
    from: userEmail || process.env.EMAIL_USERNAME,  // Use the user's email if available
    to: recipients.join(','),
    subject: subject,
    text: `${text}\n\nFrom: ${userName}\nContribution link: https://www.givebundl.com/contribute/${userId}`,
    // Add any additional fields like 'cc', 'bcc', 'attachments', etc.
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

module.exports = sendEmail;
