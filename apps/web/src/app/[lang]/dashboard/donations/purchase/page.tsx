'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery, useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CreditCard, ShieldCheck, Heart, Minus, Plus, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Id } from '@convex/_generated/dataModel';

const TIER_CONFIG = {
  pro: {
    name: 'Pro',
    price: 9.99,
    features: [
      'Apply to 5 scholarships per year',
      'Full scholarship details & eligibility',
      'Application tracking dashboard',
      'Email notifications for deadlines',
    ],
  },
  expert: {
    name: 'Expert',
    price: 49.99,
    features: [
      'Apply to 20 scholarships per year',
      'Full scholarship details & eligibility',
      'Application tracking dashboard',
      'Email notifications for deadlines',
      'Priority support',
      'Scholarship match recommendations',
    ],
  },
};

export default function DonationPurchasePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tier, setTier] = useState<'pro' | 'expert'>('pro');
  const [quantity, setQuantity] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  const profile = useQuery(
    api.institutionAuth.getInstitutionProfile,
    user?._id ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const createCheckout = useAction(api.corporateDonationActions.createDonationCheckoutSession);

  const selectedTier = TIER_CONFIG[tier];
  const totalAmount = selectedTier.price * quantity;

  const handleCheckout = async () => {
    if (!user?._id || !profile?._id) return;

    setIsProcessing(true);
    try {
      const { sessionUrl } = await createCheckout({
        userId: user._id as Id<'users'>,
        companyId: profile._id as Id<'institutionProfiles'>,
        tier,
        quantity,
      });
      window.location.href = sessionUrl;
    } catch (err) {
      console.error(err);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donate Student Subscriptions</h1>
          <p className="text-gray-500">
            Sponsor students by donating subscriptions to help them access scholarships.
          </p>
        </div>
        <Button variant="secondary" onClick={() => router.back()}>
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tier Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Subscription Tier</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.entries(TIER_CONFIG) as [('pro' | 'expert'), typeof TIER_CONFIG.pro][]).map(
                ([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setTier(key)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      tier === key
                        ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900">{config.name}</h3>
                      <span className="text-lg font-bold text-primary-600">
                        ${config.price}
                        <span className="text-sm font-normal text-gray-500">/yr</span>
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {config.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              )}
            </div>
          </Card>

          {/* Quantity Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Number of Students to Sponsor
            </h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-center text-2xl font-bold border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-500 text-sm">
                {quantity} student{quantity !== 1 ? 's' : ''} will receive a {selectedTier.name}{' '}
                subscription for 1 year
              </p>
            </div>

            {/* Quick quantity buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[5, 10, 25, 50, 100].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuantity(q)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    quantity === q
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {q} students
                </button>
              ))}
            </div>
          </Card>

          {/* Info note */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 italic text-sm text-gray-600">
            <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
            <p>
              Payments are securely processed via Stripe. After payment, subscriptions will be
              automatically assigned to registered students who don&apos;t have a subscription. Any
              remaining balance can be shared via a unique coupon link for new students.
            </p>
          </div>
        </div>

        {/* Right: Checkout Summary */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Donation Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subscription tier</span>
                <span className="font-medium">{selectedTier.name}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Price per student</span>
                <span>${selectedTier.price.toFixed(2)}/yr</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Number of students</span>
                <span>{quantity}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total Amount</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full mt-8"
              size="lg"
              onClick={handleCheckout}
              disabled={!profile || isProcessing}
              isLoading={isProcessing}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </Button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                You&apos;ll receive a coupon code after payment to share with students
              </p>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 grayscale opacity-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Secure payment via <span className="text-gray-900 font-black">STRIPE</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
