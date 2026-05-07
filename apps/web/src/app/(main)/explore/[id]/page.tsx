import type { Metadata } from "next";

interface SpotDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SpotDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `장소 #${id} — VIVAC`,
  };
}

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">장소 상세</h1>
      <p className="text-sm text-muted-foreground">ID: {id}</p>
      {/* SpotDetail — M5 장소 상세 페이지 구현 시 추가 */}
    </div>
  );
}
