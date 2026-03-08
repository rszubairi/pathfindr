'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { MainLayout } from '@/components/layout/MainLayout';
import PersonalDetailsForm from '@/components/profile/PersonalDetailsForm';
import EducationForm from '@/components/profile/EducationForm';
import TestScoresForm from '@/components/profile/TestScoresForm';
import AchievementsForm from '@/components/profile/AchievementsForm';
import PreferencesForm from '@/components/profile/PreferencesForm';

const STEPS = [
  { id: 1, name: 'Personal Details' },
  { id: 2, name: 'Education' },
  { id: 3, name: 'Test Scores' },
  { id: 4, name: 'Achievements' },
  { id: 5, name: 'Preferences' },
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Check auth on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      router.push('/login');
    }
  }, [router]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNext = (stepData: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <MainLayout>
      <Container className="py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Complete Your Academic Profile
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Help us match you with the best scholarships
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
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  if (step.id < currentStep) setCurrentStep(step.id);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${step.id === currentStep
                    ? 'bg-primary-600 text-white'
                    : step.id < currentStep
                      ? 'bg-primary-100 text-primary-700 hover:bg-primary-200 cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                disabled={step.id > currentStep}
              >
                {step.name}
              </button>
            ))}
          </div>

          {/* Current step form */}
          <Card className="p-6">{renderStep()}</Card>
        </div>
      </Container>
    </MainLayout>
  );
}
