import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Malaysia 2025 | QS Rankings | Pathfindr',
  description:
    "Discover the best universities in Malaysia for 2025. Universiti Malaya (UM), UPM, UTM, UKM, USM and more ranked by QS World University Rankings. Malaysia's leading higher education institutions.",
  keywords: ['top universities Malaysia 2025', 'best Malaysian universities QS', 'Universiti Malaya ranking 2025', 'UM UTM UKM ranking 2025', 'study in Malaysia universities'],
  openGraph: {
    title: 'Top Universities in Malaysia 2025 | QS Rankings',
    description: "Universiti Malaya, UPM, UTM, UKM and more — QS World University Rankings 2025.",
    type: 'article',
  },
};

export default function MalaysiaRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="malaysia" />
    </MainLayout>
  );
}
