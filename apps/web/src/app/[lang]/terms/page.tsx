import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Terms of Service - ThePathfindr',
  description: 'Terms of Service for ThePathfindr.com, operated by Data Analytech Sdn Bhd.',
};

export default function TermsOfServicePage() {
  return (
    <MainLayout>
      <Container className="py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Effective Date: 18 June 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <p>
            These Terms of Service ("Terms") govern your access to and use of ThePathfindr.com, mobile
            applications, websites, products, and services (collectively, the "Platform") operated by
            Data Analytech Sdn Bhd ("ThePathfindr", "we", "our", or "us").
          </p>
          <p>
            By registering for, accessing, or using the Platform, you agree to be bound by these Terms.
            If you do not agree to these Terms, you must not use the Platform.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Registration and User Accounts</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Registration</h3>
            <p className="mb-3">To access certain features of the Platform, you must create an account and provide accurate, complete, and current information.</p>
            <p className="mb-6">You agree to keep your account information updated at all times.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Account Security</h3>
            <p className="mb-3">You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted through your account.</p>
            <p className="mb-6">You must immediately notify us of any unauthorized access, security breach, or suspected misuse of your account.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">1.3 Eligibility</h3>
            <p>By using the Platform, you represent that you have the legal capacity to enter into this agreement. Users under the age of 18 should obtain consent from a parent or legal guardian where required by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Purpose of the Platform</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Services</h3>
            <p className="mb-3">The Platform provides information, tools, and services relating to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>Scholarships</li>
              <li>Universities and educational institutions</li>
              <li>Internships</li>
              <li>Graduate programmes</li>
              <li>Career opportunities</li>
              <li>Educational resources</li>
              <li>Events and programmes</li>
              <li>Related educational services</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 No Guarantee</h3>
            <p className="mb-3">ThePathfindr does not guarantee:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Admission into any institution</li>
              <li>Scholarship awards</li>
              <li>Internship placements</li>
              <li>Employment opportunities</li>
              <li>Acceptance into any programme</li>
              <li>Accuracy or completeness of information provided by third parties</li>
            </ul>
            <p>All decisions regarding admissions, scholarships, internships, and employment remain solely with the relevant institution, organisation, employer, or provider.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Acceptable Use</h2>
            <p className="mb-3">You agree to use the Platform lawfully and responsibly. You shall not:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide false or misleading information</li>
              <li>Upload fraudulent documents</li>
              <li>Impersonate another person</li>
              <li>Interfere with the operation of the Platform</li>
              <li>Attempt to gain unauthorized access to systems or data</li>
              <li>Upload viruses, malware, or harmful code</li>
              <li>Use automated scraping, bots, or data extraction tools without written permission</li>
              <li>Violate any applicable law or regulation</li>
              <li>Use the Platform in a manner that may damage our reputation or business</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Content and Documents</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Ownership</h3>
            <p className="mb-4">Users retain ownership of documents, resumes, certificates, transcripts, and other materials uploaded to the Platform.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 License to ThePathfindr</h3>
            <p className="mb-4">By uploading content, you grant ThePathfindr a worldwide, non-exclusive, royalty-free license to host, store, process, reproduce, display, and transmit such content solely for the purpose of operating and improving the Platform.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">4.3 Responsibility</h3>
            <p className="mb-3">You are solely responsible for the accuracy, legality, and authenticity of all content submitted through the Platform.</p>
            <p>ThePathfindr reserves the right to remove any content that violates these Terms or applicable laws.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Platform Ownership</h3>
            <p className="mb-4">The Platform, including its software, design, source code, databases, trademarks, logos, branding, content, and functionality, remains the exclusive property of Data Analytech Sdn Bhd and is protected by applicable intellectual property laws.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Restrictions</h3>
            <p className="mb-3">You may not copy, reproduce, modify, reverse engineer, distribute, resell, license, or create derivative works from the Platform without our prior written consent.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">5.3 Limited License</h3>
            <p>We grant you a limited, revocable, non-exclusive, non-transferable license to use the Platform solely for its intended purpose and subject to these Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
            <p className="mb-3">The Platform may contain links, advertisements, or integrations with third-party services, universities, scholarship providers, employers, payment providers, or educational organisations.</p>
            <p className="mb-3">ThePathfindr does not control and is not responsible for the content, services, policies, actions, or decisions of third parties.</p>
            <p>Your dealings with third parties are solely between you and the relevant third party.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
            <p className="mb-3">Your use of the Platform is subject to our Privacy Policy.</p>
            <p>By using the Platform, you consent to the collection, storage, processing, and sharing of information as described in the Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Fees and Payments</h2>
            <p className="mb-3">Certain services may require payment. All fees are payable in advance unless otherwise stated.</p>
            <p className="mb-3">Fees paid are subject to our Refund Policy.</p>
            <p>Failure to make payment may result in suspension or termination of access to paid services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Suspension and Termination</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">9.1 Suspension</h3>
            <p className="mb-3">ThePathfindr may suspend or restrict access where:</p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>These Terms are breached</li>
              <li>Fraudulent activity is suspected</li>
              <li>False information is submitted</li>
              <li>Security concerns arise</li>
              <li>Payment obligations are not fulfilled</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">9.2 Termination</h3>
            <p className="mb-3">We may terminate accounts at our discretion where continued access may:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Harm the Platform</li>
              <li>Harm other users</li>
              <li>Create legal or regulatory risks</li>
              <li>Violate applicable laws</li>
            </ul>
            <p className="mb-6">Termination may occur without prior notice where immediate action is necessary.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">9.3 Effect of Termination</h3>
            <p className="mb-3">Upon termination, your right to access and use the Platform immediately ceases.</p>
            <p>We may retain information where required by law, regulatory obligations, or legitimate business purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimer</h2>
            <p className="mb-3">The Platform is provided on an "as is" and "as available" basis.</p>
            <p className="mb-3">To the fullest extent permitted by law, ThePathfindr makes no warranties, express or implied, regarding availability, reliability, accuracy, completeness, security, or suitability for any purpose.</p>
            <p>We do not warrant that the Platform will be uninterrupted or error-free.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="mb-3">To the fullest extent permitted by law, Data Analytech Sdn Bhd shall not be liable for:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Loss of profits</li>
              <li>Loss of opportunities</li>
              <li>Loss of scholarships</li>
              <li>Loss of admissions</li>
              <li>Loss of employment opportunities</li>
              <li>Loss of data</li>
              <li>Business interruption</li>
              <li>Reputational damage</li>
              <li>Indirect, incidental, consequential, special, or punitive damages</li>
            </ul>
            <p>Our total liability arising from any claim relating to the Platform shall not exceed the amount paid by the user to ThePathfindr during the twelve (12) months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Indemnity</h2>
            <p className="mb-3">You agree to indemnify, defend, and hold harmless Data Analytech Sdn Bhd, its directors, officers, employees, affiliates, partners, and agents from and against any claims, losses, liabilities, damages, costs, and expenses (including legal fees) arising from:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your use of the Platform</li>
              <li>Your breach of these Terms</li>
              <li>Your violation of any law or regulation</li>
              <li>Any content uploaded by you</li>
              <li>Any dispute between you and a third party</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Force Majeure</h2>
            <p className="mb-3">ThePathfindr shall not be liable for any delay or failure to perform its obligations resulting from events beyond its reasonable control, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Natural disasters</li>
              <li>Internet outages</li>
              <li>Government actions</li>
              <li>Cyberattacks</li>
              <li>Labour disputes</li>
              <li>Pandemics</li>
              <li>Utility failures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Modifications</h2>
            <p className="mb-3">We reserve the right to modify these Terms at any time. Updated Terms will be published on the Platform.</p>
            <p>Continued use of the Platform following publication constitutes acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Governing Law</h2>
            <p className="mb-3">These Terms shall be governed by and construed in accordance with the laws of Malaysia.</p>
            <p>Any dispute arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of Malaysia.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Contact Information</h2>
            <p className="mb-4">For questions regarding these Terms, please contact:</p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-2">
              <p className="font-semibold text-gray-900">Data Analytech Sdn Bhd</p>
              <p>Company Registration No: 202001002643 (1358962-U)</p>
              <p>35-1 Jalan PJS 5/30 Petaling Jaya Commercial City 46510 Petaling Jaya Selangor</p>
              <p>Email: <a href="mailto:enquiries@thepathfindr.com" className="text-primary-600 hover:underline">enquiries@thepathfindr.com</a></p>
              <p>Phone: <a href="tel:+60132993439" className="text-primary-600 hover:underline">+60 13-299 3439</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Acceptance</h2>
            <p>By registering for, accessing, or using the Platform, you acknowledge that you have read, understood, and agreed to these Terms of Service.</p>
          </section>
        </div>
      </Container>
    </MainLayout>
  );
}
