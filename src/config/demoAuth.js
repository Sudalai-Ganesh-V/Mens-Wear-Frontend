/**
 * Demo authentication configuration for StayDesk.
 *
 * NOTE: This is frontend-only demo authentication intended solely for local
 * demonstration and portfolio workflows. Do NOT use hardcoded credentials or
 * client-side session checks for production security.
 */
export const DEMO_ACCOUNT = {
  email: 'admin@staydesk.com',
  password: 'StayDesk@2026',
  name: 'Alex Morgan',
  role: 'Portfolio Manager',
};

export function verifyDemoCredentials(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const enteredPassword = String(password || '');

  if (
    normalizedEmail === DEMO_ACCOUNT.email.toLowerCase() &&
    enteredPassword === DEMO_ACCOUNT.password
  ) {
    // Return only non-sensitive profile metadata; never expose or persist the password.
    return {
      email: DEMO_ACCOUNT.email,
      name: DEMO_ACCOUNT.name,
      role: DEMO_ACCOUNT.role,
    };
  }

  return null;
}
