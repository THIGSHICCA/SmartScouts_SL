'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [scoutRegNo, setScoutRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, isLoading } = useAuth();

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, scoutRegNo);
  };

  const openForgotModal = () => {
    setForgotEmail(email);
    setResetStep(1);
    setModalError(null);
    setModalSuccess(null);
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
    setShowForgotModal(true);
  };

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setModalError('Please enter your email address.');
      return;
    }
    setModalLoading(true);
    setModalError(null);
    setModalSuccess(null);

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to request password reset token.');
      }

      setResetToken(data.reset_token || '');
      setModalSuccess('Password reset token generated! You can now enter your new password.');
      setResetStep(2);
    } catch (err: any) {
      setModalError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken) {
      setModalError('Reset token is required.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setModalError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setModalError('Passwords do not match.');
      return;
    }

    setModalLoading(true);
    setModalError(null);

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          token: resetToken.trim(),
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setModalSuccess('Password reset successfully! You can now sign in.');
      setPassword(newPassword);
      setEmail(forgotEmail);
      setTimeout(() => {
        setShowForgotModal(false);
      }, 1500);
    } catch (err: any) {
      setModalError(err.message || 'Failed to reset password.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-white/3" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-yellow-300/5" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-5">
          <img src="/images/logo.png" alt="Smart Scouts SL" className="w-20 h-20 object-contain drop-shadow-2xl mb-3" />
          <h1 className="text-2xl font-black text-white">Smart Scouts SL</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <Card className="bg-white rounded-2xl shadow-2xl border-0 px-6 py-6">
          {error && (
            <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                placeholder="scout@example.com"
              />
            </div>

            <div>
              <label htmlFor="scout_reg_no" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Registration Number <span className="text-gray-400 normal-case font-normal">(Scouts &amp; Leaders)</span>
              </label>
              <input
                id="scout_reg_no"
                name="scout_reg_no"
                type="text"
                value={scoutRegNo}
                onChange={(e) => setScoutRegNo(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                placeholder="e.g. S12345 or SL/BT/001"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={openForgotModal}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors underline decoration-slate-300 hover:decoration-slate-900"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 mt-1"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-400">New to Smart Scouts SL?</span>
              </div>
            </div>

            <Link href="/register" className="w-full block">
              <button
                type="button"
                className="w-full h-11 border-2 border-slate-900 text-slate-900 font-black text-sm rounded-xl hover:bg-slate-50 transition-all"
              >
                Create an Account
              </button>
            </Link>
          </form>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 relative border border-slate-100">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all"
            >
              ✕
            </button>

            <div className="mb-4">
              <h2 className="text-xl font-black text-slate-900">Reset Your Password</h2>
              <p className="text-xs text-slate-500 mt-1">
                {resetStep === 1
                  ? "Enter your account email to receive a password reset token."
                  : "Enter the reset token and choose a new password."}
              </p>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium">
                {modalSuccess}
              </div>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleRequestToken} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="scout@example.com"
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-60"
                  >
                    {modalLoading ? 'Generating...' : 'Get Reset Token'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Enter reset token"
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="block w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                      title={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="block w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetStep(1)}
                    className="py-2.5 px-4 border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-60"
                  >
                    {modalLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
