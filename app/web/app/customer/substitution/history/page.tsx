'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SubstitutionAdminPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'history'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<string | null>('REQ001');
  const [actionReason, setActionReason] = useState('');

  // Sample swap requests from teachers (from mobile app)
  const [swapRequests, setSwapRequests] = useState([
    {
      id: 'REQ001',
      fromTeacherId: 'TCH001',
      fromTeacher: 'Dr. Rajesh Kumar',
      fromTeacherImage: '👨‍🏫',
      toTeacherId: '',
      toTeacher: 'To be assigned',
      toTeacherImage: '❓',
      period: 'Data Structures - Monday 09:00-10:30',
      class: 'A-101',
      date: '2024-02-26',
      reason: 'Medical Emergency - Doctor Appointment',
      status: 'Pending',
      createdAt: '2024-02-24 14:30',
      department: 'CSE',
      subject: 'Data Structures',
    },
    {
      id: 'REQ002',
      fromTeacherId: 'TCH002',
      fromTeacher: 'Prof. Priya Sharma',
      fromTeacherImage: '👩‍🏫',
      toTeacherId: '',
      toTeacher: 'To be assigned',
      toTeacherImage: '❓',
      period: 'Web Development - Wednesday 10:45-12:15',
      class: 'A-101',
      date: '2024-02-27',
      reason: 'Urgent Departmental Meeting',
      status: 'Pending',
      createdAt: '2024-02-24 10:15',
      department: 'CSE',
      subject: 'Web Development',
    },
    {
      id: 'REQ003',
      fromTeacherId: 'TCH003',
      fromTeacher: 'Dr. Amit Patel',
      fromTeacherImage: '👨‍🏫',
      toTeacherId: '',
      toTeacher: 'To be assigned',
      toTeacherImage: '❓',
      period: 'Database Design - Friday 14:00-15:30',
      class: 'B-204',
      date: '2024-02-28',
      reason: 'Personal Emergency',
      status: 'Pending',
      createdAt: '2024-02-23 16:45',
      department: 'CSE',
      subject: 'Database Design',
    },
  ]);

  // Available teachers for assignment
  const availableTeachers = [
    {
      id: 'TCH004',
      name: 'Prof. Neha Singh',
      image: '👩‍🏫',
      specialization: 'Software Engineering',
      department: 'CSE',
      phone: '+91-9876543213',
      available: true,
    },
    {
      id: 'TCH005',
      name: 'Dr. Vikram Sharma',
      image: '👨‍🏫',
      specialization: 'Cloud Computing',
      department: 'CSE',
      phone: '+91-9876543214',
      available: true,
    },
    {
      id: 'TCH006',
      name: 'Prof. Anjali Gupta',
      image: '👩‍🏫',
      specialization: 'AI & ML',
      department: 'CSE',
      phone: '+91-9876543215',
      available: false,
    },
  ];

  // Completed/Approved history
  const [swapHistory, setSwapHistory] = useState([
    {
      id: 'SUB001',
      fromTeacher: 'Dr. Rajesh Kumar',
      fromTeacherImage: '👨‍🏫',
      toTeacher: 'Prof. Neha Singh',
      toTeacherImage: '👩‍🏫',
      period: 'Data Structures - Monday 09:00-10:30',
      class: 'A-101',
      date: '2024-02-20',
      reason: 'Medical Emergency',
      status: 'Approved',
      approvedAt: '2024-02-24 15:00',
      approvedBy: 'Admin',
    },
    {
      id: 'SUB002',
      fromTeacher: 'Prof. Priya Sharma',
      fromTeacherImage: '👩‍🏫',
      toTeacher: 'Dr. Vikram Sharma',
      toTeacherImage: '👨‍🏫',
      period: 'Web Development - Wednesday 10:45-12:15',
      class: 'A-101',
      date: '2024-02-18',
      reason: 'Urgent Departmental Meeting',
      status: 'Approved',
      approvedAt: '2024-02-23 14:30',
      approvedBy: 'Admin',
    },
    {
      id: 'SUB003',
      fromTeacher: 'Dr. Nikita Verma',
      fromTeacherImage: '👩‍🏫',
      toTeacher: 'Dr. Rajesh Kumar',
      toTeacherImage: '👨‍🏫',
      period: 'Database Design - Thursday 14:00-15:30',
      class: 'C-305',
      date: '2024-02-15',
      reason: 'Conference Attendance',
      status: 'Rejected',
      approvedAt: '2024-02-22 10:00',
      approvedBy: 'Admin',
    },
  ]);

  const currentRequest = swapRequests.find((r) => r.id === selectedRequest);

  const handleApproveRequest = (toTeacherId: string) => {
    if (!toTeacherId) {
      alert('Please select a replacement teacher');
      return;
    }

    const toTeacher = availableTeachers.find((t) => t.id === toTeacherId);
    if (!currentRequest || !toTeacher) return;

    // Add to history
    setSwapHistory([
      ...swapHistory,
      {
        id: `SUB${swapHistory.length + 1}`.padStart(6, '0'),
        fromTeacher: currentRequest.fromTeacher,
        fromTeacherImage: currentRequest.fromTeacherImage,
        toTeacher: toTeacher.name,
        toTeacherImage: toTeacher.image,
        period: currentRequest.period,
        class: currentRequest.class,
        date: currentRequest.date,
        reason: currentRequest.reason,
        status: 'Approved',
        approvedAt: new Date().toLocaleString(),
        approvedBy: 'Admin',
      },
    ]);

    // Remove from requests
    setSwapRequests(swapRequests.filter((r) => r.id !== selectedRequest));
    setSelectedRequest(swapRequests[0]?.id || null);
    setActionReason('');
    alert('Request Approved Successfully!');
  };

  const handleRejectRequest = () => {
    if (!actionReason) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!currentRequest) return;

    // Add to history as rejected
    setSwapHistory([
      ...swapHistory,
      {
        id: `SUB${swapHistory.length + 1}`.padStart(6, '0'),
        fromTeacher: currentRequest.fromTeacher,
        fromTeacherImage: currentRequest.fromTeacherImage,
        toTeacher: 'Not Assigned',
        toTeacherImage: '❌',
        period: currentRequest.period,
        class: currentRequest.class,
        date: currentRequest.date,
        reason: currentRequest.reason + ' | Rejection: ' + actionReason,
        status: 'Rejected',
        approvedAt: new Date().toLocaleString(),
        approvedBy: 'Admin',
      },
    ]);

    // Remove from requests
    setSwapRequests(swapRequests.filter((r) => r.id !== selectedRequest));
    setSelectedRequest(swapRequests[0]?.id || null);
    setActionReason('');
    alert('Request Rejected Successfully!');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">EduWatch</div>
            <span className="text-xs font-medium bg-zinc-100 px-3 py-1 rounded-full">Admin - Substitution</span>
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
            <h1 className="text-4xl font-bold mb-2">Substitution & Swap Management</h1>
            <p className="text-zinc-600">Review and approve teacher swap requests from mobile app</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b border-zinc-200">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-3 font-medium transition border-b-2 ${
                activeTab === 'requests'
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
              }`}
            >
              🔔 Pending Requests ({swapRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-medium transition border-b-2 ${
                activeTab === 'history'
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
              }`}
            >
              📋 Swap History ({swapHistory.length})
            </button>
          </div>

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Requests List */}
              <div className="lg:col-span-1 space-y-3">
                <h3 className="text-lg font-bold mb-4">Pending Requests</h3>
                {swapRequests.length > 0 ? (
                  swapRequests.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => setSelectedRequest(req.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        selectedRequest === req.id
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : 'border-zinc-200 bg-white hover:border-zinc-900'
                      }`}
                    >
                      <p className="font-semibold text-sm mb-1">{req.fromTeacher}</p>
                      <p className={`text-xs ${selectedRequest === req.id ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {req.period}
                      </p>
                      <p className={`text-xs mt-2 ${selectedRequest === req.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {req.createdAt}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-green-900 font-medium">✓ No pending requests</p>
                  </div>
                )}
              </div>

              {/* Request Details */}
              <div className="lg:col-span-2">
                {currentRequest ? (
                  <div className="bg-white border border-zinc-200 rounded-lg p-8">
                    <h3 className="text-2xl font-bold mb-8">Swap Request Details</h3>

                    {/* Period Info */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 mb-8">
                      <p className="text-sm font-semibold text-zinc-600 uppercase mb-4">Period Information</p>
                      <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                          <p className="text-zinc-600">Class</p>
                          <p className="font-semibold text-zinc-900">{currentRequest.class}</p>
                        </div>
                        <div>
                          <p className="text-zinc-600">Subject</p>
                          <p className="font-semibold text-zinc-900">{currentRequest.subject}</p>
                        </div>
                        <div>
                          <p className="text-zinc-600">Period</p>
                          <p className="font-semibold text-zinc-900">{currentRequest.period}</p>
                        </div>
                        <div>
                          <p className="text-zinc-600">Date</p>
                          <p className="font-semibold text-zinc-900">{currentRequest.date}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-zinc-600">Reason</p>
                          <p className="font-semibold text-zinc-900">{currentRequest.reason}</p>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Swap Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* From Teacher */}
                      <div className="border-2 border-zinc-900 rounded-lg p-6 bg-zinc-900 text-white">
                        <p className="text-xs font-semibold text-zinc-300 uppercase mb-4">From Teacher</p>
                        <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-5xl mb-4 mx-auto">
                          {currentRequest.fromTeacherImage}
                        </div>
                        <h4 className="text-xl font-bold text-center mb-2">{currentRequest.fromTeacher}</h4>
                        <p className="text-center text-zinc-400 text-sm mb-4">ID: {currentRequest.fromTeacherId}</p>
                        <div className="text-center pt-4 border-t border-zinc-700">
                          <p className="text-xs text-zinc-400">Department: {currentRequest.department}</p>
                        </div>
                      </div>

                      {/* To Teacher Selection */}
                      <div className="border-2 border-zinc-300 rounded-lg p-6 bg-zinc-50">
                        <p className="text-xs font-semibold text-zinc-600 uppercase mb-4">Assign Replacement Teacher</p>
                        <select
                          onChange={(e) => {
                            // This will be used in approval
                          }}
                          id="teacher-select"
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900 mb-4"
                        >
                          <option value="">Select a teacher...</option>
                          {availableTeachers.map((teacher) => (
                            <option
                              key={teacher.id}
                              value={teacher.id}
                              disabled={!teacher.available}
                            >
                              {teacher.name} {!teacher.available ? '(Unavailable)' : ''}
                            </option>
                          ))}
                        </select>

                        {/* Preview of selected teacher */}
                        {(document.getElementById('teacher-select') as HTMLSelectElement)?.value && (
                          <>
                            {availableTeachers
                              .filter(
                                (t) =>
                                  t.id ===
                                  (document.getElementById('teacher-select') as HTMLSelectElement)?.value
                              )
                              .map((teacher) => (
                                <div key={teacher.id}>
                                  <div className="w-20 h-20 bg-white border-2 border-zinc-300 rounded-lg flex items-center justify-center text-5xl mb-4 mx-auto">
                                    {teacher.image}
                                  </div>
                                  <h4 className="text-xl font-bold text-center text-zinc-900 mb-2">
                                    {teacher.name}
                                  </h4>
                                  <p className="text-center text-zinc-600 text-sm mb-4">{teacher.specialization}</p>
                                  <div className="text-center pt-4 border-t border-zinc-300">
                                    <p className="text-xs text-zinc-600">
                                      Status:{' '}
                                      <span className="font-semibold text-green-600">Available</span>
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                      <h4 className="font-semibold text-blue-900 mb-4">Admin Action</h4>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-zinc-900 mb-2">
                          Rejection Reason (if rejecting)
                        </label>
                        <textarea
                          value={actionReason}
                          onChange={(e) => setActionReason(e.target.value)}
                          placeholder="Enter reason for rejection..."
                          className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleApproveRequest(
                              (document.getElementById('teacher-select') as HTMLSelectElement)?.value || ''
                            )
                          }
                          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                        >
                          ✓ Approve Request
                        </button>
                        <button
                          onClick={handleRejectRequest}
                          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                        >
                          ✕ Reject Request
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white border border-zinc-200 rounded-lg">
                    <p className="text-zinc-600">No requests to display</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {swapHistory.length > 0 ? (
                swapHistory.map((record) => (
                  <div key={record.id} className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-sm font-semibold text-zinc-600 uppercase mb-1">Period</p>
                        <p className="text-lg font-bold text-zinc-900">{record.period}</p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          record.status === 'Approved'
                            ? 'bg-green-100 text-green-900'
                            : 'bg-red-100 text-red-900'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>

                    {/* Teacher Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* From Teacher */}
                      <div className="border-2 border-zinc-300 rounded-lg p-4">
                        <p className="text-xs font-semibold text-zinc-600 uppercase mb-3">From</p>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-zinc-100 rounded-lg flex items-center justify-center text-4xl">
                            {record.fromTeacherImage}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900">{record.fromTeacher}</p>
                            <p className="text-sm text-zinc-600">Class: {record.class}</p>
                          </div>
                        </div>
                      </div>

                      {/* To Teacher */}
                      <div className="border-2 border-zinc-300 rounded-lg p-4">
                        <p className="text-xs font-semibold text-zinc-600 uppercase mb-3">To</p>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-zinc-100 rounded-lg flex items-center justify-center text-4xl">
                            {record.toTeacherImage}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900">{record.toTeacher}</p>
                            <p className="text-sm text-zinc-600">Assigned Teacher</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-zinc-50 rounded-lg text-sm">
                      <div>
                        <p className="text-zinc-600">Date</p>
                        <p className="font-semibold text-zinc-900">{record.date}</p>
                      </div>
                      <div>
                        <p className="text-zinc-600">Reason</p>
                        <p className="font-semibold text-zinc-900 text-xs">{record.reason.split(' |')[0]}</p>
                      </div>
                      <div>
                        <p className="text-zinc-600">Approved At</p>
                        <p className="font-semibold text-zinc-900 text-xs">{record.approvedAt}</p>
                      </div>
                      <div>
                        <p className="text-zinc-600">By</p>
                        <p className="font-semibold text-zinc-900">{record.approvedBy}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white border border-zinc-200 rounded-lg">
                  <p className="text-zinc-600">No history records found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}