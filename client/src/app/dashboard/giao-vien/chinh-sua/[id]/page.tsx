import EditMaterialClient from './EditMaterialClient';

export async function generateStaticParams() {
  return [
    { id: 'sample' },
    { id: 'default' },
  ];
}

export default function Page({ params }: { params: { id: string } }) {
  return <EditMaterialClient id={params.id} />;
}
