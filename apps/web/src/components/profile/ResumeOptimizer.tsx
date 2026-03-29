'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Trophy, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Download, 
  Printer,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  Share2,
  Copy,
  ExternalLink,
  Globe,
  Flag
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

interface ResumeOptimizerProps {
  profile: any;
  user: any;
}

export function ResumeOptimizer({ profile, user }: ResumeOptimizerProps) {
  const { t } = useTranslation();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { score, suggestions, level } = calculateScore(profile, user);

  const levelInfo = getLevelInfo(level, t);

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-primary-50">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Trophy className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {t('profileView.resumeOptimizer.title')}
              </h2>
            </div>
            <p className="text-gray-600">
              {levelInfo.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-9 px-3 text-xs"
                onClick={() => {
                  const url = `${window.location.protocol}//${window.location.host}/resume/${user._id || localStorage.getItem('userId')}`;
                  navigator.clipboard.writeText(url);
                  alert(t('profileView.resumeOptimizer.copySuccess'));
                }}
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                {t('profileView.resumeOptimizer.copyLink')}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-3 text-xs"
                asChild
              >
                <a href={`/resume/${user._id || localStorage.getItem('userId')}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  {t('profileView.resumeOptimizer.viewPublic')}
                </a>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="stroke-gray-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                />
                <path
                  className={cn("transition-all duration-1000 ease-out", levelInfo.color)}
                  strokeDasharray={`${score}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{score}</span>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{t('profileView.resumeOptimizer.scoreLabel')}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t('profileView.resumeOptimizer.ranking')}
              </div>
              <div className={cn("text-lg font-bold", levelInfo.textColor)}>
                {levelInfo.label}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-tight">
              <TrendingUp className="w-4 h-4 text-green-600" />
              {t('profileView.resumeOptimizer.suggestions')}
            </h3>
            <ul className="space-y-3">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3 group">
                    <div className="mt-1 p-0.5 bg-amber-50 rounded-full group-hover:bg-amber-100 transition-colors">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">
                      {t(`profileView.resumeOptimizer.suggestionsList.${suggestion}`)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-3">
                  <div className="mt-1 p-0.5 bg-green-50 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{t('profileView.resumeOptimizer.perfectProfile')}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="flex flex-col justify-end space-y-3">
            <Button 
              variant="primary" 
              className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
              onClick={() => setIsPreviewOpen(true)}
            >
              <FileText className="w-5 h-5 mr-2" />
              {t('profileView.resumeOptimizer.generateBtn')}
            </Button>
            <p className="text-xs text-center text-gray-500 italic">
              {t('profileView.resumeOptimizer.aiDescription')}
            </p>
          </div>
        </div>
      </div>

      <ResumePreview 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        profile={profile} 
        user={user} 
      />
    </Card>
  );
}

/* ─── Score Calculation Logic ────────────────────────────────── */

function calculateScore(profile: any, user: any) {
  let score = 0;
  const suggestions: string[] = [];

  // 1. Basic Info (10 points)
  if (user.fullName) score += 3;
  if (user.email) score += 3;
  if (profile.phone) score += 2; else suggestions.push('phone');
  if (profile.country || profile.nationality) score += 2;

  // 2. Education (25 points)
  if (profile.education && profile.education.length > 0) {
    score += 15;
    const hasGpa = profile.education.some((edu: any) => edu.gpa !== undefined || edu.grade !== undefined);
    if (hasGpa) score += 10;
    else suggestions.push('gpa');
  } else {
    suggestions.push('education');
  }

  // 3. Skills (20 points)
  if (profile.skills && profile.skills.length > 0) {
    if (profile.skills.length >= 8) score += 20;
    else if (profile.skills.length >= 5) score += 15;
    else score += 10;
    if (profile.skills.length < 8) suggestions.push('skills');
  } else {
    suggestions.push('skillsBasic');
  }

  // 4. Projects (20 points)
  if (profile.projects && profile.projects.length > 0) {
    score += 10;
    const hasDetailedProjects = profile.projects.every((p: any) => p.description && p.description.length > 50);
    if (hasDetailedProjects) score += 10;
    else suggestions.push('projectDetail');
  } else {
    suggestions.push('projectDetailBasic');
  }

  // 5. Credentials (15 points)
  if (profile.certificates && profile.certificates.length > 0) score += 10;
  else suggestions.push('certificates');

  if (profile.testScores && Object.values(profile.testScores).some(v => v !== undefined)) score += 5;

  // 6. Subject Scores (10 points)
  if (profile.subjectScores && profile.subjectScores.length > 0) {
    const totalSubjects = profile.subjectScores.reduce((sum: number, e: any) => sum + e.subjects.length, 0);
    if (totalSubjects >= 5) score += 10;
    else score += 5;
  } else {
    suggestions.push('subjectScores');
  }

  // 7. Extras (10 points)
  if (profile.interests && profile.interests.length > 0) score += 5;
  if (profile.preferredCountries && profile.preferredCountries.length > 0) score += 5;

  // Cap at 100
  score = Math.min(score, 100);

  let level: 'needsImprovement' | 'goodProgress' | 'professional' | 'elite' = 'needsImprovement';
  if (score > 90) level = 'elite';
  else if (score > 70) level = 'professional';
  else if (score > 40) level = 'goodProgress';

  return { score, suggestions: suggestions.slice(0, 3), level };
}

function getLevelInfo(level: string, t: any) {
  switch (level) {
    case 'elite':
      return {
        label: t('profileView.resumeOptimizer.levels.elite'),
        description: t('profileView.resumeOptimizer.descriptions.elite'),
        color: 'stroke-primary-600',
        textColor: 'text-primary-600'
      };
    case 'professional':
      return {
        label: t('profileView.resumeOptimizer.levels.professional'),
        description: t('profileView.resumeOptimizer.descriptions.professional'),
        color: 'stroke-blue-600',
        textColor: 'text-blue-600'
      };
    case 'goodProgress':
      return {
        label: t('profileView.resumeOptimizer.levels.goodProgress'),
        description: t('profileView.resumeOptimizer.descriptions.goodProgress'),
        color: 'stroke-green-600',
        textColor: 'text-green-600'
      };
    default:
      return {
        label: t('profileView.resumeOptimizer.levels.needsImprovement'),
        description: t('profileView.resumeOptimizer.descriptions.needsImprovement'),
        color: 'stroke-amber-500',
        textColor: 'text-amber-600'
      };
  }
}

/* ─── Resume Preview Modal ───────────────────────────────────── */

function ResumePreview({ isOpen, onClose, profile, user }: { isOpen: boolean, onClose: () => void, profile: any, user: any }) {
  const { t } = useTranslation();

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('profileView.resumeOptimizer.previewTitle')} 
      className="max-w-4xl"
    >
      <div className="flex justify-end gap-2 mb-4 no-print">
        <Button variant="secondary" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-1.5" />
          {t('profileView.resumeOptimizer.printBtn')}
        </Button>
      </div>

      <ResumeContent profile={profile} user={user} showProgress={true} />
    </Modal>
  );
}

export function ResumeContent({ profile, user, showProgress = false }: { profile: any, user: any, showProgress?: boolean }) {
  const { t } = useTranslation();
  const safeProfile = profile || { education: [], projects: [], skills: [], certificates: [], testScores: {} };
  
  const getSectionProgress = (section: string) => {
    if (!profile) return 0;
    switch (section) {
      case 'education':
        return safeProfile.education?.length > 0 ? (safeProfile.education.some((e: any) => e.gpa) ? 100 : 70) : 0;
      case 'projects':
        return safeProfile.projects?.length > 0 ? (safeProfile.projects.every((p: any) => p.description?.length > 50) ? 100 : 50) : 0;
      case 'skills':
        return safeProfile.skills?.length > 0 ? Math.min(100, (safeProfile.skills.length / 8) * 100) : 0;
      case 'certificates':
        return safeProfile.certificates?.length > 0 ? 100 : 0;
      case 'testScores':
        return Object.values(safeProfile.testScores || {}).some(v => v !== undefined) ? 100 : 0;
      case 'subjectScores': {
        if (!safeProfile.subjectScores?.length) return 0;
        const total = safeProfile.subjectScores.reduce((s: number, e: any) => s + e.subjects.length, 0);
        return total >= 5 ? 100 : Math.round((total / 5) * 100);
      }
      default:
        return 0;
    }
  };

  return (
    <div className="bg-white p-8 sm:p-12 border shadow-sm print:shadow-none print:border-none font-sans text-gray-900 relative" id="resume-content">
      {/* Print Only Watermark */}
      <div className="hidden print:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 opacity-[0.03] text-[100px] font-black pointer-events-none whitespace-nowrap z-0">
        ThePathFindr
      </div>

      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-6 mb-8 flex justify-between items-start relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight uppercase leading-none">
            {user.fullName}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
            {safeProfile.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {safeProfile.phone}</span>}
            {safeProfile.country && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {safeProfile.country}</span>}
          </div>
        </div>
        <div className="hidden sm:block">
          {user.profileImageUrl && (
            <img src={user.profileImageUrl} alt="" className="w-20 h-20 rounded shadow-inner" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-10">
          {/* Education */}
          <section>
            <ResumeSectionTitle 
              icon={GraduationCap} 
              title={t('profileView.resumeOptimizer.sections.education')} 
              progress={getSectionProgress('education')}
              showProgress={showProgress}
            />
            {safeProfile.education?.length > 0 ? (
              <div className="space-y-6">
                {safeProfile.education.map((edu: any, i: number) => (
                  <div key={i} className="relative pl-4 border-l-2 border-gray-100">
                    <h4 className="font-bold text-lg leading-tight">{edu.institutionName}</h4>
                    <p className="text-gray-700 italic">{edu.qualificationTitle} • {edu.fieldOfStudy}</p>
                    <div className="flex justify-between mt-1 text-sm text-gray-500 font-medium">
                      <span>{edu.startDate} — {edu.endDate || t('profileView.fields.present')}</span>
                      {edu.gpa && <span>{t('profileView.fields.gpa')}: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic no-print">{t('profileView.resumeOptimizer.placeholders.noEducation')}</p>
            )}
          </section>

          {/* Academic Results (Subject Scores) */}
          {safeProfile.subjectScores?.length > 0 && (
            <section>
              <ResumeSectionTitle
                icon={GraduationCap}
                title="Academic Results"
                progress={getSectionProgress('subjectScores')}
                showProgress={showProgress}
              />
              <div className="space-y-5">
                {safeProfile.subjectScores.map((entry: any, ei: number) => (
                  <div key={ei}>
                    <div className="flex items-baseline gap-2 mb-2">
                      <h4 className="font-bold text-base">{entry.examType}</h4>
                      {entry.year && <span className="text-xs text-gray-500 font-medium">({entry.year})</span>}
                    </div>
                    {buildSubjectSummary(entry) && (
                      <p className="text-sm text-gray-600 italic mb-2 leading-relaxed">
                        {buildSubjectSummary(entry)}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      {entry.subjects.map((s: any, si: number) => (
                        <div key={si} className="flex items-center justify-between border-b border-gray-100 py-0.5">
                          <span className="text-sm text-gray-700">{s.subject}</span>
                          <span className="text-sm font-bold text-gray-900 ml-2">{s.grade}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          <section>
            <ResumeSectionTitle
              icon={Briefcase}
              title={t('profileView.resumeOptimizer.sections.projects')}
              progress={getSectionProgress('projects')}
              showProgress={showProgress}
            />
            {safeProfile.projects?.length > 0 ? (
              <div className="space-y-6">
                {safeProfile.projects.map((proj: any, i: number) => (
                  <div key={i} className="relative pl-4 border-l-2 border-gray-100">
                    <h4 className="font-bold text-lg leading-tight">{proj.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
                    {proj.technologies?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {proj.technologies.map((tech: string) => (
                          <span key={tech} className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic no-print">{t('profileView.resumeOptimizer.placeholders.noProjects')}</p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Skills */}
          <section>
            <ResumeSectionTitle 
              icon={Sparkles} 
              title={t('profileView.resumeOptimizer.sections.expertise')} 
              progress={getSectionProgress('skills')}
              showProgress={showProgress}
            />
            {safeProfile.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {safeProfile.skills.map((skill: string) => (
                  <span key={skill} className="px-2.5 py-1 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-wide">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic no-print">{t('profileView.resumeOptimizer.placeholders.noSkills')}</p>
            )}
          </section>

          {/* Certificates */}
          <section>
            <ResumeSectionTitle 
              icon={Award} 
              title={t('profileView.resumeOptimizer.sections.certificates')} 
              progress={getSectionProgress('certificates')}
              showProgress={showProgress}
            />
            {safeProfile.certificates?.length > 0 ? (
              <div className="space-y-4">
                {safeProfile.certificates.map((cert: any, i: number) => (
                  <div key={i}>
                    <h5 className="font-bold text-sm">{cert.title}</h5>
                    <p className="text-xs text-gray-600">{cert.issuer} • {cert.dateIssued}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic no-print">{t('profileView.resumeOptimizer.placeholders.noCertificates')}</p>
            )}
          </section>

          {/* Test Scores */}
          <section>
            <ResumeSectionTitle 
              icon={FileText} 
              title={t('profileView.resumeOptimizer.sections.testScores')} 
              progress={getSectionProgress('testScores')}
              showProgress={showProgress}
            />
            {(safeProfile.testScores && Object.values(safeProfile.testScores || {}).some(v => v !== undefined)) ? (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(safeProfile.testScores || {}).map(([key, value]) => {
                  if (value === undefined) return null;
                  return (
                    <div key={key} className="bg-gray-50 p-2 border border-gray-100 rounded">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">{t(`profile.forms.testScores.${key}.label`, { defaultValue: key })}</p>
                      <p className="text-lg font-black text-gray-800 leading-none mt-1">{value as any}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic no-print">{t('profileView.resumeOptimizer.placeholders.noTestScores')}</p>
            )}
          </section>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 text-center text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em] relative z-10">
        {t('profileView.resumeOptimizer.footer')}
      </div>
    </div>
  );
}

function buildSubjectSummary(entry: { examType: string; subjects: { subject: string; grade: string }[] }): string {
  const topGrades: Record<string, string[]> = {
    SPM: ['A+', 'A', 'A-'],
    IGCSE: ['A*', 'A'],
    'O-Level': ['A1', 'A2'],
  };
  const top = topGrades[entry.examType] ?? [];
  const distinctions = entry.subjects.filter((s) => top.includes(s.grade));
  if (distinctions.length === 0) return '';
  const names = distinctions.map((s) => s.subject);
  if (names.length === 1) return `Achieved distinction in ${names[0]}.`;
  const last = names.pop();
  return `Achieved distinctions in ${names.join(', ')} and ${last}.`;
}

function ResumeSectionTitle({ icon: Icon, title, progress, showProgress }: { icon: any, title: string, progress: number, showProgress: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="mb-5 border-b border-gray-900 pb-1.5 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
          <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">{title}</h3>
        </div>
        {showProgress && (
          <div className="no-print flex items-center gap-2">
            <span className={cn(
              "text-[10px] font-bold uppercase",
              progress === 100 ? "text-green-600" : progress > 0 ? "text-amber-500" : "text-gray-400"
            )}>
              {t('profileView.resumeOptimizer.percentageComplete', { progress })}
            </span>
          </div>
        )}
      </div>
      {showProgress && (
        <div className="no-print w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-1000",
              progress === 100 ? "bg-green-500" : progress > 0 ? "bg-amber-400" : "bg-gray-200"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

