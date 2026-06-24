import { BrevoClient } from "@getbrevo/brevo";
import sanitizeHtml from "sanitize-html";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY as string,
});

const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL as string;
const SENDER_NAME = process.env.BREVO_SENDER_NAME || "SkillBridge";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Strips any HTML/script content from user-provided text before it's
// interpolated into our email templates, preventing injection attacks
// via a malicious name field.
function sanitizeForEmail(text: string): string {
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
}

async function sendEmail(to: string, subject: string, htmlContent: string) {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: { email: SENDER_EMAIL, name: SENDER_NAME },
    to: [{ email: to }],
    subject,
    htmlContent,
  });
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string,
) {
  const safeName = sanitizeForEmail(name);
  const verifyUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
      <div style="width: 40px; height: 40px; background: #6366f1; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
        <span style="color: white; font-weight: bold; font-size: 18px;">S</span>
      </div>
      <h2 style="color: #0a0a0f; margin-bottom: 8px;">Verify your email</h2>
      <p style="color: #555; line-height: 1.6;">
        Hi ${safeName}, welcome to SkillBridge! Please verify your email address before logging in.
      </p>
      <a href="${verifyUrl}" style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; margin: 16px 0;">
        Verify email
      </a>
      <p style="color: #888; font-size: 13px; margin-top: 24px;">
        This link expires in 24 hours. If you didn't create a SkillBridge account, you can safely ignore this email.
      </p>
    </div>
  `;

  await sendEmail(to, "Verify your SkillBridge email", html);
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string,
) {
  const safeName = sanitizeForEmail(name);
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
      <div style="width: 40px; height: 40px; background: #6366f1; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
        <span style="color: white; font-weight: bold; font-size: 18px;">S</span>
      </div>
      <h2 style="color: #0a0a0f; margin-bottom: 8px;">Reset your password</h2>
      <p style="color: #555; line-height: 1.6;">
        Hi ${safeName}, we received a request to reset your SkillBridge password.
      </p>
      <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; margin: 16px 0;">
        Reset password
      </a>
      <p style="color: #888; font-size: 13px; margin-top: 24px;">
        This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>
  `;

  await sendEmail(to, "Reset your SkillBridge password", html);
}
