import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Finland 2025 | QS Rankings | Pathfindr',
  description:
    'Explore the best universities in Finland for 2025. University of Helsinki, Aalto University, University of Turku and more ranked by QS World University Rankings.',
  keywords: ['top universities Finland 2025', 'best Finnish universities QS', 'University of Helsinki ranking 2025', 'Aalto University ranking 2025'],
  openGraph: {
    title: 'Top Universities in Finland 2025 | QS Rankings',
    description: 'University of Helsinki, Aalto and more — QS World University Rankings 2025.',
    type: 'article',
  },
};

export default function FinlandRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="finland" />
    </MainLayout>
  );
}
