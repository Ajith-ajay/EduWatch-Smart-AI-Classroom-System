'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    department: '',
    subject: '',
    phone: '',
    qualification: '',
    image: null as string | null,
  });

  const [excelFile, setExcelFile] = useState<File | null>(null);

  // Teachers data with images (using placeholder)
  const [teachers, setTeachers] = useState([
    {
      id: 'T001',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@itech.edu',
      department: 'Computer Science',
      subject: 'Data Structures',
      phone: '+91-98765-43210',
      qualification: 'Ph.D',
      image: '👨‍🏫',
      classes: 3,
      students: 125,
      avgEngagement: 89,
    },
    {
      id: 'T002',
      name: 'Prof. Priya Sharma',
      email: 'priya.sharma@itech.edu',
      department: 'Computer Science',
      subject: 'Web Development',
      phone: '+91-98765-43211',
      qualification: 'M.Tech',
      image: '👩‍🏫',
      classes: 4,
      students: 152,
      avgEngagement: 92,
    },
    {
      id: 'T003',
      name: 'Dr. Amit Patel',
      email: 'amit.patel@itech.edu',
      department: 'Computer Science',
      subject: 'Database Design',
      phone: '+91-98765-43212',
      qualification: 'Ph.D',
      image: '👨‍🏫',
      classes: 3,
      students: 130,
      avgEngagement: 85,
    },
    {
      id: 'T004',
      name: 'Prof. Neha Singh',
      email: 'neha.singh@itech.edu',
      department: 'Computer Science',
      subject: 'Software Engineering',
      phone: '+91-98765-43213',
      qualification: 'M.Tech',
      image: '👩‍🏫',
      classes: 2,
      students: 95,
      avgEngagement: 88,
    },
    {
      id: 'T005',
      name: 'Dr. Vikram Desai',
      email: 'vikram.desai@itech.edu',
      department: 'ECE',
      subject: 'Digital Electronics',
      phone: '+91-98765-43214',
      qualification: 'Ph.D',
      image: '👨‍🏫',
      classes: 3,
      students: 115,
      avgEngagement: 86,
    },
  ]);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = () => {
    if (newTeacher.name && newTeacher.email && newTeacher.subject) {
      const teacher = {
        id: `T${teachers.length + 1}`.padStart(4, '0'),
        ...newTeacher,
        image: '👨‍🏫',
        classes: 0,
        students: 0,
        avgEngagement: 0,
      };
      setTeachers([...teachers, teacher as any]);
      setNewTeacher({
        name: '',
        email: '',
        department: '',
        subject: '',
        phone: '',
        qualification: '',
        image: null,
      });
      setShowAddModal(false);
    }
  };

  const handleBulkUpload = () => {
    if (excelFile) {
      // In a real app, this would parse the Excel file
      alert(`Excel file "${excelFile.name}" uploaded successfully! (Mock operation)`);
      setExcelFile(null);
      setShowBulkModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">EduWatch</div>
            <span className="text-xs font-medium bg-zinc-100 px-3 py-1 rounded-full">Teachers</span>
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
              <h1 className="text-4xl font-bold mb-2">Teacher Management</h1>
              <p className="text-zinc-600">Manage faculty profiles and assignments</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAddMode('single');
                  setShowAddModal(true);
                }}
                className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
              >
                + Add Teacher
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="px-6 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition"
              >
                📤 Bulk Upload
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Total Teachers</p>
              <p className="text-3xl font-bold text-zinc-900">{teachers.length}</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Active</p>
              <p className="text-3xl font-bold text-green-600">{teachers.length}</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Total Classes</p>
              <p className="text-3xl font-bold text-zinc-900">
                {teachers.reduce((sum, t) => sum + t.classes, 0)}
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Avg Engagement</p>
              <p className="text-3xl font-bold text-zinc-900">
                {Math.round(teachers.reduce((sum, t) => sum + t.avgEngagement, 0) / teachers.length)}%
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search teachers by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
            />
          </div>

          {/* Teachers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white border border-zinc-200 rounded-lg overflow-hidden hover:border-zinc-900 transition group cursor-pointer"
              >
                {/* Card Header with Image */}
                <div className="bg-zinc-100 p-8 flex items-center justify-center">
                  <div className="text-6xl">{teacher.image}</div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-zinc-900 mb-1">{teacher.name}</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-4">{teacher.id}</p>

                  <div className="space-y-2 mb-6 text-sm">
                    <div>
                      <p className="text-zinc-600 text-xs">Subject</p>
                      <p className="font-medium text-zinc-900">{teacher.subject}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 text-xs">Department</p>
                      <p className="font-medium text-zinc-900">{teacher.department}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 text-xs">Email</p>
                      <p className="font-medium text-zinc-900 truncate">{teacher.email}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-t border-b border-zinc-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-zinc-900">{teacher.classes}</p>
                      <p className="text-xs text-zinc-600">Classes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-zinc-900">{teacher.students}</p>
                      <p className="text-xs text-zinc-600">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-zinc-900">{teacher.avgEngagement}%</p>
                      <p className="text-xs text-zinc-600">Engagement</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition">
                      Delete
                    </button>
                    <button className="flex-1 px-3 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-12 bg-white border border-zinc-200 rounded-lg">
              <p className="text-zinc-600">No teachers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Single Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-2xl font-bold">Add New Teacher</h2>
              <button
                onClick={() => setShowAddModal(false)}
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
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newTeacher.name}
                      onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                      placeholder="Dr. John Doe"
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                      placeholder="john@college.edu"
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newTeacher.phone}
                      onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                      placeholder="+91-98765-43210"
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={newTeacher.department}
                      onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                      placeholder="Computer Science"
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={newTeacher.subject}
                      onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                      placeholder="Data Structures"
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Qualification
                    </label>
                    <select
                      value={newTeacher.qualification}
                      onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      <option value="">Select qualification</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="Ph.D">Ph.D</option>
                      <option value="MBA">MBA</option>
                    </select>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-zinc-50 rounded-lg p-6 border border-zinc-200 h-fit">
                  <p className="text-sm font-semibold text-zinc-600 uppercase mb-4">Card Preview</p>
                  <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                    <div className="bg-zinc-100 p-6 flex items-center justify-center">
                      <span className="text-5xl">👨‍🏫</span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-zinc-900 mb-1">
                        {newTeacher.name || 'Teacher Name'}
                      </h4>
                      <p className="text-xs text-zinc-600 mb-3">New Teacher</p>
                      <div className="space-y-2 text-xs">
                        <div>
                          <p className="text-zinc-600">Subject</p>
                          <p className="font-medium">{newTeacher.subject || 'Subject'}</p>
                        </div>
                        <div>
                          <p className="text-zinc-600">Department</p>
                          <p className="font-medium">{newTeacher.department || 'Department'}</p>
                        </div>
                        <div>
                          <p className="text-zinc-600">Email</p>
                          <p className="font-medium truncate">{newTeacher.email || 'email@college.edu'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-zinc-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-900 rounded-lg font-medium hover:border-zinc-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeacher}
                className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition"
              >
                Add Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-2xl font-bold">Bulk Upload Teachers</h2>
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
                  <p className="text-sm font-semibold text-zinc-900 mb-2">Instructions:</p>
                  <ul className="text-sm text-zinc-600 space-y-1 list-disc list-inside">
                    <li>Download the template Excel file</li>
                    <li>Fill in teacher information (Name, Email, Subject, Department, etc.)</li>
                    <li>Upload the completed file below</li>
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
                    Upload Excel File
                  </label>
                  <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center hover:border-zinc-900 transition cursor-pointer">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      <p className="text-4xl mb-2">📄</p>
                      <p className="text-sm font-semibold text-zinc-900">
                        {excelFile ? excelFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-zinc-600 mt-1">
                        Supports Excel (.xlsx, .xls) and CSV files
                      </p>
                    </label>
                  </div>
                </div>

                {/* Preview of file */}
                {excelFile && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-900">
                      ✓ File ready to upload: <strong>{excelFile.name}</strong>
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
                Upload Teachers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
