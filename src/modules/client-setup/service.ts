import { getSeedData } from "@/mock/seed";
import { electronicContractService } from "@/modules/electronic-contracts/service";
import type { ElectronicContract } from "@/modules/electronic-contracts";
import {
  completeClientSetup,
  ensureClientSetupDraft,
  getClientSetup,
  isClientSetupComplete,
  updateClientSetup,
  reopenClientSetup,
} from "@/modules/client-setup/store";
import type {
  ClientPersonalData,
  PaymentConfig,
  ServiceInfo,
} from "@/modules/client-setup/types";
import { buildAutoContractFromSetup } from "@/modules/contract-builder/auto-generate";
import { syncDraftContractsFromClientSetup } from "@/modules/contract-builder/sync-drafts";
import type { ContractTemplateKind } from "@/modules/contract-builder/types";
import { persistElectronicContract } from "@/mock/electronic-contracts/store";
import type { MockProject } from "@/mock/projects/types";

export const clientSetupService = {
  get(clientId: string) {
    return getClientSetup(clientId);
  },

  isComplete(clientId: string) {
    return isClientSetupComplete(clientId);
  },

  ensureDraft(clientId: string, seed?: Partial<ClientPersonalData>) {
    return ensureClientSetupDraft(clientId, seed);
  },

  savePersonal(clientId: string, personal: Partial<ClientPersonalData>) {
    const current = ensureClientSetupDraft(clientId);
    return updateClientSetup(clientId, {
      personal: { ...current.personal, ...personal },
    });
  },

  saveService(clientId: string, service: Partial<ServiceInfo>) {
    const current = ensureClientSetupDraft(clientId);
    return updateClientSetup(clientId, {
      service: { ...current.service, ...service },
    });
  },

  savePayment(clientId: string, payment: Partial<PaymentConfig>) {
    const current = ensureClientSetupDraft(clientId);
    return updateClientSetup(clientId, {
      payment: { ...current.payment, ...payment },
    });
  },

  complete(clientId: string) {
    const profile = completeClientSetup(clientId);
    syncDraftContractsFromClientSetup(profile);
    return profile;
  },

  reopen(clientId: string) {
    return reopenClientSetup(clientId);
  },

  developContract(
    clientId: string,
    templateKind: ContractTemplateKind = "site_institucional"
  ): ElectronicContract {
    const profile = getClientSetup(clientId);
    if (!profile?.setupComplete) {
      throw new Error("Conclua o assistente de configuração antes de gerar o contrato.");
    }

    const payload = buildAutoContractFromSetup(profile, templateKind);
    const seed = getSeedData();

    let project = seed.projects.find(
      (p) => p.clienteId === clientId && p.nome === payload.projetoNome
    );

    if (!project) {
      const admin = seed.users.find((u) => u.role === "administrador") ?? seed.users[0];
      const id = `prj-auto-${Date.now().toString(36)}`;
      const created: MockProject = {
        id,
        clienteId: clientId,
        nome: payload.projetoNome,
        descricao: profile.service.tipoServico,
        status: "planejamento",
        progresso: 0,
        responsavelId: payload.responsavelId || admin.id,
        responsavel: payload.responsavelNome || admin.nome,
        dataInicio: profile.service.dataInicio,
        prazo: profile.service.prazoPrevisto || profile.service.dataInicio,
        prioridade: "media",
        valor: payload.valor,
        briefingId: null,
        contratoId: null,
      };
      seed.projects.unshift(created);
      project = created;
    }

    const responsavelId =
      payload.responsavelId ||
      project.responsavelId ||
      seed.users.find((u) => u.role === "administrador")?.id ||
      seed.users[0].id;

    const base = electronicContractService.create({
      clienteId: clientId,
      projetoId: project.id,
      titulo: payload.titulo,
      valor: payload.valor,
      formaPagamento: payload.formaPagamento,
      parcelas: payload.parcelas,
      prazo: payload.prazo,
      responsavelId,
    });

    base.clausulas = []; // usuário escreve título e descrição no editor
    base.variaveis = {
      cliente: payload.variaveis.cliente,
      empresa: payload.variaveis.empresa,
      cpf: payload.variaveis.cpf,
      cnpj: payload.variaveis.cnpj,
      valor: payload.variaveis.valor,
      data: payload.variaveis.data,
      projeto: payload.variaveis.projeto,
      endereco: payload.variaveis.endereco,
      telefone: payload.variaveis.telefone,
      email: payload.variaveis.email,
    };
    base.editorSettings = {
      cabecalho: `${profile.norax.razaoSocial} — Contrato de Prestação de Serviços`,
      rodape: `Documento gerado pela Norax Agency OS · ${profile.norax.cnpj}`,
    };
    base.campos = [
      {
        id: "sig-contratante",
        tipo: "assinatura",
        label: "Assinatura do CONTRATANTE",
        obrigatorio: true,
      },
      {
        id: "sig-contratada",
        tipo: "assinatura",
        label: "Assinatura da CONTRATADA (Norax)",
        obrigatorio: true,
      },
    ];
    persistElectronicContract(base);
    project.contratoId = base.id;
    // Sync fica a cargo do caller (ensureContractSyncedInBackend) com o payload final —
    // evita corrida com o sync em background do create().

    return base;
  },
};
