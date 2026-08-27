import type { Request, Response } from "express";
import { prisma } from "@/database";
import { asyncHandler } from "@/shared/utils/async-handler";
import { sendSuccess } from "@/shared/utils/api-response";
import { getParamId } from "@/shared/utils/request";
import { getRequestContext } from "@/modules/auth/middlewares/auth.middleware";
import { NotFoundError, ValidationError } from "@/shared/types/errors";
import { z } from "zod";

const personalSchema = z.object({
  nome: z.string().min(1),
  empresa: z.string().min(1),
  documento: z.string().optional(),
  email: z.string().email(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().length(2).optional(),
});

const serviceSchema = z.object({
  tipoServico: z.string(),
  nomeProjeto: z.string(),
  valorTotal: z.number().nonnegative(),
  dataInicio: z.string(),
  prazoPrevisto: z.string().optional(),
  responsavelInternoId: z.string().optional(),
  responsavelInternoNome: z.string().optional(),
  observacoes: z.string().optional(),
});

const paymentSchema = z.object({
  method: z.string(),
  installments: z.number().int().positive().default(1),
  entryPercent: z.number().optional(),
  customSchedule: z.array(z.record(z.string(), z.unknown())).optional(),
  notes: z.string().optional(),
});

const completeSetupSchema = z.object({
  personal: personalSchema,
  service: serviceSchema,
  payment: paymentSchema,
});

export const clientSetupController = {
  getSetup: asyncHandler(async (req: Request, res: Response) => {
    const client = await prisma.client.findFirst({
      where: { id: getParamId(req), deletedAt: null },
    });
    if (!client) throw new NotFoundError("Cliente não encontrado.", "CLIENT_NOT_FOUND");
    sendSuccess(res, {
      clientId: client.id,
      setupComplete: client.setupComplete,
      setupCompletedAt: client.setupCompletedAt,
      setupData: client.setupData,
      personal: {
        nome: client.nome,
        empresa: client.empresa,
        documento: client.documento,
        email: client.email,
        telefone: client.telefone,
        endereco: client.endereco,
        cidade: client.cidade,
        estado: client.estado,
      },
    });
  }),

  completeSetup: asyncHandler(async (req: Request, res: Response) => {
    const clientId = getParamId(req);
    const input = completeSetupSchema.parse(req.body);
    const ctx = getRequestContext(req);

    const client = await prisma.client.findFirst({
      where: { id: clientId, deletedAt: null },
    });
    if (!client) throw new NotFoundError("Cliente não encontrado.", "CLIENT_NOT_FOUND");

    const company = await prisma.companySettings.findFirst();
    const norax = company
      ? {
          nome: company.nome,
          razaoSocial: company.razaoSocial,
          cnpj: company.cnpj,
          email: company.email,
          telefone: company.telefone,
          endereco: company.endereco,
          cidade: company.cidade,
          estado: company.estado,
          banco: company.banco,
          agencia: company.agencia,
          conta: company.conta,
          chavePix: company.chavePix,
          destinatarioPix: company.destinatarioPix,
        }
      : null;

    if (!norax) {
      throw new ValidationError(
        "Configure os dados da empresa antes de finalizar.",
        "COMPANY_SETTINGS_MISSING"
      );
    }

    const updated = await prisma.client.update({
      where: { id: clientId },
      data: {
        nome: input.personal.nome,
        empresa: input.personal.empresa,
        documento: input.personal.documento,
        email: input.personal.email,
        telefone: input.personal.telefone,
        endereco: input.personal.endereco,
        cidade: input.personal.cidade ?? client.cidade,
        estado: input.personal.estado ?? client.estado,
        setupComplete: true,
        setupCompletedAt: new Date(),
        setupData: {
          service: input.service,
          payment: input.payment,
          norax,
          completedBy: ctx.userId,
        },
      },
    });

    sendSuccess(res, updated, "Configuração do cliente concluída.");
  }),

  getCompanySettings: asyncHandler(async (_req: Request, res: Response) => {
    let settings = await prisma.companySettings.findFirst();
    if (!settings) {
      settings = await prisma.companySettings.create({
        data: {
          nome: "Norax",
          razaoSocial: "Norax Digital Ltda",
          cnpj: "12.345.678/0001-90",
          email: "contato@norax.dev",
          telefone: "(11) 3000-0000",
          endereco: "Av. Paulista, 1000 — Bela Vista",
          cidade: "São Paulo",
          estado: "SP",
          banco: "Banco Inter",
          agencia: "0001",
          conta: "12345678-9",
          chavePix: "financeiro@norax.dev",
          destinatarioPix: "Norax Digital Ltda",
        },
      });
    }
    sendSuccess(res, settings);
  }),

  listTemplates: asyncHandler(async (_req: Request, res: Response) => {
    const templates = await prisma.contractTemplate.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    });
    sendSuccess(res, templates);
  }),
};
