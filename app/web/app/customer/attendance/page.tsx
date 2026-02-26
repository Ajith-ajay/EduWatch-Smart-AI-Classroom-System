'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('A-101');
  const [filterStatus, setFilterStatus] = useState('all');

  const classes = ['A-101', 'A-102', 'B-204', 'B-205', 'C-305', 'C-306'];

  const attendanceRecords = [
    { id: 1, studentId: 'S001', name: 'Aarjav Kumar', status: 'present', time: '09:00 AM', confidence: 98 },
    { id: 2, studentId: 'S002', name: 'Bhavna Singh', status: 'present', time: '09:02 AM', confidence: 96 },
    { id: 3, studentId: 'S003', name: 'Chandra Patel', status: 'absent', time: '-', confidence: 0 },
    { id: 4, studentId: 'S004', name: 'Deepak Joshi', status: 'present', time: '09:05 AM', confidence: 99 },
    { id: 5, studentId: 'S005', name: 'Eshita Desai', status: 'late', time: '09:25 AM', confidence: 97 },
    { id: 6, studentId: 'S006', name: 'Farhan Khan', status: 'present', time: '09:01 AM', confidence: 95 },
    { id: 7, studentId: 'S007', name: 'Gauri Sharma', status: 'present', time: '09:03 AM', confidence: 98 },
    { id: 8, studentId: 'S008', name: 'Harish Verma', status: 'absent', time: '-', confidence: 0 },
  ];

  const filteredRecords = attendanceRecords.filter((record) => {
    if (filterStatus === 'all') return true;
    return record.status === filterStatus;
  });

  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter((r) => r.status === 'present').length,
    absent: attendanceRecords.filter((r) => r.status === 'absent').length,
    late: attendanceRecords.filter((r) => r.status === 'late').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-900';
      case 'absent':
        return 'bg-red-100 text-red-900';
      case 'late':
        return 'bg-yellow-100 text-yellow-900';
      default:
        return 'bg-zinc-100 text-zinc-900';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">EduWatch</div>
            <span className="text-xs font-medium bg-zinc-100 px-3 py-1 rounded-full">Attendance</span>
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
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Attendance Management</h1>
              <p className="text-zinc-600">Track and manage class attendance records</p>
            </div>
            <button className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition">
              Export Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Total Students</p>
              <p className="text-3xl font-bold text-zinc-900">{stats.total}</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Present</p>
              <p className="text-3xl font-bold text-green-600">{stats.present}</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Absent</p>
              <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Late</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.late}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Class Selection */}
            <div className="bg-white border border-zinc-200 rounded-lg p-6 h-fit">
              <h3 className="font-semibold mb-4">Select Class</h3>
              <div className="space-y-2">
                {classes.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                      selectedClass === cls
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content - Attendance Records */}
            <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Class {selectedClass} - Today</h2>
                <div className="flex gap-2">
                  {['all', 'present', 'absent', 'late'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                        filterStatus === status
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 uppercase">ID</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 uppercase">Name</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 uppercase">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 uppercase">Time</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 uppercase">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                        <td className="py-3 px-4 text-sm font-medium text-zinc-900">{record.studentId}</td>
                        <td className="py-3 px-4 text-sm text-zinc-900">{record.name}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                              record.status
                            )}`}
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-zinc-600">{record.time}</td>
                        <td className="py-3 px-4 text-sm font-medium text-zinc-900">
                          {record.confidence > 0 ? `${record.confidence}%` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredRecords.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-zinc-600">No records found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
