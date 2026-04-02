import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { UniversityDetailPage } from '@/components/universities/UniversityDetailPage';
import { getProfileBySlug, allUniversitySlugs } from '@/data/universityProfiles';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);
  if (!profile) return {};

  const title = `${profile.name} (${profile.shortName ?? profile.name}) — Rankings, Courses & Contact | Pathfindr`;
  const description =
    `${profile.name} is ranked #${profile.globalRank} globally and #${profile.localRank} in ${profile.country} ` +
    `by QS World University Rankings ${profile.rankingYear}. ` +
    `Explore courses offered, key achievements, contact details, and campus information.`;

  return {
    title,
    description,
    keywords: [
      profile.name,
      profile.shortName ?? '',
      `${profile.name} ranking ${profile.rankingYear}`,
      `${profile.name} courses`,
      `best universities in ${profile.country} ${profile.rankingYear}`,
      `${profile.shortName ?? profile.name} QS rank`,
      `study at ${profile.name}`,
    ].filter(Boolean),
    openGraph: {
      title: `${profile.name} — #${profile.globalRank} Globally · #${profile.localRank} in ${profile.country}`,
      description,
      type: 'article',
    },
  };
}

// Pre-generate a page for every university slug at build time
export function generateStaticParams() {
  return allUniversitySlugs.map((slug) => ({ slug }));
}

export default async function UniversityPage({ params }: Props) {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);
  if (!profile) notFound();

  return (
    <MainLayout>
      <UniversityDetailPage profile={profile} />
    </MainLayout>
  );
}
