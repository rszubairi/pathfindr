'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic with loading: null to keep the initial render clean or use a skeleton
const HomeBelowFold = dynamic(() => import('./HomeBelowFold').then(mod => mod.HomeBelowFold), {
  ssr: true, // Still render on server for SEO
  loading: () => <BelowFoldPlaceholder />,
});

// A simple placeholder to avoid layout shift as much as possible
function BelowFoldPlaceholder() {
  return (
    <div className="animate-pulse space-y-12 py-10">
      <div className="h-64 bg-gray-100 rounded-lg mx-auto max-w-6xl" />
      <div className="h-96 bg-gray-50 rounded-lg mx-auto max-w-6xl" />
      <div className="h-64 bg-gray-100 rounded-lg mx-auto max-w-6xl" />
    </div>
  );
}

export function LazyHomeContent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // delay by 1 second as requested
    const timer = setTimeout(() => {
      setShow(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // During the first 1s on client, we show the placeholder.
  // On the server, 'dynamic-ssr' will render the full content for SEO.
  // Modern browsers will then hydrate this after the 1s delay when 'show' becomes true.
  return (
    <>
      {show ? <HomeBelowFold /> : <BelowFoldPlaceholder />}
    </>
  );
}
