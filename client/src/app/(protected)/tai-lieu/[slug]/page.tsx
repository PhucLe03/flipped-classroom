import React, { Suspense } from 'react';
import MaterialDetailClient from './MaterialDetailClient';

export async function generateStaticParams() {
  return [{ slug: 'preview' }];
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center p-8 text-slate-500">Đang tải...</div>}>
      <MaterialDetailClient slug={params.slug} />
    </Suspense>
  );
}
