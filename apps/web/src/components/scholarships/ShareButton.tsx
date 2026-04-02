'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Share2, Link2, Check, X as XIcon, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface ShareButtonProps {
  scholarshipName: string;
  scholarshipValue: string;
  scholarshipId: string;
  lang: string;
}

import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';

export function ShareButton({
  scholarshipName,
  scholarshipValue,
  scholarshipId,
  lang
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getOrCreateShortUrl = useMutation(api.shortUrls.getOrCreateShortUrl);

  const shareText = `Check out this scholarship: ${scholarshipName} worth ${scholarshipValue} on Pathfindr`;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUrl = async () => {
    if (shortUrl) return shortUrl;
    setLoading(true);
    try {
      const targetPath = `/${lang}/scholarships/detail?id=${scholarshipId}`;
      const shortCode = await getOrCreateShortUrl({
        targetPath,
        type: 'scholarship',
      });
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const fullShortUrl = `${baseUrl}/s/${shortCode}`;
      setShortUrl(fullShortUrl);
      return fullShortUrl;
    } catch (error) {
      console.error('Error generating short URL:', error);
      return typeof window !== 'undefined' ? window.location.href : '';
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const urlToShare = await getUrl();

    // Try native Web Share API first (mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: scholarshipName,
          text: shareText,
          url: urlToShare,
        });
        return;
      } catch {
        // User cancelled or API not available, fall through to dropdown
      }
    }

    // Desktop: show dropdown
    setIsOpen(!isOpen);
  };

  const handleCopyLink = async () => {
    const urlToShare = await getUrl();
    try {
      await navigator.clipboard.writeText(urlToShare);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = urlToShare;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    }
  };

  const handleTwitterShare = async () => {
    const urlToShare = await getUrl();
    const url = encodeURIComponent(urlToShare);
    const text = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    setIsOpen(false);
  };

  const handleWhatsAppShare = async () => {
    const urlToShare = await getUrl();
    const text = encodeURIComponent(`${shareText}\n${urlToShare}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setIsOpen(false);
  };

  const handleEmailShare = async () => {
    const urlToShare = await getUrl();
    const subject = encodeURIComponent(`Scholarship Opportunity: ${scholarshipName}`);
    const body = encodeURIComponent(`${shareText}\n\nLearn more: ${urlToShare}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="secondary"
        size="lg"
        onClick={handleShare}
        className="flex items-center gap-2"
        isLoading={loading}
      >
        <Share2 className="h-5 w-5" />
        Share
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-2">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition text-left"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Link2 className="h-4 w-4 text-gray-500" />
              )}
              <span className={cn('text-sm', copied ? 'text-green-600 font-medium' : 'text-gray-700')}>
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>

            <div className="border-t border-gray-100 my-1" />

            {/* Twitter/X */}
            <button
              onClick={handleTwitterShare}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition text-left"
            >
              <XIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Share on X</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition text-left"
            >
              <MessageCircle className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">WhatsApp</span>
            </button>

            {/* Email */}
            <button
              onClick={handleEmailShare}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition text-left"
            >
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Email</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
