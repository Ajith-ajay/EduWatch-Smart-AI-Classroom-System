'use client';

import api from '@/lib/api';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type TimetableEntry = {
  timetable_id: number;
  class_id: number;
  subject_id: number;
  teacher_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  class_name?: string;
  subject_name?: string;
  subject_code?: string;
  teacher_name?: string;
};

type TimetableMeta = {
  classes: {
    class_id: number;
    class_name: string;
    department?: string;
    semester?: number;
    section?: string;
  }[];
  subjects: {
    subject_id: number;
    subject_name: string;
    subject_code: string;
    department?: string;
  }[];
  teachers: {
    teacher_id: number;
    full_name: string;
    department?: string;
  }[];
};

type FormState = {
  class_id: string;
  subject_id: string;
  teacher_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const emptyForm: FormState = {
  class_id: '',
  subject_id: '',
  teacher_id: '',
  day_of_week: 'Monday',
  start_time: '09:00',
  end_time: '10:30',
};

export default function TimetablePage() {
  const [meta, setMeta] = useState<TimetableMeta>({ classes: [], subjects: [], teachers: [] });
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  const refreshMeta = async () => {
    const response = await api.get('/timetable/meta');
    setMeta(response.data);

    if (response.data?.classes?.length && !selectedClassId) {
      setSelectedClassId(String(response.data.classes[0].class_id));
    }
  };

  const refreshEntries = async (classId: string, day: string) => {
    const params = new URLSearchParams();

    if (classId) {
      params.set('class_id', classId);
    }

    if (day !== 'all') {
      params.set('day', day);
    }

    const query = params.toString();
    const response = await api.get(`/timetable${query ? `?${query}` : ''}`);
    setEntries(response.data);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await refreshMeta();
    } catch (error) {
      console.error('Failed to load timetable metadata', error);
      alert('Failed to load timetable metadata');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!meta.classes.length || !selectedClassId) {
      return;
    }

    refreshEntries(selectedClassId, selectedDay).catch((error) => {
      console.error('Failed to load timetable entries', error);
      alert('Failed to load timetable entries');
    });
  }, [selectedClassId, selectedDay, meta.classes]);

  const filteredEntries = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return entries;
    }

    return entries.filter((entry) => {
      return (
        entry.class_name?.toLowerCase().includes(keyword) ||
        entry.subject_name?.toLowerCase().includes(keyword) ||
        entry.subject_code?.toLowerCase().includes(keyword) ||
        entry.teacher_name?.toLowerCase().includes(keyword) ||
        entry.day_of_week.toLowerCase().includes(keyword)
      );
    });
  }, [entries, searchText]);

  const classSchedules = useMemo(() => {
    return entries.filter((entry) => String(entry.class_id) === selectedClassId);
  }, [entries, selectedClassId]);

  const openCreateModal = () => {
    setEditingEntry(null);
    setForm({ ...emptyForm, class_id: selectedClassId });
    setShowModal(true);
  };

  const openEditModal = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setForm({
      class_id: String(entry.class_id),
      subject_id: String(entry.subject_id),
      teacher_id: String(entry.teacher_id),
      day_of_week: entry.day_of_week,
      start_time: entry.start_time,
      end_time: entry.end_time,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEntry(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    if (!form.class_id || !form.subject_id || !form.teacher_id || !form.day_of_week) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        class_id: Number(form.class_id),
        subject_id: Number(form.subject_id),
        teacher_id: Number(form.teacher_id),
        day_of_week: form.day_of_week,
        start_time: form.start_time,
        end_time: form.end_time,
      };

      if (editingEntry) {
        await api.put(`/timetable/${editingEntry.timetable_id}`, payload);
      } else {
        await api.post('/timetable', payload);
      }

      await refreshEntries(selectedClassId, selectedDay);
      closeModal();
      alert(editingEntry ? 'Timetable entry updated' : 'Timetable entry created');
    } catch (error: any) {
      console.error('Failed to save timetable entry', error);
      alert(error?.response?.data?.message || 'Failed to save timetable entry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (entryId: number) => {
    if (!window.confirm('Are you sure you want to delete this period?')) {
      return;
    }

    try {
      await api.delete(`/timetable/${entryId}`);
      await refreshEntries(selectedClassId, selectedDay);
      alert('Timetable entry deleted');
    } catch (error: any) {
      console.error('Failed to delete timetable entry', error);
      alert(error?.response?.data?.message || 'Failed to delete timetable entry');
    }
  };

  const handleBulkUpload = () => {
    if (excelFile) {
      alert(`Timetable file "${excelFile.name}" uploaded successfully! (Feature coming soon)`);
      setExcelFile(null);
      setShowBulkModal(false);
    }
  };

  const selectedClassName = useMemo(() => {
    const cls = meta.classes.find((c) => String(c.class_id) === selectedClassId);
    return cls?.class_name || '';
  }, [meta.classes, selectedClassId]);

  const selectedSubjectName = useMemo(() => {
    const subj = meta.subjects.find((s) => String(s.subject_id) === form.subject_id);
    return subj?.subject_name || 'Subject';
  }, [meta.subjects, form.subject_id]);

  const selectedTeacherName = useMemo(() => {
    const tchr = meta.teachers.find((t) => String(t.teacher_id) === form.teacher_id);
    return tchr?.full_name || 'Teacher';
  }, [meta.teachers, form.teacher_id]);

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    return ((endHour - startHour) * 60 + (endMin - startMin)) / 60;
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
                onClick={openCreateModal}
                disabled={!selectedClassId}
                className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-50"
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
              <div className="flex gap-2 flex-wrap">
                {loading ? (
                  <p className="text-sm text-zinc-500">Loading classes...</p>
                ) : (
                  meta.classes.map((cls) => (
                    <button
                      key={cls.class_id}
                      onClick={() => setSelectedClassId(String(cls.class_id))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedClassId === String(cls.class_id)
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                      }`}
                    >
                      {cls.class_name} - {cls.section}
                    </button>
                  ))
                )}
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

          {loading ? (
            <div className="text-center py-12 bg-white border border-zinc-200 rounded-lg">
              <p className="text-zinc-600">Loading timetable...</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden mb-8">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-zinc-900 text-white">
                          <th className="px-4 py-3 text-left text-sm font-semibold w-20">Time</th>
                          {days.map((day) => (
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
                            {days.map((day) => {
                              const period = classSchedules.find(
                                (t) => t.day_of_week === day && parseInt(t.start_time.split(':')[0]) === hour
                              );
                              return (
                                <td key={`${day}-${hour}`} className="px-4 py-3">
                                  {period ? (
                                    <div
                                      className="bg-zinc-900 text-white p-3 rounded-lg cursor-pointer group hover:bg-zinc-800 transition"
                                      onClick={() => openEditModal(period)}
                                    >
                                      <p className="font-semibold text-xs mb-1">{period.subject_name}</p>
                                      <p className="text-xs text-zinc-300">{period.teacher_name}</p>
                                      <p className="text-xs text-zinc-400 mt-1">
                                        {period.start_time} - {period.end_time}
                                      </p>
                                      <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(period.timetable_id);
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
                        key={period.timetable_id}
                        className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-center">
                          {/* Day & Time */}
                          <div>
                            <p className="text-zinc-600 text-xs uppercase mb-1">Day & Time</p>
                            <p className="font-semibold text-zinc-900">{period.day_of_week}</p>
                            <p className="text-sm text-zinc-600">
                              {period.start_time} - {period.end_time}
                            </p>
                          </div>

                          {/* Subject */}
                          <div>
                            <p className="text-zinc-600 text-xs uppercase mb-1">Subject</p>
                            <p className="font-semibold text-zinc-900">{period.subject_name}</p>
                          </div>

                          {/* Teacher */}
                          <div>
                            <p className="text-zinc-600 text-xs uppercase mb-1">Teacher</p>
                            <p className="font-semibold text-zinc-900">{period.teacher_name}</p>
                          </div>

                          {/* Class */}
                          <div>
                            <p className="text-zinc-600 text-xs uppercase mb-1">Class</p>
                            <p className="font-semibold text-zinc-900">{period.class_name}</p>
                          </div>

                          {/* Duration */}
                          <div>
                            <p className="text-zinc-600 text-xs uppercase mb-1">Duration</p>
                            <p className="font-semibold text-zinc-900">
                              {calculateDuration(period.start_time, period.end_time).toFixed(1)} hrs
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => openEditModal(period)}
                              className="px-3 py-2 border border-zinc-300 text-zinc-900 rounded-lg text-sm font-medium hover:border-zinc-900 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(period.timetable_id)}
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
                  <p className="text-3xl font-bold text-zinc-900">{entries.length}</p>
                </div>
                <div className="bg-white border border-zinc-200 rounded-lg p-6">
                  <p className="text-zinc-600 text-sm mb-2">Class Periods</p>
                  <p className="text-3xl font-bold text-zinc-900">{classSchedules.length}</p>
                </div>
                <div className="bg-white border border-zinc-200 rounded-lg p-6">
                  <p className="text-zinc-600 text-sm mb-2">Unique Teachers</p>
                  <p className="text-3xl font-bold text-zinc-900">
                    {new Set(classSchedules.map((t) => t.teacher_name)).size}
                  </p>
                </div>
                <div className="bg-white border border-zinc-200 rounded-lg p-6">
                  <p className="text-zinc-600 text-sm mb-2">Unique Subjects</p>
                  <p className="text-3xl font-bold text-zinc-900">
                    {new Set(classSchedules.map((t) => t.subject_name)).size}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Period Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-2xl font-bold">{editingEntry ? 'Edit Period' : 'Add New Period'}</h2>
              <button
                onClick={closeModal}
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
                      value={form.class_id}
                      onChange={(e) => setForm({ ...form, class_id: e.target.value })}
                      disabled={editingEntry !== null}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900 disabled:bg-zinc-100"
                    >
                      <option value="">Select Class</option>
                      {meta.classes.map((cls) => (
                        <option key={cls.class_id} value={cls.class_id}>
                          {cls.class_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Day *
                    </label>
                    <select
                      value={form.day_of_week}
                      onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      {days.map((day) => (
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
                        value={form.start_time}
                        onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        End Time *
                      </label>
                      <input
                        type="time"
                        value={form.end_time}
                        onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Subject *
                    </label>
                    <select
                      value={form.subject_id}
                      onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      <option value="">Select Subject</option>
                      {meta.subjects.map((subject) => (
                        <option key={subject.subject_id} value={subject.subject_id}>
                          {subject.subject_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Teacher *
                    </label>
                    <select
                      value={form.teacher_id}
                      onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      <option value="">Select Teacher</option>
                      {meta.teachers.map((teacher) => (
                        <option key={teacher.teacher_id} value={teacher.teacher_id}>
                          {teacher.full_name}
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
                      {form.day_of_week} • {form.start_time} - {form.end_time}
                    </p>
                    <h4 className="font-bold text-lg mb-2">{selectedSubjectName}</h4>
                    <p className="text-sm text-zinc-300 mb-1">{selectedTeacherName}</p>
                    <p className="text-xs text-zinc-400">{selectedClassName}</p>
                    <div className="mt-4 pt-4 border-t border-zinc-700">
                      <p className="text-xs text-zinc-400">
                        Duration: {calculateDuration(form.start_time, form.end_time).toFixed(1)} hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
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
                {submitting ? 'Saving...' : editingEntry ? 'Update Period' : 'Add Period'}
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
