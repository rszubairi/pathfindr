import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Saudi Arabia 2025 | QS Rankings | Pathfindr',
  description:
    "Discover the best universities in Saudi Arabia for 2025. King Fahd University (KFUPM), King Saud University, King Abdulaziz University and more ranked by QS World University Rankings.",
  keywords: ['top universities Saudi Arabia 2025', 'best Saudi universities QS', 'KFUPM ranking 2025', 'KSU KAU ranking 2025', 'study in Saudi Arabia'],
  openGraph: {
    title: 'Top Universities in Saudi Arabia 2025 | QS Rankings',
    description: "KFUPM, King Saud University, King Abdulaziz University and more — QS World University Rankings 2025.",
    type: 'article',
  },
};

export default function SaudiArabiaRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="saudi-arabia" />
    </MainLayout>
  );
}
