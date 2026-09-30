import React, { useState } from 'react';
import { UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Rahul Sharma');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const defaultRahul: UserProfile = {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhwU9iLEZRWiao1RJbIf3ZVrTGkUBH0UXF1qrNLX6MIlC8tzzXMOrKOSdk3hNuEhEybhRUAyzR1T2ppZBuRlvX8vEOAI7TMKcLHz9rtf6y6Ps1YR9ZnMd-MxV4mXk-0i-l4KoWcIT96sqbLC3W0tPRK9Qzu1To__IwRp7w8a6SqHatn1Mhl2UJfOH2DMhtO4lHijOWa3xIZOBSirX7b92BchYhmRX4kTGeQyHmm3yy_MSsLPLBvLFY',
    role: 'Software Engineer',
    verified: true,
    currency: 'INR (₹)',
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#004ac6', '#4b41e1', '#0074a6', '#2563eb'],
      });
      onLogin(defaultRahul);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#004ac6', '#4b41e1', '#2563eb'],
      });

      const userProfile: UserProfile = {
        name: mode === 'signup' && name.trim() ? name.trim() : email.includes('rahul') ? 'Rahul Sharma' : email.split('@')[0],
        email: email.trim(),
        avatarUrl: defaultRahul.avatarUrl,
        verified: true,
        currency: 'INR (₹)',
      };

      onLogin(userProfile);
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      onLogin({
        ...defaultRahul,
        name: 'Rahul Sharma',
        email: 'unamanshlok0045@gmail.com',
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Subtle background ambient lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-surface-container-high shadow-xl relative z-10 transition-all duration-300">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center space-x-2 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance_wallet
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-2xl font-black text-primary tracking-tight">SpendWise</h1>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 font-medium">
            Smart financial audit ledger &amp; instant merchant categorizer
          </p>
        </div>

        {/* Quick Demo Login Preset Button */}
        <div className="mb-5 bg-surface-container-low p-3.5 rounded-2xl border border-surface-container">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Demo Access
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium">Instant 1-Click</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-between bg-surface-container-lowest hover:bg-surface-container border border-primary/30 p-2.5 rounded-xl transition-all active:scale-98 cursor-pointer shadow-xs group"
          >
            <div className="flex items-center space-x-2.5">
              <img
                src={defaultRahul.avatarUrl}
                alt="Rahul Sharma"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-on-surface flex items-center space-x-1">
                  <span>Sign in as Rahul Sharma</span>
                  <span
                    className="material-symbols-outlined text-[13px] text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <div className="text-[10px] text-on-surface-variant">
                  ₹34,250 May Ledger • 42 Transactions
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex p-1 bg-surface-container-low rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-2.5 bg-error-container/30 border border-error/30 rounded-xl flex items-center space-x-2 text-xs text-error font-medium">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-on-surface-variant">
                  person
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-on-surface-variant">
                mail
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-on-surface">Password</label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered email.')}
                  className="text-[11px] text-primary hover:underline cursor-pointer font-medium"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-on-surface-variant">
                lock
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant"
              />
              <span className="text-xs text-on-surface-variant">Remember me on this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-2 bg-primary text-on-primary rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-md hover:bg-primary-container active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In to SpendWise' : 'Create Free Account'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-container" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface-container-lowest px-2 text-on-surface-variant font-medium">
              or continue with
            </span>
          </div>
        </div>

        {/* Social / Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-11 border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2.5 transition-colors cursor-pointer shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Security & Highlights Footer */}
        <div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-around text-[10px] text-on-surface-variant font-medium">
          <span className="flex items-center space-x-1">
            <span className="material-symbols-outlined text-[14px] text-primary">security</span>
            <span>256-bit SSL</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
            <span>Live UPI Sync</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="material-symbols-outlined text-[14px] text-primary">verified_user</span>
            <span>Private &amp; Secure</span>
          </span>
        </div>
      </div>
    </div>
  );
};
