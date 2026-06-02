import CollectiumAppShell from "../../../../components/app/CollectiumAppShell";

type CustomerPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { userId } = await params;
  return <CollectiumAppShell page="admin" adminModule="customer" customerId={userId} />;
}
