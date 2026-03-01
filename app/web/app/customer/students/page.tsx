'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');

  const classes = ['All', 'A-101', 'A-102', 'B-204', 'B-205', 'C-305'];

  const students = [
    {
      id: 'S001',
      name: 'Aarjav Kumar',
      email: 'aarjav.kumar@student.itech.edu',
      class: 'A-101',
      department: 'CSE',
      rollNo: 'A101001',
      attendance: 94,
      engagement: 89,
    },
    {
      id: 'S002',
      name: 'Bhavna Singh',
      email: 'bhavna.singh@student.itech.edu',
      class: 'A-101',
      department: 'CSE',
      rollNo: 'A101002',
      attendance: 96,
      engagement: 92,
    },
    {
      id: 'S003',
      name: 'Chandra Patel',
      email: 'chandra.patel@student.itech.edu',
      class: 'A-102',
      department: 'CSE',
      rollNo: 'A102001',
      attendance: 88,
      engagement: 85,
    },
    {
      id: 'S004',
      name: 'Deepak Joshi',
      email: 'deepak.joshi@student.itech.edu',
      class: 'A-102',
      department: 'CSE',
      rollNo: 'A102002',
      attendance: 92,
      engagement: 88,
    },
    {
      id: 'S005',
      name: 'Eshita Desai',
      email: 'eshita.desai@student.itech.edu',
      class: 'B-204',
      department: 'ECE',
      rollNo: 'B204001',
      attendance: 97,
      engagement: 95,
    },
    {
      id: 'S006',
      name: 'Farhan Khan',
      email: 'farhan.khan@student.itech.edu',
      class: 'B-205',
      department: 'ECE',
      rollNo: 'B205001',
      attendance: 91,
      engagement: 87,
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getAttendanceColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 80) return 'text-zinc-900';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">EduWatch</div>
            <span className="text-xs font-medium bg-zinc-100 px-3 py-1 rounded-full">Students</span>
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
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Student Records</h1>
              <p className="text-zinc-600">Manage and track student information</p>
            </div>
            <button className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition">
              Export Records
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Total Students</p>
              <p className="text-3xl font-bold text-zinc-900">{students.length}</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Avg Attendance</p>
              <p className="text-3xl font-bold text-green-600">92.5%</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Avg Engagement</p>
              <p className="text-3xl font-bold text-zinc-900">89%</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Classes</p>
              <p className="text-3xl font-bold text-zinc-900">{classes.length - 1}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">Search Student</label>
              <input
                type="text"
                placeholder="Search by name, email, or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">Filter by Class</label>
              <div className="flex gap-2 flex-wrap">
                {classes.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedClass === cls
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-600 uppercase">Roll No</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-600 uppercase">Name</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-600 uppercase">Email</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-600 uppercase">Class</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-zinc-600 uppercase">Attendance</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-zinc-600 uppercase">Engagement</th>
                    <th className="text-right py-4 px-6 text-xs font-semibold text-zinc-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition">
                      <td className="py-4 px-6 text-sm font-medium text-zinc-900">{student.rollNo}</td>
                      <td className="py-4 px-6 text-sm font-medium text-zinc-900">{student.name}</td>
                      <td className="py-4 px-6 text-sm text-zinc-600">{student.email}</td>
                      <td className="py-4 px-6 text-sm text-zinc-900">{student.class}</td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-zinc-100 rounded-full h-2">
                            <div
                              className="bg-zinc-900 h-2 rounded-full"
                              style={{ width: `${student.attendance}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${getAttendanceColor(student.attendance)}`}>
                            {student.attendance}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-sm font-medium text-zinc-900">{student.engagement}%</td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-600">No students found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
