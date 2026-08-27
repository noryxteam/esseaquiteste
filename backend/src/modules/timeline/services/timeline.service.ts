import { NotFoundError } from "@/shared/types/errors";
import { timelineRepository } from "@/modules/timeline/repositories/timeline.repository";
import type { CreateTimelineInput } from "@/modules/timeline/validators/timeline.validator";
import type { PaginationParams } from "@/shared/types/api";
import { buildPaginationMeta } from "@/shared/utils/pagination";

export class TimelineModuleService {
  async list(params: PaginationParams) {
    const { data, total } = await timelineRepository.findMany(params);
    return { data, pagination: buildPaginationMeta(total, params.page, params.limit) };
  }

  async getById(id: string) {
    const event = await timelineRepository.findById(id);
    if (!event) throw new NotFoundError("Evento não encontrado.", "TIMELINE_NOT_FOUND");
    return event;
  }

  async create(input: CreateTimelineInput) {
    return timelineRepository.create(input);
  }
}

export const timelineModuleService = new TimelineModuleService();
