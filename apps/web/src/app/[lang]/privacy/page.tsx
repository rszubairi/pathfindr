import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Privacy Policy - ThePathfindr',
  description: 'Privacy Policy for ThePathfindr.com, operated by Data Analytech Sdn Bhd.',
};

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <Container className="py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Effective Date: 18 June 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <p>
            ThePathfindr.com ("ThePathfindr", "we", "our", or "us"), operated by Data Analytech Sdn Bhd,
            is committed to protecting your privacy and personal data. This Privacy Policy explains how we
            collect, use, disclose, store, and protect your information when you use ThePathfindr website,
            mobile application, and related services ("Platform").
          </p>
          <p>
            By accessing or using the Platform, you consent to the collection and processing of your
            information in accordance with this Privacy Policy.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Information You Provide</h3>
            <p className="mb-3">We may collect information that you voluntarily provide, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Date of birth</li>
              <li>Educational background</li>
              <li>Academic results and qualifications</li>
              <li>School, college, or university information</li>
              <li>Areas of study and career interests</li>
              <li>Scholarship and internship preferences</li>
              <li>Profile photographs</li>
              <li>Documents uploaded by you, including resumes, transcripts, certificates, and supporting documents</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">1.2 Information Collected Automatically</h3>
            <p className="mb-3">When you use the Platform, we may automatically collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Device information</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Location information (where permitted)</li>
              <li>Pages viewed and interactions within the Platform</li>
              <li>Login history</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="mb-3">We may use your information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create and manage your account</li>
              <li>Provide scholarship, university, internship, and educational opportunity recommendations</li>
              <li>Match users with relevant opportunities</li>
              <li>Send alerts, notifications, and updates</li>
              <li>Facilitate applications and registrations</li>
              <li>Improve Platform functionality and user experience</li>
              <li>Conduct analytics and research</li>
              <li>Provide customer support</li>
              <li>Prevent fraud, abuse, and unauthorized access</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Sharing of Information</h2>
            <p className="mb-4">We do not sell your personal information. We may share your information with:</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 Educational Institutions</h3>
            <p className="mb-4">Universities, colleges, schools, training providers, and educational organizations when you express interest in their programs or submit an application through the Platform.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Scholarship Providers</h3>
            <p className="mb-4">Government agencies, foundations, corporations, and scholarship sponsors for scholarship-related applications and assessments.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">3.3 Employers and Internship Providers</h3>
            <p className="mb-4">Companies and organizations offering internships, graduate programs, and employment opportunities.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">3.4 Service Providers</h3>
            <p className="mb-3">Third-party vendors that assist us in operating the Platform, including:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Cloud hosting providers</li>
              <li>Analytics providers</li>
              <li>Payment processors</li>
              <li>Communication service providers</li>
              <li>Technical support providers</li>
            </ul>
            <p>These parties are required to maintain the confidentiality and security of your information.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">3.5 Legal Requirements</h3>
            <p>We may disclose information when required by law, court order, governmental authority, or to protect our legal rights and interests.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Content and Uploaded Documents</h2>
            <p className="mb-3">Any documents uploaded by users remain the property of the user.</p>
            <p className="mb-3">By uploading content to the Platform, you grant ThePathfindr a limited right to process, store, display, and transmit such content solely for the purpose of providing Platform services.</p>
            <p>Users are responsible for ensuring that uploaded materials are accurate and do not infringe the rights of any third party.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="mb-3">We implement reasonable administrative, technical, and organizational measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction.</p>
            <p>However, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="mb-3">We retain personal information only for as long as necessary to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Provide Platform services</li>
              <li>Fulfill legal and regulatory obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
            <p>Upon account deletion, certain information may be retained where required by law or for legitimate business purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="mb-3">The Platform may use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Remember user preferences</li>
              <li>Improve website functionality</li>
              <li>Analyze usage patterns</li>
              <li>Personalize content and recommendations</li>
            </ul>
            <p>Users may manage cookie preferences through their browser settings.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Links</h2>
            <p className="mb-3">The Platform may contain links to third-party websites, universities, scholarship portals, employers, and other external services.</p>
            <p className="mb-3">We are not responsible for the privacy practices, content, or policies of these third-party websites.</p>
            <p>Users are encouraged to review the privacy policies of any external websites they visit.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
            <p className="mb-3">The Platform may be used by students under the age of 18.</p>
            <p className="mb-3">Where required by applicable law, parental or guardian consent may be necessary for certain services.</p>
            <p>Parents or guardians may contact us regarding the collection or processing of personal information relating to minors.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
            <p className="mb-3">Your information may be processed or stored in countries outside your country of residence.</p>
            <p>By using the Platform, you consent to such transfers, provided appropriate safeguards are implemented.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Your Rights</h2>
            <p className="mb-3">Subject to applicable laws, including the Malaysian Personal Data Protection Act 2010 (PDPA), you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Withdraw consent</li>
              <li>Request deletion of personal data</li>
              <li>Restrict certain processing activities</li>
              <li>Object to certain uses of your information</li>
            </ul>
            <p>Requests may be submitted using the contact details below.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="mb-3">We may update this Privacy Policy from time to time.</p>
            <p className="mb-3">Any changes will be posted on the Platform with an updated effective date.</p>
            <p>Continued use of the Platform after changes are published constitutes acceptance of the updated Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="mb-4">For questions, requests, or concerns regarding this Privacy Policy, please contact:</p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-2">
              <p className="font-semibold text-gray-900">Data Analytech Sdn Bhd</p>
              <p>Company Registration No: 202001002643 (1358962-U)</p>
              <p>35-1 Jalan PJS 5/30 Petaling Jaya Commercial City 46510 Petaling Jaya Selangor</p>
              <p>Email: <a href="mailto:enquiries@thepathfindr.com" className="text-primary-600 hover:underline">enquiries@thepathfindr.com</a></p>
              <p>Phone: <a href="tel:+60132993439" className="text-primary-600 hover:underline">+60 13-299 3439</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Consent</h2>
            <p>By registering for or using ThePathfindr, you acknowledge that you have read, understood, and agreed to this Privacy Policy and consent to the collection, use, processing, and disclosure of your personal information as described herein.</p>
          </section>
        </div>
      </Container>
    </MainLayout>
  );
}
