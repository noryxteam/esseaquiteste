"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type ModalType =
  | "novo-cliente"
  | "editar-cliente"
  | "nova-negociacao"
  | "qualificar"
  | "escopo"
  | "proposta"
  | "resposta"
  | "contrato"
  | "pagamento"
  | "converter-projeto"
  | "interacao"
  | "kickoff"
  | "material"
  | "bloqueio"
  | "apresentar"
  | "feedback"
  | "aprovacao"
  | "entrega"
  | "garantia"
  | "registrar-pagamento"
  | null;

interface ModalContextType {
  modal: ModalType;
  modalData: Record<string, string>;
  openModal: (type: ModalType, data?: Record<string, string>) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<Record<string, string>>({});

  const openModal = (type: ModalType, data: Record<string, string> = {}) => {
    setModal(type);
    setModalData(data);
  };

  const closeModal = () => {
    setModal(null);
    setModalData({});
  };

  return (
    <ModalContext.Provider value={{ modal, modalData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
