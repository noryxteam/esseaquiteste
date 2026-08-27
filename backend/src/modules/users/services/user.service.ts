import { NotFoundError } from "@/shared/types/errors";
import { userRepository } from "@/modules/users/repositories/user.repository";
import type { CreateUserInput, UpdateUserInput } from "@/modules/users/validators/user.validator";
import type { PaginationParams, RequestContext } from "@/shared/types/api";
import { auditService } from "@/shared/services/audit.service";
import { buildPaginationMeta } from "@/shared/utils/pagination";
import bcrypt from "bcryptjs";
import type { UserType } from "@prisma/client";
import { mapUserTypeFromRole } from "@/modules/auth/utils/token.utils";

export class UserService {
  async list(params: PaginationParams) {
    const { data, total } = await userRepository.findMany(params);
    return { data, pagination: buildPaginationMeta(total, params.page, params.limit) };
  }

  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("Usuário não encontrado.", "USER_NOT_FOUND");
    return user;
  }

  async create(input: CreateUserInput, ctx: RequestContext) {
    const hashed = await bcrypt.hash(input.password, 12);
    const user = await userRepository.create({
      ...input,
      password: hashed,
      userType: mapUserTypeFromRole(input.role ?? "COMERCIAL") as UserType,
    });
    await auditService.logCreate("User", user.id, ctx);
    return user;
  }

  async update(id: string, input: UpdateUserInput, ctx: RequestContext) {
    await this.getById(id);
    const data: UpdateUserInput & { password?: string; userType?: UserType } = { ...input };
    if (input.password) data.password = await bcrypt.hash(input.password, 12);
    if (input.role) data.userType = mapUserTypeFromRole(input.role);
    const user = await userRepository.update(id, data);
    await auditService.logUpdate("User", id, ctx, {
      changes: { ...input, password: input.password ? "[REDACTED]" : undefined },
    });
    return user;
  }

  async remove(id: string, ctx: RequestContext) {
    await this.getById(id);
    await userRepository.softDelete(id);
    await auditService.logDelete("User", id, ctx);
  }
}

export const userService = new UserService();
