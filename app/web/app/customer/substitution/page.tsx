'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function TeacherSubstitutionPage() {
  const [selectedClass, setSelectedClass] = useState('A-101');
  const [selectedPeriod, setSelectedPeriod] = useState('T001');
  const [selectedToTeacher, setSelectedToTeacher] = useState('');
  const [substitutionDate, setSubstitutionDate] = useState('');
  const [reason, setReason] = useState('');

  const classes = ['A-101', 'A-102', 'B-204', 'B-205', 'C-305'];

  // Sample timetable data
  const timetableData = [
    {
      id: 'T001',
      class: 'A-101',
      subject: 'Data Structures',
      teacher: 'Dr. Rajesh Kumar',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      image: '👨‍🏫',
    },
    {
      id: 'T002',
      class: 'A-101',
      subject: 'Web Development',
      teacher: 'Prof. Priya Sharma',
      day: 'Monday',
      startTime: '10:45',
      endTime: '12:15',
      image: '👩‍🏫',
    },
    {
      id: 'T003',
      class: 'A-101',
      subject: 'Database Design',
      teacher: 'Dr. Amit Patel',
      day: 'Tuesday',
      startTime: '09:00',
      endTime: '10:30',
      image: '👨‍🏫',
    },
  ];

  // All available teachers
  const teachers = [
    {
      id: 'TCH001',
      name: 'Dr. Rajesh Kumar',
      image: '👨‍🏫',
      specialization: 'Data Structures',
      department: 'CSE',
      phone: '+91-9876543210',
    },
    {
      id: 'TCH002',
      name: 'Prof. Priya Sharma',
      image: '👩‍🏫',
      specialization: 'Web Development',
      department: 'CSE',
      phone: '+91-9876543211',
    },
    {
      id: 'TCH003',
      name: 'Dr. Amit Patel',
      image: '👨‍🏫',
      specialization: 'Database Design',
      department: 'CSE',
      phone: '+91-9876543212',
    },
    {
      id: 'TCH004',
      name: 'Prof. Neha Singh',
      image: '👩‍🏫',
      specialization: 'Software Engineering',
      department: 'CSE',
      phone: '+91-9876543213',
    },
    {
      id: 'TCH005',
      name: 'Dr. Vikram Sharma',
      image: '👨‍🏫',
      specialization: 'Cloud Computing',
      department: 'CSE',
      phone: '+91-9876543214',
    },
  ];

  // Sample substitution history
  const substitutionHistory = [
    {
      id: 'SUB001',
      fromTeacher: 'Dr. Rajesh Kumar',
      toTeacher: 'Prof. Neha Singh',
      period: 'Data Structures - Monday 09:00',
      date: '2024-02-20',
      reason: 'Teacher absent - Medical emergency',
      status: 'Approved',
    },
    {
      id: 'SUB002',
      fromTeacher: 'Prof. Priya Sharma',
      toTeacher: 'Dr. Vikram Sharma',
      period: 'Web Development - Wednesday 10:45',
      date: '2024-02-18',
      reason: 'Urgent departmental meeting',
      status: 'Approved',
    },
    {
      id: 'SUB003',
      fromTeacher: 'Dr. Amit Patel',
      toTeacher: 'Dr. Rajesh Kumar',
      period: 'Database Design - Thursday 14:00',
      date: '2024-02-15',
      reason: 'Conference attendance',
      status: 'Approved',
    },
  ];

  const periodsForSelectedClass = timetableData.filter((t) => t.class === selectedClass);
  const currentPeriod = periodsForSelectedClass.find((p) => p.id === selectedPeriod);
  const fromTeacher = teachers.find((t) => t.name === currentPeriod?.teacher);
  const toTeacher = teachers.find((t) => t.id === selectedToTeacher);

  const handleSubmit = () => {
    if (currentPeriod && toTeacher && substitutionDate && reason) {
      alert(
        `Substitution request submitted!\nFrom: ${fromTeacher?.name}\nTo: ${toTeacher.name}\nDate: ${substitutionDate}`
      );
      setSelectedToTeacher('');
      setSubstitutionDate('');
      setReason('');
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">EduWatch</div>
            <span className="text-xs font-medium bg-zinc-100 px-3 py-1 rounded-full">Substitution</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/customer/substitution/history"
              className="px-4 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition"
            >
              📊 Requests & History
            </Link>
            <Link
              href="/customer"
              className="text-sm font-medium hover:text-zinc-600 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition"
            >
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Teacher Substitution</h1>
            <p className="text-zinc-600">Manage teacher substitutions and swaps</p>
          </div>

          {/* Selection Section */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Step 1: Select Class and Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Selection */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  Select Class *
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setSelectedPeriod(
                      timetableData.find((t) => t.class === e.target.value)?.id || ''
                    );
                  }}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                >
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Period Selection */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  Select Period *
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                >
                  {periodsForSelectedClass.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.subject} - {period.day} {period.startTime}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Period Details */}
            {currentPeriod && (
              <div className="mt-6 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                <p className="text-sm text-zinc-600 mb-2">Selected Period Details:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-600">Subject</p>
                    <p className="font-semibold text-zinc-900">{currentPeriod.subject}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600">Day</p>
                    <p className="font-semibold text-zinc-900">{currentPeriod.day}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600">Time</p>
                    <p className="font-semibold text-zinc-900">
                      {currentPeriod.startTime} - {currentPeriod.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-600">Class</p>
                    <p className="font-semibold text-zinc-900">{currentPeriod.class}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Teacher Comparison Section */}
          {currentPeriod && fromTeacher && (
            <div className="bg-white border border-zinc-200 rounded-lg p-8 mb-8">
              <h2 className="text-xl font-bold mb-8">Step 2: Teacher Substitution</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* From Teacher Card */}
                <div className="border-2 border-zinc-900 rounded-lg p-8 bg-zinc-900 text-white">
                  <p className="text-sm font-semibold text-zinc-300 uppercase mb-4">From (Current)</p>

                  {/* Teacher Image */}
                  <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center text-6xl mb-6 mx-auto">
                    {fromTeacher.image}
                  </div>

                  {/* Teacher Info */}
                  <div className="text-center mb-6 pb-6 border-b border-zinc-700">
                    <h3 className="text-2xl font-bold mb-2">{fromTeacher.name}</h3>
                    <p className="text-zinc-400 text-sm">{fromTeacher.specialization}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Department</span>
                      <span className="font-semibold">{fromTeacher.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Subject</span>
                      <span className="font-semibold">{currentPeriod.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Contact</span>
                      <span className="font-semibold">{fromTeacher.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Status</span>
                      <span className="font-semibold text-red-400">Absent/Unavailable</span>
                    </div>
                  </div>
                </div>

                {/* To Teacher Card */}
                <div className="border-2 border-zinc-300 rounded-lg p-8 bg-zinc-50">
                  <p className="text-sm font-semibold text-zinc-600 uppercase mb-4">To (Replacement)</p>

                  {/* Teacher Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Select Replacement Teacher *
                    </label>
                    <select
                      value={selectedToTeacher}
                      onChange={(e) => setSelectedToTeacher(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      <option value="">Choose a teacher...</option>
                      {teachers
                        .filter((t) => t.name !== fromTeacher.name)
                        .map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name} - {teacher.specialization}
                          </option>
                        ))}
                    </select>
                  </div>

                  {toTeacher ? (
                    <>
                      {/* Teacher Image */}
                      <div className="w-24 h-24 bg-white border-2 border-zinc-300 rounded-lg flex items-center justify-center text-6xl mb-6 mx-auto">
                        {toTeacher.image}
                      </div>

                      {/* Teacher Info */}
                      <div className="text-center mb-6 pb-6 border-b border-zinc-300">
                        <h3 className="text-2xl font-bold text-zinc-900 mb-2">{toTeacher.name}</h3>
                        <p className="text-zinc-600 text-sm">{toTeacher.specialization}</p>
                      </div>

                      {/* Details */}
                      <div className="space-y-4 text-sm text-zinc-900">
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Department</span>
                          <span className="font-semibold">{toTeacher.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Subject</span>
                          <span className="font-semibold">{toTeacher.specialization}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Contact</span>
                          <span className="font-semibold">{toTeacher.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Status</span>
                          <span className="font-semibold text-green-600">Available</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-center">
                      <p className="text-zinc-600">Select a replacement teacher to see details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Substitution Details Form */}
          {currentPeriod && toTeacher && (
            <div className="bg-white border border-zinc-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">Step 3: Substitution Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">
                    Substitution Date *
                  </label>
                  <input
                    type="date"
                    value={substitutionDate}
                    onChange={(e) => setSubstitutionDate(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">
                    Reason for Substitution *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                  >
                    <option value="">Select reason...</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Urgent Personal Work">Urgent Personal Work</option>
                    <option value="Departmental Meeting">Departmental Meeting</option>
                    <option value="Conference Attendance">Conference Attendance</option>
                    <option value="Absence">Absence</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Substitution Summary */}
              <div className="mt-8 p-6 bg-zinc-50 border border-zinc-200 rounded-lg">
                <p className="text-sm font-semibold text-zinc-600 uppercase mb-4">Substitution Summary</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-300">
                    <span className="text-zinc-600">Subject</span>
                    <span className="font-semibold text-zinc-900">{currentPeriod.subject}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-300">
                    <span className="text-zinc-600">Period</span>
                    <span className="font-semibold text-zinc-900">
                      {currentPeriod.day} {currentPeriod.startTime} - {currentPeriod.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-300">
                    <span className="text-zinc-600">From Teacher</span>
                    <span className="font-semibold text-zinc-900">{fromTeacher?.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-300">
                    <span className="text-zinc-600">To Teacher</span>
                    <span className="font-semibold text-zinc-900">{toTeacher.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-300">
                    <span className="text-zinc-600">Date</span>
                    <span className="font-semibold text-zinc-900">{substitutionDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600">Reason</span>
                    <span className="font-semibold text-zinc-900">{reason}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setSelectedClass('A-101');
                    setSelectedPeriod('T001');
                    setSelectedToTeacher('');
                    setSubstitutionDate('');
                    setReason('');
                  }}
                  className="flex-1 px-6 py-3 border border-zinc-300 text-zinc-900 rounded-lg font-medium hover:border-zinc-900 transition"
                >
                  Clear Form
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition"
                >
                  Submit Substitution
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
