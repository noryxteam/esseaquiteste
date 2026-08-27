import { NotFoundError } from "@/shared/types/errors";
import { contractRepository } from "@/modules/contracts/repositories/contract.repository";
import type {
  CreateContractInput,
  SyncContractInput,
  UpdateContractInput,
} from "@/modules/contracts/validators/contract.validator";
import type { PaginationParams, RequestContext } from "@/shared/types/api";
import { auditService } from "@/shared/services/audit.service";
import { emitDomainEvent } from "@/shared/events/emit";
import { DomainEventType } from "@/shared/events/types";
import { buildPaginationMeta } from "@/shared/utils/pagination";
import { contractSecurityRepository } from "@/modules/security/repositories/contract-security.repository";
import {
  getCodeHint,
  hashAccessCode,
  normalizeAccessCode,
} from "@/modules/security/utils/access-code.utils";
import { prisma } from "@/database";

type PanelSignature = {
  role?: string;
  nome?: string;
  documento?: string;
  data?: string;
  hora?: string;
  aceiteEletronico?: boolean;
  assinadoEm?: string;
};

function parsePanelSignatures(conteudo: unknown): PanelSignature[] {
  if (!conteudo || typeof conteudo !== "object") return [];
  const raw = (conteudo as { assinaturas?: unknown }).assinaturas;
  if (!Array.isArray(raw)) return [];
  return raw.filter((s): s is PanelSignature => Boolean(s) && typeof s === "object");
}

function normalizeSignatureRole(role: string | undefined): "norax" | "cliente" | null {
  if (!role) return null;
  const r = role.toLowerCase();
  if (r === "norax" || r === "empresa") return "norax";
  if (r === "cliente") return "cliente";
  return null;
}

function parseSignatureDate(sig: PanelSignature): Date {
  const raw = sig.assinadoEm || sig.data;
  if (!raw) return new Date();
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw);
  if (br) return new Date(`${br[3]}-${br[2]}-${br[1]}T12:00:00`);
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

/** Espelha assinaturas do painel (localStorage) na tabela oficial do portal. */
async function syncSignaturesFromPanel(contractId: string, conteudo: unknown) {
  const signatures = parsePanelSignatures(conteudo);
  for (const sig of signatures) {
    const role = normalizeSignatureRole(sig.role);
    if (!role || !sig.nome?.trim()) continue;

    const existing = await prisma.contractSignatureRecord.findFirst({
      where: { contractId, role },
    });
    if (existing) continue;

    await prisma.contractSignatureRecord.create({
      data: {
        contractId,
        role,
        nome: sig.nome.trim(),
        documento: (sig.documento || "").trim() || "—",
        aceiteEletronico: Boolean(sig.aceiteEletronico),
        dataAssinatura: parseSignatureDate(sig),
      },
    });
  }

  const all = await prisma.contractSignatureRecord.findMany({
    where: { contractId },
    select: { role: true },
  });
  const roles = new Set(all.map((s) => s.role.toLowerCase()));
  const hasNorax = roles.has("norax") || roles.has("empresa");
  const hasCliente = roles.has("cliente");

  if (hasNorax && hasCliente) {
    await prisma.contract.update({
      where: { id: contractId },
      data: { status: "ASSINADO", dataAssinatura: new Date(), assinado: true },
    });
  } else if (hasNorax || hasCliente) {
    await prisma.contract.update({
      where: { id: contractId },
      data: { status: "PARCIALMENTE_ASSINADO" },
    });
  }
}

export class ContractService {
  async list(params: PaginationParams) {
    const { data, total } = await contractRepository.findMany(params);
    return { data, pagination: buildPaginationMeta(total, params.page, params.limit) };
  }

  async getById(id: string) {
    const contract = await contractRepository.findById(id);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");
    return contract;
  }

  async create(input: CreateContractInput, ctx: RequestContext) {
    const contract = await contractRepository.create(input);
    await auditService.logCreate("Contract", contract.id, ctx);
    await emitDomainEvent({
      type: DomainEventType.CONTRACT_CREATED,
      payload: {
        contractId: contract.id,
        clienteId: contract.clienteId,
        projetoId: contract.projetoId,
        numeroContrato: contract.numeroContrato,
        valor: Number(contract.valor),
      },
      context: ctx,
    });
    return contract;
  }

  async update(id: string, input: UpdateContractInput, ctx: RequestContext) {
    const previous = await this.getById(id);
    const contract = await contractRepository.update(id, input);
    await auditService.logUpdate("Contract", id, ctx, { changes: input });
    if (input.status && input.status !== previous.status) {
      await auditService.logStatusChange("Contract", id, ctx, previous.status, input.status);
      await emitDomainEvent({
        type: DomainEventType.CONTRACT_STATUS_CHANGED,
        payload: {
          contractId: id,
          clienteId: contract.clienteId,
          projetoId: contract.projetoId,
          numeroContrato: contract.numeroContrato,
          from: previous.status,
          to: input.status,
        },
        context: ctx,
      });
      if (input.status === "ASSINADO" || input.status === "FINALIZADO") {
        await emitDomainEvent({
          type: DomainEventType.CONTRACT_SIGNED,
          payload: {
            contractId: id,
            clienteId: contract.clienteId,
            projetoId: contract.projetoId,
            numeroContrato: contract.numeroContrato,
          },
          context: ctx,
        });
      }
    }
    return contract;
  }

  /** Persiste contrato do painel no banco (fonte da verdade para URLs públicas). */
  async syncFromPanel(input: SyncContractInput, ctx: RequestContext) {
    const contract = await contractRepository.upsertFromPanel(input, ctx.userId);

    if (input.accessCode) {
      const normalized = normalizeAccessCode(input.accessCode);
      const codeHash = hashAccessCode(normalized);
      const existing = await contractSecurityRepository.findActiveCodeByHash(contract.id, codeHash);
      if (!existing) {
        await contractSecurityRepository.createAccessCode({
          contractId: contract.id,
          codeHash,
          codeHint: getCodeHint(normalized),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdById: ctx.userId,
          source: "STAFF_GENERATED",
        });
      }
    }

    await syncSignaturesFromPanel(contract.id, input.conteudo);

    await auditService.logUpdate("Contract", contract.id, ctx, { changes: { sync: true } });
    return {
      id: contract.id,
      uniqueSlug: contract.uniqueSlug,
      numeroContrato: contract.numeroContrato,
    };
  }

  async remove(id: string, ctx: RequestContext) {
    await this.getById(id);
    await contractRepository.softDelete(id);
    await auditService.logDelete("Contract", id, ctx);
  }
}

export const contractService = new ContractService();
