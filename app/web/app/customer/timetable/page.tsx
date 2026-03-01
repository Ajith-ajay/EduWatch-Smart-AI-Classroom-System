'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function TimetablePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClass, setSelectedClass] = useState('A-101');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<string | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  const classes = ['A-101', 'A-102', 'B-204', 'B-205', 'C-305'];
  const teachers = [
    'Dr. Rajesh Kumar',
    'Prof. Priya Sharma',
    'Dr. Amit Patel',
    'Prof. Neha Singh',
  ];
  const subjects = ['Data Structures', 'Web Development', 'Database Design', 'Software Engineering'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const [newPeriod, setNewPeriod] = useState({
    class: selectedClass,
    subject: '',
    teacher: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
  });

  // Sample timetable data
  const [timetableData, setTimetableData] = useState([
    {
      id: 'T001',
      class: 'A-101',
      subject: 'Data Structures',
      teacher: 'Dr. Rajesh Kumar',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
    },
    {
      id: 'T002',
      class: 'A-101',
      subject: 'Web Development',
      teacher: 'Prof. Priya Sharma',
      day: 'Monday',
      startTime: '10:45',
      endTime: '12:15',
    },
    {
      id: 'T003',
      class: 'A-101',
      subject: 'Database Design',
      teacher: 'Dr. Amit Patel',
      day: 'Tuesday',
      startTime: '09:00',
      endTime: '10:30',
    },
    {
      id: 'T004',
      class: 'A-101',
      subject: 'Software Engineering',
      teacher: 'Prof. Neha Singh',
      day: 'Wednesday',
      startTime: '09:00',
      endTime: '10:30',
    },
    {
      id: 'T005',
      class: 'A-101',
      subject: 'Data Structures',
      teacher: 'Dr. Rajesh Kumar',
      day: 'Thursday',
      startTime: '10:45',
      endTime: '12:15',
    },
    {
      id: 'T006',
      class: 'A-101',
      subject: 'Web Development',
      teacher: 'Prof. Priya Sharma',
      day: 'Friday',
      startTime: '09:00',
      endTime: '10:30',
    },
  ]);

  const classSchedules = timetableData.filter((t) => t.class === selectedClass);

  const handleAddPeriod = () => {
    if (newPeriod.subject && newPeriod.teacher) {
      const period = {
        id: `T${timetableData.length + 1}`.padStart(4, '0'),
        ...newPeriod,
        class: selectedClass,
      };
      setTimetableData([...timetableData, period]);
      setNewPeriod({
        class: selectedClass,
        subject: '',
        teacher: '',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
      });
      setShowAddModal(false);
    }
  };

  const handleDeletePeriod = (id: string) => {
    if (confirm('Are you sure you want to delete this period?')) {
      setTimetableData(timetableData.filter((t) => t.id !== id));
    }
  };

  const handleBulkUpload = () => {
    if (excelFile) {
      alert(`Timetable file "${excelFile.name}" uploaded successfully! (Mock operation)`);
      setExcelFile(null);
      setShowBulkModal(false);
    }
  };

  const getGridPosition = (day: string, startTime: string) => {
    const dayIndex = daysOfWeek.indexOf(day);
    const hour = parseInt(startTime.split(':')[0]);
    return { dayIndex, hour };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">EduWatch</div>
            <span className="text-xs font-medium bg-zinc-100 px-3 py-1 rounded-full">Timetable</span>
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
              <h1 className="text-4xl font-bold mb-2">Timetable Management</h1>
              <p className="text-zinc-600">Manage class schedules and periods</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
              >
                + Add Period
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="px-6 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition"
              >
                📤 Bulk Import
              </button>
            </div>
          </div>

          {/* Class Selection & View Toggle */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-200">
            <div className="flex items-center gap-4">
              <p className="text-sm font-semibold text-zinc-600">Class:</p>
              <div className="flex gap-2">
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

            {/* View Toggle */}
            <div className="flex gap-2 bg-zinc-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  viewMode === 'grid' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                📅 Grid View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  viewMode === 'list' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                📋 List View
              </button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-900 text-white">
                      <th className="px-4 py-3 text-left text-sm font-semibold w-20">Time</th>
                      {daysOfWeek.map((day) => (
                        <th key={day} className="px-4 py-3 text-left text-sm font-semibold">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[9, 10, 11, 12, 13, 14, 15, 16].map((hour) => (
                      <tr key={hour} className="border-t border-zinc-200 hover:bg-zinc-50">
                        <td className="px-4 py-3 text-sm font-semibold text-zinc-900">
                          {hour}:00 - {hour + 1}:30
                        </td>
                        {daysOfWeek.map((day) => {
                          const period = classSchedules.find(
                            (t) => t.day === day && parseInt(t.startTime.split(':')[0]) === hour
                          );
                          return (
                            <td key={`${day}-${hour}`} className="px-4 py-3">
                              {period ? (
                                <div
                                  className="bg-zinc-900 text-white p-3 rounded-lg cursor-pointer group hover:bg-zinc-800 transition"
                                  onClick={() => setEditingPeriod(period.id)}
                                >
                                  <p className="font-semibold text-xs mb-1">{period.subject}</p>
                                  <p className="text-xs text-zinc-300">{period.teacher}</p>
                                  <p className="text-xs text-zinc-400 mt-1">
                                    {period.startTime} - {period.endTime}
                                  </p>
                                  <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePeriod(period.id);
                                      }}
                                      className="flex-1 text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-20 bg-zinc-50 rounded border-2 border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 text-xs hover:border-zinc-900 transition cursor-pointer group">
                                  <span className="opacity-0 group-hover:opacity-100">Add</span>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4 mb-8">
              {classSchedules.length > 0 ? (
                classSchedules.map((period) => (
                  <div
                    key={period.id}
                    className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-center">
                      {/* Day & Time */}
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Day & Time</p>
                        <p className="font-semibold text-zinc-900">{period.day}</p>
                        <p className="text-sm text-zinc-600">
                          {period.startTime} - {period.endTime}
                        </p>
                      </div>

                      {/* Subject */}
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Subject</p>
                        <p className="font-semibold text-zinc-900">{period.subject}</p>
                      </div>

                      {/* Teacher */}
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Teacher</p>
                        <p className="font-semibold text-zinc-900">{period.teacher}</p>
                      </div>

                      {/* Class */}
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Class</p>
                        <p className="font-semibold text-zinc-900">{period.class}</p>
                      </div>

                      {/* Duration */}
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Duration</p>
                        <p className="font-semibold text-zinc-900">1.5 hrs</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setNewPeriod({
                              class: period.class,
                              subject: period.subject,
                              teacher: period.teacher,
                              day: period.day,
                              startTime: period.startTime,
                              endTime: period.endTime,
                            });
                            setEditingPeriod(period.id);
                            setShowAddModal(true);
                          }}
                          className="px-3 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePeriod(period.id)}
                          className="px-3 py-2 bg-red-100 text-red-900 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white border border-zinc-200 rounded-lg">
                  <p className="text-zinc-600">No periods added for this class yet</p>
                </div>
              )}
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Total Periods</p>
              <p className="text-3xl font-bold text-zinc-900">{timetableData.length}</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Class Periods</p>
              <p className="text-3xl font-bold text-zinc-900">{classSchedules.length}</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Unique Teachers</p>
              <p className="text-3xl font-bold text-zinc-900">
                {new Set(classSchedules.map((t) => t.teacher)).size}
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Unique Subjects</p>
              <p className="text-3xl font-bold text-zinc-900">
                {new Set(classSchedules.map((t) => t.subject)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Period Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-2xl font-bold">{editingPeriod ? 'Edit Period' : 'Add New Period'}</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingPeriod(null);
                }}
                className="text-xl text-zinc-600 hover:text-zinc-900"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Class *
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      disabled={editingPeriod !== null}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900 disabled:bg-zinc-100"
                    >
                      {classes.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Day *
                    </label>
                    <select
                      value={newPeriod.day}
                      onChange={(e) => setNewPeriod({ ...newPeriod, day: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={newPeriod.startTime}
                        onChange={(e) => setNewPeriod({ ...newPeriod, startTime: e.target.value })}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        End Time *
                      </label>
                      <input
                        type="time"
                        value={newPeriod.endTime}
                        onChange={(e) => setNewPeriod({ ...newPeriod, endTime: e.target.value })}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Subject *
                    </label>
                    <select
                      value={newPeriod.subject}
                      onChange={(e) => setNewPeriod({ ...newPeriod, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Teacher *
                    </label>
                    <select
                      value={newPeriod.teacher}
                      onChange={(e) => setNewPeriod({ ...newPeriod, teacher: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher} value={teacher}>
                          {teacher}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-zinc-50 rounded-lg p-6 border border-zinc-200 h-fit">
                  <p className="text-sm font-semibold text-zinc-600 uppercase mb-4">Period Preview</p>
                  <div className="bg-zinc-900 text-white p-4 rounded-lg">
                    <p className="text-xs text-zinc-400 mb-2">
                      {newPeriod.day} • {newPeriod.startTime} - {newPeriod.endTime}
                    </p>
                    <h4 className="font-bold text-lg mb-2">{newPeriod.subject || 'Subject'}</h4>
                    <p className="text-sm text-zinc-300 mb-1">{newPeriod.teacher || 'Teacher'}</p>
                    <p className="text-xs text-zinc-400">{newPeriod.class || 'Class'}</p>
                    <div className="mt-4 pt-4 border-t border-zinc-700">
                      <p className="text-xs text-zinc-400">
                        Duration: {((parseInt(newPeriod.endTime.split(':')[0]) - parseInt(newPeriod.startTime.split(':')[0])) * 60 + (parseInt(newPeriod.endTime.split(':')[1]) - parseInt(newPeriod.startTime.split(':')[1]))) / 60} hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-zinc-200">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingPeriod(null);
                }}
                className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-900 rounded-lg font-medium hover:border-zinc-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPeriod}
                className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition"
              >
                {editingPeriod ? 'Update Period' : 'Add Period'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-2xl font-bold">Bulk Import Timetable</h2>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-xl text-zinc-600 hover:text-zinc-900"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Instructions */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-zinc-900 mb-3">Instructions:</p>
                  <ul className="text-sm text-zinc-600 space-y-2 list-disc list-inside">
                    <li>Download the timetable template (Excel)</li>
                    <li>Fill in the required columns: Class, Day, Start Time, End Time, Subject, Teacher</li>
                    <li>Ensure time format is HH:MM (24-hour format)</li>
                    <li>Upload the completed file to import all periods at once</li>
                  </ul>
                </div>

                {/* Download Template */}
                <div>
                  <button className="px-4 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition">
                    📥 Download Template
                  </button>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-4">
                    Upload Timetable File
                  </label>
                  <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center hover:border-zinc-900 transition cursor-pointer">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="timetable-file"
                    />
                    <label htmlFor="timetable-file" className="cursor-pointer">
                      <p className="text-4xl mb-2">📅</p>
                      <p className="text-sm font-semibold text-zinc-900">
                        {excelFile ? excelFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-zinc-600 mt-1">
                        Supports Excel (.xlsx, .xls) and CSV files
                      </p>
                    </label>
                  </div>
                </div>

                {/* File Info */}
                {excelFile && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      ✓ Ready to import: <strong>{excelFile.name}</strong>
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Make sure the file contains valid data before importing
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-zinc-200">
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-900 rounded-lg font-medium hover:border-zinc-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!excelFile}
                className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import Timetable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
