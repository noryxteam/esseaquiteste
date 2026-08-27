export type {
  ClauseBlock,
  ContractTemplateKind,
  ContractTemplateDef,
  ContractPageLayout,
} from "@/modules/contract-builder/types";
export {
  CONTRACT_TEMPLATES,
  getTemplate,
  materializeTemplate,
  renumberBlocks,
  formatBlockNumber,
} from "@/modules/contract-builder/templates";
export { paginateClauseBlocks } from "@/modules/contract-builder/pagination";
export {
  buildAutoContractFromSetup,
  buildVariablesFromSetup,
  blocksToClauses,
} from "@/modules/contract-builder/auto-generate";
export { syncDraftContractsFromClientSetup } from "@/modules/contract-builder/sync-drafts";
export { ClauseBlockEditor } from "@/modules/contract-builder/components/ClauseBlockEditor";
export { SignatureBlock } from "@/modules/contract-builder/components/SignatureBlock";
export { ContractTemplatePicker } from "@/modules/contract-builder/components/ContractTemplatePicker";
