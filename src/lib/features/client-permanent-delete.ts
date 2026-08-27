/**
 * Exclusão permanente de cliente (ficha + contratos + setup + estrutura).
 *
 * Quando o usuário pedir para RETIRAR o botão Excluir:
 * 1. Defina CLIENT_PERMANENT_DELETE_ENABLED = false
 * 2. Isso some o botão E anula toda a lógica de delete (no-op).
 * Não basta esconder o botão — a flag desativa o recurso por completo.
 */
export const CLIENT_PERMANENT_DELETE_ENABLED = true;
