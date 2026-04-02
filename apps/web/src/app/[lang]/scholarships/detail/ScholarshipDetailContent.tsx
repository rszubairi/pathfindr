'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import {
    ChevronRight,
    Building2,
    DollarSign,
    Users,
    CheckCircle,
    ExternalLink,
    Calendar,
    Globe,
    BookOpen,
    Tag,
    Bell,
    BellOff,
    Clock,
    Trophy
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScholarshipCard } from '@/components/scholarships/ScholarshipCard';
import { ScholarshipDetailSkeleton } from '@/components/scholarships/ScholarshipDetailSkeleton';
import { DeadlineCountdown } from '@/components/scholarships/DeadlineCountdown';
import { ShareButton } from '@/components/scholarships/ShareButton';
import { SubscriptionGate, type GateReason } from '@/components/subscription/SubscriptionGate';
import { ApplicationTracker } from '@/components/subscription/ApplicationTracker';
import { useScholarship, useFeaturedScholarships } from '@/lib/convexQueries';
import { useApplyGate } from '@/hooks/useApplyGate';
import { useNotify } from '@/hooks/useNotify';
import { Scholarship } from '@/types';
import { formatCurrency, formatDate, isDeadlinePassed } from '@/lib/utils';

export function ScholarshipDetailContent() {
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();
    const id = searchParams.get('id') || '';
    const lang = (params?.lang as string) || 'en';

    const { data: scholarship, isLoading } = useScholarship(id);
    const { data: relatedScholarships } = useFeaturedScholarships(4);

    const {
        checkGate,
        apply,
        alreadyApplied,
        loading: gateLoading,
        tier,
        applicationsUsed,
        applicationsLimit,
        isSubscribed,
    } = useApplyGate(id);

    const {
        isSubscribed: isNotifySubscribed,
        toggleNotify,
        loading: notifyLoading,
    } = useNotify(id);

    const [gateModal, setGateModal] = useState<{
        isOpen: boolean;
        reason: GateReason;
    }>({ isOpen: false, reason: 'auth' });
    const [applying, setApplying] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredRelated = relatedScholarships.filter((s: any) => s._id !== id).slice(0, 3).map((s: any) => ({ ...s, id: s._id }));

    const handleApplyNow = useCallback(async () => {
        if (!scholarship) return;

        const result = checkGate();

        if (!result.allowed) {
            if (result.reason === 'auth') {
                router.push(`/register?redirect=${encodeURIComponent(`/scholarships/detail?id=${id}`)}`);
                return;
            }
            setGateModal({ isOpen: true, reason: result.reason });
            return;
        }

        // User is subscribed and within limits — proceed
        setApplying(true);
        try {
            await apply();
            // Open external URL after recording the application
            if (scholarship.applicationUrl) {
                window.open(scholarship.applicationUrl, '_blank', 'noopener,noreferrer');
            }
        } catch (err) {
            console.error('Failed to apply:', err);
        } finally {
            setApplying(false);
        }
    }, [scholarship, checkGate, apply, id, router]);

    if (isLoading || !scholarship) {
        return (
            <MainLayout>
                <ScholarshipDetailSkeleton />
            </MainLayout>
        );
    }

    const providerTypeLabel =
        scholarship.providerType.charAt(0).toUpperCase() + scholarship.providerType.slice(1);
    const passed = isDeadlinePassed(scholarship.deadline);

    // Render eligibility criteria as key-value pairs
    const criteriaEntries = Object.entries(scholarship.eligibilityCriteria || {});

    // Format criteria key to readable label
    const formatCriteriaKey = (key: string): string => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .replace(/_/g, ' ');
    };

    const isPending = scholarship.status === 'pending';

    // Determine apply button text and state
    const getApplyButtonProps = () => {
        if (isPending) return { text: 'Opening Soon', disabled: true };
        if (passed) return { text: 'Deadline Passed', disabled: true };
        if (scholarship.status !== 'active') return { text: 'Not Available', disabled: true };
        if (alreadyApplied) return { text: 'Already Applied', disabled: true };
        if (isSubscribed && applicationsUsed >= applicationsLimit)
            return { text: 'Limit Reached', disabled: false }; // clickable to show upgrade modal
        return { text: 'Apply Now', disabled: false };
    };

    const applyBtnProps = getApplyButtonProps();

    return (
        <MainLayout>
            {/* Subscription Gate Modal */}
            <SubscriptionGate
                isOpen={gateModal.isOpen}
                onClose={() => setGateModal({ ...gateModal, isOpen: false })}
                gateReason={gateModal.reason}
                currentTier={tier}
                redirectPath={`/scholarships/detail?id=${id}`}
            />

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4 border-b border-gray-200">
                <Container size="xl">
                    <nav className="flex items-center text-sm text-gray-600">
                        <Link href="/" className="hover:text-primary-600 transition">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                        <Link href="/scholarships" className="hover:text-primary-600 transition">
                            Scholarships
                        </Link>
                        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
                            {scholarship.name}
                        </span>
                    </nav>
                </Container>
            </div>

            {/* Header */}
            <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-10">
                <Container size="xl">
                    <Badge variant="outline" size="md" className="mb-4">
                        {providerTypeLabel}
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {scholarship.name}
                    </h1>
                    <div className="flex items-center flex-wrap gap-4 text-lg text-gray-600">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            <span className="font-medium">{scholarship.provider}</span>
                        </div>
                        {scholarship.providerType === 'university' && (
                            <div className="flex gap-2">
                                {scholarship.localRanking && (
                                    <Badge variant="secondary" size="sm" className="bg-amber-50 text-amber-700 border-amber-100 flex items-center gap-1">
                                        <Trophy className="h-3 w-3" />
                                        #{scholarship.localRanking} Local
                                    </Badge>
                                )}
                                {scholarship.internationalRanking && (
                                    <Badge variant="secondary" size="sm" className="bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1">
                                        <Globe className="h-3 w-3" />
                                        #{scholarship.internationalRanking} World
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </Container>
            </section>

            {/* Key Info Bar */}
            <section className="py-6 border-b border-gray-200 bg-white">
                <Container size="xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Value */}
                        <div className="bg-primary-50 p-4 rounded-xl border border-primary-100">
                            <div className="flex items-center gap-2 text-sm text-primary-600 mb-1">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-medium">Scholarship Value</span>
                            </div>
                            <p className="text-2xl font-bold text-primary-700">
                                {formatCurrency(scholarship.value, scholarship.currency)}
                            </p>
                        </div>

                        {/* Deadline Countdown */}
                        <div className="col-span-1">
                            <DeadlineCountdown deadline={scholarship.deadline} className="h-full" />
                        </div>

                        {/* Applicants */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
                                <Users className="h-4 w-4" />
                                <span className="font-medium">Applied via Pathfindr</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-700">
                                {scholarship.applicationCount ?? 0}{' '}
                                <span className="text-sm font-normal text-blue-500">students</span>
                            </p>
                        </div>

                        {/* Status */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium">Status</span>
                            </div>
                            <Badge
                                variant={scholarship.status === 'active' ? 'success' : scholarship.status === 'closed' ? 'danger' : 'warning'}
                                size="md"
                            >
                                {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                            </Badge>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Action Row */}
            <section className="py-6 bg-white border-b border-gray-200">
                <Container size="xl">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                        {isPending ? (
                            <>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    disabled
                                    className="flex items-center gap-2"
                                >
                                    <Clock className="h-5 w-5" />
                                    Opening Soon
                                </Button>
                                <Button
                                    variant={isNotifySubscribed ? 'ghost' : 'primary'}
                                    size="lg"
                                    onClick={toggleNotify}
                                    disabled={notifyLoading}
                                    isLoading={notifyLoading}
                                    className="flex items-center gap-2"
                                >
                                    {isNotifySubscribed ? (
                                        <>
                                            <BellOff className="h-5 w-5" />
                                            Notifications On
                                        </>
                                    ) : (
                                        <>
                                            <Bell className="h-5 w-5" />
                                            Notify Me
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleApplyNow}
                                disabled={applyBtnProps.disabled || applying || gateLoading}
                                isLoading={applying}
                                className="flex items-center gap-2"
                            >
                                <ExternalLink className="h-5 w-5" />
                                {applyBtnProps.text}
                            </Button>
                        )}
                        <ShareButton
                            scholarshipName={scholarship.name}
                            scholarshipValue={formatCurrency(scholarship.value, scholarship.currency)}
                            scholarshipId={id}
                            lang={lang}
                        />
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section className="py-10 bg-gray-50">
                <Container size="xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Left Column */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Description */}
                            {scholarship.description && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Scholarship</h2>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {scholarship.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Eligibility Criteria */}
                            {criteriaEntries.length > 0 && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
                                        <div className="divide-y divide-gray-100">
                                            {criteriaEntries.map(([key, value]) => (
                                                <div key={key} className="flex flex-col sm:flex-row sm:items-center py-3 gap-1 sm:gap-4">
                                                    <span className="text-sm font-semibold text-gray-500 sm:w-48 flex-shrink-0">
                                                        {formatCriteriaKey(key)}
                                                    </span>
                                                    <span className="text-gray-900 font-medium">
                                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Key Dates */}
                            <Card>
                                <CardContent className="pt-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Dates</h2>
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                                                <span className="text-sm font-medium text-gray-500">Application Deadline</span>
                                            </div>
                                            <span className="text-gray-900 font-medium sm:ml-auto">
                                                {formatDate(scholarship.deadline, 'long')}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                                                <span className="text-sm font-medium text-gray-500">Date Posted</span>
                                            </div>
                                            <span className="text-gray-900 font-medium sm:ml-auto">
                                                {formatDate(scholarship.createdAt, 'long')}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                                                <span className="text-sm font-medium text-gray-500">Last Updated</span>
                                            </div>
                                            <span className="text-gray-900 font-medium sm:ml-auto">
                                                {formatDate(scholarship.updatedAt, 'long')}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sidebar - shown below on mobile, right column on desktop */}
                        <div className="space-y-6">
                            {/* Application Tracker (for subscribed users) */}
                            {isSubscribed && tier && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                                            Your Applications
                                        </h3>
                                        <ApplicationTracker
                                            used={applicationsUsed}
                                            limit={applicationsLimit}
                                            tier={tier}
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            {/* Eligible Countries */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Globe className="h-5 w-5 text-gray-500" />
                                        <h3 className="text-lg font-bold text-gray-900">Eligible Countries</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {scholarship.eligibleCountries.map((country: string) => (
                                            <Badge key={country} variant="primary" size="sm">
                                                {country}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Fields of Study */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BookOpen className="h-5 w-5 text-gray-500" />
                                        <h3 className="text-lg font-bold text-gray-900">Fields of Study</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {scholarship.eligibleFields.map((field: string) => (
                                            <Badge key={field} variant="secondary" size="sm">
                                                {field}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Provider Info */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Tag className="h-5 w-5 text-gray-500" />
                                        <h3 className="text-lg font-bold text-gray-900">Provider Details</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Provider</p>
                                            <p className="font-medium text-gray-900">{scholarship.provider}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Type</p>
                                            <Badge variant="outline" size="sm">
                                                {providerTypeLabel}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Currency</p>
                                            <p className="font-medium text-gray-900">{scholarship.currency}</p>
                                        </div>
                                        {scholarship.providerType === 'university' && (scholarship.localRanking || scholarship.internationalRanking) && (
                                            <div className="pt-2 border-t border-gray-100 mt-2 space-y-3">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">University Rankings</p>
                                                {scholarship.localRanking && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-500">Local Rank</span>
                                                        <Badge variant="secondary" size="sm" className="bg-amber-50 text-amber-700 border-amber-100">
                                                            #{scholarship.localRanking}
                                                        </Badge>
                                                    </div>
                                                )}
                                                {scholarship.internationalRanking && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-500">World Rank</span>
                                                        <Badge variant="secondary" size="sm" className="bg-blue-50 text-blue-700 border-blue-100">
                                                            #{scholarship.internationalRanking}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* CTA (Sidebar) */}
                            {isPending ? (
                                <Card className="bg-amber-50 border-amber-200">
                                    <CardContent className="pt-6 text-center">
                                        <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                                        <p className="text-amber-700 font-medium mb-4">
                                            This scholarship is opening soon. Get notified when applications open!
                                        </p>
                                        <Button
                                            variant={isNotifySubscribed ? 'secondary' : 'primary'}
                                            size="lg"
                                            onClick={toggleNotify}
                                            disabled={notifyLoading}
                                            isLoading={notifyLoading}
                                            className="w-full flex items-center justify-center gap-2"
                                        >
                                            {isNotifySubscribed ? (
                                                <>
                                                    <BellOff className="h-5 w-5" />
                                                    Notifications On
                                                </>
                                            ) : (
                                                <>
                                                    <Bell className="h-5 w-5" />
                                                    Notify Me
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : !passed && scholarship.status === 'active' && !alreadyApplied ? (
                                <Card className="bg-primary-50 border-primary-200">
                                    <CardContent className="pt-6 text-center">
                                        <p className="text-primary-700 font-medium mb-4">
                                            Interested in this scholarship?
                                        </p>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            onClick={handleApplyNow}
                                            disabled={applying || gateLoading}
                                            isLoading={applying}
                                            className="w-full flex items-center justify-center gap-2"
                                        >
                                            <ExternalLink className="h-5 w-5" />
                                            {applyBtnProps.text}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : null}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Related Scholarships */}
            {filteredRelated.length > 0 && (
                <section className="py-16 bg-white">
                    <Container size="xl">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                            Related Scholarships
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {filteredRelated.map((s: Scholarship) => (
                                <ScholarshipCard key={s.id} scholarship={s} />
                            ))}
                        </div>
                    </Container>
                </section>
            )}
        </MainLayout>
    );
}
