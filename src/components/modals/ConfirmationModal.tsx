"use client";

import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { Modal, type ModalProps } from "./Modal";

export interface ConfirmationModalProps extends Omit<ModalProps, "children" | "footer"> {
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

export function ConfirmationModal({
  open,
  onClose,
  title = "Confirmar ação",
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  loading = false,
  children,
  ...props
}: ConfirmationModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {confirmLabel}
          </Button>
        </>
      }
      {...props}
    >
      {children}
    </Modal>
  );
}

export interface DeleteModalProps extends ConfirmationModalProps {
  itemName?: string;
}

export function DeleteModal({
  itemName,
  title,
  description,
  confirmLabel = "Excluir",
  onConfirm,
  ...props
}: DeleteModalProps) {
  return (
    <ConfirmationModal
      title={title ?? "Excluir item"}
      description={
        description ??
        (itemName
          ? `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`
          : "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.")
      }
      confirmLabel={confirmLabel}
      onConfirm={onConfirm}
      {...props}
    >
      <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
        <Trash2 className="h-4 w-4 text-state-red shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          O item será removido permanentemente do sistema.
        </p>
      </div>
    </ConfirmationModal>
  );
}

export interface SuccessModalProps extends Omit<ModalProps, "footer"> {
  actionLabel?: string;
  onAction?: () => void;
}

export function SuccessModal({
  open,
  onClose,
  title = "Sucesso",
  description,
  actionLabel = "Continuar",
  onAction,
  children,
  ...props
}: SuccessModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <Button
          onClick={() => {
            onAction?.();
            onClose();
          }}
        >
          {actionLabel}
        </Button>
      }
      {...props}
    >
      <div className="flex flex-col items-center text-center py-2">
        <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center mb-3">
          <CheckCircle2 className="h-5 w-5 text-foreground" />
        </div>
        {children}
      </div>
    </Modal>
  );
}

export interface ErrorModalProps extends Omit<ModalProps, "footer"> {
  errorMessage?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorModal({
  open,
  onClose,
  title = "Erro",
  description,
  errorMessage,
  retryLabel = "Tentar novamente",
  onRetry,
  children,
  ...props
}: ErrorModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {onRetry && (
            <Button onClick={onRetry}>{retryLabel}</Button>
          )}
        </>
      }
      {...props}
    >
      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-inset p-3">
        <AlertTriangle className="h-4 w-4 text-foreground/70 shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          {errorMessage ?? children ?? "Ocorreu um erro inesperado. Tente novamente."}
        </div>
      </div>
    </Modal>
  );
}

export function FullscreenModal({
  open,
  onClose,
  title,
  children,
  footer,
  ...props
}: ModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={footer}
      size="full"
      className="max-h-[95vh] w-full max-w-6xl"
      {...props}
    >
      {children}
    </Modal>
  );
}
