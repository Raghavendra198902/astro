'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SignupRedirect() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Redirect to /auth/register with the same query parameters
    const params = new URLSearchParams(searchParams.toString());
    const url = `/auth/register${params.toString() ? '?' + params.toString() : ''}`;
    window.location.href = url;
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Redirecting to registration...</p>
      </div>
    </div>
  );
}
