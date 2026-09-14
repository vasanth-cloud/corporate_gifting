import ClaimClientComponent from './ClaimClientComponent';

export const dynamic = 'force-dynamic';

export default function ClaimPage({ params }: { params: { token: string } }) {
  return <ClaimClientComponent token={params.token} />;
}
