'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [features, setFeatures] = useState({
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

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    attendanceAlerts: true,
    engagementAlerts: true,
    systemUpdates: false,
  });

  const [general, setGeneral] = useState({
    schoolName: 'Institute of Technology',
    autoBackup: true,
    dataRetention: '90',
  });

  const [saved, setSaved] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedFeatures = localStorage.getItem('eduwatch_features');
    const savedNotifications = localStorage.getItem('eduwatch_notifications');
    const savedGeneral = localStorage.getItem('eduwatch_general');

    if (savedFeatures) setFeatures(JSON.parse(savedFeatures));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedGeneral) setGeneral(JSON.parse(savedGeneral));
  }, []);

  const featuresList = [
    {
      key: 'analytics',
      title: 'Analytics Dashboard',
      description: 'Enable access to comprehensive analytics and performance metrics',
      icon: '📊',
    },
    {
      key: 'attendance',
      title: 'Attendance Reports',
      description: 'Enable attendance tracking and management',
      icon: '✓',
    },
    {
      key: 'monitoring',
      title: 'Classroom Monitoring',
      description: 'Enable real-time classroom monitoring features',
      icon: '👁️',
    },
    {
      key: 'teachers',
      title: 'Teacher Management',
      description: 'Enable teacher profile and assignment management',
      icon: '👨‍🏫',
    },
    {
      key: 'students',
      title: 'Student Records',
      description: 'Enable student information management',
      icon: '📚',
    },
    {
      key: 'classes',
      title: 'Class Management',
      description: 'Enable class information management',
      icon: '🏫',
    },
    {
      key: 'timetable',
      title: 'Timetable Management',
      description: 'Enable class schedule creation and management',
      icon: '📅',
    },
    {
      key: 'substitution',
      title: 'Teacher Substitution',
      description: 'Enable teacher substitution and swap management',
      icon: '🔄',
    },
    {
      key: 'content',
      title: 'Content Management',
      description: 'Enable educational content management',
      icon: '📝',
    },
    {
      key: 'settings',
      title: 'Settings Management',
      description: 'Access to system settings and configuration',
      icon: '⚙️',
    },
  ];

  const toggleFeature = (key: string) => {
    const updatedFeatures = {
      ...features,
      [key]: !features[key as keyof typeof features],
    };
    setFeatures(updatedFeatures);
    localStorage.setItem('eduwatch_features', JSON.stringify(updatedFeatures));
  };

  const toggleNotification = (key: string) => {
    const updatedNotifications = {
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    };
    setNotifications(updatedNotifications);
    localStorage.setItem('eduwatch_notifications', JSON.stringify(updatedNotifications));
  };

  const handleGeneralChange = (key: string, value: any) => {
    const updatedGeneral = {
      ...general,
      [key]: value,
    };
    setGeneral(updatedGeneral);
    localStorage.setItem('eduwatch_general', JSON.stringify(updatedGeneral));
  };

  const handleSave = () => {
    localStorage.setItem('eduwatch_features', JSON.stringify(features));
    localStorage.setItem('eduwatch_notifications', JSON.stringify(notifications));
    localStorage.setItem('eduwatch_general', JSON.stringify(general));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaultFeatures = {
      analytics: true,
      attendance: true,
      monitoring: true,
      teachers: true,
      students: true,
      classes: true,
      substitution: true,
      timetable: true,
      content: true,
      settings: true,
    };
    setFeatures(defaultFeatures);
    setNotifications({
      emailNotifications: true,
      attendanceAlerts: true,
      engagementAlerts: true,
      systemUpdates: false,
    });
    setGeneral({
      schoolName: 'Institute of Technology',
      autoBackup: true,
      dataRetention: '90',
    });
    localStorage.setItem('eduwatch_features', JSON.stringify(defaultFeatures));
    localStorage.removeItem('eduwatch_notifications');
    localStorage.removeItem('eduwatch_general');
  };

  const enabledCount = Object.values(features).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">EduWatch</div>
            <span className="text-xs font-medium bg-zinc-100 px-3 py-1 rounded-full">Settings</span>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="/customer" className="text-sm font-medium hover:text-zinc-600 transition">
              Dashboard
            </Link>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Settings & Configuration</h1>
            <p className="text-zinc-600">Manage system settings and feature availability</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Navigation */}
            <div className="bg-white border border-zinc-200 rounded-lg p-6 h-fit">
              <h3 className="font-semibold text-sm uppercase text-zinc-600 mb-4">Settings</h3>
              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg bg-zinc-900 text-white text-sm font-medium transition">
                  Features
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition">
                  Notifications
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition">
                  General
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition">
                  Security
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Features Section */}
              <div className="bg-white border border-zinc-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Dashboard Features</h2>
                    <p className="text-sm text-zinc-600 mt-1">
                      Toggle features to show/hide on the customer dashboard
                    </p>
                  </div>
                  <div className="bg-zinc-100 px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium text-zinc-900">
                      {enabledCount}/{featuresList.length} Enabled
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuresList.map((feature) => (
                    <div
                      key={feature.key}
                      className="border border-zinc-200 rounded-lg p-4 hover:border-zinc-900 transition flex items-start gap-4"
                    >
                      <div className="text-3xl mt-1">{feature.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-zinc-900 text-sm mb-1">{feature.title}</h3>
                        <p className="text-xs text-zinc-600 mb-3">{feature.description}</p>
                        <button
                          onClick={() => toggleFeature(feature.key)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition ${
                            features[feature.key as keyof typeof features]
                              ? 'bg-green-100 text-green-900'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full mr-2 inline-block" style={{
                            backgroundColor: features[feature.key as keyof typeof features] ? '#16a34a' : '#a1a1a1',
                          }}></span>
                          {features[feature.key as keyof typeof features] ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white border border-zinc-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:border-zinc-900 transition">
                    <div>
                      <h3 className="font-semibold text-zinc-900">Email Notifications</h3>
                      <p className="text-sm text-zinc-600 mt-1">
                        Receive email notifications for system events
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification('emailNotifications')}
                      className={`relative w-14 h-8 rounded-full transition ${
                        notifications.emailNotifications ? 'bg-green-600' : 'bg-zinc-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition transform ${
                          notifications.emailNotifications ? 'translate-x-6' : ''
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:border-zinc-900 transition">
                    <div>
                      <h3 className="font-semibold text-zinc-900">Attendance Alerts</h3>
                      <p className="text-sm text-zinc-600 mt-1">
                        Get alerts for attendance anomalies
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification('attendanceAlerts')}
                      className={`relative w-14 h-8 rounded-full transition ${
                        notifications.attendanceAlerts ? 'bg-green-600' : 'bg-zinc-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition transform ${
                          notifications.attendanceAlerts ? 'translate-x-6' : ''
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:border-zinc-900 transition">
                    <div>
                      <h3 className="font-semibold text-zinc-900">Engagement Alerts</h3>
                      <p className="text-sm text-zinc-600 mt-1">
                        Alert when classroom engagement drops below threshold
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification('engagementAlerts')}
                      className={`relative w-14 h-8 rounded-full transition ${
                        notifications.engagementAlerts ? 'bg-green-600' : 'bg-zinc-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition transform ${
                          notifications.engagementAlerts ? 'translate-x-6' : ''
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:border-zinc-900 transition">
                    <div>
                      <h3 className="font-semibold text-zinc-900">System Updates</h3>
                      <p className="text-sm text-zinc-600 mt-1">
                        Notifications about system updates and maintenance
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification('systemUpdates')}
                      className={`relative w-14 h-8 rounded-full transition ${
                        notifications.systemUpdates ? 'bg-green-600' : 'bg-zinc-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition transform ${
                          notifications.systemUpdates ? 'translate-x-6' : ''
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* General Settings */}
              <div className="bg-white border border-zinc-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">General Settings</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      value={general.schoolName}
                      onChange={(e) => handleGeneralChange('schoolName', e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Data Retention Period (days)
                    </label>
                    <select
                      value={general.dataRetention}
                      onChange={(e) => handleGeneralChange('dataRetention', e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-zinc-900">Automatic Backup</h3>
                      <p className="text-sm text-zinc-600 mt-1">
                        Enable daily automatic backups
                      </p>
                    </div>
                    <button
                      onClick={() => handleGeneralChange('autoBackup', !general.autoBackup)}
                      className={`relative w-14 h-8 rounded-full transition ${
                        general.autoBackup ? 'bg-green-600' : 'bg-zinc-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition transform ${
                          general.autoBackup ? 'translate-x-6' : ''
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={handleSave}
                  className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition"
                >
                  {saved ? '✓ Saved' : 'Save Changes'}
                </button>
                <button 
                  onClick={handleReset}
                  className="px-6 py-3 border border-zinc-300 text-zinc-900 rounded-lg font-medium hover:border-zinc-900 transition"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
