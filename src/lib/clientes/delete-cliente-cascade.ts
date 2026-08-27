import { CLIENT_PERMANENT_DELETE_ENABLED } from "@/lib/features/client-permanent-delete";
import { removeCliente } from "@/lib/mock-data/clientes";
import { deleteClientSetup } from "@/modules/client-setup/store";
import { removeClientStructure } from "@/modules/client-setup/bootstrap-client";
import { deleteElectronicContractsByClienteId } from "@/mock/electronic-contracts/store";
import { deleteFormsByClientId } from "@/modules/client-forms/store";

/**
 * Apaga a ficha do cliente e tudo ligado a ela (setup, contratos, formulários, estrutura).
 * No-op se CLIENT_PERMANENT_DELETE_ENABLED = false.
 */
export function deleteClienteCascade(clienteId: string): boolean {
  if (!CLIENT_PERMANENT_DELETE_ENABLED) return false;
  if (!clienteId) return false;

  removeCliente(clienteId);
  deleteClientSetup(clienteId);
  deleteElectronicContractsByClienteId(clienteId);
  deleteFormsByClientId(clienteId);
  removeClientStructure(clienteId);
  return true;
}
