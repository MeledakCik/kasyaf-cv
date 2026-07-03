import TemplateClient from "./TemplateClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <TemplateClient
      initialCategory={params.category ?? "All"}
    />
  );
}