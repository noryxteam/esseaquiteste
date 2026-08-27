import { apiFetch } from "@/modules/auth/api/auth.api";
import { emitIntegrationEvent } from "@/modules/integration/emit";
import { DomainEventType } from "@/modules/integration/types";
import type { SearchResultItem } from "@/modules/integration/types";

export interface GlobalSearchResponse {
  query: string;
  total: number;
  results: SearchResultItem[];
}

export const integrationApi = {
  search(query: string) {
    return apiFetch<GlobalSearchResponse>(`/search?q=${encodeURIComponent(query)}`);
  },
};

/** Ponte API → eventos locais após mutações bem-sucedidas */
export const integrationBridge = {
  onClientCreated(payload: { clientId: string; empresa: string; nome: string }) {
    return emitIntegrationEvent(DomainEventType.CLIENT_CREATED, payload);
  },
  onProjectCreated(payload: { projectId: string; clienteId: string; nome: string }) {
    return emitIntegrationEvent(DomainEventType.PROJECT_CREATED, payload);
  },
  onContractSigned(payload: { contractId: string; numeroContrato: string; clienteId: string }) {
    return emitIntegrationEvent(DomainEventType.CONTRACT_SIGNED, payload);
  },
  onPaymentConfirmed(payload: { movementId: string; descricao: string; valor: number }) {
    return emitIntegrationEvent(DomainEventType.PAYMENT_CONFIRMED, payload);
  },
  onMeetingFinished(payload: {
    meetingId: string;
    titulo: string;
    clienteId: string;
    projetoId: string;
  }) {
    return emitIntegrationEvent(DomainEventType.MEETING_FINISHED, payload);
  },
};
