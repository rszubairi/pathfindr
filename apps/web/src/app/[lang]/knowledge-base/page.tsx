'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Search, ArrowRight, Globe, Trophy, BookOpen } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { countryMeta } from '@/data/universityRankings';

const featuredArticle = {
  slug: 'university-rankings',
  title: "World's Top 25 Universities (QS 2025)",
  description:
    "Explore the definitive global leaderboard of higher education institutions, ranked by academic reputation, employer outcomes, and research impact. Featuring MIT, Oxford, Cambridge, Harvard and more.",
  category: 'Global Rankings',
  icon: '🌍',
  readTime: '5 min read',
  tags: ['Rankings', 'Global', 'QS 2025'],
};

const countryArticles = countryMeta.map((c) => ({
  slug: `university-rankings/${c.slug}`,
  title: `Top Universities in ${c.name}`,
  description: c.description,
  category: 'Country Rankings',
  icon: c.flag,
  readTime: '3 min read',
  tags: ['Rankings', c.name, 'QS 2025'],
}));

const categories = ['All', 'Global Rankings', 'Country Rankings'];

export default function KnowledgeBasePage() {
  const params = useParams();
  const lang = (params?.lang as string) ?? 'en';
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const allArticles = [featuredArticle, ...countryArticles];

  const filtered = allArticles.filter((a) => {
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
    const matchesSearch =
      search === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featured = filtered.find((a) => a.slug === 'university-rankings');
  const rest = filtered.filter((a) => a.slug !== 'university-rankings');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-800 via-indigo-700 to-blue-600 pt-14 pb-20 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5 text-sm font-medium">
            <BookOpen className="w-4 h-4" />
            Knowledge Base
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            Guides, Rankings & Resources
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto">
            Everything you need to make informed decisions about higher education — from world rankings to country-specific university guides.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">

        {/* Search + filter bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-10 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">No articles match your search.</div>
        )}

        {/* Featured article */}
        {featured && (
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5" /> Featured
            </h2>
            <Link href={`/${lang}/${featured.slug}`} className="group block">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-10 text-white flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shrink-0">
                    {featured.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {featured.category}
                      </span>
                      <span className="text-blue-200 text-xs">{featured.readTime}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:underline underline-offset-2">
                      {featured.title}
                    </h3>
                    <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">{featured.description}</p>
                  </div>
                  <div className="shrink-0 bg-white text-indigo-700 rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2 group-hover:bg-indigo-50 transition-colors">
                    Read article <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Country ranking cards */}
        {rest.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Country Rankings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((article) => (
                <Link key={article.slug} href={`/${lang}/${article.slug}`} className="group block">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all h-full flex flex-col overflow-hidden">
                    {/* Card top band */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-3">
                      <div className="text-4xl leading-none">{article.icon}</div>
                      <div>
                        <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-0.5">
                          {article.category}
                        </div>
                        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-indigo-700 transition-colors">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                    {/* Card body */}
                    <div className="px-5 py-4 flex-1 flex flex-col gap-3">
                      <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-3">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-indigo-500 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
