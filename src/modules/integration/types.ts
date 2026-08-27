/** Espelha os eventos de domínio do backend — preparado para WebSocket */
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
  /** Evento interno do frontend — invalida estado global */
  STATE_INVALIDATED = "STATE_INVALIDATED",
}

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
  | "search"
  | "sidebar";

export interface EventPayloadMap {
  [DomainEventType.CLIENT_CREATED]: { clientId: string; empresa: string; nome: string };
  [DomainEventType.CLIENT_UPDATED]: { clientId: string; empresa: string };
  [DomainEventType.PROJECT_CREATED]: {
    projectId: string;
    clienteId: string;
    nome: string;
  };
  [DomainEventType.PROJECT_UPDATED]: {
    projectId: string;
    clienteId: string;
    nome: string;
    status: string;
  };
  [DomainEventType.PROJECT_COMPLETED]: { projectId: string; clienteId: string; nome: string };
  [DomainEventType.CONTRACT_CREATED]: {
    contractId: string;
    clienteId: string;
    projetoId: string;
    numeroContrato: string;
  };
  [DomainEventType.CONTRACT_STATUS_CHANGED]: {
    contractId: string;
    numeroContrato: string;
    from: string;
    to: string;
  };
  [DomainEventType.CONTRACT_SIGNED]: {
    contractId: string;
    numeroContrato: string;
    clienteId: string;
  };
  [DomainEventType.PAYMENT_CONFIRMED]: {
    movementId: string;
    descricao: string;
    valor: number;
  };
  [DomainEventType.PAYMENT_PENDING]: { movementId: string; descricao: string };
  [DomainEventType.MEETING_FINISHED]: {
    meetingId: string;
    titulo: string;
    clienteId: string;
    projetoId: string;
  };
  [DomainEventType.BRIEFING_CREATED]: {
    briefingId: string;
    clienteId: string;
    projetoId: string;
  };
  [DomainEventType.FILE_UPLOADED]: {
    fileId: string;
    nome: string;
    clienteId: string;
    projetoId: string;
  };
  [DomainEventType.TASK_COMPLETED]: { taskId: string; titulo: string };
  [DomainEventType.TASK_CREATED]: { taskId: string; titulo: string };
  [DomainEventType.STATE_INVALIDATED]: { modules: AffectedModule[] };
}

export interface DomainEvent<T extends DomainEventType = DomainEventType> {
  type: T;
  payload: EventPayloadMap[T];
  affectedModules: AffectedModule[];
  timestamp: Date;
}

export type AnyDomainEvent = {
  [K in DomainEventType]: DomainEvent<K>;
}[DomainEventType];

export type DomainEventHandler = (event: AnyDomainEvent) => void | Promise<void>;

export interface SearchResultItem {
  id: string;
  type: "client" | "project" | "contract" | "meeting" | "file" | "briefing" | "user";
  title: string;
  subtitle: string;
  link: string;
}
