import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendContactEmail = async (data) => {
  const { name, email, message } = data;
  
  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    replyTo: email,
    subject: `New Contact Request from ${name}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

export const sendBulkOrderEmail = async (data) => {
  const {
    companyName,
    contactName,
    email,
    phone,
    productCategory,
    quantity,
    specifications,
  } = data;

  const htmlContent = `
    <h2>New Bulk Order Request</h2>
    <p><strong>Company Name:</strong> ${escapeHtml(companyName)}</p>
    <p><strong>Contact Name:</strong> ${escapeHtml(contactName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Product Category:</strong> ${escapeHtml(productCategory)}</p>
    <p><strong>Quantity:</strong> ${escapeHtml(quantity)}</p>
    <p><strong>Specifications:</strong></p>
    <p>${escapeHtml(specifications).replace(/\n/g, '<br>')}</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    replyTo: email,
    subject: `New Bulk Order Request from ${companyName}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};
