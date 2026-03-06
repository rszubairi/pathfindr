import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Search,
  Target,
  Bell,
  BarChart,
  FileText,
  Shield,
  Smartphone,
  Zap,
  Users,
  Check,
  X,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Features - Pathfindr',
  description:
    'Discover powerful features that help you find, track, and secure scholarships, internships, and educational opportunities worldwide.',
  openGraph: {
    title: 'Features - Pathfindr',
    description:
      'Discover powerful features that help you find, track, and secure educational opportunities.',
  },
};

const mainFeatures = [
  {
    icon: Search,
    title: 'Advanced Search & Filters',
    description:
      'Find exactly what you\'re looking for with powerful search capabilities and smart filters. Filter by country, field of study, scholarship value, provider type, and application deadline.',
    benefits: [
      'Multi-criteria filtering',
      'Instant search results',
      'Saved search preferences',
      'Custom alerts for new matches',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Target,
    title: 'AI-Powered Matching',
    description:
      'Our intelligent matching algorithm analyzes your profile, academic background, and goals to recommend opportunities with the highest success probability.',
    benefits: [
      'Personalized recommendations',
      'Match score for each opportunity',
      'Continuous learning from your preferences',
      'Smart priority ranking',
    ],
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Bell,
    title: 'Real-Time Notifications',
    description:
      'Never miss a deadline or new opportunity. Get instant notifications for new scholarships matching your profile, upcoming deadlines, and application status updates.',
    benefits: [
      'Email and push notifications',
      'Customizable alert preferences',
      'Deadline reminders',
      'New opportunity alerts',
    ],
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: BarChart,
    title: 'Application Tracking Dashboard',
    description:
      'Manage all your applications in one place. Track progress, monitor deadlines, and see your success rate with an intuitive visual dashboard.',
    benefits: [
      'Visual timeline of applications',
      'Status tracking (draft, submitted, accepted)',
      'Document checklist',
      'Success analytics',
    ],
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    icon: FileText,
    title: 'Document Management',
    description:
      'Store and organize all your application documents securely in one place. Upload transcripts, recommendation letters, essays, and more.',
    benefits: [
      'Secure cloud storage',
      'Version control',
      'Quick document sharing',
      'Template library',
    ],
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Shield,
    title: 'Verified Listings',
    description:
      'All opportunities are verified by our team to ensure accuracy and legitimacy. We regularly update information and remove expired or fraudulent listings.',
    benefits: [
      'Manual verification process',
      'Regular updates',
      'Fraud detection',
      'Trusted sources only',
    ],
    color: 'from-indigo-500 to-indigo-600',
  },
];

const additionalFeatures = [
  { icon: Smartphone, title: 'Mobile App', description: 'Access on iOS and Android' },
  { icon: Zap, title: 'Quick Apply', description: 'Fast-track application process' },
  { icon: Users, title: 'Community Forum', description: 'Connect with other students' },
  { icon: FileText, title: 'Essay Review', description: 'Get feedback on your essays' },
  { icon: BarChart, title: 'Success Analytics', description: 'Track your application success rate' },
  { icon: Bell, title: 'Custom Alerts', description: 'Set up personalized notifications' },
];

const comparisonFeatures = [
  { feature: 'Scholarship Search', free: true, premium: true },
  { feature: 'Basic Filters', free: true, premium: true },
  { feature: 'Advanced Filters', free: false, premium: true },
  { feature: 'AI-Powered Matching', free: 'Limited', premium: true },
  { feature: 'Application Tracking', free: '5 applications', premium: 'Unlimited' },
  { feature: 'Document Storage', free: '100MB', premium: '10GB' },
  { feature: 'Real-Time Notifications', free: false, premium: true },
  { feature: 'Priority Support', free: false, premium: true },
  { feature: 'Essay Review', free: false, premium: true },
  { feature: 'Success Analytics', free: false, premium: true },
  { feature: 'Custom Alerts', free: false, premium: true },
  { feature: 'Mobile App Access', free: true, premium: true },
];

export default function FeaturesPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <Container size="xl">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="primary" size="md" className="mb-4">
              Platform Features
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to Succeed
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Powerful tools and features designed to help you discover, track, and secure
              educational opportunities worldwide.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Features Showcase */}
      <section className="py-20 bg-white">
        <Container size="xl">
          <div className="space-y-24">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`grid md:grid-cols-2 gap-12 items-center ${
                    isEven ? '' : 'md:grid-flow-dense'
                  }`}
                >
                  {/* Icon & Title */}
                  <div className={isEven ? 'md:order-1' : 'md:order-2'}>
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700">
                          <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual Placeholder */}
                  <div className={isEven ? 'md:order-2' : 'md:order-1'}>
                    <div
                      className={`bg-gradient-to-br ${feature.color} rounded-2xl h-80 flex items-center justify-center shadow-xl`}
                    >
                      <Icon className="h-32 w-32 text-white opacity-20" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gray-50">
        <Container size="xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              And Much More...
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Additional features to enhance your experience and maximize your success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} variant="default">
                  <CardContent className="pt-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <Container size="xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade anytime to unlock advanced features.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card variant="bordered">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 px-6 text-left text-gray-900 font-semibold">Feature</th>
                      <th className="py-4 px-6 text-center text-gray-900 font-semibold">Free</th>
                      <th className="py-4 px-6 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-gray-900 font-semibold">Premium</span>
                          <Badge variant="primary" size="sm" className="mt-1">
                            $9.99/mo
                          </Badge>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-b-0">
                        <td className="py-4 px-6 text-gray-700">{item.feature}</td>
                        <td className="py-4 px-6 text-center">
                          {typeof item.free === 'boolean' ? (
                            item.free ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-600">{item.free}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {typeof item.premium === 'boolean' ? (
                            item.premium ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-600">{item.premium}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild variant="secondary" size="lg">
                <Link href="/register">Start Free</Link>
              </Button>
              <Button asChild variant="primary" size="lg">
                <Link href="/register?plan=premium">Upgrade to Premium</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <Container size="xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Scholarship?
            </h2>
            <p className="text-xl mb-8 text-primary-50">
              Join thousands of students using Pathfindr to discover and secure educational
              opportunities worldwide.
            </p>
            <Button asChild variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              <Link href="/scholarships">Browse Scholarships</Link>
            </Button>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
