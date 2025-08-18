// app/api/send-email/route.ts
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Verify env variables are loaded
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email credentials not configured');
    }

    const { email, firstName, userId, password } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Using app password here
      },
    });

   await transporter.sendMail({
  from: `"Loan App Support" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Your Loan App Account Credentials',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #2563eb;">Welcome to Loan App!</h1>
        <p style="color: #4b5563;">Your account has been successfully created</p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #111827; margin-top: 0;">Your Login Credentials</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="color: #4b5563;">For your security, please:</p>
        <ul style="color: #4b5563; padding-left: 20px;">
          <li>Change your password after first login</li>
          <li>Never share your credentials with anyone</li>
          <li>Contact support if you didn't request this account</li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
           style="display: inline-block; background-color: #2563eb; color: white; 
                  padding: 12px 24px; text-decoration: none; border-radius: 4px;
                  font-weight: bold; margin-top: 10px;">
          Login to Your Account
        </a>
      </div>
      
      <div style="margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center;">
        <p>© ${new Date().getFullYear()} Loan App. All rights reserved.</p>
        <p>This is an automated message - please do not reply directly to this email.</p>
      </div>
    </div>
  `,
});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}