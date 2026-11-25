import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Info, Lock, Mail } from 'lucide-react';
import { DEMO_ACCOUNT, verifyDemoCredentials } from '../config/demoAuth';
import { loginSuccess } from '../redux/authSlice';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginInputs(email, password) {
  const errors = {};
  const trimmedEmail = String(email || '').trim();

  if (!trimmedEmail) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!String(password || '')) {
    errors.password = 'Password is required.';
  }

  return errors;
}

function getFieldClassName(rightPadding = 'pr-3.5') {
  return `staydesk-field h-11 pl-10 ${rightPadding}`;
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [showForgotHelp, setShowForgotHelp] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

  const signedOutNotice = location.state?.loggedOut
    ? 'You have been signed out. Your saved hotel properties remain intact.'
    : '';

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const destination =
    location.state?.from && location.state.from !== '/login'
      ? location.state.from
      : '/';

  const handleEmailChange = (value) => {
    setEmail(value);
    setAuthError('');
    if (fieldErrors.email) {
      const next = validateLoginInputs(value, password);
      setFieldErrors((prev) => ({ ...prev, email: next.email }));
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setAuthError('');
    if (fieldErrors.password) {
      const next = validateLoginInputs(email, value);
      setFieldErrors((prev) => ({ ...prev, password: next.password }));
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setFieldErrors({});
    setAuthError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAuthError('');

    const errors = validateLoginInputs(email, password);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const authenticatedUser = verifyDemoCredentials(email, password);
    if (!authenticatedUser) {
      setAuthError(
        'Incorrect email or password. Please verify your credentials and try again.'
      );
      return;
    }

    dispatch(loginSuccess({ user: authenticatedUser, rememberMe }));
    navigate(destination, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      <Helmet>
        <title>Sign In · StayDesk Hotel Management</title>
        <meta
          name="description"
          content="Sign in to StayDesk to manage your hotel portfolio, rates, property locations, and interactive maps."
        />
      </Helmet>

      <aside className="hidden lg:flex lg:w-1/2 xl:w-[54%] relative overflow-hidden bg-[#0F1E36] text-white flex-col justify-between p-12 xl:p-16">
        {!heroImageError && (
          <img
            src="/src/assets/images/hotel_halcyon_harbor_1795494711795.jpg"
            alt="Waterfront boutique hotel property managed on StayDesk"
            referrerPolicy="no-referrer"
            onError={() => setHeroImageError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0B172A] via-[#0F1E36]/80 to-[#0F1E36]/65"
        />

        <div className="relative z-10">
          <span className="font-display text-2xl font-semibold tracking-tight text-white">
            StayDesk
          </span>
        </div>

        <div className="relative z-10 max-w-lg space-y-5">
          <h2 className="font-display text-4xl font-medium leading-tight tracking-tight text-white text-balance">
            Thoughtful oversight for boutique hotel portfolios.
          </h2>
          <p className="text-base leading-relaxed text-slate-200/90">
            Organize property rates, photography, descriptions, and mapped
            coordinates from one quiet, responsive workspace.
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs text-teal-200/90">
            <span>Portfolio Catalog</span>
            <span aria-hidden="true" className="text-slate-400">
              ·
            </span>
            <span>Interactive Maps</span>
            <span aria-hidden="true" className="text-slate-400">
              ·
            </span>
            <span>Local Browser Persistence</span>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-300/80">
          © {new Date().getFullYear()} StayDesk Hotel Management
        </div>
      </aside>

      <main className="flex-1 flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16 bg-slate-50">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8 lg:hidden">
            <span className="font-display text-2xl font-semibold tracking-tight text-[#0F1E36]">
              StayDesk
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 shadow-xs">
            <header className="mb-6">
              <h1 className="font-display text-3xl font-medium tracking-tight text-[#0F1E36]">
                Welcome Back
              </h1>
              <p className="mt-1.5 text-sm text-slate-600">
                Sign in to manage your hotel properties.
              </p>
            </header>

            {signedOutNotice && !authError && (
              <div
                role="status"
                className="mb-5 flex items-start gap-2.5 rounded-lg border border-teal-200 bg-teal-50/70 px-3.5 py-3 text-xs text-teal-900"
              >
                <CheckCircle2
                  className="w-4 h-4 text-teal-700 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{signedOutNotice}</span>
              </div>
            )}

            {authError && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-medium text-red-800"
              >
                <AlertCircle
                  className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="login-email-input"
                  className="staydesk-label text-sm font-medium text-slate-800 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="login-email-input"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="admin@staydesk.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? 'login-email-error' : undefined
                    }
                    className={getFieldClassName()}
                  />
                </div>
                {fieldErrors.email && (
                  <p
                    id="login-email-error"
                    role="alert"
                    className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
                  >
                    <AlertCircle
                      className="w-3.5 h-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password-input"
                  className="staydesk-label text-sm font-medium text-slate-800 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="login-password-input"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Enter your password"
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                      fieldErrors.password ? 'login-password-error' : undefined
                    }
                    className={getFieldClassName('pr-11')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 inline-flex items-center justify-center text-slate-500 hover:text-slate-800 rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p
                    id="login-password-error"
                    role="alert"
                    className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
                  >
                    <AlertCircle
                      className="w-3.5 h-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{fieldErrors.password}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotHelp((prev) => !prev)}
                  className="text-sm font-medium text-teal-800 hover:text-teal-950 hover:underline underline-offset-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
                >
                  Forgot password?
                </button>
              </div>

              {showForgotHelp && (
                <div
                  role="status"
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600 space-y-2"
                >
                  <p className="flex items-start gap-2">
                    <Info
                      className="w-4 h-4 text-teal-700 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Password recovery is disabled in this frontend-only demo.
                      Use the predefined demo credentials below to sign in.
                    </span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full h-11 mt-2 inline-flex items-center justify-center text-sm font-semibold text-white bg-[#0F1E36] hover:bg-teal-900 active:scale-[0.99] rounded-lg transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-700"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-700">
                  Demo account credentials
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="text-xs font-medium text-teal-800 hover:text-teal-950 hover:underline underline-offset-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
                >
                  Use demo account
                </button>
              </div>
              <dl className="mt-2 space-y-1 text-xs text-slate-600">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="font-mono text-slate-800">
                    {DEMO_ACCOUNT.email}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-slate-500">Password</dt>
                  <dd className="font-mono text-slate-800">
                    {DEMO_ACCOUNT.password}
                  </dd>
                </div>
              </dl>
              <p className="mt-2.5 text-[11px] leading-relaxed text-slate-500">
                Demo authentication only — not intended for production security.
                Passwords are never stored in browser storage.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
