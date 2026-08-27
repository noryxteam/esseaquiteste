import type { MockSettings } from "@/mock/settings/types";
import type { NoraxCompanySnapshot } from "@/modules/client-setup/types";

/** Estende settings da empresa com dados bancários / PIX */
export function getNoraxCompanySnapshot(settings?: MockSettings): NoraxCompanySnapshot {
  const empresa = settings?.empresa;
  return {
    nome: empresa?.nome ?? "Norax",
    razaoSocial: empresa?.razaoSocial ?? "Norax Digital Ltda",
    cnpj: empresa?.cnpj ?? "12.345.678/0001-90",
    email: empresa?.email ?? "contato@norax.dev",
    telefone: empresa?.telefone ?? "(11) 3000-0000",
    endereco: empresa?.endereco ?? "Av. Paulista, 1000 — Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    banco: empresa?.banco ?? "Banco Inter",
    agencia: empresa?.agencia ?? "0001",
    conta: empresa?.conta ?? "12345678-9",
    chavePix: empresa?.chavePix ?? empresa?.email ?? "financeiro@norax.dev",
    destinatarioPix: empresa?.destinatarioPix ?? empresa?.razaoSocial ?? "Norax Digital Ltda",
  };
}
