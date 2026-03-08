import { Suspense } from 'react';
import { VerifyEmailContent } from './VerifyEmailContent';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <Container className="py-12">
            <div className="max-w-md mx-auto">
              <Card className="p-8 text-center">
                <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Loading...
                </h1>
              </Card>
            </div>
          </Container>
        </MainLayout>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
