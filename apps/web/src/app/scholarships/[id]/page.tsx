import { ScholarshipDetailContent } from './ScholarshipDetailContent';

export async function generateStaticParams() {
  // Provide at least one placeholder for the build process to succeed with output: 'export'
  // Dynamic IDs will be handled on the client side via useParams() and your Amplify Rewrite rule.
  return [{ id: 'placeholder' }];
}

export default function ScholarshipDetailPage() {
  return <ScholarshipDetailContent />;
}
