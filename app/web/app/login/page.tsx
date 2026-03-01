'use client';

import api from '@/lib/api';
import { setAuthTokens, setUserSession } from '@/lib/auth';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Signup states
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/auth/login', {
        email,
        password
      });

      const accessToken = res.data?.access_token;
      const refreshToken = res.data?.refresh_token;

      if (!accessToken || !refreshToken) {
        throw new Error('Invalid login response from server');
      }

      setAuthTokens(accessToken, refreshToken);
      setSuccess('Login successful! Redirecting...');

      setUserSession({
        email,
        loginTime: new Date().toISOString(),
      });

      setTimeout(() => {
        window.location.href = '/customer';
      }, 1000);

    } catch (error: any) {
      console.error("Error Login", error);
      setError(error?.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!fullName || !signupEmail || !signupPassword || !confirmPassword || !institution || !adminCode) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/signup', {
        full_name: fullName,
        email: signupEmail,
        password: signupPassword,
        confirm_password: confirmPassword,
        institution: institution,
        admin_code: adminCode
      });

      setSuccess('Account created successfully! Redirecting to login...');

      setTimeout(() => {
        setFullName('');
        setSignupEmail('');
        setSignupPassword('');
        setConfirmPassword('');
        setInstitution('');
        setAdminCode('');
        setAgreeTerms(false);
        setIsLogin(true);
      }, 1000);
    } catch (error) {
      console.error("Error signing up", error);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setError('');
    setSuccess('');
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-right {
          animation: slideInRight 0.5s ease-out;
        }

        .animate-slide-left {
          animation: slideInLeft 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            EduWatch
          </Link>
          <Link href="/" className="px-4 py-2 text-sm font-medium hover:text-zinc-600 transition">
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
        {/* Left Section - Brand & Info */}
        <div className="hidden lg:flex flex-col justify-center px-12 bg-zinc-900 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Welcome to EduWatch
            </h1>
            <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
              Intelligent classroom monitoring and management system powered by AI
            </p>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white text-zinc-900 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Real-time Analytics</p>
                  <p className="text-sm text-zinc-400">Monitor classroom performance in real-time</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white text-zinc-900 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Automated Attendance</p>
                  <p className="text-sm text-zinc-400">AI-powered facial recognition for accuracy</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white text-zinc-900 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Engagement Tracking</p>
                  <p className="text-sm text-zinc-400">Understand student participation and focus</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-zinc-700">
              <p className="text-sm text-zinc-400">
                © {new Date().getFullYear()} EduWatch. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Form Container */}
        <div className="flex flex-col justify-center px-6 lg:px-12 py-12">
          <div className="max-w-md w-full mx-auto">
            {/* Tab Toggle */}
            <div className="mb-8 flex gap-2 bg-zinc-100 p-1 rounded-lg">
              <button
                onClick={() => toggleForm(true)}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold text-sm transition-all duration-300 ${
                  isLogin
                    ? 'bg-zinc-900 text-white shadow-md'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => toggleForm(false)}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold text-sm transition-all duration-300 ${
                  !isLogin
                    ? 'bg-zinc-900 text-white shadow-md'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Animated Form Container */}
            <div className="relative">
              {/* LOGIN FORM */}
              {isLogin && (
                <div
                  className="animate-slide-right space-y-6"
                >
                  {/* Header */}
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold text-zinc-900 mb-2">Sign In</h2>
                    <p className="text-zinc-600">Enter your credentials to access your account</p>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@college.edu"
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                      />
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                      />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 border border-zinc-300 rounded cursor-pointer"
                        />
                        <span className="text-sm text-zinc-700">Remember me</span>
                      </label>
                      <Link href="/forgot-password" className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition">
                        Forgot password?
                      </Link>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in duration-300">
                        <p className="text-sm font-medium text-red-900">{error}</p>
                      </div>
                    )}

                    {/* Success Message */}
                    {success && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in duration-300">
                        <p className="text-sm font-medium text-green-900">{success}</p>
                      </div>
                    )}

                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-zinc-900 text-white font-semibold rounded-lg hover:bg-zinc-800 transition disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="my-6 flex items-center gap-4">
                    <div className="flex-1 h-px bg-zinc-200"></div>
                    <span className="text-sm text-zinc-600">or</span>
                    <div className="flex-1 h-px bg-zinc-200"></div>
                  </div>

                  {/* Social Login */}
                  <div className="space-y-3">
                    <button className="w-full py-3 border border-zinc-300 rounded-lg font-medium text-zinc-900 hover:bg-zinc-50 transition flex items-center justify-center gap-2">
                      <span>🔐</span>
                      Sign in with Institution ID
                    </button>
                  </div>
                </div>
              )}

              {/* SIGNUP FORM */}
              {!isLogin && (
                <div
                  className="animate-slide-left space-y-6"
                >
                  {/* Header */}
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold text-zinc-900 mb-2">Create Account</h2>
                    <p className="text-zinc-600">Join EduWatch and manage your classroom smartly</p>
                  </div>

                  {/* Signup Form */}
                  <form onSubmit={handleSignup} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="john@college.edu"
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                      />
                    </div>

                    {/* Institution */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Institution Name
                      </label>
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="Your College/University"
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                      />
                    </div>

                    {/* Admin Code */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Admin Code
                      </label>
                      <input
                        type="text"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        placeholder="Your College/University"
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                      />
                      <p className="text-xs text-zinc-500 mt-1">Must be at least 8 characters</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                      />
                    </div>

                    {/* Terms Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 border border-zinc-300 rounded cursor-pointer mt-1 flex-shrink-0"
                      />
                      <span className="text-sm text-zinc-700">
                        I agree to the{' '}
                        <Link href="/terms" className="font-semibold text-zinc-900 hover:text-zinc-600">
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="font-semibold text-zinc-900 hover:text-zinc-600">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in duration-300">
                        <p className="text-sm font-medium text-red-900">{error}</p>
                      </div>
                    )}

                    {/* Success Message */}
                    {success && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in duration-300">
                        <p className="text-sm font-medium text-green-900">{success}</p>
                      </div>
                    )}

                    {/* Signup Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-zinc-900 text-white font-semibold rounded-lg hover:bg-zinc-800 transition disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                      {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                  </form>

                  {/* Benefits */}
                  <div className="mt-6 pt-6 border-t border-zinc-200">
                    <p className="text-xs font-semibold text-zinc-600 uppercase mb-3">Why join EduWatch?</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <span className="text-green-500">✓</span> Real-time classroom analytics
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <span className="text-green-500">✓</span> AI-powered attendance
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <span className="text-green-500">✓</span> Student engagement tracking
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
