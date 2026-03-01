'use client';

import api from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  const urlParser = (path: string) => {
    return path.startsWith('http') ? path : `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
  } 

  type Teacher = {
    teacher_id: string;
    full_name: string;
    email: string;
    department: string;
    phone: string;
    staff_image_path: string;
    classes?: number;
    students?: number;
  };

  const [newTeacher, setNewTeacher] = useState({
    full_name: '',
    email: '',
    department: '',
    phone: '',
    qualification: '',
    staff_image_path: null as string | null,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  // Teachers data with images (using placeholder)
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await api.get('/teachers');
        setTeachers(response.data);
        console.log("Fetched Teachers", response.data);
        
      } catch (error) {
        console.error("Error fetching the teacher data", error);        
      }
    }

    fetchTeacherData();
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setSelectedTeacherId(null);
    setNewTeacher({
      full_name: '',
      email: '',
      department: '',
      phone: '',
      qualification: '',
      staff_image_path: null,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setIsEditMode(true);
    setSelectedTeacherId(teacher.teacher_id);
    setNewTeacher({
      full_name: teacher.full_name,
      email: teacher.email,
      department: teacher.department || '',
      phone: teacher.phone || '',
      qualification: '',
      staff_image_path: teacher.staff_image_path,
    });
    // Set preview to existing image
    if (teacher.staff_image_path) {
      setImagePreview(urlParser(teacher.staff_image_path));
    }
    setShowAddModal(true);
  };

  const handleAddTeacher = async () => {
    if (newTeacher.full_name && newTeacher.email) {
      try {
        // Create FormData for multipart/form-data
        const formData = new FormData();
        formData.append('full_name', newTeacher.full_name);
        formData.append('email', newTeacher.email);
        formData.append('department', newTeacher.department || '');
        formData.append('phone', newTeacher.phone || '');
        formData.append('qualification', newTeacher.qualification || '');
        
        // Add image file if selected
        if (imageFile) {
          formData.append('staff_image', imageFile);
        }

        let response;
        if (isEditMode && selectedTeacherId) {
          // Update existing teacher
          response = await api.put(`/teachers/${selectedTeacherId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Teacher updated:', response.data);
        } else {
          // Create new teacher
          response = await api.post('/teachers', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Teacher created:', response.data);
        }
        
        // Refresh teachers list
        const teachersResponse = await api.get('/teachers');
        setTeachers(teachersResponse.data);

        // Reset form and close modal
        closeAddModal();
        
        alert(isEditMode ? 'Teacher updated successfully!' : 'Teacher added successfully!');
      } catch (error) {
        console.error(`Error ${isEditMode ? 'updating' : 'adding'} teacher:`, error);
        alert(`Failed to ${isEditMode ? 'update' : 'add'} teacher. Please try again.`);
      }
    } else {
      alert('Please fill in all required fields');
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

  const handleDeleteTeacher = async (teacher: Teacher) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${teacher.full_name}?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/teachers/${teacher.teacher_id}`);
      
      // Refresh teachers list
      const teachersResponse = await api.get('/teachers');
      setTeachers(teachersResponse.data);
      
      alert('Teacher deleted successfully!');
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert('Failed to delete teacher. Please try again.');
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
            {/* <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Total Classes</p>
              <p className="text-3xl font-bold text-zinc-900">
                {teachers.reduce((sum, t) => sum + t.classes, 0)}
              </p>
            </div> */}
            {/* <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <p className="text-zinc-600 text-sm mb-2">Avg Engagement</p>
              <p className="text-3xl font-bold text-zinc-900">
                {Math.round(teachers.reduce((sum, t) => sum + t.avgEngagement, 0) / teachers.length)}%
              </p>
            </div> */}
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
                key={teacher.teacher_id}
                className="bg-white border border-zinc-200 rounded-lg overflow-hidden hover:border-zinc-900 transition group cursor-pointer"
              >
                {/* Card Header with Image */}
                <div className="bg-zinc-100 p-8 flex items-center justify-center">
                  <img src={urlParser(teacher.staff_image_path)} alt={teacher.full_name} className="w-36 h-36 rounded object-cover" />
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-zinc-900 mb-1">{teacher.full_name}</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-4">{teacher.teacher_id}</p>

                  <div className="space-y-2 mb-6 text-sm">
                    <div>
                      <p className="text-zinc-600 text-xs">Department</p>
                      <p className="font-medium text-zinc-900">{teacher.department}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 text-xs">Email</p>
                      <p className="font-medium text-zinc-900 truncate">{teacher.email}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 text-xs">Phone</p>
                      <p className="font-medium text-zinc-900 truncate">{teacher.phone}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  {/* <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-t border-b border-zinc-100">
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
                  </div> */}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDeleteTeacher(teacher)}
                      className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-500 transition"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => handleEditTeacher(teacher)}
                      className="flex-1 px-3 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
                    >
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
              <h2 className="text-2xl font-bold">{isEditMode ? 'Edit Teacher' : 'Add New Teacher'}</h2>
              <button
                onClick={closeAddModal}
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
                      value={newTeacher.full_name}
                      onChange={(e) => setNewTeacher({ ...newTeacher, full_name: e.target.value })}
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
                      Qualification
                    </label>
                    <input
                      type="text"
                      value={newTeacher.qualification}
                      onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                      placeholder="B.Tech, M.Tech, Ph.D, etc."
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 file:cursor-pointer"
                    />
                    <p className="text-xs text-zinc-500 mt-1">JPG, PNG, GIF (Max 5MB)</p>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-zinc-50 rounded-lg p-6 border border-zinc-200 h-fit">
                  <p className="text-sm font-semibold text-zinc-600 uppercase mb-4">Card Preview</p>
                  <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                    <div className="bg-zinc-100 p-6 flex items-center justify-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl">👨‍🏫</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-zinc-900 mb-1">
                        {newTeacher.full_name || 'Teacher Name'}
                      </h4>
                      <p className="text-xs text-zinc-600 mb-3">New Teacher</p>
                      <div className="space-y-2 text-xs">
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
                onClick={closeAddModal}
                className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-900 rounded-lg font-medium hover:border-zinc-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeacher}
                className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition"
              >
                {isEditMode ? 'Update Teacher' : 'Add Teacher'}
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
