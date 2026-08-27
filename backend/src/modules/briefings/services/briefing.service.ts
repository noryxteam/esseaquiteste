import { NotFoundError } from "@/shared/types/errors";
import { briefingRepository } from "@/modules/briefings/repositories/briefing.repository";
import type { CreateBriefingInput, UpdateBriefingInput } from "@/modules/briefings/validators/briefing.validator";
import type { PaginationParams, RequestContext } from "@/shared/types/api";
import { auditService } from "@/shared/services/audit.service";
import { emitDomainEvent } from "@/shared/events/emit";
import { DomainEventType } from "@/shared/events/types";
import { buildPaginationMeta } from "@/shared/utils/pagination";

export class BriefingService {
  async list(params: PaginationParams) {
    const { data, total } = await briefingRepository.findMany(params);
    return { data, pagination: buildPaginationMeta(total, params.page, params.limit) };
  }

  async getById(id: string) {
    const briefing = await briefingRepository.findById(id);
    if (!briefing) throw new NotFoundError("Briefing não encontrado.", "BRIEFING_NOT_FOUND");
    return briefing;
  }

  async create(input: CreateBriefingInput, ctx: RequestContext) {
    const briefing = await briefingRepository.create(input);
    await auditService.logCreate("Briefing", briefing.id, ctx);
    await emitDomainEvent({
      type: DomainEventType.BRIEFING_CREATED,
      payload: {
        briefingId: briefing.id,
        clienteId: briefing.clienteId,
        projetoId: briefing.projetoId,
      },
      context: ctx,
    });
    return briefing;
  }

  async update(id: string, input: UpdateBriefingInput, ctx: RequestContext) {
    await this.getById(id);
    const briefing = await briefingRepository.update(id, input);
    await auditService.logUpdate("Briefing", id, ctx, { changes: input });
    return briefing;
  }

  async remove(id: string, ctx: RequestContext) {
    await this.getById(id);
    await briefingRepository.softDelete(id);
    await auditService.logDelete("Briefing", id, ctx);
  }
}

export const briefingService = new BriefingService();
