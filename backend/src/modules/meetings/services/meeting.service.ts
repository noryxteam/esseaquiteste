import { NotFoundError } from "@/shared/types/errors";
import { meetingRepository } from "@/modules/meetings/repositories/meeting.repository";
import type { CreateMeetingInput, UpdateMeetingInput } from "@/modules/meetings/validators/meeting.validator";
import type { PaginationParams, RequestContext } from "@/shared/types/api";
import { auditService } from "@/shared/services/audit.service";
import { emitDomainEvent } from "@/shared/events/emit";
import { DomainEventType } from "@/shared/events/types";
import { buildPaginationMeta } from "@/shared/utils/pagination";

export class MeetingService {
  async list(params: PaginationParams) {
    const { data, total } = await meetingRepository.findMany(params);
    return { data, pagination: buildPaginationMeta(total, params.page, params.limit) };
  }

  async getById(id: string) {
    const meeting = await meetingRepository.findById(id);
    if (!meeting) throw new NotFoundError("Reunião não encontrada.", "MEETING_NOT_FOUND");
    return meeting;
  }

  async create(input: CreateMeetingInput, ctx: RequestContext) {
    const meeting = await meetingRepository.create(input);
    await auditService.logCreate("Meeting", meeting.id, ctx);
    return meeting;
  }

  async update(id: string, input: UpdateMeetingInput, ctx: RequestContext) {
    const previous = await this.getById(id);
    const meeting = await meetingRepository.update(id, input);
    await auditService.logUpdate("Meeting", id, ctx, { changes: input });
    if (input.status === "CONCLUIDA" && previous.status !== "CONCLUIDA") {
      await emitDomainEvent({
        type: DomainEventType.MEETING_FINISHED,
        payload: {
          meetingId: meeting.id,
          clienteId: meeting.clienteId,
          projetoId: meeting.projetoId,
          titulo: meeting.titulo,
        },
        context: ctx,
      });
    }
    return meeting;
  }

  async remove(id: string, ctx: RequestContext) {
    await this.getById(id);
    await meetingRepository.softDelete(id);
    await auditService.logDelete("Meeting", id, ctx);
  }
}

export const meetingService = new MeetingService();
