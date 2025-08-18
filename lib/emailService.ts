// lib/emailService.ts
import { sendEmail } from "./emailProvider"; // You'll need to set this up

interface EmailParams {
  email: string;
  firstName: string;
  lastName: string;
  userId: string;
  password: string;
}

export const sendPasswordEmail = async ({
  email,
  firstName,
  lastName,
  userId,
  password
}: EmailParams) => {
  const subject = "Your Account Credentials";
  const html = `
    <div>
      <h2>Welcome to Our Platform, ${firstName}!</h2>
      <p>Your account has been successfully created.</p>
      <p><strong>Login Details:</strong></p>
      <ul>
        <li><strong>User ID:</strong> ${userId}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>Please keep these credentials secure and change your password after first login.</p>
      <p>Login at: <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">${process.env.NEXT_PUBLIC_APP_URL}/login</a></p>
    </div>
  `;

  try {
    await sendEmail({
      to: email,
      subject,
      html
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send credentials email");
  }
};