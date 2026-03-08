import { VerifyEmailContent } from './VerifyEmailContent';

export async function generateStaticParams() {
  // Provide at least one placeholder for the build process to succeed with output: 'export'
  return [{ token: 'placeholder' }];
}

export default function VerifyEmailPage({
  params,
}: {
  params: { token: string };
}) {
  return <VerifyEmailContent token={params.token} />;
}
