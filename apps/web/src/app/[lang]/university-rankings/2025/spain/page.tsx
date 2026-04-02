import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Spain 2025 | QS Rankings | Pathfindr',
  description:
    'Explore the best universities in Spain for 2025. University of Barcelona, UAM, Complutense Madrid, Granada and more ranked by QS World University Rankings.',
  keywords: ['top universities Spain 2025', 'best Spanish universities QS', 'University of Barcelona ranking 2025', 'study in Spain university rankings'],
  openGraph: {
    title: 'Top Universities in Spain 2025 | QS Rankings',
    description: 'University of Barcelona, UAM, Complutense and more — QS World University Rankings 2025.',
    type: 'article',
  },
};

export default function SpainRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="spain" />
    </MainLayout>
  );
}
