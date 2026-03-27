'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../../../../convex/_generated/api';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { MainLayout } from '@/components/layout/MainLayout';
import PersonalDetailsForm from '@/components/profile/PersonalDetailsForm';
import EducationForm from '@/components/profile/EducationForm';
import TestScoresForm from '@/components/profile/TestScoresForm';
import AchievementsForm from '@/components/profile/AchievementsForm';
import PreferencesForm from '@/components/profile/PreferencesForm';
import type { Id } from '../../../../../../convex/_generated/dataModel';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';

const STEPS = [
  { id: 1, name: 'personalDetails', labelKey: 'profile.steps.personalDetails' },
  { id: 2, name: 'education', labelKey: 'profile.steps.education' },
  { id: 3, name: 'testScores', labelKey: 'profile.steps.testScores' },
  { id: 4, name: 'achievements', labelKey: 'profile.steps.achievements' },
  { id: 5, name: 'preferences', labelKey: 'profile.steps.preferences' },
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Get userId from localStorage
  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  // Fetch existing profile
  const existingProfile = useQuery(
    api.profiles.getByUserId,
    storedUserId ? { userId: storedUserId as Id<'users'> } : 'skip'
  );

  const [formData, setFormData] = useState<Record<string, any>>({
    personalDetails: {},
    education: [],
    testScores: {},
    certificates: [],
    projects: [],
    skills: [],
    interests: [],
    preferredCountries: [],
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingProfile) {
      setFormData({
        personalDetails: {
          dateOfBirth: existingProfile.dateOfBirth || '',
          gender: existingProfile.gender || '',
          nationality: existingProfile.nationality || '',
          country: existingProfile.country || '',
          countryCode: existingProfile.countryCode || '+60',
          phone: existingProfile.phone || '',
        },
        education: existingProfile.education || [],
        testScores: existingProfile.testScores || {},
        certificates: existingProfile.certificates || [],
        projects: existingProfile.projects || [],
        skills: existingProfile.skills || [],
        interests: existingProfile.interests || [],
        preferredCountries: existingProfile.preferredCountries || [],
        availability: existingProfile.availability || '',
      });
      setIsInitialLoading(false);
    } else if (existingProfile === null) {
      setIsInitialLoading(false);
    }
  }, [existingProfile]);

  // Check auth and role on mount
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (user.role !== 'student') {
        router.push('/dashboard');
      }
    }
  }, [router, user, authLoading]);

  const upsertProfile = useMutation(api.profiles.upsert);

  const saveProfileData = async (stepData: Record<string, any>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (storedUserId) {
      const profilePayload = {
        userId: storedUserId as Id<'users'>,
        dateOfBirth: updatedData.personalDetails?.dateOfBirth,
        gender: updatedData.personalDetails?.gender,
        nationality: updatedData.personalDetails?.nationality,
        country: updatedData.personalDetails?.country,
        countryCode: updatedData.personalDetails?.countryCode || undefined,
        phone: updatedData.personalDetails?.phone || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        education: (updatedData.education || []).map((edu: any) => ({
          id: edu.id,
          institutionName: edu.institutionName,
          qualificationTitle: edu.qualificationTitle,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: edu.startDate,
          endDate: edu.endDate || undefined,
          grade: edu.grade || undefined,
          gpa: edu.gpa !== undefined && edu.gpa !== '' ? Number(edu.gpa) : undefined,
        })),
        testScores: {
          sat: updatedData.testScores?.sat ? Number(updatedData.testScores.sat) : undefined,
          ielts: updatedData.testScores?.ielts ? Number(updatedData.testScores.ielts) : undefined,
          toefl: updatedData.testScores?.toefl ? Number(updatedData.testScores.toefl) : undefined,
          gre: updatedData.testScores?.gre ? Number(updatedData.testScores.gre) : undefined,
          gmat: updatedData.testScores?.gmat ? Number(updatedData.testScores.gmat) : undefined,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        certificates: (updatedData.certificates || []).map((cert: any) => ({
          id: cert.id,
          title: cert.title,
          issuer: cert.issuer,
          dateIssued: cert.dateIssued,
        })),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projects: (updatedData.projects || []).map((proj: any) => ({
          id: proj.id,
          title: proj.title,
          description: proj.description,
          technologies: proj.technologies || [],
          startDate: proj.startDate,
          endDate: proj.endDate || undefined,
        })),
        skills: updatedData.skills || [],
        interests: updatedData.interests || [],
        preferredCountries: updatedData.preferredCountries || [],
        availability: updatedData.availability || undefined,
      };

      await upsertProfile(profilePayload);
      return updatedData;
    }
    return updatedData;
  };

  const handleNext = async (stepData: Record<string, any>) => {
    try {
      await saveProfileData(stepData);
      
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Failed to save profile progress:', err);
      showToast('Failed to save progress', 'error');
    }
  };

  const handleSave = async (stepData: Record<string, any>) => {
    try {
      await saveProfileData(stepData);
      showToast('Profile progress saved successfully!');
    } catch (err) {
      console.error('Failed to save profile:', err);
      showToast('Failed to save profile', 'error');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderStep = () => {
    const commonProps = {
      data: formData,
      onNext: handleNext,
      onSave: handleSave,
      onBack: handleBack,
    };

    switch (currentStep) {
      case 1:
        return <PersonalDetailsForm {...commonProps} isFirstStep />;
      case 2:
        return <EducationForm {...commonProps} />;
      case 3:
        return <TestScoresForm {...commonProps} />;
      case 4:
        return <AchievementsForm {...commonProps} />;
      case 5:
        return <PreferencesForm {...commonProps} />;
      default:
        return null;
    }
  };

  if (isInitialLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container className="py-6 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('profile.complete.title')}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {t('profile.complete.subtitle')}
                </p>
              </div>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {currentStep} / {STEPS.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(currentStep / STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Step navigation pills */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {STEPS.map((step) => {
              const canNavigate = !!existingProfile || step.id <= currentStep;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (canNavigate) setCurrentStep(step.id);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${step.id === currentStep
                      ? 'bg-primary-600 text-white'
                      : canNavigate
                        ? 'bg-primary-100 text-primary-700 hover:bg-primary-200 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  disabled={!canNavigate}
                >
                  {t(step.labelKey)}
                </button>
              );
            })}
          </div>

          {/* Current step form */}
          <Card className="p-4 sm:p-6">{renderStep()}</Card>
        </div>
      </Container>
    </MainLayout>
  );
}
