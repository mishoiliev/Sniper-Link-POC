import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return NextResponse.redirect(
      new URL('/confirm?error=missing_params', request.url)
    );
  }

  // In a real app, you would:
  // 1. Look up the token in your database
  // 2. Verify it matches the email
  // 3. Check if it's expired
  // 4. Mark the email as verified
  // 5. Activate the user account

  // For this POC, we'll just simulate verification
  console.log('=== EMAIL VERIFICATION ===');
  console.log('Email:', email);
  console.log('Token:', token);
  console.log('Status: Verified (simulated)');
  console.log('==========================');

  // Redirect to success page
  return NextResponse.redirect(
    new URL(`/verified?email=${encodeURIComponent(email)}`, request.url)
  );
}

