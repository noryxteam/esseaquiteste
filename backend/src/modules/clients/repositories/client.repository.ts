import type { Client } from "@prisma/client";
import { prisma } from "@/database";
import type { PaginationParams } from "@/shared/types/api";
import {
  buildOrderBy,
  buildSearchOr,
  mergeWhere,
  paginatedQuery,
  softDeleteWhere,
} from "@/shared/repositories/base.repository";
import type { CreateClientInput, UpdateClientInput } from "@/modules/clients/validators/client.validator";

const SORT_FIELDS = ["createdAt", "empresa", "nome", "status", "ultimoContato"];
const SEARCH_FIELDS = ["nome", "empresa", "email", "segmento", "cidade"];

const include = {
  responsavel: { select: { id: true, nome: true, email: true, role: true } },
  _count: { select: { projects: { where: { deletedAt: null } } } },
};

export class ClientRepository {
  async findMany(params: PaginationParams) {
    const where = mergeWhere(
      softDeleteWhere(),
      buildSearchOr(params.search, SEARCH_FIELDS),
      params.filters
    );

    return paginatedQuery<Client>(
      (args) => prisma.client.findMany({ ...args, include }),
      (args) => prisma.client.count(args),
      where,
      params,
      SORT_FIELDS
    );
  }

  async findById(id: string) {
    return prisma.client.findFirst({
      where: { id, ...softDeleteWhere() },
      include: {
        ...include,
        projects: { where: softDeleteWhere(), take: 10 },
      },
    });
  }

  async create(data: CreateClientInput) {
    return prisma.client.create({ data, include });
  }

  async update(id: string, data: UpdateClientInput) {
    return prisma.client.update({ where: { id }, data, include });
  }

  async softDelete(id: string) {
    return prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async sumProjectValue(clienteId: string): Promise<number> {
    const result = await prisma.project.aggregate({
      where: { clienteId, ...softDeleteWhere() },
      _sum: { valor: true },
    });
    return Number(result._sum.valor ?? 0);
  }
}

export const clientRepository = new ClientRepository();
