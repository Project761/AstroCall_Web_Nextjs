'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function FreeKundliRedirect() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      // Redirect to the basic-detail page with the ID as query parameter
      router.replace(`/freekundli/basic-detail?FreekundliID=${id}`);
    }
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Kundli...</p>
      </div>
    </div>
  );
}
