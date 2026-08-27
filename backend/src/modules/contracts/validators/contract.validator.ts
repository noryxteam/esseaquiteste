import { z } from "zod";

export const contractStatusSchema = z.enum([
  "RASCUNHO",
  "EM_REVISAO",
  "DEFINITIVO",
  "AGUARDANDO_ASSINATURA",
  "PARCIALMENTE_ASSINADO",
  "ASSINADO",
  "FINALIZADO",
  "ARQUIVADO",
  "CANCELADO",
  "EXPIRADO",
]);

export const createContractSchema = z.object({
  clienteId: z.string().cuid(),
  projetoId: z.string().cuid(),
  numeroContrato: z.string().min(3).max(50),
  valor: z.coerce.number().positive(),
  status: contractStatusSchema.optional(),
  dataAssinatura: z.coerce.date().optional().nullable(),
  formaPagamento: z.string().min(2).max(50),
  parcelas: z.number().int().positive().optional(),
  assinado: z.boolean().optional(),
  link: z.string().optional().nullable(),
  hashDocumento: z.string().optional().nullable(),
});

export const updateContractSchema = createContractSchema.partial();

const clauseBlockSchema = z.object({
  id: z.string().min(1),
  titulo: z.string(),
  paragrafos: z.array(z.string()),
  ordem: z.number().int().nonnegative(),
});

const syncClientSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  empresa: z.string().min(1),
  email: z.string().min(1),
  /** Gmail de notificação (email de recuperação do setup) */
  emailNotificacao: z.string().email().optional().nullable(),
  telefone: z.string().optional().nullable(),
  segmento: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
});

const syncProjectSchema = z.object({
  id: z.string().min(1),
  clienteId: z.string().min(1),
  nome: z.string().min(1),
  descricao: z.string().optional().nullable(),
  valor: z.coerce.number().nonnegative().optional(),
  dataInicio: z.string().optional().nullable(),
  prazo: z.string().optional().nullable(),
});

/**
 * Upsert do painel (contratos eletrônicos).
 * Inclui snapshots de cliente/projeto para garantir FKs no banco.
 */
export const syncContractSchema = z.object({
  id: z.string().min(1),
  clienteId: z.string().min(1),
  projetoId: z.string().min(1),
  numeroContrato: z.string().min(3).max(50),
  uniqueSlug: z.string().min(3).max(64),
  titulo: z.string().min(1).max(200),
  valor: z.coerce.number().nonnegative(),
  status: contractStatusSchema,
  lifecycleStep: z
    .enum([
      "CRIADO",
      "EDITADO",
      "CAMPOS_ADICIONADOS",
      "REVISADO",
      "DEFINITIVO",
      "ENVIADO",
      "CLIENTE_ACESSOU",
      "DISPOSITIVO_AUTORIZADO",
      "CLIENTE_LEU",
      "ACEITE_ELETRONICO",
      "CLIENTE_ASSINOU",
      "NORAX_ASSINOU",
      "PDF_GERADO",
      "ARQUIVADO",
    ])
    .optional(),
  versao: z.number().int().nonnegative().optional(),
  isImmutable: z.boolean().optional(),
  formaPagamento: z.string().min(1).max(50),
  parcelas: z.number().int().positive().optional(),
  prazo: z.string().optional().nullable(),
  responsavelId: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  hashDocumento: z.string().optional().nullable(),
  accessCode: z.string().optional().nullable(),
  dataEnvio: z.string().optional().nullable(),
  dataAssinatura: z.string().optional().nullable(),
  clauseBlocks: z.array(clauseBlockSchema).optional(),
  campos: z.unknown().optional(),
  editorSettings: z.unknown().optional(),
  conteudo: z.unknown().optional(),
  client: syncClientSchema,
  project: syncProjectSchema,
});

export type CreateContractInput = z.infer<typeof createContractSchema>;
export type UpdateContractInput = z.infer<typeof updateContractSchema>;
export type SyncContractInput = z.infer<typeof syncContractSchema>;
