'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MainLayout } from '@/components/layout/MainLayout';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import type { Id } from '../../../../../../convex/_generated/dataModel';
import { ArrowLeft, Plus, Trash2, BookOpen } from 'lucide-react';

type ExamType = 'IGCSE' | 'SPM' | 'O-Level';

interface SubjectEntry {
  subject: string;
  grade: string;
}

interface ExamEntry {
  id: string;
  examType: ExamType;
  year: string;
  subjects: SubjectEntry[];
}

const SUBJECTS: Record<ExamType, string[]> = {
  SPM: [
    'Bahasa Malaysia',
    'English Language',
    'Mathematics',
    'Additional Mathematics',
    'Science',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Moral Education',
    'Islamic Education',
    'Geography',
    'Accounting',
    'Economics',
    'Business Studies',
    'Information and Communication Technology',
    'Arts',
    'Music',
    'Physical Education',
    'Bahasa Arab',
  ],
  IGCSE: [
    'English Language',
    'English Literature',
    'Mathematics',
    'Additional Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Combined Science',
    'History',
    'Geography',
    'Economics',
    'Business Studies',
    'Computer Science',
    'Accounting',
    'Art and Design',
    'Music',
    'Sociology',
    'Malay',
    'Chinese',
    'French',
    'German',
    'Spanish',
  ],
  'O-Level': [
    'English Language',
    'Mother Tongue Language',
    'Mathematics',
    'Additional Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Combined Science',
    'History',
    'Geography',
    'Social Studies',
    'Economics',
    'Commerce',
    'Literature in English',
    'Computing',
    'Art',
    'Music',
    'Chinese Language',
    'Malay Language',
    'Tamil Language',
  ],
};

const GRADES: Record<ExamType, string[]> = {
  SPM: ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C', 'D', 'E', 'TH'],
  IGCSE: ['A*', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'U'],
  'O-Level': ['A1', 'A2', 'B3', 'B4', 'C5', 'C6', 'D7', 'E8', 'F9'],
};

const EXAM_TYPE_OPTIONS = [
  { value: 'SPM', label: 'SPM (Sijil Pelajaran Malaysia)' },
  { value: 'IGCSE', label: 'IGCSE (Cambridge)' },
  { value: 'O-Level', label: 'O-Level (Cambridge/Singapore)' },
];

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function currentYear() {
  return new Date().getFullYear();
}

function yearOptions() {
  const y = currentYear();
  return Array.from({ length: 10 }, (_, i) => {
    const yr = String(y - i);
    return { value: yr, label: yr };
  });
}

export default function SubjectScoresPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [storedUserId, setStoredUserId] = useState<string | null>(null);
  const [entries, setEntries] = useState<ExamEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      router.push('/login');
    } else {
      setStoredUserId(userId);
    }
  }, [router]);

  const profile = useQuery(
    api.profiles.getByUserId,
    storedUserId ? { userId: storedUserId as Id<'users'> } : 'skip'
  );

  const updateSubjectScores = useMutation(api.profiles.updateSubjectScores);

  // Populate from existing profile data
  useEffect(() => {
    if (profile && profile.subjectScores) {
      setEntries(
        profile.subjectScores.map((e) => ({
          id: e.id,
          examType: e.examType,
          year: e.year ?? '',
          subjects: e.subjects,
        }))
      );
    }
  }, [profile]);

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      { id: generateId(), examType: 'SPM', year: String(currentYear()), subjects: [] },
    ]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEntryField = (id: string, field: 'examType' | 'year', value: string) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        if (field === 'examType') {
          // Reset subjects when exam type changes since grades differ
          return { ...e, examType: value as ExamType, subjects: [] };
        }
        return { ...e, [field]: value };
      })
    );
  };

  const addSubject = (entryId: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? { ...e, subjects: [...e.subjects, { subject: '', grade: '' }] }
          : e
      )
    );
  };

  const updateSubject = (
    entryId: string,
    index: number,
    field: 'subject' | 'grade',
    value: string
  ) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== entryId) return e;
        const updated = [...e.subjects];
        updated[index] = { ...updated[index], [field]: value };
        return { ...e, subjects: updated };
      })
    );
  };

  const removeSubject = (entryId: string, index: number) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? { ...e, subjects: e.subjects.filter((_, i) => i !== index) }
          : e
      )
    );
  };

  const handleSave = async () => {
    if (!storedUserId) return;

    // Validate: each subject row must have both subject and grade filled
    for (const entry of entries) {
      if (entry.subjects.length === 0) {
        showToast('Please add at least one subject for each exam entry.', 'error');
        return;
      }
      for (const s of entry.subjects) {
        if (!s.subject || !s.grade) {
          showToast('Please fill in all subject and grade fields.', 'error');
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      await updateSubjectScores({
        userId: storedUserId as Id<'users'>,
        subjectScores: entries.map((e) => ({
          id: e.id,
          examType: e.examType,
          year: e.year || undefined,
          subjects: e.subjects,
        })),
      });
      showToast('Subject scores saved successfully!', 'success');
      router.push('/profile/view');
    } catch {
      showToast('Failed to save subject scores. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (profile === undefined) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
        </div>
      </MainLayout>
    );
  }

  if (profile === null) {
    return (
      <MainLayout>
        <Container className="py-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 mb-6">
              Please complete your profile first before adding subject scores.
            </p>
            <Button variant="primary" asChild>
              <Link href="/profile/complete">Complete Profile</Link>
            </Button>
          </div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container className="py-6 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Back link */}
          <Link
            href="/profile/view"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>

          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary-600" />
              Subject Scores
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Add your IGCSE, SPM, or O-Level subject grades so institutions can assess your academic background.
            </p>
          </div>

          {/* Exam entries */}
          {entries.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">No exam results added yet.</p>
              <Button variant="primary" onClick={addEntry}>
                <Plus className="w-4 h-4 mr-1.5" />
                Add Exam Results
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, entryIndex) => {
                const subjectOptions = SUBJECTS[entry.examType].map((s) => ({
                  value: s,
                  label: s,
                }));
                const gradeOptions = GRADES[entry.examType].map((g) => ({
                  value: g,
                  label: g,
                }));

                return (
                  <Card key={entry.id} className="p-5 sm:p-6">
                    {/* Entry header */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-800">
                        Exam {entryIndex + 1}
                      </h3>
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove this exam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Exam type + year */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <Select
                        label="Exam Type"
                        value={entry.examType}
                        onChange={(e) =>
                          updateEntryField(entry.id, 'examType', e.target.value)
                        }
                        options={EXAM_TYPE_OPTIONS}
                      />
                      <Select
                        label="Year Taken"
                        value={entry.year}
                        onChange={(e) =>
                          updateEntryField(entry.id, 'year', e.target.value)
                        }
                        options={yearOptions()}
                        placeholder="Select year"
                      />
                    </div>

                    {/* Subjects table */}
                    {entry.subjects.length > 0 && (
                      <div className="mb-3 space-y-2">
                        <div className="grid grid-cols-[1fr_140px_36px] gap-2 px-1">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Subject
                          </span>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Grade
                          </span>
                          <span />
                        </div>
                        {entry.subjects.map((subj, si) => (
                          <div
                            key={si}
                            className="grid grid-cols-[1fr_140px_36px] gap-2 items-center"
                          >
                            <Select
                              value={subj.subject}
                              onChange={(e) =>
                                updateSubject(entry.id, si, 'subject', e.target.value)
                              }
                              options={subjectOptions}
                              placeholder="Select subject"
                            />
                            <Select
                              value={subj.grade}
                              onChange={(e) =>
                                updateSubject(entry.id, si, 'grade', e.target.value)
                              }
                              options={gradeOptions}
                              placeholder="Grade"
                            />
                            <button
                              onClick={() => removeSubject(entry.id, si)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-center"
                              title="Remove subject"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addSubject(entry.id)}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add Subject
                    </Button>
                  </Card>
                );
              })}

              <Button variant="secondary" onClick={addEntry}>
                <Plus className="w-4 h-4 mr-1.5" />
                Add Another Exam
              </Button>
            </div>
          )}

          {/* Save / Cancel */}
          {entries.length > 0 && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" asChild>
                <Link href="/profile/view">Cancel</Link>
              </Button>
              <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                Save Scores
              </Button>
            </div>
          )}
        </div>
      </Container>
    </MainLayout>
  );
}
