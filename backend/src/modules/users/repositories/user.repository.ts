import { prisma } from "@/database";
import type { PaginationParams } from "@/shared/types/api";
import { buildSearchOr, mergeWhere, paginatedQuery, softDeleteWhere } from "@/shared/repositories/base.repository";
import type { CreateUserInput, UpdateUserInput } from "@/modules/users/validators/user.validator";
import type { UserType } from "@prisma/client";

const SORT_FIELDS = ["createdAt", "nome", "email", "role"];
const SEARCH_FIELDS = ["nome", "email"];
const publicSelect = {
  id: true, nome: true, email: true, role: true, avatar: true, ativo: true, createdAt: true, updatedAt: true,
};

export class UserRepository {
  async findMany(params: PaginationParams) {
    const where = mergeWhere(softDeleteWhere(), buildSearchOr(params.search, SEARCH_FIELDS), params.filters);
    return paginatedQuery(
      (args) => prisma.user.findMany({ ...args, select: publicSelect }),
      (args) => prisma.user.count(args),
      where, params, SORT_FIELDS
    );
  }

  async findById(id: string) {
    return prisma.user.findFirst({ where: { id, ...softDeleteWhere() }, select: publicSelect });
  }

  async findByEmail(email: string) {
    return prisma.user.findFirst({ where: { email, ...softDeleteWhere() } });
  }

  async create(data: CreateUserInput & { password: string; userType?: UserType }) {
    return prisma.user.create({ data, select: publicSelect });
  }

  async update(id: string, data: UpdateUserInput & { password?: string; userType?: UserType }) {
    return prisma.user.update({ where: { id }, data, select: publicSelect });
  }

  async softDelete(id: string) {
    return prisma.user.update({ where: { id }, data: { deletedAt: new Date() }, select: publicSelect });
  }
}

export const userRepository = new UserRepository();
