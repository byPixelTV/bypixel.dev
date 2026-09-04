import OGPreviewCard from "@/components/OGPreviewCard";
import { fetchOGData } from "@/lib/og-fetcher";

export default async function StreamedLinkPreview({ url }: { url: string }) {
  const data = await fetchOGData(url);
  return <OGPreviewCard data={data} href={url} />;
}
