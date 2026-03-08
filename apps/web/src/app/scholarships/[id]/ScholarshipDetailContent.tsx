'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
import { useScholarship, useFeaturedScholarships, useIncrementApplicationCount } from '@/lib/convexQueries';
import { Scholarship } from '@/types';
import { formatCurrency, formatDate, isDeadlinePassed } from '@/lib/utils';

export function ScholarshipDetailContent() {
    const params = useParams();
    const id = params.id as string;

    const { data: scholarship, isLoading } = useScholarship(id);
    const { data: relatedScholarships } = useFeaturedScholarships(4);
    const incrementCount = useIncrementApplicationCount();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredRelated = relatedScholarships.filter((s: any) => s._id !== id).slice(0, 3).map((s: any) => ({ ...s, id: s._id }));

    const handleApplyNow = useCallback(async () => {
        if (!scholarship) return;

        // Increment application count
        try {
            await incrementCount({ id: id as any });
        } catch {
            // Silently fail - don't block the user from applying
        }

        // Open application URL in new tab
        if (scholarship.applicationUrl) {
            window.open(scholarship.applicationUrl, '_blank', 'noopener,noreferrer');
        }
    }, [scholarship, incrementCount, id]);

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

    return (
        <MainLayout>
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
                    <div className="flex items-center gap-2 text-lg text-gray-600">
                        <Building2 className="h-5 w-5" />
                        <span className="font-medium">{scholarship.provider}</span>
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
                    <div className="flex flex-wrap gap-4">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleApplyNow}
                            disabled={passed || scholarship.status !== 'active'}
                            className="flex items-center gap-2"
                        >
                            <ExternalLink className="h-5 w-5" />
                            {passed ? 'Deadline Passed' : 'Apply Now'}
                        </Button>
                        <ShareButton
                            scholarshipName={scholarship.name}
                            scholarshipValue={formatCurrency(scholarship.value, scholarship.currency)}
                        />
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section className="py-10 bg-gray-50">
                <Container size="xl">
                    <div className="grid md:grid-cols-3 gap-8">
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
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-500 w-32">Application Deadline</span>
                                            <span className="text-gray-900 font-medium">
                                                {formatDate(scholarship.deadline, 'long')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-500 w-32">Date Posted</span>
                                            <span className="text-gray-900 font-medium">
                                                {formatDate(scholarship.createdAt, 'long')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-500 w-32">Last Updated</span>
                                            <span className="text-gray-900 font-medium">
                                                {formatDate(scholarship.updatedAt, 'long')}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
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
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Apply CTA (Sidebar) */}
                            {!passed && scholarship.status === 'active' && (
                                <Card className="bg-primary-50 border-primary-200">
                                    <CardContent className="pt-6 text-center">
                                        <p className="text-primary-700 font-medium mb-4">
                                            Interested in this scholarship?
                                        </p>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            onClick={handleApplyNow}
                                            className="w-full flex items-center justify-center gap-2"
                                        >
                                            <ExternalLink className="h-5 w-5" />
                                            Apply Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
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
