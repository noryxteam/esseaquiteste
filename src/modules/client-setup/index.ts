export type {
  ClientSetupProfile,
  ClientPersonalData,
  ServiceInfo,
  PaymentConfig,
  PaymentMethodId,
  NoraxCompanySnapshot,
} from "@/modules/client-setup/types";
export {
  PAYMENT_METHOD_LABELS,
  SERVICE_TYPES,
  BRAZIL_STATES,
} from "@/modules/client-setup/types";
export { clientSetupService } from "@/modules/client-setup/service";
export {
  getClientSetup,
  isClientSetupComplete,
  ensureClientSetupDraft,
  completeClientSetup,
  formatPaymentLabel,
} from "@/modules/client-setup/store";
export { getNoraxCompanySnapshot } from "@/modules/client-setup/norax-company";
export { ClientSetupWizard } from "@/modules/client-setup/components/ClientSetupWizard";
export { WizardShell } from "@/modules/client-setup/components/WizardShell";
