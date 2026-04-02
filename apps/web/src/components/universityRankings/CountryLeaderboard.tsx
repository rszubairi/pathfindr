'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, ExternalLink, Search, BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { countryRankings, countryMeta } from '@/data/universityRankings';

const RANKINGS_YEAR = 2025;

const medalColors: Record<number, { bg: string; border: string; text: string; label: string; avatar: string }> = {
  1: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-600', label: '🥇', avatar: 'bg-amber-500' },
  2: { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-500', label: '🥈', avatar: 'bg-slate-400' },
  3: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-500', label: '🥉', avatar: 'bg-orange-400' },
};

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
  countrySlug: string;
}

export function CountryLeaderboard({ countrySlug }: Props) {
  const params = useParams();
  const lang = (params?.lang as string) ?? 'en';
  const [search, setSearch] = useState('');

  const meta = countryMeta.find((c) => c.slug === countrySlug);
  const universities = countryRankings[countrySlug];

  if (!meta || !universities) return null;

  const top3 = universities.slice(0, Math.min(3, universities.length));
  const rest = universities.slice(3);

  const filteredRest = rest.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase())
  );
  const filteredTop3 = top3.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase())
  );

  const otherCountries = countryMeta.filter((c) => c.slug !== countrySlug);

  return (
    <>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-800 via-indigo-700 to-blue-600 py-14 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-white/5 rounded-full" />
        </div>
        <Container>
          <div className="relative z-10">
            <Link
              href={`/${lang}/university-rankings/2025`}
              className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              All World Rankings
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl sm:text-6xl leading-none">{meta.flag}</span>
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold">
                    <Calendar className="w-3 h-3" />
                    QS Rankings {RANKINGS_YEAR}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Top Universities in {meta.name} {RANKINGS_YEAR}
                </h1>
              </div>
            </div>
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed">{meta.description}</p>
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14">

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: 'Universities Listed', value: String(universities.length) },
            { label: 'Best Global Rank', value: `#${universities[0]?.globalRank}` },
            { label: 'Rankings Year', value: String(RANKINGS_YEAR) },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
              <div className="text-2xl font-extrabold text-indigo-700">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Podium — Top 3 */}
        {search === '' && top3.length >= 3 && (
          <div className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5 text-center">Top 3</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[top3[1], top3[0], top3[2]].map((u) => {
                if (!u) return null;
                const m = medalColors[u.rank];
                const isFirst = u.rank === 1;
                return (
                  <div
                    key={u.rank}
                    className={`relative rounded-2xl border-2 ${m.border} ${m.bg} p-5 flex flex-col items-center text-center shadow-sm ${isFirst ? 'sm:-mt-4 sm:shadow-lg' : ''}`}
                  >
                    {isFirst && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-bold px-3 py-0.5 rounded-full shadow">
                        #1 in {meta.name}
                      </div>
                    )}
                    <div className="text-3xl mb-2">{m.label}</div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white mb-3 ${m.avatar}`}>
                      {getInitials(u.name)}
                    </div>
                    <div className="font-semibold text-gray-900 text-sm leading-snug mb-1">{u.name}</div>
                    <div className="text-xs text-gray-500 mb-1">{u.city}</div>
                    <div className="mb-3">
                      <Badge variant="outline" size="sm">Global #{u.globalRank}</Badge>
                    </div>
                    <div className="flex items-center gap-1.5 mb-4">
                      <div className="h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${m.avatar}`} style={{ width: `${u.score}%` }} />
                      </div>
                      <span className={`text-xs font-bold ${m.text}`}>{u.score}</span>
                    </div>
                    <a
                      href={u.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                    >
                      Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search universities in ${meta.name}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Leaderboard list */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-sm">
              {search ? `Results for "${search}"` : `Ranks 4–${universities.length}`}
            </h2>
            {!search && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {RANKINGS_YEAR}
              </span>
            )}
          </div>

          {(search ? [...filteredTop3, ...filteredRest] : filteredRest).map((u, idx) => (
            <div
              key={u.rank}
              className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors ${idx !== 0 ? 'border-t border-gray-100' : ''}`}
            >
              <div className="w-8 shrink-0 text-center">
                <span className="text-sm font-bold text-gray-400">#{u.rank}</span>
              </div>
              <div className="w-9 h-9 shrink-0 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                {getInitials(u.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">{u.name}</div>
                <div className="text-xs text-gray-400 truncate">{u.city}</div>
              </div>
              <div className="hidden sm:block shrink-0">
                <Badge variant="outline" size="sm">Global #{u.globalRank}</Badge>
              </div>
              <div className="hidden md:block shrink-0">
                <Badge variant={u.type === 'Public' ? 'primary' : 'secondary'} size="sm">{u.type}</Badge>
              </div>
              <div className="hidden lg:flex items-center gap-2 shrink-0">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${u.score}%` }} />
                </div>
                <span className="text-xs font-semibold text-gray-600 w-8 text-right">{u.score}</span>
              </div>
              <a
                href={u.website}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-gray-400 hover:text-indigo-600 transition-colors"
                aria-label={`Visit ${u.name} website`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}

          {search && filteredTop3.length === 0 && filteredRest.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">No universities match your search.</div>
          )}
          {rest.length === 0 && search === '' && (
            <div className="py-6 text-center text-gray-400 text-sm">All universities shown in top 3 above.</div>
          )}
        </div>

        {/* Other Countries */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Explore Other Countries</h2>
          <p className="text-sm text-gray-500">Find top universities in other regions — {RANKINGS_YEAR} rankings.</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-10">
          {otherCountries.map((country) => (
            <Link
              key={country.slug}
              href={`/${lang}/university-rankings/2025/${country.slug}`}
              className="group bg-white rounded-2xl border border-gray-200 p-3 hover:border-indigo-400 hover:shadow-md transition-all text-center"
            >
              <div className="text-2xl mb-1">{country.flag}</div>
              <div className="font-medium text-gray-700 text-xs group-hover:text-indigo-700 transition-colors leading-tight">
                {country.name}
              </div>
            </Link>
          ))}
        </div>

        {/* Knowledge base CTA */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 mb-0.5">Read our University Guides</div>
            <div className="text-sm text-gray-600">In-depth articles covering top universities in every country, application tips, and more.</div>
          </div>
          <Link
            href={`/${lang}/knowledge-base`}
            className="shrink-0 inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Knowledge Base <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs text-gray-400">
          Rankings based on QS World University Rankings {RANKINGS_YEAR}. Visit{' '}
          <a href="https://www.topuniversities.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
            topuniversities.com
          </a>{' '}
          for the official full rankings.
        </p>
      </Container>
    </>
  );
}
