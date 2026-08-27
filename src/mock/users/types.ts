export type UserRole =
  | "administrador"
  | "designer"
  | "desenvolvedor"
  | "financeiro"
  | "comercial"
  | "cliente";

export interface MockUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  initials: string;
  ativo: boolean;
  criadoEm: string;
}
