'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../../../../convex/_generated/api';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import type { Id } from '../../../../../../convex/_generated/dataModel';
import {
  User,
  Users,
  GraduationCap,
  FileText,
  Award,
  FolderOpen,
  Sparkles,
  Heart,
  Globe,
  Pencil,
  Calendar,
  MapPin,
  Flag,
  Phone,
  Copy,
  Check,
  Gift,
  Share2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ResumeOptimizer } from '@/components/profile/ResumeOptimizer';

export default function StudentProfileViewPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [storedUserId, setStoredUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

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

  const referralStats = useQuery(
    api.referrals.getReferralStats,
    storedUserId ? { userId: storedUserId as Id<'users'> } : 'skip'
  );

  const generateReferralCode = useMutation(api.referrals.generateReferralCode);

  // Auto-generate referral code if user doesn't have one
  useEffect(() => {
    if (storedUserId && referralStats && !referralStats.referralCode) {
      generateReferralCode({ userId: storedUserId as Id<'users'> });
    }
  }, [storedUserId, referralStats, generateReferralCode]);

  if (authLoading || profile === undefined) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated || !user) return null;

  if (profile === null) {
    return (
      <MainLayout>
        <Container className="py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t('profileView.notFound')}
            </h1>
            <p className="text-gray-600 mb-6">
              {t('profileView.notFoundDesc')}
            </p>
            <Button variant="primary" asChild>
              <Link href="/profile/complete">{t('profileView.completeProfileBtn')}</Link>
            </Button>
          </div>
        </Container>
      </MainLayout>
    );
  }

  const hasTestScores =
    profile.testScores &&
    (profile.testScores.sat ||
      profile.testScores.ielts ||
      profile.testScores.toefl ||
      profile.testScores.gre ||
      profile.testScores.gmat);

  const hasCertificates = profile.certificates && profile.certificates.length > 0;
  const hasProjects = profile.projects && profile.projects.length > 0;
  const hasSkills = profile.skills && profile.skills.length > 0;
  const hasInterests = profile.interests && profile.interests.length > 0;

  return (
    <MainLayout>
      <Container className="py-6 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <Card className="p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.fullName} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                    {user.fullName}
                  </h1>
                  <p className="text-gray-500 text-sm truncate">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    {profile.nationality && (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <Flag className="w-3.5 h-3.5 shrink-0" />
                        {profile.nationality}
                      </span>
                    )}
                    {profile.country && (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {profile.country}
                      </span>
                    )}
                    {profile.phone && (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        {profile.countryCode ? `${profile.countryCode} ` : ''}{profile.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="secondary" size="sm" asChild className="self-start mt-1 shrink-0">
                <Link href="/profile/complete" className="flex items-center gap-1.5">
                  <Pencil className="w-4 h-4" />
                  {t('profileView.editProfile')}
                </Link>
              </Button>
            </div>
          </Card>

          {/* Resume Optimizer */}
          <ResumeOptimizer profile={profile} user={user} />

          {/* Referral Programme */}
          {referralStats && (
            <Card className="p-5 sm:p-6">
              <SectionHeader icon={Users} title={t('referral.title')} />
              <div className="mt-4 space-y-4">
                {/* Referral Code */}
                {referralStats.referralCode && (
                   <div>
                    <p className="text-sm text-gray-500 mb-2">{t('referral.code.label')}</p>
                    <div className="flex items-center gap-2">
                      <code className="px-4 py-2 bg-gray-100 rounded-lg text-lg font-mono font-bold text-gray-900 tracking-wider">
                        {referralStats.referralCode}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(referralStats.referralCode!);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={t('referral.code.copy')}
                      >
                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => {
                          const shareUrl = `${window.location.origin}/register?ref=${referralStats.referralCode}`;
                          navigator.clipboard.writeText(shareUrl);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={t('referral.code.copyLink')}
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {t('referral.code.description')}
                    </p>
                  </div>
                )}

                {/* Progress */}
                <div>
                   <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      {t('referral.progress.title')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('referral.progress.count', { count: referralStats.referralsTowardNextReward })}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${(referralStats.referralsTowardNextReward / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    {referralStats.referralsNeeded === 0
                      ? t('referral.progress.earned')
                      : referralStats.referralsTowardNextReward === 0
                        ? t('referral.progress.inviteToEarn')
                        : t('referral.progress.moreNeeded', { count: referralStats.referralsNeeded })
                    }
                  </p>
                </div>

                {/* Total Stats */}
                <div className="flex items-center gap-6 pt-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{referralStats.totalReferrals}</p>
                    <p className="text-xs text-gray-500">{t('referral.progress.stats.friendsReferred')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{referralStats.rewardsEarned}</p>
                    <p className="text-xs text-gray-500">{t('referral.progress.stats.rewardsEarned')}</p>
                  </div>
                </div>

                {/* Earned Rewards */}
                {referralStats.rewards.length > 0 && (
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">{t('referral.rewards.title')}</p>
                    <div className="space-y-2">
                      {referralStats.rewards.map((reward) => (
                        <div
                          key={reward._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-primary-600" />
                            {reward.rewardType === 'self_subscription' ? (
                              <span className="text-sm font-medium text-gray-900">
                                {t('referral.rewards.proSubscription')}
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {t('referral.rewards.coupon')} <code className="font-mono">{reward.couponCode}</code>
                                </span>
                                {reward.couponStatus === 'available' && (
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(reward.couponCode!);
                                      setCopiedCoupon(reward.couponCode!);
                                      setTimeout(() => setCopiedCoupon(null), 2000);
                                    }}
                                    className="p-1 text-gray-400 hover:text-primary-600"
                                    title={t('referral.rewards.copyCoupon')}
                                  >
                                    {copiedCoupon === reward.couponCode ? (
                                      <Check className="w-3.5 h-3.5 text-green-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <Badge
                            variant={
                              reward.rewardType === 'self_subscription'
                                ? 'success'
                                : reward.couponStatus === 'available'
                                  ? 'primary'
                                  : 'default'
                            }
                            size="sm"
                          >
                            {reward.rewardType === 'self_subscription'
                              ? t('referral.rewards.status.active')
                              : reward.couponStatus === 'available'
                                ? t('referral.rewards.status.available')
                                : t('referral.rewards.status.claimed')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Personal Details */}
          <Card className="p-5 sm:p-6">
            <SectionHeader icon={User} title={t('profileView.sections.personal')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <DetailItem label={t('profileView.fields.dob')} value={profile.dateOfBirth} />
              <DetailItem
                label={t('profileView.fields.gender')}
                value={
                  profile.gender
                    ? t(`profile.forms.personalDetails.gender.${profile.gender}`)
                    : undefined
                }
              />
              <DetailItem label={t('profileView.fields.nationality')} value={profile.nationality} />
              <DetailItem label={t('profileView.fields.country')} value={profile.country} />
              <DetailItem
                label={t('profileView.fields.phone')}
                value={
                  profile.phone
                    ? `${profile.countryCode || ''} ${profile.phone}`
                    : undefined
                }
              />
            </div>
          </Card>

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <Card className="p-6">
              <SectionHeader icon={GraduationCap} title={t('profileView.sections.education')} />
              <div className="mt-4 space-y-5">
                {profile.education.map((edu, index) => (
                  <div
                    key={edu.id || index}
                    className={
                      index > 0
                        ? 'pt-5 border-t border-gray-100'
                        : ''
                    }
                  >
                    <h4 className="font-semibold text-gray-900">
                      {edu.institutionName}
                    </h4>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {edu.qualificationTitle}
                      {edu.fieldOfStudy && ` ${t('common.in', { defaultValue: 'in' })} ${edu.fieldOfStudy}`}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {edu.startDate}
                        {edu.endDate ? ` — ${edu.endDate}` : ` — ${t('profileView.fields.present')}`}
                      </span>
                      {edu.gpa !== undefined && edu.gpa !== null && (
                        <span>{t('profileView.fields.gpa')}: {edu.gpa}</span>
                      )}
                      {edu.grade && <span>{t('profileView.fields.grade')}: {edu.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Test Scores */}
          {hasTestScores && (
            <Card className="p-6">
              <SectionHeader icon={FileText} title={t('profileView.sections.testScores')} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {profile.testScores?.sat && (
                  <ScoreItem label="SAT" value={profile.testScores.sat} />
                )}
                {profile.testScores?.ielts && (
                  <ScoreItem label="IELTS" value={profile.testScores.ielts} />
                )}
                {profile.testScores?.toefl && (
                  <ScoreItem label="TOEFL" value={profile.testScores.toefl} />
                )}
                {profile.testScores?.gre && (
                  <ScoreItem label="GRE" value={profile.testScores.gre} />
                )}
                {profile.testScores?.gmat && (
                  <ScoreItem label="GMAT" value={profile.testScores.gmat} />
                )}
              </div>
            </Card>
          )}

          {/* Certificates */}
          {hasCertificates && (
            <Card className="p-6">
              <SectionHeader icon={Award} title={t('profileView.sections.certificates')} />
              <div className="mt-4 space-y-4">
                {profile.certificates!.map((cert, index) => (
                  <div
                    key={cert.id || index}
                    className={
                      index > 0
                        ? 'pt-4 border-t border-gray-100'
                        : ''
                    }
                  >
                    <h4 className="font-semibold text-gray-900">
                      {cert.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {cert.issuer}
                    </p>
                    {cert.dateIssued && (
                      <p className="text-sm text-gray-500 mt-0.5 inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {cert.dateIssued}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Projects */}
          {hasProjects && (
            <Card className="p-6">
              <SectionHeader icon={FolderOpen} title={t('profileView.sections.projects')} />
              <div className="mt-4 space-y-5">
                {profile.projects!.map((proj, index) => (
                  <div
                    key={proj.id || index}
                    className={
                      index > 0
                        ? 'pt-5 border-t border-gray-100'
                        : ''
                    }
                  >
                    <h4 className="font-semibold text-gray-900">
                      {proj.title}
                    </h4>
                    {proj.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {proj.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {proj.startDate}
                        {proj.endDate ? ` — ${proj.endDate}` : ` — ${t('profileView.fields.present')}`}
                      </span>
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {proj.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Skills & Interests */}
          {(hasSkills || hasInterests) && (
            <Card className="p-6">
              {hasSkills && (
                <div>
                  <SectionHeader icon={Sparkles} title={t('profileView.sections.skills')} />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.skills!.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {hasInterests && (
                <div className={hasSkills ? 'mt-6' : ''}>
                  <SectionHeader icon={Heart} title={t('profileView.sections.interests')} />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.interests!.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Preferences */}
          {(profile.preferredCountries?.length > 0 || profile.availability) && (
            <Card className="p-6">
              <SectionHeader icon={Globe} title={t('profileView.sections.preferences')} />
              {profile.preferredCountries && profile.preferredCountries.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {t('profileView.fields.preferredCountries')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredCountries.map((country) => (
                      <span
                        key={country}
                        className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.availability && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {t('profileView.fields.availability')}
                  </p>
                  <p className="text-gray-900">{profile.availability}</p>
                </div>
              )}
            </Card>
          )}
        </div>
      </Container>
    </MainLayout>
  );
}

/* ─── Helper Components ──────────────────────────────────────── */

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-primary-600" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}

function ScoreItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
        {label}
      </p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
