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
  Flag,
  Users
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
  const safeProfile = profile || { education: [], projects: [], skills: [], certificates: [], extracurriculars: [] };

  // 1. Basic Info (10 points)
  if (user.fullName) score += 3;
  if (user.email) score += 3;
  if (safeProfile.phone) score += 2; else suggestions.push('phone');
  if (safeProfile.country || safeProfile.nationality) score += 2;

  // 2. Education (25 points) - More granular based on levels
  if (safeProfile.education && safeProfile.education.length > 0) {
    const quals = safeProfile.education.map((e: any) => e.qualificationTitle?.toLowerCase() || '');
    const isUni = quals.some((q: string) => q.includes('bachelor') || q.includes('master') || q.includes('phd') || q.includes('mba') || q.includes('university'));
    const isCollege = quals.some((q: string) => q.includes('associate') || q.includes('diploma') || q.includes('college'));
    const isSchool = quals.some((q: string) => q.includes('high school') || q.includes('secondary') || q.includes('school'));

    // Base education score
    score += 15;

    // Level-specific suggestions
    if (isUni) {
      // University students should have GPA
      const hasGpa = safeProfile.education.some((edu: any) => (edu.gpa !== undefined && edu.gpa > 0) || edu.grade);
      if (hasGpa) score += 10; else suggestions.push('gpa');
    } else if (isCollege || isSchool) {
      // School/College students should have subject scores or GPA
      const hasAcademicResults = (safeProfile.subjectScores && safeProfile.subjectScores.length > 0) || 
                                 safeProfile.education.some((edu: any) => edu.gpa || edu.grade);
      if (hasAcademicResults) score += 10; else suggestions.push('subjectScores');
    }
  } else {
    suggestions.push('education');
  }

  // 3. Skills (20 points)
  if (safeProfile.skills && safeProfile.skills.length > 0) {
    if (safeProfile.skills.length >= 8) score += 20;
    else if (safeProfile.skills.length >= 5) score += 15;
    else score += 10;
    if (safeProfile.skills.length < 8) suggestions.push('skills');
  } else {
    suggestions.push('skillsBasic');
  }

  // 4. Projects (15 points)
  if (safeProfile.projects && safeProfile.projects.length > 0) {
    score += 8;
    const hasDetailedProjects = safeProfile.projects.every((p: any) => p.description && p.description.length > 50);
    if (hasDetailedProjects) score += 7;
    else suggestions.push('projectDetail');
  } else {
    suggestions.push('projectDetailBasic');
  }

  // 5. Credentials & Tests (15 points)
  if (safeProfile.certificates && safeProfile.certificates.length > 0) score += 8;
  else suggestions.push('certificates');

  if (safeProfile.testScores && Object.values(safeProfile.testScores).some(v => v !== undefined)) score += 7;

  // 6. Extracurriculars (15 points)
  if (safeProfile.extracurriculars && safeProfile.extracurriculars.length > 0) {
    score += 10;
    if (safeProfile.extracurriculars.length >= 3) score += 5;
    else suggestions.push('extracurricularCount');
  } else {
    suggestions.push('extracurricularBasic');
  }

  // Cap at 100
  score = Math.min(score, 100);

  let level: 'needsImprovement' | 'goodProgress' | 'professional' | 'elite' = 'needsImprovement';
  if (score >= 90) level = 'elite';
  else if (score >= 70) level = 'professional';
  else if (score >= 40) level = 'goodProgress';

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
      case 'education': {
        if (!safeProfile.education?.length) return 0;
        const quals = safeProfile.education.map((e: any) => e.qualificationTitle?.toLowerCase() || '');
        const isUni = quals.some((q: string) => q.includes('bachelor') || q.includes('master') || q.includes('phd') || q.includes('mba') || q.includes('university'));
        const isCollege = quals.some((q: string) => q.includes('associate') || q.includes('diploma') || q.includes('college'));
        
        let progress = 60; // Has entries
        const hasGpa = safeProfile.education.some((e: any) => e.gpa || e.grade);
        if (hasGpa) progress += 20;
        if (isUni || isCollege) progress += 20;
        else if (safeProfile.subjectScores?.length) progress += 20;
        
        return Math.min(100, progress);
      }
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
      case 'extracurriculars':
        return safeProfile.extracurriculars?.length > 0 ? (safeProfile.extracurriculars.every((e: any) => e.description?.length > 30) ? 100 : 50) : 0;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-[#faf9f6] p-8 sm:p-14 border border-gray-200/50 shadow-2xl print:shadow-none print:border-none font-sans text-gray-900 relative overflow-hidden" id="resume-content">
      {/* Design accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/5 blur-[120px] pointer-events-none rounded-full" />
      
      {/* Decorative Retro Grid (Subtle) */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none no-print" 
           style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }} />

      {/* Print Only Watermark */}
      <div className="hidden print:block absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] opacity-[0.03] text-[120px] font-black pointer-events-none whitespace-nowrap z-0 select-none">
        PATHFINDR
      </div>

      {/* Header */}
      <div className="relative z-10 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.85] text-gray-900">
              {user.fullName}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              <a href={`mailto:${user.email}`} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                <span className="p-1.5 bg-gray-100 rounded-md"><Mail className="w-3.5 h-3.5" /></span>
                {user.email}
              </a>
              {safeProfile.phone && (
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="p-1.5 bg-gray-100 rounded-md"><Phone className="w-3.5 h-3.5" /></span>
                  {safeProfile.phone}
                </span>
              )}
              {safeProfile.country && (
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="p-1.5 bg-gray-100 rounded-md"><MapPin className="w-3.5 h-3.5" /></span>
                  {safeProfile.country}
                </span>
              )}
            </div>
          </div>
          <div className="relative no-print">
            {user.profileImageUrl ? (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-lg blur opacity-20" />
                <img src={user.profileImageUrl} alt="" className="relative w-24 h-24 object-cover rounded-lg border-2 border-white shadow-xl" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-white shadow-inner flex items-center justify-center">
                <User className="w-10 h-10 text-gray-300" />
              </div>
            )}
          </div>
        </div>
        <div className="h-2 w-full bg-gray-900 mt-8 rounded-full overflow-hidden flex">
          <div className="h-full bg-primary-500 w-1/3" />
          <div className="h-full bg-secondary-500 w-1/4" />
          <div className="h-full bg-primary-300 flex-1" />
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
              <div className="space-y-8">
                {safeProfile.education.map((edu: any, i: number) => (
                  <div key={i} className="group relative pl-6 border-l-4 border-gray-900/10 hover:border-gray-900 transition-colors">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h4 className="font-bold text-xl leading-tight text-gray-900">{edu.institutionName}</h4>
                    <p className="text-gray-600 font-semibold mt-1">{edu.qualificationTitle} • <span className="text-primary-600">{edu.fieldOfStudy}</span></p>
                    <div className="flex justify-between mt-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                      <span>{edu.startDate} — {edu.endDate || t('profileView.fields.present')}</span>
                      {edu.gpa && <span className="text-gray-900">{t('profileView.fields.gpa')}: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic no-print px-4 py-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                {t('profileView.resumeOptimizer.placeholders.noEducation')}
              </p>
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
              <div className="space-y-6 bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-sm">
                {safeProfile.subjectScores.map((entry: any, ei: number) => (
                  <div key={ei} className="last:mb-0 mb-6 border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline gap-3">
                        <h4 className="font-black text-lg tracking-tight uppercase">{entry.examType}</h4>
                        {entry.year && <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase">{entry.year}</span>}
                      </div>
                      <div className="h-0.5 flex-1 mx-4 bg-gray-100 no-print" />
                    </div>
                    {buildSubjectSummary(entry) && (
                      <p className="text-xs text-primary-700 font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" />
                        {buildSubjectSummary(entry)}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                      {entry.subjects.map((s: any, si: number) => (
                        <div key={si} className="flex items-center justify-between border-b border-gray-100/50 py-1 transition-colors hover:border-gray-200">
                          <span className="text-sm text-gray-600 font-medium">{s.subject}</span>
                          <span className="text-sm font-black text-gray-900 min-w-[24px] text-right">{s.grade}</span>
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
              <div className="space-y-8">
                {safeProfile.projects.map((proj: any, i: number) => (
                  <div key={i} className="group relative pl-6 border-l-4 border-gray-900/10 hover:border-gray-900 transition-colors">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h4 className="font-bold text-xl leading-tight text-gray-900">{proj.title}</h4>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed font-medium">{proj.description}</p>
                    {proj.technologies?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {proj.technologies.map((tech: string) => (
                          <span key={tech} className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-gray-900 text-white rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic no-print px-4 py-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                {t('profileView.resumeOptimizer.placeholders.noProjects')}
              </p>
            )}
          </section>

          {/* Extracurricular Activities */}
          <section>
            <ResumeSectionTitle
              icon={Users}
              title={t('profileView.resumeOptimizer.sections.extracurriculars')}
              progress={getSectionProgress('extracurriculars')}
              showProgress={showProgress}
            />
            {safeProfile.extracurriculars?.length > 0 ? (
              <div className="space-y-8">
                {safeProfile.extracurriculars.map((ec: any, i: number) => (
                  <div key={i} className="group relative pl-6 border-l-4 border-gray-900/10 hover:border-gray-900 transition-colors">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xl leading-tight text-gray-900">{ec.name}</h4>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap ml-4">
                        {ec.startDate} — {ec.endDate || t('profileView.fields.present')}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-primary-600 mt-1 uppercase tracking-tight">{ec.role}</p>
                    {ec.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed font-medium">{ec.description}</p>}
                    {ec.achievement && (
                      <div className="mt-3 flex items-center gap-2 text-amber-700 bg-amber-50/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-amber-200/50 w-fit">
                        <Trophy className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{ec.achievement}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic no-print px-4 py-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                {t('profileView.resumeOptimizer.placeholders.noExtracurriculars')}
              </p>
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
                  <span key={skill} className="px-3 py-1 bg-white border border-gray-200 text-gray-900 text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md hover:border-gray-900 transition-all">
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
              <div className="space-y-5">
                {safeProfile.certificates.map((cert: any, i: number) => (
                  <div key={i} className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <h5 className="font-bold text-sm text-gray-900">{cert.title}</h5>
                    <p className="text-[11px] text-gray-500 font-medium mt-1">{cert.issuer}</p>
                    <p className="text-[10px] text-primary-600 font-bold uppercase tracking-widest mt-2">{cert.dateIssued}</p>
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
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(safeProfile.testScores || {}).map(([key, value]) => {
                  if (value === undefined) return null;
                  return (
                    <div key={key} className="flex items-center justify-between bg-white/40 backdrop-blur-sm p-3 border border-gray-100 rounded-xl shadow-sm">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{t(`profile.forms.testScores.${key}.label`, { defaultValue: key })}</p>
                      <p className="text-lg font-black text-gray-900 leading-none">{value as any}</p>
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
    <div className="mb-6 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center no-print">
            <Icon className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
          </div>
          <Icon className="w-5 h-5 text-gray-900 hidden print:block" strokeWidth={2.5} />
          <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">{title}</h3>
        </div>
        {showProgress && (
          <div className="no-print flex items-center gap-2 px-2 py-1 bg-white/50 backdrop-blur-md rounded-full border border-gray-100 shadow-sm">
            <span className={cn(
              "text-[9px] font-black uppercase tracking-tighter px-1",
              progress === 100 ? "text-green-600" : progress > 0 ? "text-amber-600" : "text-gray-400"
            )}>
              {t('profileView.resumeOptimizer.percentageComplete', { progress })}
            </span>
          </div>
        )}
      </div>
      
      {showProgress && (
        <div className="no-print w-full h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
          <div 
            className={cn(
              "h-full transition-all duration-1000",
              progress === 100 ? "bg-green-500" : progress > 0 ? "bg-amber-400" : "bg-gray-200"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {/* Decorative background for the title line in print */}
      <div className="hidden print:block w-full h-0.5 bg-gray-900 mt-1" />
    </div>
  );
}

