import { PublicFormView } from "@/modules/client-forms/components/PublicFormView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Página pública do formulário — sem painel, sem edição. */
export default async function PublicFormPage({ params }: PageProps) {
  const { slug } = await params;
  return <PublicFormView slug={slug} />;
}
