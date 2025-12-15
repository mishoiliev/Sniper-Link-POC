import { NextRequest, NextResponse } from 'next/server';
import { generateGmailSniperLink } from '@/lib/gmail-sniper';

/**
 * API endpoint to generate Gmail sniper links server-side
 * This ensures the from email matches what was used in the actual email
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const subject = searchParams.get('subject') || 'Confirm your email address';

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@buildit.bg';

    const gmailLink = generateGmailSniperLink({
      from: fromEmail,
      subject,
      to: email,
      newerThan: '1d',
    });

    return NextResponse.json({ gmailLink });
  } catch (error) {
    console.error('Gmail link generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

