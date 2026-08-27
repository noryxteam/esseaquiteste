import { prisma } from "@/database";
import type { PaginationParams } from "@/shared/types/api";
import { buildSearchOr, mergeWhere, paginatedQuery, softDeleteWhere } from "@/shared/repositories/base.repository";
import type { CreateFinanceInput, UpdateFinanceInput } from "@/modules/finance/validators/finance.validator";

const SORT_FIELDS = ["createdAt", "data", "valor", "status", "tipo"];
const SEARCH_FIELDS = ["descricao", "formaPagamento"];
const include = {
  cliente: { select: { id: true, empresa: true } },
  contrato: { select: { id: true, numeroContrato: true } },
};

export class FinanceRepository {
  async findMany(params: PaginationParams) {
    const where = mergeWhere(softDeleteWhere(), buildSearchOr(params.search, SEARCH_FIELDS), params.filters);
    return paginatedQuery(
      (args) => prisma.financeMovement.findMany({ ...args, include }),
      (args) => prisma.financeMovement.count(args),
      where, params, SORT_FIELDS, "data"
    );
  }

  async findById(id: string) {
    return prisma.financeMovement.findFirst({ where: { id, ...softDeleteWhere() }, include });
  }

  async create(data: CreateFinanceInput) {
    return prisma.financeMovement.create({ data, include });
  }

  async update(id: string, data: UpdateFinanceInput) {
    return prisma.financeMovement.update({ where: { id }, data, include });
  }

  async softDelete(id: string) {
    return prisma.financeMovement.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

export const financeRepository = new FinanceRepository();
