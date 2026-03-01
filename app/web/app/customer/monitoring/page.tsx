'use client';

import Link from 'next/link';

export default function MonitoringPage() {
  const liveClassrooms = [
    {
      id: 1,
      name: 'Class A-101',
      teacher: 'Dr. Rajesh Kumar',
      subject: 'Data Structures',
      students: 42,
      engagement: 87,
      status: 'active',
    },
    {
      id: 2,
      name: 'Class A-102',
      teacher: 'Prof. Priya Sharma',
      subject: 'Web Development',
      students: 38,
      engagement: 92,
      status: 'active',
    },
    {
      id: 3,
      name: 'Class B-204',
      teacher: 'Dr. Amit Patel',
      subject: 'Database Design',
      students: 40,
      engagement: 85,
      status: 'active',
    },
    {
      id: 4,
      name: 'Class B-205',
      teacher: 'Prof. Neha Singh',
      subject: 'Software Engineering',
      students: 41,
      engagement: 89,
      status: 'monitoring',
    },
  ];

  const getEngagementColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 80) return 'text-zinc-900';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">EduWatch</div>
            <span className="text-xs font-medium bg-zinc-100 px-3 py-1 rounded-full">Monitoring</span>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="/customer" className="text-sm font-medium hover:text-zinc-600 transition">
              Dashboard
            </Link>
            <button className="text-sm font-medium hover:text-zinc-600 transition">Help</button>
            <Link
              href="/logout"
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Classroom Monitoring</h1>
            <p className="text-zinc-600">Real-time monitoring of active classrooms</p>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Active Classes</p>
              <p className="text-3xl font-bold text-zinc-900">4</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Total Students</p>
              <p className="text-3xl font-bold text-zinc-900">161</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Avg Engagement</p>
              <p className="text-3xl font-bold text-green-600">88.3%</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">System Health</p>
              <p className="text-3xl font-bold text-zinc-900">99.8%</p>
            </div>
          </div>

          {/* Live Classrooms */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Active Classrooms</h2>
            {liveClassrooms.map((classroom) => (
              <div
                key={classroom.id}
                className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{classroom.name}</h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          classroom.status === 'active' ? 'bg-green-100 text-green-900' : 'bg-yellow-100 text-yellow-900'
                        }`}
                      >
                        {classroom.status === 'active' ? '● Live' : '◐ Monitoring'}
                      </span>
                    </div>
                    <p className="text-zinc-600 text-sm">
                      {classroom.teacher} • {classroom.subject}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition">
                    View Details
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-zinc-50 p-4 rounded-lg">
                    <p className="text-zinc-600 text-sm mb-2">Students Present</p>
                    <p className="text-2xl font-bold text-zinc-900">{classroom.students}</p>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-lg">
                    <p className="text-zinc-600 text-sm mb-2">Engagement Level</p>
                    <p className={`text-2xl font-bold ${getEngagementColor(classroom.engagement)}`}>
                      {classroom.engagement}%
                    </p>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-lg">
                    <p className="text-zinc-600 text-sm mb-2">Duration</p>
                    <p className="text-2xl font-bold text-zinc-900">45m</p>
                  </div>
                </div>

                {/* Engagement Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-zinc-600">Engagement Trend</p>
                    <p className="text-xs text-zinc-500">Last 10 minutes</p>
                  </div>
                  <div className="flex gap-1">
                    {[75, 82, 85, 88, 87, 89, 88, 90, 91, 87].map((value, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-zinc-100 rounded-sm overflow-hidden h-8"
                        style={{
                          backgroundColor:
                            value >= 90 ? '#16a34a' : value >= 80 ? '#3f3f46' : value >= 70 ? '#eab308' : '#ef4444',
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
