const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendPaymentConfirmation(email, amount) {
const info = await transporter.sendMail({
  from: `"Mon Site" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Confirmation de paiement 🎉",
  html: `
    <h2>Merci 🎉</h2>
    <p>Votre paiement est confirmé.</p>
    <p><strong>Session:</strong> ${session.id}</p>
  `,
});

console.log("📩 Email envoyé:", info.messageId);
console.log("Accepté:", info.accepted);
console.log("Refusé:", info.rejected);
}

module.exports = sendPaymentConfirmation;