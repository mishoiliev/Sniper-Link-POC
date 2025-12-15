# Gmail Sniper Link POC

A proof of concept demonstrating Gmail sniper links in email confirmation flows. This allows users to quickly find confirmation emails in Gmail using filtered search links.

## Features

- ✅ User registration with email validation
- ✅ Real email sending via Resend
- ✅ Gmail sniper links that filter to the exact email
- ✅ Email confirmation flow
- ✅ Beautiful, responsive UI

## Setup

### 1. Install Dependencies

Using bun:
```bash
bun install
```

Or using npm:
```bash
npm install
```

### 2. Set Up Resend

1. Sign up for a free account at [resend.com](https://resend.com)
2. Get your API key from the [API Keys page](https://resend.com/api-keys)
3. (Optional) Verify your domain for custom "from" addresses

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Your verified domain email address (must be verified in Resend)
# For testing, you can use: onboarding@resend.dev
RESEND_FROM_EMAIL=onboarding@resend.dev

# Base URL for your application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run the Development Server

Using bun:
```bash
bun run dev
```

Or using npm:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Gmail Sniper Links

The sniper link uses Gmail's search URL format to automatically filter emails:

```
https://mail.google.com/mail/u/0/#search/from:email@example.com+subject:"Subject"+to:user@example.com+newer_than:1d
```

This link:
- Opens Gmail
- Filters to emails from the specified sender
- Matches the exact subject line
- Filters to the recipient's email
- Shows only emails from the last day

### Email Flow

1. User registers with name and email
2. System sends confirmation email via Resend
3. Email includes:
   - Confirmation link
   - Gmail sniper link (also shown on confirmation page)
4. User clicks sniper link → Gmail opens filtered to their confirmation email
5. User clicks confirmation link → Email verified

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── register/route.ts    # Registration API with email sending
│   │   └── verify/route.ts      # Email verification handler
│   ├── register/page.tsx        # Registration form
│   ├── confirm/page.tsx         # Confirmation page with sniper link
│   └── verified/page.tsx        # Success page
├── lib/
│   └── gmail-sniper.ts          # Gmail sniper link generator
└── .env.local                   # Environment variables (create this)
```

## Gmail Search Operators

The sniper link supports various Gmail search operators:

- `from:email@example.com` - Filter by sender
- `to:email@example.com` - Filter by recipient
- `subject:"exact subject"` - Match exact subject
- `newer_than:1d` - Filter by date (1d, 1h, 7d, etc.)
- `"exact phrase"` - Search for exact phrase

## Testing

1. Register with a Gmail address
2. Check your email (or use the sniper link)
3. Click the confirmation link
4. You should see the verified page

## Notes

- For production, store tokens in a database
- Implement token expiration
- Add rate limiting
- Use a verified domain for better deliverability
- Consider adding email templates
