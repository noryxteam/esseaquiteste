import { prisma } from "@/database";
import type { PaginationParams } from "@/shared/types/api";
import { buildSearchOr, mergeWhere, paginatedQuery, softDeleteWhere } from "@/shared/repositories/base.repository";
import type {
  CreateContractInput,
  SyncContractInput,
  UpdateContractInput,
} from "@/modules/contracts/validators/contract.validator";
import { Prisma } from "@prisma/client";

const SORT_FIELDS = ["createdAt", "numeroContrato", "valor", "status", "dataCriacao"];
const SEARCH_FIELDS = ["numeroContrato", "formaPagamento"];
const include = {
  cliente: { select: { id: true, empresa: true } },
  projeto: { select: { id: true, nome: true } },
};

function parseOptionalDate(value?: string | null): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "" || value === "—") return null;
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (br) {
    return new Date(`${br[3]}-${br[2]}-${br[1]}T12:00:00`);
  }
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (isoDate) {
    return new Date(`${isoDate[1]}-${isoDate[2]}-${isoDate[3]}T12:00:00`);
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export class ContractRepository {
  async findMany(params: PaginationParams) {
    const where = mergeWhere(softDeleteWhere(), buildSearchOr(params.search, SEARCH_FIELDS), params.filters);
    return paginatedQuery(
      (args) => prisma.contract.findMany({ ...args, include }),
      (args) => prisma.contract.count(args),
      where, params, SORT_FIELDS, "dataCriacao"
    );
  }

  async findById(id: string) {
    return prisma.contract.findFirst({ where: { id, ...softDeleteWhere() }, include });
  }

  async findByIdOrSlug(idOrSlug: string) {
    return prisma.contract.findFirst({
      where: {
        deletedAt: null,
        OR: [{ id: idOrSlug }, { uniqueSlug: idOrSlug }, { numeroContrato: idOrSlug }],
      },
      include,
    });
  }

  async create(data: CreateContractInput) {
    return prisma.contract.create({ data, include });
  }

  async update(id: string, data: UpdateContractInput) {
    return prisma.contract.update({ where: { id }, data, include });
  }

  /** Garante cliente + projeto no banco e faz upsert do contrato (mesmos IDs do painel). */
  async upsertFromPanel(input: SyncContractInput, fallbackResponsavelId: string) {
    const responsavelId = await this.resolveResponsavelId(input.responsavelId, fallbackResponsavelId);

    await this.ensureClient(input.client, responsavelId);
    await this.ensureProject(input.project, responsavelId);

    const shared = {
      clienteId: input.client.id,
      projetoId: input.project.id,
      numeroContrato: input.numeroContrato,
      uniqueSlug: input.uniqueSlug,
      titulo: input.titulo,
      valor: input.valor,
      status: input.status,
      lifecycleStep: input.lifecycleStep,
      versao: input.versao,
      isImmutable: input.isImmutable,
      formaPagamento: input.formaPagamento,
      parcelas: input.parcelas ?? 1,
      prazo: parseOptionalDate(input.prazo),
      responsavelId,
      link: input.link ?? null,
      hashDocumento: input.hashDocumento ?? null,
      accessCode: input.accessCode ?? null,
      dataEnvio: parseOptionalDate(input.dataEnvio),
      dataAssinatura: parseOptionalDate(input.dataAssinatura),
      clauseBlocks: (input.clauseBlocks ?? []) as Prisma.InputJsonValue,
      campos: (input.campos ?? []) as Prisma.InputJsonValue,
      editorSettings: (input.editorSettings ?? {}) as Prisma.InputJsonValue,
      conteudo: (input.conteudo ?? null) as Prisma.InputJsonValue,
      assinado: input.status === "ASSINADO" || input.status === "FINALIZADO",
      deletedAt: null,
    };

    const updateData: Prisma.ContractUncheckedUpdateInput = shared;
    const createData: Prisma.ContractUncheckedCreateInput = {
      id: input.id,
      ...shared,
    };

    try {
      // Upsert atômico evita "Registro duplicado" quando create + ensure syncam em paralelo.
      return await prisma.contract.upsert({
        where: { id: input.id },
        create: createData,
        update: updateData,
        include,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        const conflict = await prisma.contract.findFirst({
          where: {
            OR: [
              { uniqueSlug: input.uniqueSlug },
              { numeroContrato: input.numeroContrato },
            ],
          },
          include,
        });
        if (conflict) {
          return prisma.contract.update({
            where: { id: conflict.id },
            data: updateData,
            include,
          });
        }
      }
      throw err;
    }
  }

  private async resolveResponsavelId(
    candidate: string | null | undefined,
    fallback: string
  ): Promise<string> {
    if (candidate) {
      const user = await prisma.user.findUnique({ where: { id: candidate }, select: { id: true } });
      if (user) return user.id;
    }
    return fallback;
  }

  private async ensureClient(
    client: SyncContractInput["client"],
    responsavelId: string
  ) {
    const contactEmail =
      client.email && client.email.includes("@") ? client.email : `${client.id}@norax.local`;
    const notificationEmail =
      client.emailNotificacao && client.emailNotificacao.includes("@")
        ? client.emailNotificacao
        : null;
    // Preferência: Gmail de notificação para alertas de dispositivo
    const email = notificationEmail ?? contactEmail;
    const estado = (client.estado || "SP").slice(0, 2).toUpperCase();
    const setupData = {
      emailRecuperacao: notificationEmail ?? contactEmail,
      emailContato: contactEmail,
    };

    await prisma.client.upsert({
      where: { id: client.id },
      update: {
        nome: client.nome,
        empresa: client.empresa,
        email,
        telefone: client.telefone ?? null,
        segmento: client.segmento || "Geral",
        cidade: client.cidade || "São Paulo",
        estado,
        setupData,
        deletedAt: null,
      },
      create: {
        id: client.id,
        nome: client.nome,
        empresa: client.empresa,
        email,
        telefone: client.telefone ?? null,
        segmento: client.segmento || "Geral",
        cidade: client.cidade || "São Paulo",
        estado,
        status: "PROSPECTO",
        responsavelId,
        setupData,
      },
    });
  }

  private async ensureProject(
    project: SyncContractInput["project"],
    responsavelId: string
  ) {
    const dataInicio = parseOptionalDate(project.dataInicio) ?? new Date();
    const prazo = parseOptionalDate(project.prazo) ?? dataInicio;

    await prisma.project.upsert({
      where: { id: project.id },
      update: {
        clienteId: project.clienteId,
        nome: project.nome,
        descricao: project.descricao?.trim() || project.nome,
        valor: project.valor ?? 0,
        dataInicio,
        prazo,
        responsavelId,
        deletedAt: null,
      },
      create: {
        id: project.id,
        clienteId: project.clienteId,
        nome: project.nome,
        descricao: project.descricao?.trim() || project.nome,
        status: "PLANEJAMENTO",
        progresso: 0,
        responsavelId,
        dataInicio,
        prazo,
        prioridade: "MEDIA",
        valor: project.valor ?? 0,
      },
    });
  }

  async softDelete(id: string) {
    return prisma.contract.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

export const contractRepository = new ContractRepository();
