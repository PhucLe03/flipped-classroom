import MaterialDetailClient from './MaterialDetailClient';

const FALLBACK_SLUGS = [
  'gioi-thieu-ve-giai-tich-va-ban-chat-cua-dao-ham',
  'khao-sat-dao-dong-dieu-hoa-va-con-lac-lo-xo',
  'chuyen-de-cau-dieu-kien-toan-dien',
  'y-nghia-hinh-hoc-va-vat-ly-cua-dao-ham',
  'phuong-phap-hoc-dao-nguoc-hieu-qua-toan-dien',
  'preview',
];

/**
 * Dynamically queries all material slugs from the backend at build-time.
 * If backend is offline or during CI/CD without active server,
 * gracefully falls back to predefined essential slugs.
 */
export async function generateStaticParams() {
  const slugSet = new Set<string>(FALLBACK_SLUGS);

  try {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const baseUrl = rawApiUrl.trim().replace(/\/+$/, '');
    const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

    // Attempt to dynamically fetch materials with a 3-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${apiUrl}/materials?limit=100`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const materials = json?.data?.materials || json?.data || [];
      if (Array.isArray(materials)) {
        materials.forEach((m: { slug?: string }) => {
          if (m?.slug) slugSet.add(m.slug);
        });
      }
    }
  } catch {
    // Backend offline or unreachable during build time (e.g. GitHub Actions runner)
    // Silently proceed with fallback slugs
  }

  return Array.from(slugSet).map((slug) => ({ slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <MaterialDetailClient slug={params.slug} />;
}
