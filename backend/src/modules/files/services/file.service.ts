import { NotFoundError } from "@/shared/types/errors";
import { fileRepository } from "@/modules/files/repositories/file.repository";
import type { CreateFileInput, UpdateFileInput } from "@/modules/files/validators/file.validator";
import type { PaginationParams, RequestContext } from "@/shared/types/api";
import { auditService } from "@/shared/services/audit.service";
import { emitDomainEvent } from "@/shared/events/emit";
import { DomainEventType } from "@/shared/events/types";
import { buildPaginationMeta } from "@/shared/utils/pagination";

export class FileService {
  async list(params: PaginationParams) {
    const { data, total } = await fileRepository.findMany(params);
    return { data, pagination: buildPaginationMeta(total, params.page, params.limit) };
  }

  async getById(id: string) {
    const file = await fileRepository.findById(id);
    if (!file) throw new NotFoundError("Arquivo não encontrado.", "FILE_NOT_FOUND");
    return file;
  }

  async create(input: CreateFileInput, ctx: RequestContext) {
    const file = await fileRepository.create(input);
    await auditService.logCreate("File", file.id, ctx);
    await emitDomainEvent({
      type: DomainEventType.FILE_UPLOADED,
      payload: {
        fileId: file.id,
        clienteId: file.clienteId,
        projetoId: file.projetoId,
        nome: file.nome,
      },
      context: ctx,
    });
    return file;
  }

  async update(id: string, input: UpdateFileInput, ctx: RequestContext) {
    await this.getById(id);
    const file = await fileRepository.update(id, input);
    await auditService.logUpdate("File", id, ctx, { changes: input });
    return file;
  }

  async remove(id: string, ctx: RequestContext) {
    await this.getById(id);
    await fileRepository.softDelete(id);
    await auditService.logDelete("File", id, ctx);
  }
}

export const fileService = new FileService();
