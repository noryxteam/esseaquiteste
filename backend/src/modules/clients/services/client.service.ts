import { NotFoundError } from "@/shared/types/errors";
import { clientRepository } from "@/modules/clients/repositories/client.repository";
import type { CreateClientInput, UpdateClientInput } from "@/modules/clients/validators/client.validator";
import type { PaginationParams, RequestContext } from "@/shared/types/api";
import { auditService } from "@/shared/services/audit.service";
import { emitDomainEvent } from "@/shared/events/emit";
import { DomainEventType } from "@/shared/events/types";
import { buildPaginationMeta } from "@/shared/utils/pagination";

export class ClientService {
  async list(params: PaginationParams) {
    const { data, total } = await clientRepository.findMany(params);
    const enriched = await Promise.all(
      data.map(async (client) => {
        const valorTotal = await clientRepository.sumProjectValue(client.id);
        const withCount = client as typeof client & { _count?: { projects: number } };
        return {
          ...client,
          valorTotal,
          quantidadeProjetos: withCount._count?.projects ?? 0,
        };
      })
    );
    return { data: enriched, pagination: buildPaginationMeta(total, params.page, params.limit) };
  }

  async getById(id: string) {
    const client = await clientRepository.findById(id);
    if (!client) throw new NotFoundError("Cliente não encontrado.", "CLIENT_NOT_FOUND");
    const valorTotal = await clientRepository.sumProjectValue(id);
    return { ...client, valorTotal, quantidadeProjetos: client.projects?.length ?? 0 };
  }

  async create(input: CreateClientInput, ctx: RequestContext) {
    const client = await clientRepository.create(input);
    await auditService.logCreate("Client", client.id, ctx);
    await emitDomainEvent({
      type: DomainEventType.CLIENT_CREATED,
      payload: { clientId: client.id, empresa: client.empresa, nome: client.nome },
      context: ctx,
    });
    return client;
  }

  async update(id: string, input: UpdateClientInput, ctx: RequestContext) {
    await this.getById(id);
    const previous = await clientRepository.findById(id);
    const client = await clientRepository.update(id, input);
    await auditService.logUpdate("Client", id, ctx, { changes: input });
    if (input.status && previous && input.status !== previous.status) {
      await auditService.logStatusChange("Client", id, ctx, previous.status, input.status);
    }
    await emitDomainEvent({
      type: DomainEventType.CLIENT_UPDATED,
      payload: { clientId: id, empresa: client.empresa, changes: input as Record<string, unknown> },
      context: ctx,
    });
    return client;
  }

  async remove(id: string, ctx: RequestContext) {
    await this.getById(id);
    await clientRepository.softDelete(id);
    await auditService.logDelete("Client", id, ctx);
  }
}

export const clientService = new ClientService();
