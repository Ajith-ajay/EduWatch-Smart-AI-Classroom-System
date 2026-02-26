'use client';

import Link from 'next/link';

export default function AnalyticsDashboard() {
  const navigationItems = [
    { name: 'Dashboard', path: '/customer', icon: '📊' },
    { name: 'Analytics', path: '/customer/analytics', icon: '📈', active: true },
    { name: 'Attendance', path: '/customer/attendance', icon: '✓' },
    { name: 'Monitoring', path: '/customer/monitoring', icon: '👁️' },
    { name: 'Teachers', path: '/customer/teachers', icon: '👨‍🏫' },
    { name: 'Students', path: '/customer/students', icon: '📚' },
  ];

  const analyticsData = [
    {
      title: 'Average Attendance Rate',
      value: '94.2%',
      change: '+2.4%',
      trend: 'up',
      color: 'bg-zinc-900',
    },
    {
      title: 'Classes Today',
      value: '24',
      change: '+5',
      trend: 'up',
      color: 'bg-zinc-800',
    },
    {
      title: 'Active Teachers',
      value: '145',
      change: '-3',
      trend: 'down',
      color: 'bg-zinc-700',
    },
    {
      title: 'Student Engagement',
      value: '87.5%',
      change: '+1.2%',
      trend: 'up',
      color: 'bg-zinc-900',
    },
  ];

  const recentActivity = [
    { time: '10:30 AM', event: 'Attendance marked for Class A-101', status: 'completed' },
    { time: '10:15 AM', event: 'Classroom monitoring initiated - Lab 2', status: 'active' },
    { time: '09:45 AM', event: 'Class B-204 attendance completed', status: 'completed' },
    { time: '09:20 AM', event: 'System health check passed', status: 'completed' },
    { time: '08:50 AM', event: 'Daily backup completed', status: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">EduWatch</div>
            <span className="text-xs font-medium bg-zinc-100 px-3 py-1 rounded-full">Analytics</span>
          </div>
          <div className="flex gap-8 items-center">
            <button className="text-sm font-medium hover:text-zinc-600 transition">Profile</button>
            <button className="text-sm font-medium hover:text-zinc-600 transition">Help</button>
            <Link
              href="/login"
              className="px-4 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition"
            >
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-zinc-600">Real-time insights and performance metrics</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium hover:border-zinc-900 transition">
                Today
              </button>
              <button className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium hover:border-zinc-900 transition">
                This Week
              </button>
              <button className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition">
                This Month
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {analyticsData.map((metric, index) => (
              <div
                key={index}
                className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition"
              >
                <p className="text-zinc-600 text-sm mb-3">{metric.title}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-zinc-900 mb-2">{metric.value}</p>
                    <p
                      className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metric.change} from last month
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${metric.color} rounded-lg opacity-10`}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart Area */}
            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Attendance Trend (Last 7 Days)</h2>
              <div className="space-y-4">
                {/* Simplified Chart Representation */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-12 text-sm font-medium text-zinc-600">{day}</span>
                    <div className="flex-1 bg-zinc-100 rounded h-8 relative overflow-hidden">
                      <div
                        className="bg-zinc-900 h-full rounded transition-all"
                        style={{ width: `${85 + Math.random() * 10}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right text-sm font-medium text-zinc-900">
                      {(85 + Math.random() * 10).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-zinc-900 text-white rounded-lg p-6">
                <h3 className="font-semibold mb-4">System Overview</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-zinc-400 text-sm">Classes Running</p>
                    <p className="text-2xl font-bold">18/24</p>
                  </div>
                  <div className="border-t border-zinc-700 pt-3">
                    <p className="text-zinc-400 text-sm">Monitored</p>
                    <p className="text-2xl font-bold">16/18</p>
                  </div>
                  <div className="border-t border-zinc-700 pt-3">
                    <p className="text-zinc-400 text-sm">System Health</p>
                    <p className="text-2xl font-bold">99.8%</p>
                  </div>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white border border-zinc-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Top Classes</h3>
                <div className="space-y-3">
                  {['A-101', 'B-204', 'C-305'].map((cls, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-zinc-100 last:border-0">
                      <span className="text-sm font-medium">{cls}</span>
                      <span className="text-sm bg-zinc-100 px-2 py-1 rounded">97%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-12 bg-white border border-zinc-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-zinc-900"></div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{activity.event}</p>
                      <p className="text-xs text-zinc-600">{activity.time}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      activity.status === 'completed'
                        ? 'bg-zinc-100 text-zinc-900'
                        : 'bg-green-100 text-green-900'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
