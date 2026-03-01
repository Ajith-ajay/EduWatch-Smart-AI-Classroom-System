'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ClassesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDepartment, setSelectedDepartment] = useState('AI&DS');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const departments = ['AI&DS', 'CSE', 'ECE', 'Mechanical', 'Civil', 'EEE'];
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const sections = ['A', 'B', 'C', 'D', 'E'];

  const [newClass, setNewClass] = useState({
    className: '',
    department: selectedDepartment,
    semester: selectedSemester,
    section: 'A',
    strength: '60',
    classRoom: '',
  });

  // Sample class data based on database schema
  const [classesData, setClassesData] = useState([
    {
      id: 'C001',
      className: 'AI&DS 1st Year A',
      department: 'AI&DS',
      semester: '1',
      section: 'A',
      strength: 60,
      classRoom: 'A-101',
      createdAt: '2024-01-15',
    },
    {
      id: 'C002',
      className: 'AI&DS 1st Year B',
      department: 'AI&DS',
      semester: '1',
      section: 'B',
      strength: 62,
      classRoom: 'A-102',
      createdAt: '2024-01-15',
    },
    {
      id: 'C003',
      className: 'AI&DS 1st Year C',
      department: 'AI&DS',
      semester: '1',
      section: 'C',
      strength: 58,
      classRoom: 'A-103',
      createdAt: '2024-01-15',
    },
    {
      id: 'C004',
      className: 'AI&DS 1st Year D',
      department: 'AI&DS',
      semester: '1',
      section: 'D',
      strength: 61,
      classRoom: 'A-104',
      createdAt: '2024-01-15',
    },
    {
      id: 'C005',
      className: 'AI&DS 2nd Year A',
      department: 'AI&DS',
      semester: '3',
      section: 'A',
      strength: 58,
      classRoom: 'B-201',
      createdAt: '2024-01-20',
    },
    {
      id: 'C006',
      className: 'AI&DS 2nd Year B',
      department: 'AI&DS',
      semester: '3',
      section: 'B',
      strength: 60,
      classRoom: 'B-202',
      createdAt: '2024-01-20',
    },
    {
      id: 'C007',
      className: 'CSE 1st Year A',
      department: 'CSE',
      semester: '1',
      section: 'A',
      strength: 65,
      classRoom: 'C-101',
      createdAt: '2024-01-15',
    },
    {
      id: 'C008',
      className: 'CSE 1st Year B',
      department: 'CSE',
      semester: '1',
      section: 'B',
      strength: 63,
      classRoom: 'C-102',
      createdAt: '2024-01-15',
    },
  ]);

  // Filter classes based on department, semester, and search
  const filteredClasses = classesData.filter((cls) => {
    const matchesDept = cls.department === selectedDepartment;
    const matchesSem = cls.semester === selectedSemester;
    const matchesSearch =
      cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.classRoom.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSem && matchesSearch;
  });

  // Get all classes for this department
  const departmentClasses = classesData.filter((cls) => cls.department === selectedDepartment);

  const handleAddClass = () => {
    if (newClass.className && newClass.classRoom) {
      const classItem = {
        id: `C${String(classesData.length + 1).padStart(3, '0')}`,
        ...newClass,
        strength: parseInt(newClass.strength),
        createdAt: new Date().toISOString().split('T')[0],
        department: selectedDepartment,
        semester: selectedSemester,
      };
      setClassesData([...classesData, classItem]);
      setNewClass({
        className: '',
        department: selectedDepartment,
        semester: selectedSemester,
        section: 'A',
        strength: '60',
        classRoom: '',
      });
      setShowAddModal(false);
    }
  };

  const handleDeleteClass = (id: string) => {
    if (confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      setClassesData(classesData.filter((c) => c.id !== id));
    }
  };

  const handleBulkUpload = () => {
    if (excelFile) {
      alert(`Classes file "${excelFile.name}" uploaded successfully! (Mock operation)`);
      setExcelFile(null);
      setShowBulkModal(false);
    }
  };

  // Calculate stats
  const totalStrength = filteredClasses.reduce((sum, cls) => sum + cls.strength, 0);
  const avgStrength = filteredClasses.length > 0 ? Math.round(totalStrength / filteredClasses.length) : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">EduWatch</div>
            <span className="text-xs font-medium bg-zinc-100 px-3 py-1 rounded-full">Classes</span>
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
              <h1 className="text-4xl font-bold mb-2">Class Management</h1>
              <p className="text-zinc-600">Manage classes by department and semester</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
              >
                + Add Class
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="px-6 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition"
              >
                📤 Bulk Import
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              {/* Department Select */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setNewClass({ ...newClass, department: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester Select */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => {
                    setSelectedSemester(e.target.value);
                    setNewClass({ ...newClass, semester: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                >
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      Sem {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by class or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 bg-zinc-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium transition ${
                    viewMode === 'grid' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  📊 Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium transition ${
                    viewMode === 'list' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  📋 List
                </button>
              </div>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition group"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-semibold text-zinc-600 uppercase mb-1">
                          {cls.department} - Sem {cls.semester}
                        </p>
                        <h3 className="text-xl font-bold text-zinc-900">{cls.className}</h3>
                      </div>
                      <span className="text-2xl font-bold text-zinc-400 group-hover:text-zinc-900 transition">
                        {cls.section}
                      </span>
                    </div>

                    {/* Card Stats */}
                    <div className="space-y-3 py-4 border-y border-zinc-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-600">Classroom</span>
                        <span className="text-sm font-semibold text-zinc-900">{cls.classRoom}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-600">Students</span>
                        <span className="text-sm font-semibold text-zinc-900">{cls.strength}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-600">Created</span>
                        <span className="text-sm font-semibold text-zinc-900">{cls.createdAt}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-900 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white border border-zinc-200 rounded-lg">
                  <p className="text-zinc-600 mb-2">No classes found</p>
                  <p className="text-sm text-zinc-500">Try adjusting your filters or add a new class</p>
                </div>
              )}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4 mb-8">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 items-center">
                      {/* Class Name */}
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Class Name</p>
                        <p className="font-semibold text-zinc-900">{cls.className}</p>
                      </div>

                      {/* Department */}
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Department</p>
                        <p className="font-semibold text-zinc-900">{cls.department}</p>
                      </div>

                      {/* Semester */}
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Semester</p>
                        <p className="font-semibold text-zinc-900">Sem {cls.semester}</p>
                      </div>

                      {/* Section */}
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Section</p>
                        <p className="font-semibold text-zinc-900">{cls.section}</p>
                      </div>

                      {/* Classroom */}
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Classroom</p>
                        <p className="font-semibold text-zinc-900">{cls.classRoom}</p>
                      </div>

                      {/* Strength */}
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Strength</p>
                        <p className="font-semibold text-zinc-900">{cls.strength}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 justify-end">
                        <button className="px-3 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClass(cls.id)}
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
                  <p className="text-zinc-600 mb-2">No classes found</p>
                  <p className="text-sm text-zinc-500">Try adjusting your filters or add a new class</p>
                </div>
              )}
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Total Classes</p>
              <p className="text-3xl font-bold text-zinc-900">{departmentClasses.length}</p>
              <p className="text-xs text-zinc-600 mt-2">{selectedDepartment}</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Filtered Classes</p>
              <p className="text-3xl font-bold text-zinc-900">{filteredClasses.length}</p>
              <p className="text-xs text-zinc-600 mt-2">
                Sem {selectedSemester}
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Total Strength</p>
              <p className="text-3xl font-bold text-zinc-900">{totalStrength}</p>
              <p className="text-xs text-zinc-600 mt-2">Students</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Average Strength</p>
              <p className="text-3xl font-bold text-zinc-900">{avgStrength}</p>
              <p className="text-xs text-zinc-600 mt-2">Per class</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-2xl font-bold">{editingClass ? 'Edit Class' : 'Add New Class'}</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingClass(null);
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
                      Department *
                    </label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Semester *
                    </label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      {semesters.map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Section *
                    </label>
                    <select
                      value={newClass.section}
                      onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      {sections.map((section) => (
                        <option key={section} value={section}>
                          Section {section}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Classroom *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., A-101"
                      value={newClass.classRoom}
                      onChange={(e) => setNewClass({ ...newClass, classRoom: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Strength (Students) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newClass.strength}
                      onChange={(e) => setNewClass({ ...newClass, strength: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-zinc-50 rounded-lg p-6 border border-zinc-200 h-fit">
                  <p className="text-sm font-semibold text-zinc-600 uppercase mb-4">Class Preview</p>
                  <div className="bg-zinc-900 text-white p-6 rounded-lg">
                    <p className="text-xs text-zinc-400 mb-2">
                      {selectedDepartment} • Semester {selectedSemester}
                    </p>
                    <h4 className="font-bold text-2xl mb-4">
                      {selectedDepartment} {selectedSemester} {newClass.section}
                    </h4>
                    <div className="space-y-3 border-t border-zinc-700 pt-4">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Section</span>
                        <span className="font-semibold">{newClass.section}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Classroom</span>
                        <span className="font-semibold">{newClass.classRoom || 'Room #'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Strength</span>
                        <span className="font-semibold">{newClass.strength} Students</span>
                      </div>
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
                  setEditingClass(null);
                }}
                className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-900 rounded-lg font-medium hover:border-zinc-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClass}
                className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition"
              >
                {editingClass ? 'Update Class' : 'Add Class'}
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
              <h2 className="text-2xl font-bold">Bulk Import Classes</h2>
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
                    <li>Download the class template (Excel)</li>
                    <li>Fill in required columns: Class Name, Department, Semester, Section, Classroom, Strength</li>
                    <li>Use format: AI&DS 1st Year A for class name</li>
                    <li>Use numbers for semester: 1, 2, 3, etc.</li>
                    <li>Upload the completed file to import all classes at once</li>
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
                    Upload Classes File
                  </label>
                  <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center hover:border-zinc-900 transition cursor-pointer">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="classes-file"
                    />
                    <label htmlFor="classes-file" className="cursor-pointer">
                      <p className="text-4xl mb-2">📊</p>
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
                Import Classes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
