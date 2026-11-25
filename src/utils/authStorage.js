/**
 * Client-side session persistence for StayDesk demo authentication.
 * Uses sessionStorage by default and localStorage only when "Remember Me" is checked.
 * Passwords are never stored in browser storage, and hotel data keys are never modified.
 */
const AUTH_SESSION_KEY = 'staydesk_auth_session_v1';

function parseStoredSession(raw) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.email !== 'string' ||
      !parsed.email.trim()
    ) {
      return null;
    }

    return {
      email: parsed.email,
      name: typeof parsed.name === 'string' ? parsed.name : 'StayDesk Manager',
      role: typeof parsed.role === 'string' ? parsed.role : 'Portfolio Manager',
    };
  } catch {
    return null;
  }
}

export function loadAuthSession() {
  try {
    const localRaw = window.localStorage.getItem(AUTH_SESSION_KEY);
    const localUser = parseStoredSession(localRaw);
    if (localUser) {
      return { user: localUser, rememberMe: true };
    }

    const sessionRaw = window.sessionStorage.getItem(AUTH_SESSION_KEY);
    const sessionUser = parseStoredSession(sessionRaw);
    if (sessionUser) {
      return { user: sessionUser, rememberMe: false };
    }

    return null;
  } catch {
    return null;
  }
}

export function saveAuthSession(user, rememberMe) {
  const safePayload = JSON.stringify({
    email: user.email,
    name: user.name,
    role: user.role,
    signedInAt: new Date().toISOString(),
  });

  try {
    if (rememberMe) {
      window.localStorage.setItem(AUTH_SESSION_KEY, safePayload);
      window.sessionStorage.removeItem(AUTH_SESSION_KEY);
    } else {
      window.sessionStorage.setItem(AUTH_SESSION_KEY, safePayload);
      window.localStorage.removeItem(AUTH_SESSION_KEY);
    }
    return true;
  } catch {
    return false;
  }
}

export function clearAuthSession() {
  try {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
    window.sessionStorage.removeItem(AUTH_SESSION_KEY);
  } catch {
    // Ignore storage access errors gracefully
  }
}
