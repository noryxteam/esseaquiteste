import { electronicContractService } from "@/modules/electronic-contracts";
import { ensureContractSyncedInBackend } from "@/modules/electronic-contracts/sync-api";
import { getContractViewPath } from "@/lib/contract-routes";
import type { ElectronicContract } from "@/modules/electronic-contracts";
import { clientSetupService } from "@/modules/client-setup/service";
import { apiFetch } from "@/modules/auth/api/auth.api";
import type { SendChannel } from "@/modules/client-forms/components/SendFormModal";

/** Link do cliente: vai direto em /visualizar (1 carga; o gate de dispositivo já está lá). */
export function resolveContractPublicUrl(contract: ElectronicContract): string {
  const slug = contract.uniqueSlug || contract.id;
  const path = getContractViewPath(slug);
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  return path;
}

export function getContractSendDefaults(contractId: string): {
  title: string;
  phone: string;
  email: string;
  publicUrl: string;
  contract: ElectronicContract | null;
} {
  const contract = electronicContractService.getById(contractId);
  if (!contract) {
    return { title: "Contrato", phone: "", email: "", publicUrl: "", contract: null };
  }

  const setup = clientSetupService.get(contract.clienteId);
  const phone =
    setup?.personal.telefone ||
    contract.variaveis.telefone ||
    "";
  const email =
    setup?.service.emailRecuperacao ||
    setup?.personal.email ||
    contract.variaveis.email ||
    "";

  return {
    title: contract.numeroContrato || contract.titulo || "Contrato",
    phone,
    email,
    publicUrl: resolveContractPublicUrl(contract),
    contract,
  };
}

/**
 * Marca como enviado + sync. Idempotente se já estiver aguardando assinatura.
 * Se ainda for rascunho, gera a versão definitiva automaticamente.
 */
export async function sendContractToClientAction(contractId: string): Promise<{
  contract: ElectronicContract;
  publicUrl: string;
}> {
  const existing = electronicContractService.getById(contractId);
  if (!existing) {
    throw new Error("Contrato não encontrado.");
  }

  // Criar ≠ pronto para o cliente: gera versão definitiva se ainda for rascunho
  if (!existing.isImmutable) {
    electronicContractService.prepareForClientSend(existing.id);
  }

  const prepared = electronicContractService.getById(contractId);
  if (!prepared) {
    throw new Error("Contrato não encontrado.");
  }

  const alreadySent =
    prepared.status === "aguardando-assinatura" ||
    prepared.status === "parcialmente-assinado" ||
    prepared.status === "assinado" ||
    Boolean(prepared.dataEnvio);

  const contract = alreadySent
    ? prepared
    : electronicContractService.sendToClient(prepared.id);

  const synced = await ensureContractSyncedInBackend(contract);
  const withSlug = {
    ...contract,
    uniqueSlug: synced.uniqueSlug || contract.uniqueSlug,
  };
  const publicUrl = resolveContractPublicUrl(withSlug);

  try {
    await navigator.clipboard.writeText(publicUrl);
  } catch {
    // ignore
  }

  return { contract: withSlug, publicUrl };
}

export async function deliverContractInvite(input: {
  contractId: string;
  channel: SendChannel;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
}): Promise<{ publicUrl: string; contract: ElectronicContract }> {
  const { contract, publicUrl } = await sendContractToClientAction(input.contractId);
  const message = input.message.replaceAll("{{link}}", publicUrl);

  if (input.channel === "whatsapp") {
    const digits = (input.phone ?? "").replace(/\D/g, "");
    if (digits.length < 10) {
      throw new Error("Informe um número de WhatsApp válido.");
    }
    window.open(
      `https://wa.me/${digits}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
    return { publicUrl, contract };
  }

  const to = input.email?.trim() ?? "";
  if (!to.includes("@")) {
    throw new Error("Informe um e-mail válido.");
  }

  await apiFetch("/forms/send-invite", {
    method: "POST",
    body: JSON.stringify({
      to,
      subject: input.subject?.trim() || `Contrato — ${contract.numeroContrato}`,
      message,
      formUrl: publicUrl,
      ctaLabel: "Abrir contrato",
    }),
  });

  return { publicUrl, contract };
}

export const CONTRACT_WA_MSG =
  "Olá! Segue o link do seu contrato para visualização e assinatura:\n\n{{link}}";

export const CONTRACT_EMAIL_MSG =
  "Olá!\n\nSegue o link do seu contrato para visualização e assinatura:\n\n{{link}}\n\nQualquer dúvida, estamos à disposição.";
