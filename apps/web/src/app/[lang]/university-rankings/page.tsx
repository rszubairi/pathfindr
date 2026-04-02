import { redirect } from 'next/navigation';

// Redirect the index to the latest rankings year so old links keep working
// and crawlers follow to the canonical versioned URL.
export default function UniversityRankingsIndex({
  params,
}: {
  params: { lang: string };
}) {
  redirect(`/${params.lang}/university-rankings/2025`);
}
