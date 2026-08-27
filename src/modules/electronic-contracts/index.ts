export { electronicContractService } from "@/modules/electronic-contracts/service";
export type {
  ElectronicContract,
  ElectronicContractStatus,
  ContractLifecycleStep,
  ContractClause,
  ContractFillableField,
  ContractVariableValues,
  ContractSignatureRecord,
  AuthorizedDevice,
  ContractTimelineEntry,
  ContractEditorSettings,
} from "@/mock/electronic-contracts/types";
export { CONTRACT_VARIABLES } from "@/mock/electronic-contracts/types";
export { LIFECYCLE_LABELS, LIFECYCLE_ORDER } from "@/mock/electronic-contracts/lifecycle";
export { toContractDocumentData } from "@/modules/electronic-contracts/adapter";
