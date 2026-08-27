import type { ContractViewData } from "@/lib/mock-data/contract-view-types";

export type ContractPageType = "cover" | "content" | "signatures" | "certificate";

export interface ContractSection {
  number: string;
  title: string;
  paragraphs: string[];
}

export interface ContractPageContent {
  id: number;
  type: ContractPageType;
  sections?: ContractSection[];
  title?: string;
}

export interface ContractDocumentData extends ContractViewData {
  totalPages: number;
  pages: ContractPageContent[];
  accessCode: string;
  shareLink: string;
  qrValue: string;
  history: ContractHistoryEvent[];
}

export interface ContractViewerState {
  currentPage: number;
  zoom: number;
  textScale: number;
  fitWidth: boolean;
  fullscreen: boolean;
}

export interface ContractHistoryEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  responsible: string;
}
