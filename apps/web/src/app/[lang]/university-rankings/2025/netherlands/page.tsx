import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in the Netherlands 2025 | QS Rankings | Pathfindr',
  description:
    'Discover the best universities in the Netherlands for 2025. TU Delft, University of Amsterdam, Leiden, Utrecht, Erasmus and more ranked by QS World University Rankings.',
  keywords: ['top universities Netherlands 2025', 'best Dutch universities QS', 'TU Delft ranking 2025', 'University of Amsterdam ranking 2025'],
  openGraph: {
    title: 'Top Universities in the Netherlands 2025 | QS Rankings',
    description: 'TU Delft, Amsterdam, Leiden, Utrecht and more — QS World University Rankings 2025.',
    type: 'article',
  },
};

export default function NetherlandsRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="netherlands" />
    </MainLayout>
  );
}
