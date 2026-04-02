import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Indonesia 2025 | QS Rankings | Pathfindr',
  description:
    'Find the best universities in Indonesia for 2025. Universitas Indonesia (UI), ITB Bandung, Universitas Gadjah Mada and more ranked by QS World University Rankings.',
  keywords: ['top universities Indonesia 2025', 'best Indonesian universities QS', 'Universitas Indonesia ranking 2025', 'ITB ranking 2025', 'UGM ranking 2025'],
  openGraph: {
    title: 'Top Universities in Indonesia 2025 | QS Rankings',
    description: 'Universitas Indonesia, ITB, Gadjah Mada and more — QS World University Rankings 2025.',
    type: 'article',
  },
};

export default function IndonesiaRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="indonesia" />
    </MainLayout>
  );
}
