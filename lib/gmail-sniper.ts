/**
 * Generates a Gmail sniper link that opens Gmail and filters to show
 * emails matching the specified criteria.
 * 
 * Gmail search operators:
 * - from:email@example.com
 * - to:email@example.com
 * - subject:keyword
 * - "exact phrase"
 * - has:attachment
 * - newer_than:1d
 * 
 * @param options - Configuration for the Gmail link
 * @param options.from - Email address of the sender
 * @param options.subject - Subject line of the email (optional)
 * @param options.to - Recipient email address (optional)
 * @param options.hasWords - Words that should be in the email (optional)
 * @param options.newerThan - Filter emails newer than (e.g., "1d", "1h", "7d")
 * @returns Gmail URL with search query parameters
 */
export function generateGmailSniperLink(options: {
  from?: string;
  subject?: string;
  to?: string;
  hasWords?: string;
  newerThan?: string;
}): string {
  const baseUrl = 'https://mail.google.com/mail/u/0/#search/';
  const queryParts: string[] = [];

  if (options.from) {
    // Use exact match for better filtering
    queryParts.push(`from:${options.from}`);
  }

  if (options.subject) {
    // Add subject filter
    queryParts.push(`subject:${options.subject}`);
  }

  if (options.to) {
    queryParts.push(`to:${options.to}`);
  }

  if (options.hasWords) {
    queryParts.push(`"${options.hasWords}"`);
  }

  if (options.newerThan) {
    queryParts.push(`newer_than:${options.newerThan}`);
  }

  if (queryParts.length === 0) {
    return 'https://mail.google.com/mail/u/0/#inbox';
  }

  // Join query parts with spaces (Gmail uses space for AND)
  // URL encode the entire query string
  const query = queryParts.join(' ');
  return `${baseUrl}${encodeURIComponent(query)}`;
}

/**
 * Alternative method using the inbox query parameter format
 * This format: https://mail.google.com/mail/u/0/#inbox?q=query
 */
export function generateGmailSniperLinkAlt(options: {
  from?: string;
  subject?: string;
  to?: string;
  hasWords?: string;
}): string {
  const baseUrl = 'https://mail.google.com/mail/u/0/#inbox';
  const queryParts: string[] = [];

  if (options.from) {
    queryParts.push(`from:${options.from}`);
  }

  if (options.subject) {
    const escapedSubject = options.subject.replace(/[+\-&|!(){}[\]^"~*?:\\]/g, '\\$&');
    queryParts.push(`subject:"${escapedSubject}"`);
  }

  if (options.to) {
    queryParts.push(`to:${options.to}`);
  }

  if (options.hasWords) {
    queryParts.push(options.hasWords);
  }

  if (queryParts.length === 0) {
    return baseUrl;
  }

  const query = queryParts.join('+');
  return `${baseUrl}?q=${encodeURIComponent(query)}`;
}

