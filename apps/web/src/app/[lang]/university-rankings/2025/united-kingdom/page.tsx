import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in the United Kingdom 2025 | QS Rankings | Pathfindr',
  description:
    'Explore the best universities in the United Kingdom for 2025. Imperial College London, Oxford, Cambridge, UCL, Edinburgh and more ranked by QS World University Rankings.',
  keywords: ['top UK universities 2025', 'best universities United Kingdom QS', 'Oxford Cambridge ranking 2025', 'UK university rankings'],
  openGraph: {
    title: 'Top Universities in the United Kingdom 2025 | QS Rankings',
    description: 'Imperial College, Oxford, Cambridge and more — QS World University Rankings 2025.',
    type: 'article',
  },
};

export default function UKRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="united-kingdom" />
    </MainLayout>
  );
}
