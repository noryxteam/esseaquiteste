import { NotFoundError } from "@/shared/types/errors";
import { financeRepository } from "@/modules/finance/repositories/finance.repository";
import type { CreateFinanceInput, UpdateFinanceInput } from "@/modules/finance/validators/finance.validator";
import type { PaginationParams, RequestContext } from "@/shared/types/api";
import { auditService } from "@/shared/services/audit.service";
import { emitDomainEvent } from "@/shared/events/emit";
import { DomainEventType } from "@/shared/events/types";
import { buildPaginationMeta } from "@/shared/utils/pagination";

export class FinanceService {
  async list(params: PaginationParams) {
    const { data, total } = await financeRepository.findMany(params);
    return { data, pagination: buildPaginationMeta(total, params.page, params.limit) };
  }

  async getById(id: string) {
    const movement = await financeRepository.findById(id);
    if (!movement) throw new NotFoundError("Movimentação não encontrada.", "FINANCE_NOT_FOUND");
    return movement;
  }

  async create(input: CreateFinanceInput, ctx: RequestContext) {
    const movement = await financeRepository.create(input);
    await auditService.logCreate("FinanceMovement", movement.id, ctx);
    await this.emitFinanceEvents(movement, ctx);
    return movement;
  }

  async update(id: string, input: UpdateFinanceInput, ctx: RequestContext) {
    const previous = await this.getById(id);
    const movement = await financeRepository.update(id, input);
    await auditService.logUpdate("FinanceMovement", id, ctx, { changes: input });
    if (input.status && input.status !== previous.status) {
      await auditService.logStatusChange("FinanceMovement", id, ctx, previous.status, input.status);
    }
    await this.emitFinanceEvents(movement, ctx);
    return movement;
  }

  private async emitFinanceEvents(
    movement: Awaited<ReturnType<typeof financeRepository.create>>,
    ctx: RequestContext
  ) {
    if (movement.tipo === "RECEITA" && movement.status === "PAGO") {
      await emitDomainEvent({
        type: DomainEventType.PAYMENT_CONFIRMED,
        payload: {
          movementId: movement.id,
          clienteId: movement.clienteId,
          contratoId: movement.contratoId,
          valor: Number(movement.valor),
          descricao: movement.descricao,
        },
        context: ctx,
      });
    } else if (
      movement.tipo === "RECEITA" &&
      (movement.status === "PENDENTE" || movement.status === "ATRASADO")
    ) {
      await emitDomainEvent({
        type: DomainEventType.PAYMENT_PENDING,
        payload: {
          movementId: movement.id,
          clienteId: movement.clienteId,
          contratoId: movement.contratoId,
          descricao: movement.descricao,
        },
        context: ctx,
      });
    }
  }

  async remove(id: string, ctx: RequestContext) {
    await this.getById(id);
    await financeRepository.softDelete(id);
    await auditService.logDelete("FinanceMovement", id, ctx);
  }
}

export const financeService = new FinanceService();
