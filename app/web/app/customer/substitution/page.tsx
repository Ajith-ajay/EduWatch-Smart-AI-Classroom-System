'use client';

import api from '@/lib/api';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type MetaClass = {
  class_id: number;
  class_name: string;
  department?: string;
  semester?: number;
  section?: string;
};

type MetaTeacher = {
  teacher_id: number;
  full_name: string;
  department?: string;
};

type MetaPeriod = {
  timetable_id: number;
  class_id: number;
  class_name?: string;
  class_department?: string;
  class_semester?: number;
  class_section?: string;
  subject_id: number;
  subject_name?: string;
  subject_code?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  original_teacher_id: number;
  original_teacher_name?: string;
};

export default function TeacherSubstitutionPage() {
  const [classes, setClasses] = useState<MetaClass[]>([]);
  const [teachers, setTeachers] = useState<MetaTeacher[]>([]);
  const [periods, setPeriods] = useState<MetaPeriod[]>([]);

  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [selectedToTeacherId, setSelectedToTeacherId] = useState<string>('');
  const [substitutionDate, setSubstitutionDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const refreshMeta = async () => {
    const response = await api.get('/substitution/meta');
    const payload = response.data || { classes: [], teachers: [], periods: [] };

    setClasses(payload.classes || []);
    setTeachers(payload.teachers || []);
    setPeriods(payload.periods || []);

    if (payload.classes?.length) {
      const firstClassId = String(payload.classes[0].class_id);
      setSelectedClassId((prev) => prev || firstClassId);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await refreshMeta();
    } catch (error) {
      console.error('Failed to load substitution metadata', error);
      alert('Failed to load substitution metadata');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const periodsForSelectedClass = useMemo(() => {
    return periods.filter((item) => String(item.class_id) === selectedClassId);
  }, [periods, selectedClassId]);

  useEffect(() => {
    if (!periodsForSelectedClass.length) {
      setSelectedPeriodId('');
      return;
    }

    const hasSelected = periodsForSelectedClass.some(
      (item) => String(item.timetable_id) === selectedPeriodId,
    );

    if (!hasSelected) {
      setSelectedPeriodId(String(periodsForSelectedClass[0].timetable_id));
    }
  }, [periodsForSelectedClass, selectedPeriodId]);

  const currentPeriod = useMemo(() => {
    return periodsForSelectedClass.find(
      (period) => String(period.timetable_id) === selectedPeriodId,
    );
  }, [periodsForSelectedClass, selectedPeriodId]);

  const fromTeacher = useMemo(() => {
    if (!currentPeriod) return null;
    return teachers.find((teacher) => teacher.teacher_id === currentPeriod.original_teacher_id) || null;
  }, [teachers, currentPeriod]);

  const replacementTeachers = useMemo(() => {
    if (!currentPeriod) return teachers;
    return teachers.filter((teacher) => teacher.teacher_id !== currentPeriod.original_teacher_id);
  }, [teachers, currentPeriod]);

  const toTeacher = useMemo(() => {
    return replacementTeachers.find((teacher) => String(teacher.teacher_id) === selectedToTeacherId) || null;
  }, [replacementTeachers, selectedToTeacherId]);

  const handleSubmit = async () => {
    if (!currentPeriod || !selectedToTeacherId || !substitutionDate) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/substitution/swap', {
        timetable_id: currentPeriod.timetable_id,
        substitute_teacher_id: Number(selectedToTeacherId),
        substitution_date: substitutionDate,
      });

      alert('Teacher substitution created successfully');
      setSelectedToTeacherId('');
      setSubstitutionDate('');
    } catch (error: any) {
      console.error('Failed to create substitution', error);
      alert(error?.response?.data?.message || 'Failed to create substitution');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
              📊 History
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
            <h1 className="text-4xl font-bold mb-2">Teacher Substitution</h1>
            <p className="text-zinc-600">Swap teacher for a selected class period</p>
          </div>

          {loading ? (
            <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center text-zinc-600">
              Loading substitution data...
            </div>
          ) : (
            <>
              <div className="bg-white border border-zinc-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">Step 1: Select Class and Period</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Select Class *
                    </label>
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      {classes.map((cls) => (
                        <option key={cls.class_id} value={cls.class_id}>
                          {cls.class_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Select Period *
                    </label>
                    <select
                      value={selectedPeriodId}
                      onChange={(e) => setSelectedPeriodId(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                    >
                      {periodsForSelectedClass.map((period) => (
                        <option key={period.timetable_id} value={period.timetable_id}>
                          {period.subject_name} - {period.day_of_week} {period.start_time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {currentPeriod && (
                  <div className="mt-6 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <p className="text-sm text-zinc-600 mb-2">Selected Period Details:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-zinc-600">Subject</p>
                        <p className="font-semibold text-zinc-900">{currentPeriod.subject_name}</p>
                      </div>
                      <div>
                        <p className="text-zinc-600">Day</p>
                        <p className="font-semibold text-zinc-900">{currentPeriod.day_of_week}</p>
                      </div>
                      <div>
                        <p className="text-zinc-600">Time</p>
                        <p className="font-semibold text-zinc-900">
                          {currentPeriod.start_time} - {currentPeriod.end_time}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-600">Class</p>
                        <p className="font-semibold text-zinc-900">{currentPeriod.class_name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {currentPeriod && fromTeacher && (
                <div className="bg-white border border-zinc-200 rounded-lg p-8 mb-8">
                  <h2 className="text-xl font-bold mb-8">Step 2: Teacher Swap</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="border-2 border-zinc-900 rounded-lg p-8 bg-zinc-900 text-white">
                      <p className="text-sm font-semibold text-zinc-300 uppercase mb-4">From (Current)</p>
                      <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center text-6xl mb-6 mx-auto">
                        👨‍🏫
                      </div>
                      <div className="text-center mb-6 pb-6 border-b border-zinc-700">
                        <h3 className="text-2xl font-bold mb-2">{fromTeacher.full_name}</h3>
                        <p className="text-zinc-400 text-sm">{currentPeriod.subject_name}</p>
                      </div>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Department</span>
                          <span className="font-semibold">{fromTeacher.department || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Period</span>
                          <span className="font-semibold">{currentPeriod.day_of_week}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Status</span>
                          <span className="font-semibold text-red-400">Unavailable</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-2 border-zinc-300 rounded-lg p-8 bg-zinc-50">
                      <p className="text-sm font-semibold text-zinc-600 uppercase mb-4">To (Replacement)</p>
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-zinc-900 mb-2">
                          Select Replacement Teacher *
                        </label>
                        <select
                          value={selectedToTeacherId}
                          onChange={(e) => setSelectedToTeacherId(e.target.value)}
                          className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-zinc-900"
                        >
                          <option value="">Choose a teacher...</option>
                          {replacementTeachers.map((teacher) => (
                            <option key={teacher.teacher_id} value={teacher.teacher_id}>
                              {teacher.full_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {toTeacher ? (
                        <>
                          <div className="w-24 h-24 bg-white border-2 border-zinc-300 rounded-lg flex items-center justify-center text-6xl mb-6 mx-auto">
                            👩‍🏫
                          </div>
                          <div className="text-center mb-6 pb-6 border-b border-zinc-300">
                            <h3 className="text-2xl font-bold text-zinc-900 mb-2">{toTeacher.full_name}</h3>
                            <p className="text-zinc-600 text-sm">Replacement Teacher</p>
                          </div>
                          <div className="space-y-4 text-sm text-zinc-900">
                            <div className="flex justify-between">
                              <span className="text-zinc-600">Department</span>
                              <span className="font-semibold">{toTeacher.department || '-'}</span>
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

              {currentPeriod && toTeacher && (
                <div className="bg-white border border-zinc-200 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-bold mb-6">Step 3: Swap Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>

                  <div className="mt-8 p-6 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <p className="text-sm font-semibold text-zinc-600 uppercase mb-4">Swap Summary</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-300">
                        <span className="text-zinc-600">Subject</span>
                        <span className="font-semibold text-zinc-900">{currentPeriod.subject_name}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-300">
                        <span className="text-zinc-600">Period</span>
                        <span className="font-semibold text-zinc-900">
                          {currentPeriod.day_of_week} {currentPeriod.start_time} - {currentPeriod.end_time}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-300">
                        <span className="text-zinc-600">From Teacher</span>
                        <span className="font-semibold text-zinc-900">{fromTeacher.full_name}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-300">
                        <span className="text-zinc-600">To Teacher</span>
                        <span className="font-semibold text-zinc-900">{toTeacher.full_name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-600">Date</span>
                        <span className="font-semibold text-zinc-900">{substitutionDate || '-'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="mt-6 w-full py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Teacher Swap'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
