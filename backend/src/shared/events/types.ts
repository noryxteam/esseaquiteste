import type { RequestContext } from "@/shared/types/api";

export enum DomainEventType {
  CLIENT_CREATED = "CLIENT_CREATED",
  CLIENT_UPDATED = "CLIENT_UPDATED",
  PROJECT_CREATED = "PROJECT_CREATED",
  PROJECT_UPDATED = "PROJECT_UPDATED",
  PROJECT_COMPLETED = "PROJECT_COMPLETED",
  CONTRACT_CREATED = "CONTRACT_CREATED",
  CONTRACT_STATUS_CHANGED = "CONTRACT_STATUS_CHANGED",
  CONTRACT_SIGNED = "CONTRACT_SIGNED",
  PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  MEETING_FINISHED = "MEETING_FINISHED",
  BRIEFING_CREATED = "BRIEFING_CREATED",
  FILE_UPLOADED = "FILE_UPLOADED",
  TASK_COMPLETED = "TASK_COMPLETED",
  TASK_CREATED = "TASK_CREATED",
}

/** Módulos afetados — preparado para invalidação via WebSocket */
export type AffectedModule =
  | "dashboard"
  | "clients"
  | "projects"
  | "contracts"
  | "meetings"
  | "briefings"
  | "finance"
  | "files"
  | "tasks"
  | "reports"
  | "timeline"
  | "notifications"
  | "search";

export interface DomainEvent<T extends DomainEventType = DomainEventType> {
  type: T;
  payload: EventPayloadMap[T];
  context?: RequestContext;
  affectedModules: AffectedModule[];
  timestamp: Date;
}

export type AnyDomainEvent = {
  [K in DomainEventType]: DomainEvent<K>;
}[DomainEventType];

export interface EventPayloadMap {
  [DomainEventType.CLIENT_CREATED]: {
    clientId: string;
    empresa: string;
    nome: string;
  };
  [DomainEventType.CLIENT_UPDATED]: {
    clientId: string;
    empresa: string;
    changes: Record<string, unknown>;
  };
  [DomainEventType.PROJECT_CREATED]: {
    projectId: string;
    clienteId: string;
    nome: string;
    responsavelId: string;
  };
  [DomainEventType.PROJECT_UPDATED]: {
    projectId: string;
    clienteId: string;
    nome: string;
    status: string;
  };
  [DomainEventType.PROJECT_COMPLETED]: {
    projectId: string;
    clienteId: string;
    nome: string;
  };
  [DomainEventType.CONTRACT_CREATED]: {
    contractId: string;
    clienteId: string;
    projetoId: string;
    numeroContrato: string;
    valor: number;
  };
  [DomainEventType.CONTRACT_STATUS_CHANGED]: {
    contractId: string;
    clienteId: string;
    projetoId: string;
    numeroContrato: string;
    from: string;
    to: string;
  };
  [DomainEventType.CONTRACT_SIGNED]: {
    contractId: string;
    clienteId: string;
    projetoId: string;
    numeroContrato: string;
  };
  [DomainEventType.PAYMENT_CONFIRMED]: {
    movementId: string;
    clienteId: string;
    contratoId: string | null;
    valor: number;
    descricao: string;
  };
  [DomainEventType.PAYMENT_PENDING]: {
    movementId: string;
    clienteId: string;
    contratoId: string | null;
    descricao: string;
  };
  [DomainEventType.MEETING_FINISHED]: {
    meetingId: string;
    clienteId: string;
    projetoId: string;
    titulo: string;
    briefingId?: string;
    taskIds?: string[];
  };
  [DomainEventType.BRIEFING_CREATED]: {
    briefingId: string;
    clienteId: string;
    projetoId: string;
  };
  [DomainEventType.FILE_UPLOADED]: {
    fileId: string;
    clienteId: string;
    projetoId: string;
    nome: string;
    contratoId?: string | null;
  };
  [DomainEventType.TASK_COMPLETED]: {
    taskId: string;
    clienteId: string;
    projetoId: string;
    titulo: string;
  };
  [DomainEventType.TASK_CREATED]: {
    taskId: string;
    clienteId: string;
    projetoId: string;
    titulo: string;
  };
}

export type DomainEventHandler = (event: AnyDomainEvent) => Promise<void>;
