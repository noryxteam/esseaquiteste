import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
/** Shared size scale across design system primitives. */
export type Size = "xs" | "sm" | "md" | "lg" | "xl";

/** Button visual variants. */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

/** Semantic status dot colors — used sparingly for information, not decoration. */
export type StatusColor = "default" | "blue" | "green" | "orange" | "red" | "purple" | "neutral";

/** Generic entity status used by StatusBadge. */
export type EntityStatus =
  | "active"
  | "inactive"
  | "pending"
  | "completed"
  | "cancelled"
  | "draft"
  | "archived"
  | "error";

/** Action / task priority levels. */
export type Priority = "low" | "medium" | "high" | "urgent" | "urgente" | "atencao" | "informativo";

/** Financial payment statuses. */
export type PaymentStatus = "recebido" | "pendente" | "pago" | "parcial" | "atrasado";

/** Contract lifecycle statuses. */
export type ContractStatus =
  | "rascunho"
  | "aguardando-assinatura"
  | "enviado"
  | "assinado"
  | "finalizado"
  | "cancelado"
  | "arquivado"
  | "expirado";

/** Meeting statuses. */
export type MeetingStatus = "agendada" | "em-andamento" | "concluida";

/** Text weight variants. */
export type TextWeight = "normal" | "medium" | "semibold";

/** Text tone variants. */
export type TextTone = "default" | "secondary" | "muted" | "danger" | "success";

export interface SlotProps {
  children?: ReactNode;
  className?: string;
}

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export type NoraxButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: Size;
  loading?: boolean;
};

export type NoraxInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: Size;
  error?: boolean;
  label?: string;
  hint?: string;
};

export type NoraxTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
  size?: Size;
  error?: boolean;
  label?: string;
  hint?: string;
};

export type NoraxDivProps = HTMLAttributes<HTMLDivElement>;

export interface AvatarUser {
  id?: string;
  name: string;
  initials?: string;
  imageUrl?: string;
}
