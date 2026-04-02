import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Italy 2025 | QS Rankings | Pathfindr',
  description:
    'Find the best universities in Italy for 2025. Politecnico di Milano, University of Bologna, Sapienza Rome, Padua and more ranked by QS World University Rankings.',
  keywords: ['top universities Italy 2025', 'best Italian universities QS', 'Politecnico Milano ranking 2025', 'University of Bologna ranking 2025'],
  openGraph: {
    title: 'Top Universities in Italy 2025 | QS Rankings',
    description: 'Politecnico di Milano, Bologna, Sapienza and more — QS World University Rankings 2025.',
    type: 'article',
  },
};

export default function ItalyRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="italy" />
    </MainLayout>
  );
}
