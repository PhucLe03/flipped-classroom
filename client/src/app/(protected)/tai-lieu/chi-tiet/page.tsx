'use client';

import React, { Suspense } from 'react';
import MaterialDetailClient from '../[slug]/MaterialDetailClient';
import { Loader2 } from 'lucide-react';

export default function ChiTietTaiLieuPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
          <p className="mt-4 text-base font-medium text-slate-500">Đang tải bài học...</p>
        </div>
      }
    >
      <MaterialDetailClient />
    </Suspense>
  );
}
