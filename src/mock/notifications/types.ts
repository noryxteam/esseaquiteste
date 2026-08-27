export type NotificationType = "info" | "success" | "warning" | "error";

export interface MockNotification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: NotificationType;
  lida: boolean;
  criadoEm: string;
  link: string | null;
  usuarioId: string;
}
