import Link from 'next/link';
import { ArrowRight, Award, Building2, Briefcase, GraduationCap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Path to Global{' '}
            <span className="text-primary-600">Educational Opportunities</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with scholarships, university programmes, internships, and jobs across
            Southeast Asia and beyond
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Award className="w-12 h-12 text-primary-600" />}
            title="Scholarships"
            description="Discover and apply for scholarships from governments, universities, and organizations"
          />
          <FeatureCard
            icon={<GraduationCap className="w-12 h-12 text-primary-600" />}
            title="University Programs"
            description="Explore degree programmes from top universities worldwide"
          />
          <FeatureCard
            icon={<Briefcase className="w-12 h-12 text-primary-600" />}
            title="Internships"
            description="Find internship opportunities to kickstart your career"
          />
          <FeatureCard
            icon={<Building2 className="w-12 h-12 text-primary-600" />}
            title="Graduate Jobs"
            description="Access entry-level positions and graduate programmes"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">
            Create your profile today and unlock access to thousands of opportunities
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
