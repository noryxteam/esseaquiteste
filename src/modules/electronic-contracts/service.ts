import type {
  ContractClause,
  ContractEditorSettings,
  ContractFillableField,
  ContractSignatureRecord,
  ElectronicContract,
} from "@/mock/electronic-contracts/types";
import { canAdvanceTo, hasReachedStep, LIFECYCLE_LABELS } from "@/mock/electronic-contracts/lifecycle";
import { resolveClausulas } from "@/mock/electronic-contracts/variables";
import {
  createContractNumber,
  createElectronicContractId,
  generateAccessCode,
  generateDocumentHash,
  generateUniqueSlug,
  getAllElectronicContracts,
  getElectronicContract,
  getShareLink,
  nowBR,
  persistElectronicContract,
} from "@/mock/electronic-contracts/store";
import { getSeedData } from "@/mock/seed";
import { emitIntegrationEvent } from "@/modules/integration/emit";
import { DomainEventType } from "@/modules/integration/types";
import {
  getDeviceFingerprint,
  getDeviceLabel,
} from "@/mock/electronic-contracts/utils";
import { syncElectronicContractInBackground } from "@/modules/electronic-contracts/sync-api";

function pushTimeline(
  contract: ElectronicContract,
  step: ElectronicContract["lifecycleStep"],
  usuario: string,
  descricao?: string
): void {
  const { date, time } = nowBR();
  contract.timeline.unshift({
    id: `tl-${step}-${Date.now()}`,
    step,
    titulo: LIFECYCLE_LABELS[step],
    descricao: descricao ?? LIFECYCLE_LABELS[step],
    data: date,
    hora: time,
    usuario,
  });
}

function pushSecurityLog(
  contract: ElectronicContract,
  acao: string,
  opts?: { dispositivoId?: string; codigoUtilizado?: boolean }
): void {
  const { date, time } = nowBR();
  contract.securityLogs.unshift({
    id: `sec-${Date.now()}`,
    data: date,
    hora: time,
    acao,
    dispositivoId: opts?.dispositivoId,
    codigoUtilizado: opts?.codigoUtilizado,
    versao: contract.versao,
    hashDocumento: contract.hashDocumento,
  });
}

function advance(
  contract: ElectronicContract,
  step: ElectronicContract["lifecycleStep"],
  usuario: string,
  descricao?: string
): void {
  if (!canAdvanceTo(contract.lifecycleStep, step)) {
    throw new Error(`Não é possível avançar de ${contract.lifecycleStep} para ${step}`);
  }
  contract.lifecycleStep = step;
  pushTimeline(contract, step, usuario, descricao);
  pushSecurityLog(contract, LIFECYCLE_LABELS[step]);
}

/** Registro de etapa sem exigir ordem estrita (assinaturas independentes). */
function recordMilestone(
  contract: ElectronicContract,
  step: ElectronicContract["lifecycleStep"],
  usuario: string,
  descricao?: string
): void {
  contract.lifecycleStep = step;
  pushTimeline(contract, step, usuario, descricao);
  pushSecurityLog(contract, LIFECYCLE_LABELS[step]);
}

export const electronicContractService = {
  getById(idOrSlug: string): ElectronicContract | undefined {
    const contract = getElectronicContract(idOrSlug);
    if (!contract) return undefined;
    if (!contract.accessCode) {
      contract.accessCode = generateAccessCode();
      persistElectronicContract(contract);
      syncElectronicContractInBackground(contract);
    }
    return contract;
  },

  list(): ElectronicContract[] {
    return getAllElectronicContracts();
  },

  create(input: {
    clienteId: string;
    projetoId: string;
    titulo: string;
    valor: number;
    formaPagamento: string;
    parcelas: number;
    prazo: string;
    responsavelId: string;
  }): ElectronicContract {
    const seed = getSeedData();
    const client = seed.clients.find((c) => c.id === input.clienteId);
    const project = seed.projects.find((p) => p.id === input.projetoId);
    const responsavel = seed.users.find((u) => u.id === input.responsavelId);
    const slugs = new Set(getAllElectronicContracts().map((c) => c.uniqueSlug));
    const id = createElectronicContractId();
    const { date } = nowBR();

    const contract: ElectronicContract = {
      id,
      numeroContrato: createContractNumber(),
      clienteId: input.clienteId,
      projetoId: input.projetoId,
      titulo: input.titulo,
      valor: input.valor,
      formaPagamento: input.formaPagamento,
      parcelas: input.parcelas,
      prazo: input.prazo,
      responsavelId: input.responsavelId,
      responsavelNome: responsavel?.nome ?? "Responsável",
      status: "rascunho",
      lifecycleStep: "criado",
      versao: 0,
      isImmutable: false,
      uniqueSlug: generateUniqueSlug(slugs),
      accessCode: generateAccessCode(),
      accessCodeUsed: false,
      shareLink: "",
      hashDocumento: "",
      dataCriacao: date,
      dataEnvio: null,
      dataAssinatura: null,
      clausulas: [],
      campos: [],
      variaveis: {
        cliente: client?.nome ?? "",
        empresa: client?.empresa ?? "",
        cpf: client?.nome ?? "",
        cnpj: "00.000.000/0001-00",
        valor: input.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        data: date,
        projeto: project?.nome ?? "",
        endereco: `${client?.cidade ?? ""}, ${client?.estado ?? ""}`,
        telefone: client?.telefone ?? "",
        email: client?.email ?? "",
      },
      editorSettings: {},
      assinaturas: [],
      dispositivosAutorizados: [],
      solicitacoesDispositivo: [],
      timeline: [],
      securityLogs: [],
      pdfUrl: null,
      conteudoResolvido: false,
    };

    pushTimeline(contract, "criado", responsavel?.nome ?? "Sistema");
    persistElectronicContract(contract);
    // Sync em background fica a cargo do caller (não bloqueia abertura do editor).
    // await no create travava a UI quando o backend demorava / estava offline.

    void emitIntegrationEvent(DomainEventType.CONTRACT_CREATED, {
      contractId: id,
      clienteId: input.clienteId,
      projetoId: input.projetoId,
      numeroContrato: contract.numeroContrato,
    });

    return contract;
  },

  /** Contrato avulso — sem cliente/projeto cadastrado (ex.: Apaga Logo). */
  createWithClauses(input: {
    titulo: string;
    clausulas: ContractClause[];
    empresa?: string;
    cliente?: string;
    valor?: number;
    prazo?: string;
  }): ElectronicContract {
    const seed = getSeedData();
    const responsavel = seed.users.find((u) => u.role !== "cliente") ?? seed.users[0];
    const slugs = new Set(getAllElectronicContracts().map((c) => c.uniqueSlug));
    const id = createElectronicContractId();
    const { date } = nowBR();
    const valor = input.valor ?? 0;
    const prazo = input.prazo || date;

    const contract: ElectronicContract = {
      id,
      numeroContrato: createContractNumber(),
      clienteId: "standalone",
      projetoId: "standalone",
      titulo: input.titulo,
      valor,
      formaPagamento: "—",
      parcelas: 1,
      prazo,
      responsavelId: responsavel?.id ?? "system",
      responsavelNome: responsavel?.nome ?? "Sistema",
      status: "rascunho",
      lifecycleStep: "editado",
      versao: 0,
      isImmutable: false,
      uniqueSlug: generateUniqueSlug(slugs),
      accessCode: generateAccessCode(),
      accessCodeUsed: false,
      shareLink: "",
      hashDocumento: "",
      dataCriacao: date,
      dataEnvio: null,
      dataAssinatura: null,
      clausulas: input.clausulas,
      campos: [],
      variaveis: {
        cliente: input.cliente ?? "",
        empresa: input.empresa ?? "",
        cpf: "",
        cnpj: "",
        valor: valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        data: date,
        projeto: "",
        endereco: "",
        telefone: "",
        email: "",
      },
      editorSettings: {},
      assinaturas: [],
      dispositivosAutorizados: [],
      solicitacoesDispositivo: [],
      timeline: [],
      securityLogs: [],
      pdfUrl: null,
      conteudoResolvido: false,
    };

    pushTimeline(contract, "criado", contract.responsavelNome);
    pushTimeline(contract, "editado", contract.responsavelNome, "Cláusulas definidas na criação");
    persistElectronicContract(contract);

    void emitIntegrationEvent(DomainEventType.CONTRACT_CREATED, {
      contractId: id,
      clienteId: "standalone",
      projetoId: "standalone",
      numeroContrato: contract.numeroContrato,
    });

    return contract;
  },

  updateContent(
    id: string,
    clausulas: ContractClause[],
    settings: ContractEditorSettings
  ): ElectronicContract {
    const contract = getElectronicContract(id);
    if (!contract) throw new Error("Contrato não encontrado");
    if (contract.isImmutable) throw new Error("Contrato definitivo não pode ser editado");

    contract.clausulas = clausulas;
    contract.editorSettings = settings;
    if (contract.lifecycleStep === "criado") {
      advance(contract, "editado", contract.responsavelNome);
    }
    contract.status = "rascunho";
    persistElectronicContract(contract);
    syncElectronicContractInBackground(contract);
    return contract;
  },

  addFields(id: string, campos: ContractFillableField[]): ElectronicContract {
    const contract = getElectronicContract(id);
    if (!contract) throw new Error("Contrato não encontrado");
    if (contract.isImmutable) throw new Error("Contrato definitivo não pode ser editado");

    contract.campos = campos;
    const from = contract.lifecycleStep;
    if (from === "editado" || from === "criado") {
      if (from === "criado") advance(contract, "editado", contract.responsavelNome);
      advance(contract, "campos_adicionados", contract.responsavelNome);
    }
    persistElectronicContract(contract);
    return contract;
  },

  markReviewed(id: string): ElectronicContract {
    const contract = getElectronicContract(id);
    if (!contract) throw new Error("Contrato não encontrado");
    if (contract.isImmutable) throw new Error("Contrato já é definitivo");

    if (contract.lifecycleStep === "campos_adicionados") {
      advance(contract, "revisado", contract.responsavelNome);
      contract.status = "em-revisao";
    }
    persistElectronicContract(contract);
    return contract;
  },

  finalize(id: string): ElectronicContract {
    const contract = getElectronicContract(id);
    if (!contract) throw new Error("Contrato não encontrado");
    if (contract.isImmutable) throw new Error("Contrato já é definitivo");

    if (contract.lifecycleStep !== "revisado") {
      throw new Error("Revise o documento antes de torná-lo definitivo");
    }

    contract.clausulas = resolveClausulas(contract.clausulas, contract.variaveis);
    contract.conteudoResolvido = true;
    contract.versao = 1;
    contract.isImmutable = true;
    contract.hashDocumento = generateDocumentHash(contract.id, contract.versao);
    contract.shareLink = getShareLink(contract.uniqueSlug);
    contract.status = "definitivo";
    advance(contract, "definitivo", contract.responsavelNome, "Versão imutável v1 gerada");
    persistElectronicContract(contract);
    syncElectronicContractInBackground(contract);
    return contract;
  },

  /**
   * Prepara o contrato para envio ao cliente.
   * Avança automaticamente revisão → definitivo se ainda for rascunho.
   * (Criar o contrato não basta — “definitivo” trava a versão que o cliente assina.)
   */
  prepareForClientSend(id: string): ElectronicContract {
    let contract = getElectronicContract(id);
    if (!contract) throw new Error("Contrato não encontrado");

    if (contract.isImmutable || hasReachedStep(contract.lifecycleStep, "definitivo")) {
      return contract;
    }

    // Garante etapas mínimas até "revisado"
    if (contract.lifecycleStep === "criado") {
      advance(contract, "editado", contract.responsavelNome, "Preparação automática para envio");
    }
    if (contract.lifecycleStep === "editado") {
      advance(
        contract,
        "campos_adicionados",
        contract.responsavelNome,
        "Preparação automática para envio"
      );
    }
    if (contract.lifecycleStep === "campos_adicionados") {
      advance(contract, "revisado", contract.responsavelNome, "Revisão automática para envio");
      contract.status = "em-revisao";
    }

    persistElectronicContract(contract);

    if (!contract.isImmutable && contract.lifecycleStep === "revisado") {
      contract = this.finalize(contract.id);
    }

    return getElectronicContract(id) ?? contract;
  },

  sendToClient(id: string): ElectronicContract {
    const contract = getElectronicContract(id);
    if (!contract) throw new Error("Contrato não encontrado");
    if (!contract.isImmutable) {
      // Segurança: se alguém chamar send direto, prepara antes
      this.prepareForClientSend(id);
    }
    const ready = getElectronicContract(id);
    if (!ready?.isImmutable) {
      throw new Error("Não foi possível gerar a versão definitiva do contrato.");
    }

    ready.accessCode = ready.accessCode || generateAccessCode();
    ready.accessCodeUsed = false;
    const { date } = nowBR();
    ready.dataEnvio = date;
    ready.status = "aguardando-assinatura";
    advance(ready, "enviado", ready.responsavelNome, `Código: ${ready.accessCode}`);
    persistElectronicContract(ready);
    syncElectronicContractInBackground(ready);
    return ready;
  },

  validateAccessCode(slug: string, code: string): ElectronicContract {
    const contract = getElectronicContract(slug);
    if (!contract) throw new Error("Contrato não encontrado");
    if (!contract.accessCode || code !== contract.accessCode) {
      throw new Error("Código de acesso inválido");
    }
    return contract;
  },

  registerClientAccess(slug: string): ElectronicContract {
    const contract = getElectronicContract(slug);
    if (!contract) throw new Error("Contrato não encontrado");

    if (contract.lifecycleStep === "enviado") {
      advance(contract, "cliente_acessou", "Cliente");
    }
    persistElectronicContract(contract);
    return contract;
  },

  authorizeDevice(slug: string, code?: string): { contract: ElectronicContract; authorized: boolean } {
    const contract = getElectronicContract(slug);
    if (!contract) throw new Error("Contrato não encontrado");

    const fp = getDeviceFingerprint();
    const label = getDeviceLabel();
    const existing = contract.dispositivosAutorizados.find((d) => d.fingerprint === fp);

    if (existing) {
      existing.ultimoAcesso = nowBR().date;
      persistElectronicContract(contract);
      return { contract, authorized: true };
    }

    if (contract.dispositivosAutorizados.length === 0) {
      if (code && contract.accessCode && code !== contract.accessCode) {
        throw new Error("Código de acesso inválido");
      }
      const { date } = nowBR();
      contract.dispositivosAutorizados.push({
        id: `dev-${Date.now()}`,
        fingerprint: fp,
        label,
        autorizadoEm: date,
        ultimoAcesso: date,
      });
      contract.accessCodeUsed = true;
      if (contract.lifecycleStep === "cliente_acessou") {
        advance(contract, "dispositivo_autorizado", "Cliente", label);
      }
      pushSecurityLog(contract, "Dispositivo autorizado", {
        dispositivoId: fp,
        codigoUtilizado: !!code,
      });
      persistElectronicContract(contract);
      return { contract, authorized: true };
    }

    const pending = contract.solicitacoesDispositivo.find(
      (r) => r.fingerprint === fp && r.status === "pendente"
    );
    if (!pending) {
      contract.solicitacoesDispositivo.push({
        id: `req-${Date.now()}`,
        fingerprint: fp,
        label,
        solicitadoEm: nowBR().date,
        status: "pendente",
      });
      persistElectronicContract(contract);
      return { contract, authorized: false };
    }

    return { contract, authorized: pending.status === "aprovado" };
  },

  approveDevice(slug: string, requestId: string): ElectronicContract {
    const contract = getElectronicContract(slug);
    if (!contract) throw new Error("Contrato não encontrado");

    const req = contract.solicitacoesDispositivo.find((r) => r.id === requestId);
    if (!req) throw new Error("Solicitação não encontrada");

    req.status = "aprovado";
    const { date } = nowBR();
    contract.dispositivosAutorizados.push({
      id: `dev-${Date.now()}`,
      fingerprint: req.fingerprint,
      label: req.label,
      autorizadoEm: date,
      ultimoAcesso: date,
      aprovadoPor: contract.responsavelNome,
    });
    pushSecurityLog(contract, "Novo dispositivo aprovado", { dispositivoId: req.fingerprint });
    persistElectronicContract(contract);
    return contract;
  },

  markClientRead(slug: string): ElectronicContract {
    const contract = getElectronicContract(slug);
    if (!contract) throw new Error("Contrato não encontrado");
    if (contract.lifecycleStep === "dispositivo_autorizado") {
      advance(contract, "cliente_leu", "Cliente");
    }
    persistElectronicContract(contract);
    return contract;
  },

  acceptElectronicTerms(slug: string): ElectronicContract {
    const contract = getElectronicContract(slug);
    if (!contract) throw new Error("Contrato não encontrado");
    if (contract.lifecycleStep === "cliente_leu") {
      advance(contract, "aceite_eletronico", "Cliente");
    }
    persistElectronicContract(contract);
    return contract;
  },

  signAsClient(
    slug: string,
    signature: Omit<ContractSignatureRecord, "role" | "assinadoEm">
  ): ElectronicContract {
    const contract = getElectronicContract(slug);
    if (!contract) throw new Error("Contrato não encontrado");
    if (contract.assinaturas.some((s) => s.role === "cliente")) {
      throw new Error("Cliente já assinou este contrato");
    }

    const { date } = nowBR();
    contract.assinaturas.push({
      role: "cliente",
      ...signature,
      assinadoEm: date,
    });

    const noraxDone = contract.assinaturas.some((s) => s.role === "norax");
    if (noraxDone) {
      contract.status = "assinado";
      contract.dataAssinatura = date;
      recordMilestone(contract, "cliente_assinou", signature.nome);
      contract.pdfUrl = `/mock-pdf/${contract.id}-v${contract.versao}.pdf`;
      contract.versao += 1;
      recordMilestone(contract, "pdf_gerado", "Sistema Norax", "PDF regenerado após assinaturas");
      void emitIntegrationEvent(DomainEventType.CONTRACT_SIGNED, {
        contractId: contract.id,
        numeroContrato: contract.numeroContrato,
        clienteId: contract.clienteId,
      });
    } else {
      contract.status = "parcialmente-assinado";
      recordMilestone(contract, "cliente_assinou", signature.nome);
    }

    persistElectronicContract(contract);
    return contract;
  },

  signAsNorax(
    id: string,
    signature: { nome: string; documento?: string; data?: string; hora?: string }
  ): ElectronicContract {
    const contract = getElectronicContract(id);
    if (!contract) throw new Error("Contrato não encontrado");
    if (contract.assinaturas.some((s) => s.role === "norax")) {
      throw new Error("Norax já assinou este contrato");
    }

    const { date, time } = nowBR();
    contract.assinaturas.push({
      role: "norax",
      nome: signature.nome,
      documento: signature.documento ?? "12.345.678/0001-90",
      data: signature.data ?? date,
      hora: signature.hora ?? time,
      aceiteEletronico: true,
      assinadoEm: date,
    });

    const clientDone = contract.assinaturas.some((s) => s.role === "cliente");
    if (clientDone) {
      contract.status = "assinado";
      contract.dataAssinatura = date;
      recordMilestone(contract, "norax_assinou", signature.nome);
      contract.pdfUrl = `/mock-pdf/${contract.id}-v${contract.versao}.pdf`;
      contract.versao += 1;
      recordMilestone(contract, "pdf_gerado", "Sistema Norax", "PDF regenerado após assinaturas");
      void emitIntegrationEvent(DomainEventType.CONTRACT_SIGNED, {
        contractId: contract.id,
        numeroContrato: contract.numeroContrato,
        clienteId: contract.clienteId,
      });
    } else {
      contract.status = "parcialmente-assinado";
      recordMilestone(contract, "norax_assinou", signature.nome);
    }

    persistElectronicContract(contract);
    return contract;
  },

  generatePdf(id: string): ElectronicContract {
    const contract = getElectronicContract(id);
    if (!contract) throw new Error("Contrato não encontrado");
    if (contract.lifecycleStep !== "norax_assinou") {
      throw new Error("Ambas as assinaturas são necessárias");
    }

    contract.pdfUrl = `/mock-pdf/${contract.id}-v${contract.versao}.pdf`;
    contract.status = "finalizado";
    advance(contract, "pdf_gerado", "Sistema Norax", "PDF simulado gerado");
    persistElectronicContract(contract);
    return contract;
  },

  archive(id: string): ElectronicContract {
    const contract = getElectronicContract(id);
    if (!contract) throw new Error("Contrato não encontrado");
    if (contract.lifecycleStep !== "pdf_gerado") {
      throw new Error("Gere o PDF definitivo antes de arquivar");
    }

    contract.status = "arquivado";
    advance(contract, "arquivado", contract.responsavelNome);
    persistElectronicContract(contract);
    return contract;
  },

  createNewVersion(id: string): ElectronicContract {
    const contract = getElectronicContract(id);
    if (!contract) throw new Error("Contrato não encontrado");
    if (!contract.isImmutable) throw new Error("Apenas contratos definitivos geram novas versões");

    const slugs = new Set(getAllElectronicContracts().map((c) => c.uniqueSlug));
    const newVersion = contract.versao + 1;
    const updated: ElectronicContract = {
      ...contract,
      versao: newVersion,
      isImmutable: false,
      status: "rascunho",
      lifecycleStep: "criado",
      uniqueSlug: generateUniqueSlug(slugs),
      accessCode: generateAccessCode(),
      accessCodeUsed: false,
      hashDocumento: "",
      pdfUrl: null,
      assinaturas: [],
      dispositivosAutorizados: [],
      solicitacoesDispositivo: [],
      conteudoResolvido: false,
    };
    pushTimeline(updated, "criado", contract.responsavelNome, `Nova versão v${newVersion}`);
    persistElectronicContract(updated);
    return updated;
  },
};
