/**
 * Camada preparatória para WebSocket / SSE.
 * Hoje emite eventos locais; no futuro basta conectar o transport remoto.
 */

export type TimelineRealtimeEvent = {
  type: "timeline.updated" | "project.progress" | "project.finalized";
  projectId: string;
  at: string;
  progress?: number;
};

type Listener = (event: TimelineRealtimeEvent) => void;

const listeners = new Set<Listener>();

export function subscribeTimelineRealtime(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitTimelineRealtime(event: TimelineRealtimeEvent): void {
  listeners.forEach((l) => {
    try {
      l(event);
    } catch {
      // listener isolado
    }
  });
}
