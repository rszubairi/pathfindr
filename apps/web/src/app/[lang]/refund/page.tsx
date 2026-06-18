import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Refund Policy - ThePathfindr',
  description: 'Refund Policy for ThePathfindr.com, operated by Data Analytech Sdn Bhd.',
};

export default function RefundPolicyPage() {
  return (
    <MainLayout>
      <Container className="py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Refund Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Effective Date: 18 June 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <p>
            This Refund Policy governs all payments made through ThePathfindr.com ("ThePathfindr",
            "Platform", "we", "our", or "us"), operated by Data Analytech Sdn Bhd. By purchasing any
            product, subscription, advertising package, listing, or service through the Platform, you
            agree to this Refund Policy.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. General Policy</h2>
            <p className="mb-3">ThePathfindr strives to provide high-quality educational, scholarship, internship, and career discovery services.</p>
            <p className="mb-3">Due to the digital nature of our services, refunds are generally not available once access has been granted, content has been delivered, or services have commenced, except as expressly stated in this Policy.</p>
            <p>Refund requests will be reviewed on a case-by-case basis.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Student Subscription Plans</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Monthly and Annual Subscriptions</h3>
            <p className="mb-3">Subscription fees paid by students or users for premium access are generally non-refundable after payment has been successfully processed.</p>
            <p className="mb-3">Users may cancel future renewals at any time through their account settings.</p>
            <p className="mb-6">Cancellation will stop future billing but will not result in a refund for the current subscription period.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Duplicate Charges</h3>
            <p>If a user is charged more than once for the same subscription due to a technical or billing error, ThePathfindr will investigate and issue an appropriate refund for any verified duplicate payment.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. University and Institution Subscriptions</h2>
            <p className="mb-3">Universities, colleges, schools, training providers, and educational institutions purchasing subscriptions, promotional packages, or platform access are not entitled to refunds once:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>The institution profile has been activated</li>
              <li>Marketing exposure has commenced</li>
              <li>Student leads have been delivered</li>
              <li>Platform access has been provided</li>
            </ul>
            <p>Exceptions may be considered where the service cannot be delivered due to an error attributable solely to ThePathfindr.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Scholarship Provider Services</h2>
            <p className="mb-3">Fees paid by scholarship providers for listings, campaigns, promotional activities, or featured placements are non-refundable once the listing or campaign has been published or activated.</p>
            <p className="mb-3">Where a campaign cannot be delivered due to a Platform error, ThePathfindr may, at its discretion:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide a replacement campaign period</li>
              <li>Extend the campaign duration</li>
              <li>Issue a partial or full refund</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Internship and Job Listings</h2>
            <p className="mb-3">Payments for internship, graduate programme, or job listings are non-refundable once the listing has been published.</p>
            <p className="mb-3">Where a listing fails to appear due to a technical issue caused by ThePathfindr, we may:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Re-publish the listing</li>
              <li>Extend the listing period</li>
              <li>Provide an appropriate refund</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Advertising and Sponsorship Packages</h2>
            <p className="mb-3">Advertising, sponsorship, banner placements, featured content, email campaigns, and promotional packages are non-refundable once the campaign has commenced.</p>
            <p className="mb-3">If ThePathfindr is unable to deliver the agreed advertising services, we may provide:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Replacement advertising inventory</li>
              <li>Campaign extensions</li>
              <li>Partial or full refunds, depending on the circumstances</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Events and Programmes</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">7.1 Paid Events</h3>
            <p className="mb-3">Refund requests for paid events, workshops, seminars, bootcamps, webinars, or educational programmes must be submitted before the registration closing date.</p>
            <p className="mb-6">Approved refunds may be subject to an administrative processing fee.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">7.2 Event Cancellation by ThePathfindr</h3>
            <p className="mb-3">If an event is cancelled by ThePathfindr, registered participants may choose either:</p>
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>A full refund</li>
              <li>Transfer of registration to a future event</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">7.3 Failure to Attend</h3>
            <p>No refund will be provided where a participant fails to attend an event or programme.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Scholarships and Admissions</h2>
            <p className="mb-3">ThePathfindr does not guarantee:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Scholarship awards</li>
              <li>University admissions</li>
              <li>Internship placements</li>
              <li>Employment opportunities</li>
            </ul>
            <p>Payments made for premium services, application assistance, profile enhancement, or subscription services are not refundable solely because a user was unsuccessful in obtaining a scholarship, admission, internship, or employment opportunity.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Technical Errors</h2>
            <p className="mb-3">Users may request a refund where:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Payment has been processed but service was not delivered</li>
              <li>Duplicate charges occurred</li>
              <li>Access was unavailable due to a prolonged Platform failure attributable to ThePathfindr</li>
            </ul>
            <p>All claims must be supported by reasonable evidence and submitted within thirty (30) days of the transaction.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Refund Processing</h2>
            <p className="mb-3">Approved refunds will generally be processed within fourteen (14) to thirty (30) business days.</p>
            <p className="mb-3">Refunds will be made using the original payment method whenever possible.</p>
            <p>ThePathfindr shall not be responsible for delays caused by banks, payment gateways, or financial institutions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Chargebacks</h2>
            <p className="mb-3">Users are encouraged to contact ThePathfindr before initiating any chargeback or payment dispute.</p>
            <p>Where a chargeback is filed without first contacting us, we reserve the right to suspend or terminate the relevant account pending investigation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Amendments</h2>
            <p className="mb-3">ThePathfindr reserves the right to amend this Refund Policy at any time.</p>
            <p>Any updates will be published on the Platform and will take effect immediately upon publication.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="mb-4">For refund requests or billing enquiries, please contact:</p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-2">
              <p className="font-semibold text-gray-900">Data Analytech Sdn Bhd</p>
              <p>Company Registration No: 202001002643 (1358962-U)</p>
              <p>35-1 Jalan PJS 5/30 Petaling Jaya Commercial City 46510 Petaling Jaya Selangor</p>
              <p>Email: <a href="mailto:enquiries@thepathfindr.com" className="text-primary-600 hover:underline">enquiries@thepathfindr.com</a></p>
              <p>Phone: <a href="tel:+60132993439" className="text-primary-600 hover:underline">+60 13-299 3439</a></p>
            </div>
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-800 mb-2">All refund requests should include:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                <li>Full name</li>
                <li>Registered email address</li>
                <li>Transaction reference number</li>
                <li>Date of payment</li>
                <li>Reason for refund request</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Final Decision</h2>
            <p>All refund requests shall be reviewed by ThePathfindr. Decisions regarding refunds shall be made reasonably and in good faith and shall be final.</p>
          </section>
        </div>
      </Container>
    </MainLayout>
  );
}
