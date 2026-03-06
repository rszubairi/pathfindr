import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, Eye, Heart, Users, Globe, TrendingUp } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About Us - Pathfindr',
  description:
    'Learn about Pathfindr\'s mission to connect students with global educational opportunities across Southeast Asia and beyond.',
  openGraph: {
    title: 'About Us - Pathfindr',
    description:
      'Learn about Pathfindr\'s mission to connect students with global educational opportunities.',
  },
};

const milestones = [
  {
    year: '2022',
    title: 'The Beginning',
    description:
      'Pathfindr was founded with a vision to democratize access to global educational opportunities for Southeast Asian students.',
  },
  {
    year: '2023',
    title: 'Rapid Growth',
    description:
      'Reached 1,000 students and partnered with 20 universities and scholarship providers across the region.',
  },
  {
    year: '2024',
    title: 'Regional Expansion',
    description:
      'Expanded to 50+ countries with 5,000+ scholarships and helped students secure over $10M in funding.',
  },
  {
    year: '2025',
    title: 'AI-Powered Matching',
    description:
      'Launched personalized AI matching algorithm and crossed 5,000 active users with $50M+ in scholarships awarded.',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Accessibility',
    description: 'Making educational opportunities accessible to students from all backgrounds.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building a supportive network of students, alumni, and education partners.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connecting students with opportunities worldwide, with a focus on Southeast Asia.',
  },
  {
    icon: TrendingUp,
    title: 'Excellence',
    description: 'Providing high-quality, verified information and exceptional user experience.',
  },
];

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <Container size="xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About Pathfindr
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're on a mission to empower students across Southeast Asia and beyond to access
              world-class educational opportunities and achieve their dreams.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <Container size="xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <Card variant="bordered" className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To democratize access to global educational opportunities by connecting students
                with scholarships, universities, internships, and jobs that align with their goals
                and potential. We believe every talented student deserves the chance to pursue
                world-class education, regardless of their financial background.
              </p>
            </Card>

            {/* Vision */}
            <Card variant="bordered" className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-secondary-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To become the leading platform for student opportunity discovery in Southeast Asia,
                empowering a generation of globally competitive, well-educated professionals who
                contribute to their communities and drive regional development.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <Container size="xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Pathfindr was born from a simple observation: talented students across Southeast
                  Asia were missing out on life-changing educational opportunities simply because
                  they didn't know they existed or didn't know how to access them.
                </p>
                <p>
                  Our founders, themselves beneficiaries of international scholarships, experienced
                  firsthand the transformative power of global education. They also witnessed
                  countless peers struggle to find and apply for opportunities scattered across
                  hundreds of websites, PDFs, and social media posts.
                </p>
                <p>
                  In 2022, we set out to change this. We built Pathfindr as a centralized platform
                  where students could discover, track, and apply for educational opportunities from
                  around the world. Today, we've helped thousands of students secure scholarships
                  worth over $50 million and counting.
                </p>
                <p>
                  But we're just getting started. Every day, we're working to add more opportunities,
                  improve our matching algorithms, and build tools that make the application process
                  easier and more successful.
                </p>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="bg-gradient-to-br from-primary-200 to-secondary-200 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center text-primary-700">
                <Users className="h-24 w-24 mx-auto mb-4" />
                <p className="text-lg font-semibold">Our Growing Community</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <Container size="xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Pathfindr.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} variant="default" className="text-center">
                  <CardContent className="pt-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <Container size="xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Key milestones in our mission to empower students.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  {/* Year Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {milestone.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <Container size="xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl mb-8 text-primary-50">
              Be part of a growing network of ambitious students achieving their educational dreams.
              Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                <Link href="/register">Create Free Account</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-white border-2 border-white hover:bg-white/10">
                <Link href="/scholarships">Browse Scholarships</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
