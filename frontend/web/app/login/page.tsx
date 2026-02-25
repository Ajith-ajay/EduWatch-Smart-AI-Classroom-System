'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate login (replace with actual API call)
    setTimeout(() => {
      if (email && password) {
        // Store login info in localStorage
        localStorage.setItem('eduwatch_user', JSON.stringify({
          email,
          loginTime: new Date().toISOString(),
        }));
        // Redirect to customer dashboard
        window.location.href = '/customer';
      } else {
        setError('Please fill in all fields');
      }
      setLoading(false);
    }, 1000);
  };

  return (
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
      <div className="pt-24 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Section - Brand & Info */}
        <div className="hidden lg:flex flex-col justify-center px-12 py-12 bg-zinc-900 text-white">
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

        {/* Right Section - Login Form */}
        <div className="flex flex-col justify-center px-6 lg:px-12 py-12">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-zinc-900 mb-2">Sign In</h2>
              <p className="text-zinc-600">Enter your credentials to access your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900">{error}</p>
                </div>
              )}

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

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-zinc-200 text-center">
              <p className="text-sm text-zinc-600">
                Don't have an account?{' '}
                <Link href="/signup" className="font-semibold text-zinc-900 hover:text-zinc-600 transition">
                  Request access
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
              <p className="text-xs font-semibold text-zinc-600 uppercase mb-2">Demo Credentials</p>
              <p className="text-xs text-zinc-600">
                Email: <span className="font-mono font-semibold">admin@itech.edu</span>
              </p>
              <p className="text-xs text-zinc-600">
                Password: <span className="font-mono font-semibold">demo123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
