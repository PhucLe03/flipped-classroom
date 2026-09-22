import MaterialDetailClient from './MaterialDetailClient';

export async function generateStaticParams() {
  return [
    { slug: 'gioi-thieu-ve-giai-tich-va-ban-chat-cua-dao-ham' },
    { slug: 'khao-sat-dao-dong-dieu-hoa-va-con-lac-lo-xo' },
    { slug: 'chuyen-de-cau-dieu-kien-toan-dien' },
    { slug: 'y-nghia-hinh-hoc-va-vat-ly-cua-dao-ham' },
    { slug: 'phuong-phap-hoc-dao-nguoc-hieu-qua-toan-dien' },
    { slug: 'preview' },
  ];
}

export default function Page({ params }: { params: { slug: string } }) {
  return <MaterialDetailClient slug={params.slug} />;
}
