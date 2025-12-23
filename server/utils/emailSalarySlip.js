const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,    
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = async ({ to, pdfBuffer, month, year }) => {
  await transporter.sendMail({
    from: `"HR Department" <${process.env.SMTP_USER}>`,
    to,
    subject: `Salary Slip for ${month}/${year}`,
    text: `Dear Employee,

Please find attached your salary slip for ${month}/${year}.

This is a system-generated email. Please do not reply.

Regards,
HR Department`,
    attachments: [
      {
        filename: `SalarySlip_${month}_${year}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};
