'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CustomerDashboard() {
  const [activeMenu, setActiveMenu] = useState('overview');
  const [enabledFeatures, setEnabledFeatures] = useState({
    analytics: true,
    attendance: true,
    monitoring: true,
    teachers: true,
    students: true,
    classes: true,
    timetable: true,
    substitution: true,
    content: true,
    settings: true,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedFeatures = localStorage.getItem('eduwatch_features');
    if (savedFeatures) {
      setEnabledFeatures(JSON.parse(savedFeatures));
    }
  }, []);

  // College/Institution Details
  const collegeDetails = {
    name: 'Velammal Engineering College',
    code: '1120',
    principal: 'Dr. Satish Kumar',
    location: 'Chennai, India',
    established: '1995',
    email: 'admin@velammal.edu.in',
    phone: '+91-9047251565',
    website: 'www.velammal.edu.in',
    totalTeachers: 150,
    totalStudents: 3500,
    totalClasses: 85,
    totalDepartments: 12,
  };

  // All action items (will be filtered based on enabledFeatures)
  const allActionItems = [
    {
      key: 'analytics',
      title: 'Analytics Dashboard',
      description: 'View comprehensive analytics and insights',
      icon: '📊',
      path: '/customer/analytics',
      color: 'bg-zinc-900',
    },
    {
      key: 'attendance',
      title: 'Attendance Reports',
      description: 'Track and manage attendance records',
      icon: '✓',
      path: '/customer/attendance',
      color: 'bg-zinc-700',
    },
    {
      key: 'monitoring',
      title: 'Classroom Monitoring',
      description: 'Real-time classroom monitoring',
      icon: '👁️',
      path: '/customer/monitoring',
      color: 'bg-zinc-800',
    },
    {
      key: 'teachers',
      title: 'Teacher Management',
      description: 'Manage teacher profiles and assignments',
      icon: '👨‍🏫',
      path: '/customer/teachers',
      color: 'bg-zinc-600',
    },
    {
      key: 'students',
      title: 'Student Records',
      description: 'Manage student information',
      icon: '📚',
      path: '/customer/students',
      color: 'bg-zinc-700',
    },
    {
      key: 'classes',
      title: 'Class Management',
      description: 'Manage classes by department and semester',
      icon: '🏫',
      path: '/customer/classes',
      color: 'bg-zinc-900',
    },
    {
      key: 'timetable',
      title: 'Timetable Management',
      description: 'Create and manage class schedules',
      icon: '📅',
      path: '/customer/timetable',
      color: 'bg-zinc-900',
    },
    {
      key: 'substitution',
      title: 'Teacher Substitution',
      description: 'Manage teacher substitutions and swaps',
      icon: '🔄',
      path: '/customer/substitution',
      color: 'bg-zinc-700',
    },
    {
      key: 'content',
      title: 'Content Management',
      description: 'Manage educational content',
      icon: '📝',
      path: '/customer/content',
      color: 'bg-zinc-800',
    },
    {
      key: 'settings',
      title: 'Settings & Configuration',
      description: 'System settings and preferences',
      icon: '⚙️',
      path: '/customer/settings',
      color: 'bg-zinc-600',
    },
  ];

  // Filter action items based on enabled features
  const actionItems = allActionItems.filter(
    (item) => enabledFeatures[item.key as keyof typeof enabledFeatures]
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold tracking-tight">EduWatch</div>
            <span className="text-xs font-medium bg-zinc-100 px-3 py-1 rounded-full">Customer Portal</span>
          </div>
          <div className="flex gap-8 items-center">
            <button className="text-sm font-medium hover:text-zinc-600 transition">Profile</button>
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

      {/* Main Content */}
      <div className="pt-24 min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 pb-12">
        {/* Left Section - College Details */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Main College Card */}
            <div className="bg-zinc-900 text-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">{collegeDetails.name}</h2>
              <p className="text-zinc-400 text-sm mb-6">Institution ID: {collegeDetails.code}</p>

              <div className="space-y-4 border-t border-zinc-700 pt-6">
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wide">Principal</p>
                  <p className="font-medium text-lg">{collegeDetails.principal}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wide">Location</p>
                  <p className="font-medium">{collegeDetails.location}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wide">Established</p>
                  <p className="font-medium">{collegeDetails.established}</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="space-y-3">
              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                <p className="text-xs text-zinc-600 uppercase tracking-wide">Total Teachers</p>
                <p className="text-3xl font-bold text-zinc-900">{collegeDetails.totalTeachers}</p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                <p className="text-xs text-zinc-600 uppercase tracking-wide">Total Students</p>
                <p className="text-3xl font-bold text-zinc-900">{collegeDetails.totalStudents}</p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                <p className="text-xs text-zinc-600 uppercase tracking-wide">Active Classes</p>
                <p className="text-3xl font-bold text-zinc-900">{collegeDetails.totalClasses}</p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                <p className="text-xs text-zinc-600 uppercase tracking-wide">Departments</p>
                <p className="text-3xl font-bold text-zinc-900">{collegeDetails.totalDepartments}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white border border-zinc-200 p-6 rounded-lg space-y-3">
              <h3 className="font-semibold text-sm mb-4">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-zinc-600">Email</p>
                  <p className="font-medium text-zinc-900">{collegeDetails.email}</p>
                </div>
                <div>
                  <p className="text-zinc-600">Phone</p>
                  <p className="font-medium text-zinc-900">{collegeDetails.phone}</p>
                </div>
                <div>
                  <p className="text-zinc-600">Website</p>
                  <Link href={collegeDetails.website} className="font-medium text-zinc-900 hover:text-zinc-700 transition">
                    {collegeDetails.website}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="lg:col-span-2">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-zinc-600 mb-8">Access all modules and features</p>

            {/* Action Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actionItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="group bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{item.icon}</span>
                    <div
                      className={`w-3 h-3 rounded-full ${item.color} group-hover:opacity-100 opacity-60 transition`}
                    ></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-zinc-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-600">{item.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-zinc-900 group-hover:gap-2 transition">
                    Access <span className="ml-auto">→</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Stats Section */}
            <div className="mt-12 bg-zinc-50 border border-zinc-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-8">System Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-zinc-600 text-sm uppercase tracking-wide mb-2">Platform Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="font-semibold">Operational</p>
                  </div>
                </div>
                <div>
                  <p className="text-zinc-600 text-sm uppercase tracking-wide mb-2">Last Updated</p>
                  <p className="font-semibold">Today at 10:30 AM</p>
                </div>
                <div>
                  <p className="text-zinc-600 text-sm uppercase tracking-wide mb-2">Active Sessions</p>
                  <p className="font-semibold">24 Users Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}