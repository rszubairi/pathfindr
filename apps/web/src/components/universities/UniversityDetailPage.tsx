'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin, Globe, Phone, Mail, Calendar, Users, BookOpen,
  ChevronLeft, Trophy, Star, ChevronDown, ChevronUp, ExternalLink,
  Share2, Copy, Check,
} from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import type { UniversityProfile } from '@/data/universityProfiles';

function getInitials(name: string) {
  return name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

interface Props {
  profile: UniversityProfile;
}

export function UniversityDetailPage({ profile }: Props) {
  const params = useParams();
  const lang = (params?.lang as string) ?? 'en';
  const [expandedCategory, setExpandedCategory] = useState<string | null>(profile.courseCategories[0]?.name ?? null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [loadingShortUrl, setLoadingShortUrl] = useState(false);

  const getOrCreateShortUrl = useMutation(api.shortUrls.getOrCreateShortUrl);

  const handleShare = async () => {
    setIsShareModalOpen(true);
    if (!shortUrl) {
      setLoadingShortUrl(true);
      try {
        const targetPath = `/${lang}/universities/${profile.slug}`;
        const shortCode = await getOrCreateShortUrl({
          targetPath,
          type: 'university',
        });
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        setShortUrl(`${baseUrl}/s/${shortCode}`);
      } catch (error) {
        console.error('Error generating short URL:', error);
      } finally {
        setLoadingShortUrl(false);
      }
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const backHref = `/${lang}/university-rankings/2025/${profile.countrySlug}`;

  const stats = [
    profile.studentCount && { label: 'Students', value: profile.studentCount, icon: Users },
    profile.internationalStudents && { label: 'International', value: profile.internationalStudents, icon: Globe },
    { label: 'Founded', value: String(profile.founded), icon: Calendar },
    profile.campusSize && { label: 'Campus', value: profile.campusSize, icon: MapPin },
  ].filter(Boolean) as { label: string; value: string; icon: React.ElementType }[];

  return (
    <>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-800 via-indigo-700 to-blue-600 pt-12 pb-24 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/3" />
        </div>
        <Container>
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {profile.country} Rankings {profile.rankingYear}
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Logo or initials */}
            <div className="shrink-0">
              {profile.logo ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white shadow-xl ring-2 ring-white/30 flex items-center justify-center p-1">
                  <Image
                    src={profile.logo}
                    alt={`${profile.name} logo`}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 ring-2 ring-white/30 flex items-center justify-center text-2xl font-extrabold text-white shadow-xl">
                  {getInitials(profile.name)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold">
                  <Trophy className="w-3 h-3 text-amber-300" />
                  #{profile.globalRank} Globally · #{profile.localRank} in {profile.country}
                </span>
                <Badge variant="outline" size="sm" className="border-white/30 text-white bg-white/10">
                  {profile.type}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
                {profile.name}
              </h1>
              {profile.shortName && profile.shortName !== profile.name && (
                <div className="text-blue-200 text-base font-medium mb-2">{profile.shortName}</div>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-blue-100 text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {profile.city}, {profile.country}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Est. {profile.founded}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-300" /> QS Score {profile.score} · {profile.rankingYear}
                </span>
              </div>
              {profile.tagline && (
                <div className="mt-3 italic text-blue-200 text-sm">"{profile.tagline}"</div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* CTA strip — pulled up over hero */}
      <div className="relative z-10 -mt-8">
        <Container>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
            >
              <Globe className="w-4 h-4" /> Visit Official Website
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm px-5 py-3 rounded-xl border border-gray-200 transition-colors"
              >
                <Mail className="w-4 h-4 text-indigo-500" /> Email Admissions
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/\s/g, '')}`}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm px-5 py-3 rounded-xl border border-gray-200 transition-colors"
              >
                <Phone className="w-4 h-4 text-indigo-500" /> {profile.phone}
              </a>
            )}
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-sm px-5 py-3 rounded-xl transition-colors border border-indigo-200 whitespace-nowrap"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </Container>
      </div>

      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share University"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Share this university profile with others using this short link:
          </p>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex-1 text-sm font-medium text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap px-1">
              {loadingShortUrl ? (
                <span className="text-gray-400 italic">Generating link...</span>
              ) : (
                shortUrl || 'Failed to generate link'
              )}
            </div>
            <Button
              size="sm"
              variant="secondary"
              className={cn(
                "h-9 px-3 rounded-lg flex items-center gap-2 transition-all",
                isCopied ? "border-green-500 bg-green-50 text-green-700" : ""
              )}
              onClick={handleCopy}
              disabled={loadingShortUrl || !shortUrl}
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsShareModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Container className="py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left / Main column ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* About */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> About
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">{profile.description}</p>
            </section>

            {/* Ranking snapshot */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Rankings · {profile.rankingYear}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100">
                  <div className="text-2xl font-extrabold text-indigo-700">#{profile.globalRank}</div>
                  <div className="text-xs text-gray-500 mt-0.5">QS Global Rank</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                  <div className="text-2xl font-extrabold text-amber-600">#{profile.localRank}</div>
                  <div className="text-xs text-gray-500 mt-0.5">National Rank</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                  <div className="text-2xl font-extrabold text-green-700">{profile.score}</div>
                  <div className="text-xs text-gray-500 mt-0.5">QS Score / 100</div>
                </div>
              </div>
              {/* Score bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Overall QS Score</span>
                  <span className="font-semibold text-indigo-600">{profile.score} / 100</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all"
                    style={{ width: `${profile.score}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1.5">Source: QS World University Rankings {profile.rankingYear}</div>
              </div>
            </section>

            {/* Achievements */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" /> Key Achievements
              </h2>
              <ul className="space-y-3">
                {profile.achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 w-14 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-1 text-center">
                      {a.year}
                    </span>
                    <span className="text-sm text-gray-700 leading-snug">{a.title}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Courses */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Courses Offered
              </h2>
              <div className="space-y-2">
                {profile.courseCategories.map((cat) => {
                  const isOpen = expandedCategory === cat.name;
                  return (
                    <div key={cat.name} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedCategory(isOpen ? null : cat.name)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="font-semibold text-gray-800 text-sm">{cat.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{cat.courses.length} programmes</span>
                          {isOpen
                            ? <ChevronUp className="w-4 h-4 text-gray-400" />
                            : <ChevronDown className="w-4 h-4 text-gray-400" />
                          }
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-4 py-3 flex flex-wrap gap-2">
                          {cat.courses.map((course) => (
                            <span
                              key={course}
                              className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg px-2.5 py-1"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ── Right / Sidebar ────────────────────────────── */}
          <div className="space-y-6">

            {/* Quick stats */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-4">At a Glance</h3>
              <ul className="space-y-3">
                {stats.map((s) => (
                  <li key={s.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <s.icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{s.label}</div>
                      <div className="text-sm font-semibold text-gray-800">{s.value}</div>
                    </div>
                  </li>
                ))}
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Type</div>
                    <div className="text-sm font-semibold text-gray-800">{profile.type}</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-4">Contact & Location</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5 text-gray-600">
                  <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <span>{profile.address}</span>
                </li>
                {profile.phone && (
                  <li>
                    <a
                      href={`tel:${profile.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2.5 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                    >
                      <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                      {profile.phone}
                    </a>
                  </li>
                )}
                {profile.email && (
                  <li>
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-2.5 text-gray-700 hover:text-indigo-600 transition-colors font-medium break-all"
                    >
                      <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                      {profile.email}
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-indigo-600 hover:underline font-medium"
                  >
                    <Globe className="w-4 h-4 shrink-0" />
                    {profile.website.replace('https://', '')}
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                {profile.mapUrl && (
                  <li>
                    <a
                      href={profile.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" /> View on Google Maps
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Country ranking CTA */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                More universities in {profile.country}
              </div>
              <div className="text-xs text-gray-600 mb-3">
                See the full {profile.rankingYear} ranking for {profile.country}.
              </div>
              <Link
                href={backHref}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                {profile.country} Rankings {profile.rankingYear}
              </Link>
            </div>
          </div>
        </div>

        {/* Source note */}
        <p className="mt-10 text-xs text-gray-400">
          Ranking data sourced from QS World University Rankings {profile.rankingYear}.
          Contact details and programme information are provided for reference — please verify directly with the university.
          Visit{' '}
          <a href="https://www.topuniversities.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
            topuniversities.com
          </a>{' '}
          for the official full rankings.
        </p>
      </Container>
    </>
  );
}
