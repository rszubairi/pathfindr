import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in France 2025 | QS Rankings | Pathfindr',
  description:
    'Discover the best universities in France for 2025. Sorbonne, Paris-Saclay, École Polytechnique, HEC Paris and more ranked by QS World University Rankings.',
  keywords: ['top universities France 2025', 'best French universities QS', 'Sorbonne ranking 2025', 'grandes écoles France ranking'],
  openGraph: {
    title: 'Top Universities in France 2025 | QS Rankings',
    description: 'Sorbonne, Paris-Saclay, École Polytechnique and more — QS World University Rankings 2025.',
    type: 'article',
  },
};

export default function FranceRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="france" />
    </MainLayout>
  );
}
