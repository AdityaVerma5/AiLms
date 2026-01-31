/**
 * Free tier: 5 course creations per user.
 * Whitelisted emails and paid members (isMember) get unlimited.
 */

export const FREE_CREDIT_LIMIT = 5;

export const WHITELISTED_EMAILS = [
  "adityavermabits@gmail.com",
  "gaurastik@gmail.com",
].map((e) => e.toLowerCase());

export function isWhitelisted(email) {
  if (!email || typeof email !== "string") return false;
  return WHITELISTED_EMAILS.includes(email.toLowerCase().trim());
}

/** Returns null if user has unlimited credits, else the numeric limit (5). */
export function getCreditLimit(email, isMember) {
  if (isWhitelisted(email) || isMember) return null;
  return FREE_CREDIT_LIMIT;
}
