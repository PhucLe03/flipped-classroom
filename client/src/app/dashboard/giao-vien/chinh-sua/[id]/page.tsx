import React, { Suspense } from 'react';
import EditMaterialClient from './EditMaterialClient';

export async function generateStaticParams() {
  return [{ id: 'sample' }];
}

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center p-8 text-slate-500">Đang tải...</div>}>
      <EditMaterialClient id={params.id} />
    </Suspense>
  );
}
