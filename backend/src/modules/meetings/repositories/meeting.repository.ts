import { prisma } from "@/database";
import type { PaginationParams } from "@/shared/types/api";
import { buildSearchOr, mergeWhere, paginatedQuery, softDeleteWhere } from "@/shared/repositories/base.repository";
import type { CreateMeetingInput, UpdateMeetingInput } from "@/modules/meetings/validators/meeting.validator";

const SORT_FIELDS = ["createdAt", "data", "titulo", "status"];
const SEARCH_FIELDS = ["titulo"];
const include = {
  cliente: { select: { id: true, empresa: true } },
  projeto: { select: { id: true, nome: true } },
  participantes: { include: { user: { select: { id: true, nome: true, email: true } } } },
};

export class MeetingRepository {
  async findMany(params: PaginationParams) {
    const where = mergeWhere(softDeleteWhere(), buildSearchOr(params.search, SEARCH_FIELDS), params.filters);
    return paginatedQuery(
      (args) => prisma.meeting.findMany({ ...args, include }),
      (args) => prisma.meeting.count(args),
      where, params, SORT_FIELDS, "data"
    );
  }

  async findById(id: string) {
    return prisma.meeting.findFirst({ where: { id, ...softDeleteWhere() }, include });
  }

  async create(data: CreateMeetingInput) {
    const { participantIds, ...rest } = data;
    return prisma.meeting.create({
      data: {
        ...rest,
        participantes: participantIds?.length
          ? { create: participantIds.map((userId) => ({ userId })) }
          : undefined,
      },
      include,
    });
  }

  async update(id: string, data: UpdateMeetingInput) {
    const { participantIds, ...rest } = data;
    if (participantIds) {
      await prisma.meetingParticipant.deleteMany({ where: { meetingId: id } });
      if (participantIds.length) {
        await prisma.meetingParticipant.createMany({
          data: participantIds.map((userId) => ({ meetingId: id, userId })),
        });
      }
    }
    return prisma.meeting.update({ where: { id }, data: rest, include });
  }

  async softDelete(id: string) {
    return prisma.meeting.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

export const meetingRepository = new MeetingRepository();
