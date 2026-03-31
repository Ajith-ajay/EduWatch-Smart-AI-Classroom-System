'use client';

import api from '@/lib/api';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type ClassItem = {
  class_id: number;
  class_name: string;
  department?: string | null;
  semester?: number | null;
  section?: string | null;
  created_at?: string;
};

type ClassForm = {
  class_name: string;
  department: string;
  semester: string;
  section: string;
};

const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
const sections = ['A', 'B', 'C', 'D', 'E'];

const emptyForm: ClassForm = {
  class_name: '',
  department: '',
  semester: '1',
  section: 'A',
};

export default function ClassesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [classesData, setClassesData] = useState<ClassItem[]>([]);
  const [form, setForm] = useState<ClassForm>(emptyForm);

  const formatDate = (value?: string) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toISOString().split('T')[0];
  };

  const refreshClasses = async () => {
    const response = await api.get('/classes');
    const rows = response.data || [];
    setClassesData(rows);

    const departments = Array.from(
      new Set(rows.map((item: ClassItem) => item.department).filter(Boolean)),
    ) as string[];

    if (departments.length && selectedDepartment === 'all') {
      setSelectedDepartment(departments[0]);
      setForm((prev) => ({ ...prev, department: departments[0] }));
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await refreshClasses();
    } catch (error) {
      console.error('Failed to load classes', error);
      alert('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const departments = useMemo(() => {
    const options = Array.from(
      new Set(classesData.map((item) => item.department).filter(Boolean)),
    ) as string[];
    return options;
  }, [classesData]);

  const filteredClasses = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return classesData.filter((cls) => {
      const matchesDept =
        selectedDepartment === 'all' || cls.department === selectedDepartment;
      const matchesSem =
        selectedSemester === 'all' || String(cls.semester ?? '') === selectedSemester;
      const matchesSearch =
        !keyword ||
        cls.class_name.toLowerCase().includes(keyword) ||
        (cls.section || '').toLowerCase().includes(keyword) ||
        (cls.department || '').toLowerCase().includes(keyword);

      return matchesDept && matchesSem && matchesSearch;
    });
  }, [classesData, selectedDepartment, selectedSemester, searchTerm]);

  const departmentClasses = useMemo(() => {
    if (selectedDepartment === 'all') {
      return classesData;
    }
    return classesData.filter((cls) => cls.department === selectedDepartment);
  }, [classesData, selectedDepartment]);

  const handleOpenCreate = () => {
    setEditingClass(null);
    setForm({
      class_name: '',
      department:
        selectedDepartment !== 'all'
          ? selectedDepartment
          : departments[0] || '',
      semester: selectedSemester !== 'all' ? selectedSemester : '1',
      section: 'A',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (cls: ClassItem) => {
    setEditingClass(cls);
    setForm({
      class_name: cls.class_name,
      department: cls.department || '',
      semester: String(cls.semester || '1'),
      section: cls.section || 'A',
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingClass(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    if (!form.class_name.trim()) {
      alert('Class name is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        class_name: form.class_name.trim(),
        department: form.department || undefined,
        semester: form.semester ? Number(form.semester) : undefined,
        section: form.section || undefined,
      };

      if (editingClass) {
        await api.put(`/classes/${editingClass.class_id}`, payload);
      } else {
        await api.post('/classes', payload);
      }

      await refreshClasses();
      closeModal();
      alert(editingClass ? 'Class updated successfully' : 'Class created successfully');
    } catch (error: any) {
      console.error('Failed to save class', error);
      alert(error?.response?.data?.message || 'Failed to save class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClass = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/classes/${id}`);
      await refreshClasses();
      alert('Class deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete class', error);
      alert(error?.response?.data?.message || 'Failed to delete class');
    }
  };

  const handleBulkUpload = () => {
    if (excelFile) {
      alert(`Classes file "${excelFile.name}" uploaded successfully! (Feature coming soon)`);
      setExcelFile(null);
      setShowBulkModal(false);
    }
  };

  const totalSemesters = new Set(
    filteredClasses.map((item) => item.semester).filter((item) => item !== null && item !== undefined),
  ).size;
  const totalSections = new Set(
    filteredClasses.map((item) => item.section).filter((item) => !!item),
  ).size;

  return (
    <div className="min-h-screen bg-white">
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
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Class Management</h1>
              <p className="text-zinc-600">Manage classes by department and semester</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleOpenCreate}
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

          <div className="bg-white border border-zinc-200 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              {/* <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    if (e.target.value !== 'all') {
                      setForm((prev) => ({ ...prev, department: e.target.value }));
                    }
                  }}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                >
                  <option value="all">All Semesters</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      Sem {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by class, section..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

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

          {loading ? (
            <div className="text-center py-12 bg-white border border-zinc-200 rounded-lg">
              <p className="text-zinc-600">Loading classes...</p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls) => (
                      <div
                        key={cls.class_id}
                        className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-xs font-semibold text-zinc-600 uppercase mb-1">
                              {cls.department || '-'} - Sem {cls.semester ?? '-'}
                            </p>
                            <h3 className="text-xl font-bold text-zinc-900">{cls.class_name}</h3>
                          </div>
                          <span className="text-2xl font-bold text-zinc-400 group-hover:text-zinc-900 transition">
                            {cls.section || '-'}
                          </span>
                        </div>

                        <div className="space-y-3 py-4 border-y border-zinc-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-zinc-600">Class ID</span>
                            <span className="text-sm font-semibold text-zinc-900">#{cls.class_id}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-zinc-600">Section</span>
                            <span className="text-sm font-semibold text-zinc-900">{cls.section || '-'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-zinc-600">Created</span>
                            <span className="text-sm font-semibold text-zinc-900">{formatDate(cls.created_at)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleOpenEdit(cls)}
                            className="flex-1 px-3 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClass(cls.class_id)}
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

              {viewMode === 'list' && (
                <div className="space-y-4 mb-8">
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls) => (
                      <div
                        key={cls.class_id}
                        className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 items-center">
                          <div>
                            <p className="text-zinc-600 text-xs uppercase mb-1">Class Name</p>
                            <p className="font-semibold text-zinc-900">{cls.class_name}</p>
                          </div>

                          <div>
                            <p className="text-zinc-600 text-xs uppercase mb-1">Department</p>
                            <p className="font-semibold text-zinc-900">{cls.department || '-'}</p>
                          </div>

                          <div>
                            <p className="text-zinc-600 text-xs uppercase mb-1">Semester</p>
                            <p className="font-semibold text-zinc-900">Sem {cls.semester ?? '-'}</p>
                          </div>

                          <div>
                            <p className="text-zinc-600 text-xs uppercase mb-1">Section</p>
                            <p className="font-semibold text-zinc-900">{cls.section || '-'}</p>
                          </div>

                          <div>
                            <p className="text-zinc-600 text-xs uppercase mb-1">Class ID</p>
                            <p className="font-semibold text-zinc-900">#{cls.class_id}</p>
                          </div>

                          <div>
                            <p className="text-zinc-600 text-xs uppercase mb-1">Created</p>
                            <p className="font-semibold text-zinc-900">{formatDate(cls.created_at)}</p>
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleOpenEdit(cls)}
                              className="px-3 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClass(cls.class_id)}
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-zinc-200 rounded-lg p-6">
                  <p className="text-zinc-600 text-sm mb-2">Total Classes</p>
                  <p className="text-3xl font-bold text-zinc-900">{departmentClasses.length}</p>
                  <p className="text-xs text-zinc-600 mt-2">
                    {selectedDepartment === 'all' ? 'All Departments' : selectedDepartment}
                  </p>
                </div>
                <div className="bg-white border border-zinc-200 rounded-lg p-6">
                  <p className="text-zinc-600 text-sm mb-2">Filtered Classes</p>
                  <p className="text-3xl font-bold text-zinc-900">{filteredClasses.length}</p>
                  <p className="text-xs text-zinc-600 mt-2">
                    {selectedSemester === 'all' ? 'All Semesters' : `Sem ${selectedSemester}`}
                  </p>
                </div>
                <div className="bg-white border border-zinc-200 rounded-lg p-6">
                  <p className="text-zinc-600 text-sm mb-2">Semesters</p>
                  <p className="text-3xl font-bold text-zinc-900">{totalSemesters}</p>
                  <p className="text-xs text-zinc-600 mt-2">In current view</p>
                </div>
                <div className="bg-white border border-zinc-200 rounded-lg p-6">
                  <p className="text-zinc-600 text-sm mb-2">Sections</p>
                  <p className="text-3xl font-bold text-zinc-900">{totalSections}</p>
                  <p className="text-xs text-zinc-600 mt-2">In current view</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-2xl font-bold">{editingClass ? 'Edit Class' : 'Add New Class'}</h2>
              <button
                onClick={closeModal}
                className="text-xl text-zinc-600 hover:text-zinc-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Department *
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      <option value="">Select Department</option>
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
                      value={form.semester}
                      onChange={(e) => setForm({ ...form, semester: e.target.value })}
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
                      value={form.section}
                      onChange={(e) => setForm({ ...form, section: e.target.value })}
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
                      Class Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., AI&DS 1st Year A"
                      value={form.class_name}
                      onChange={(e) => setForm({ ...form, class_name: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div className="bg-zinc-50 rounded-lg p-6 border border-zinc-200 h-fit">
                  <p className="text-sm font-semibold text-zinc-600 uppercase mb-4">Class Preview</p>
                  <div className="bg-zinc-900 text-white p-6 rounded-lg">
                    <p className="text-xs text-zinc-400 mb-2">
                      {form.department || 'Department'} • Semester {form.semester}
                    </p>
                    <h4 className="font-bold text-2xl mb-4">
                      {form.class_name || 'Class Name'}
                    </h4>
                    <div className="space-y-3 border-t border-zinc-700 pt-4">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Section</span>
                        <span className="font-semibold">{form.section}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Semester</span>
                        <span className="font-semibold">{form.semester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Department</span>
                        <span className="font-semibold">{form.department || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-zinc-200">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-900 rounded-lg font-medium hover:border-zinc-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingClass ? 'Update Class' : 'Add Class'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-2xl font-bold">Bulk Import Classes</h2>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-xl text-zinc-600 hover:text-zinc-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-zinc-900 mb-3">Instructions:</p>
                  <ul className="text-sm text-zinc-600 space-y-2 list-disc list-inside">
                    <li>Download the class template (Excel)</li>
                    <li>Fill in required columns: Class Name, Department, Semester, Section</li>
                    <li>Use numbers for semester: 1, 2, 3, etc.</li>
                    <li>Upload the completed file to import all classes at once</li>
                  </ul>
                </div>

                <div>
                  <button className="px-4 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition">
                    📥 Download Template
                  </button>
                </div>

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
