import EditMaterialClient from './EditMaterialClient';

export async function generateStaticParams() {
  return [{ id: 'sample' }];
}

export default function Page({ params }: { params: { id: string } }) {
  return <EditMaterialClient id={params.id} />;
}
