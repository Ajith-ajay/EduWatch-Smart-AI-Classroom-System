'use client';

import api from '@/lib/api';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type SubHistoryItem = {
  substitution_id: number;
  timetable_id: number;
  substitution_date: string;
  approved_by?: string;
  created_at?: string;
  class_id?: number;
  class_name?: string;
  class_department?: string;
  class_semester?: number;
  class_section?: string;
  subject_name?: string;
  subject_code?: string;
  day_of_week?: string;
  start_time?: string;
  end_time?: string;
  original_teacher_id: number;
  original_teacher_name?: string;
  substitute_teacher_id: number;
  substitute_teacher_name?: string;
};

type MetaClass = {
  class_id: number;
  class_name: string;
};

type MetaTeacher = {
  teacher_id: number;
  full_name: string;
};

export default function SubstitutionHistoryPage() {
  const [history, setHistory] = useState<SubHistoryItem[]>([]);
  const [classes, setClasses] = useState<MetaClass[]>([]);
  const [teachers, setTeachers] = useState<MetaTeacher[]>([]);

  const [selectedClassId, setSelectedClassId] = useState('all');
  const [selectedTeacherId, setSelectedTeacherId] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshMeta = async () => {
    const response = await api.get('/substitution/meta');
    const payload = response.data || { classes: [], teachers: [] };
    setClasses(payload.classes || []);
    setTeachers(payload.teachers || []);
  };

  const refreshHistory = async (classId = selectedClassId, teacherId = selectedTeacherId) => {
    const params = new URLSearchParams();
    if (classId !== 'all') {
      params.set('class_id', classId);
    }
    if (teacherId !== 'all') {
      params.set('teacher_id', teacherId);
    }

    const query = params.toString();
    const response = await api.get(`/substitution/history${query ? `?${query}` : ''}`);
    setHistory(response.data || []);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([refreshMeta(), refreshHistory('all', 'all')]);
    } catch (error) {
      console.error('Failed to load substitution history', error);
      alert('Failed to load substitution history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (loading) return;
    refreshHistory(selectedClassId, selectedTeacherId).catch((error) => {
      console.error('Failed to refresh substitution history', error);
      alert('Failed to refresh substitution history');
    });
  }, [selectedClassId, selectedTeacherId]);

  const filteredHistory = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return history;

    return history.filter((item) => {
      return (
        item.class_name?.toLowerCase().includes(keyword) ||
        item.subject_name?.toLowerCase().includes(keyword) ||
        item.original_teacher_name?.toLowerCase().includes(keyword) ||
        item.substitute_teacher_name?.toLowerCase().includes(keyword) ||
        item.day_of_week?.toLowerCase().includes(keyword)
      );
    });
  }, [history, searchText]);

  const formatDate = (value?: string) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">EduWatch</div>
            <span className="text-xs font-medium bg-zinc-100 px-3 py-1 rounded-full">Swap History</span>
          </div>
          <div className="flex gap-8 items-center">
            <Link
              href="/customer/substitution"
              className="text-sm font-medium hover:text-zinc-600 transition"
            >
              Swap Teacher
            </Link>
            <Link href="/customer" className="text-sm font-medium hover:text-zinc-600 transition">
              Dashboard
            </Link>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Swap History</h1>
            <p className="text-zinc-600">List of all approved teacher substitutions</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Class</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                >
                  <option value="all">All Classes</option>
                  {classes.map((item) => (
                    <option key={item.class_id} value={item.class_id}>
                      {item.class_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Teacher</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                >
                  <option value="all">All Teachers</option>
                  {teachers.map((item) => (
                    <option key={item.teacher_id} value={item.teacher_id}>
                      {item.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by class, subject, teacher, day..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center text-zinc-600">
              Loading history...
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <div
                    key={item.substitution_id}
                    className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 items-center">
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Class</p>
                        <p className="font-semibold text-zinc-900">{item.class_name}</p>
                      </div>
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Subject</p>
                        <p className="font-semibold text-zinc-900">{item.subject_name}</p>
                        <p className="text-xs text-zinc-500">{item.subject_code}</p>
                      </div>
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">From</p>
                        <p className="font-semibold text-zinc-900">{item.original_teacher_name}</p>
                      </div>
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">To</p>
                        <p className="font-semibold text-zinc-900">{item.substitute_teacher_name}</p>
                      </div>
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Day/Time</p>
                        <p className="font-semibold text-zinc-900">{item.day_of_week}</p>
                        <p className="text-xs text-zinc-500">
                          {item.start_time} - {item.end_time}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Substitute Date</p>
                        <p className="font-semibold text-zinc-900">{formatDate(item.substitution_date)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-600 text-xs uppercase mb-1">Approved By</p>
                        <p className="font-semibold text-zinc-900">{item.approved_by || 'Admin'}</p>
                      </div>
                      <div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-900">
                          Approved
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center text-zinc-600">
                  No substitution history found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
