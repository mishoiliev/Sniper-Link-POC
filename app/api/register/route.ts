import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateGmailSniperLink } from '@/lib/gmail-sniper';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured. Please set RESEND_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@buildit.bg';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Generate a confirmation token (in production, this would be stored in DB)
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);

    const confirmationSubject = 'Confirm your email address';
    const confirmationUrl = `${baseUrl}/api/verify?token=${token}&email=${encodeURIComponent(email)}`;
    
    // Generate the Gmail sniper link with better filtering
    // Include recipient email and recent time filter for better accuracy
    const gmailLink = generateGmailSniperLink({
      from: fromEmail,
      subject: confirmationSubject,
      to: email,
      newerThan: '1d', // Filter to emails from the last day
    });

    // Send the actual email
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: confirmationSubject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome, ${name}!</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for registering! Please confirm your email address by clicking the button below:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmationUrl}" 
                   style="display: inline-block; background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Confirm Email Address
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <strong>Quick Tip:</strong> Can't find this email? 
                <a href="${gmailLink}" style="color: #667eea; text-decoration: none; font-weight: 600;">
                  Click here to open Gmail and find it automatically
                </a>
              </p>
              
              <p style="font-size: 12px; color: #999; margin-top: 20px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${confirmationUrl}" style="color: #667eea; word-break: break-all;">${confirmationUrl}</a>
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome, ${name}!

Thank you for registering! Please confirm your email address by clicking the link below:

${confirmationUrl}

Quick Tip: Can't find this email? Open Gmail using this link:
${gmailLink}

If you didn't create an account, you can safely ignore this email.
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('=== EMAIL SENT ===');
    console.log('Email ID:', data?.id);
    console.log('To:', email);
    console.log('Subject:', confirmationSubject);
    console.log('Gmail Sniper Link:', gmailLink);
    console.log('==================');

    return NextResponse.json({
      success: true,
      token,
      message: 'Registration successful. Please check your email.',
      gmailLink, // Include in response for POC demonstration
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

