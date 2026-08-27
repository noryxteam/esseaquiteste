import { Router } from "express";
import { z } from "zod";
import { ClientFormStatus } from "@prisma/client";
import { prisma } from "@/database";
import { asyncHandler } from "@/shared/utils/async-handler";
import { sendSuccess } from "@/shared/utils/api-response";
import { NotFoundError, ValidationError } from "@/shared/types/errors";
import { emailService } from "@/modules/security/services/email.service";

const STATUS_TO_API: Record<ClientFormStatus, string> = {
  DRAFT: "draft",
  SENT: "sent",
  ANSWERED: "answered",
  ARCHIVED: "archived",
};

const STATUS_FROM_API: Record<string, ClientFormStatus> = {
  draft: "DRAFT",
  sent: "SENT",
  answered: "ANSWERED",
  archived: "ARCHIVED",
};

function toPublicForm(row: {
  id: string;
  clienteId: string;
  title: string;
  status: ClientFormStatus;
  slug: string;
  blocks: unknown;
  version: number;
  sentAt: Date | null;
  meta: unknown;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: row.id,
    clientId: row.clienteId,
    title: row.title,
    status: STATUS_TO_API[row.status],
    slug: row.slug,
    blocks: row.blocks,
    version: row.version,
    sentAt: row.sentAt?.toISOString() ?? null,
    meta: row.meta ?? {},
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const syncSchema = z.object({
  id: z.string().min(1),
  clientId: z.string().min(1),
  title: z.string().min(1).max(200),
  status: z.enum(["draft", "sent", "answered", "archived"]),
  slug: z.string().min(4).max(64),
  blocks: z.array(z.unknown()),
  version: z.number().int().min(1).optional(),
  sentAt: z.string().nullable().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string().optional(),
});

const sendInviteSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  formUrl: z.string().url(),
  ctaLabel: z.string().min(1).max(80).optional(),
});

const submitSchema = z.object({
  answers: z.record(z.string(), z.unknown()),
});

/** Rotas públicas — sem auth (link do cliente). */
export const formsPublicRoutes = Router();

formsPublicRoutes.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug ?? "");
    const row = await prisma.clientForm.findUnique({ where: { slug } });
    if (!row) {
      throw new NotFoundError("Formulário não encontrado.", "FORM_NOT_FOUND");
    }
    if (row.status === "DRAFT" || row.status === "ARCHIVED") {
      throw new NotFoundError("Formulário indisponível.", "FORM_UNAVAILABLE");
    }
    sendSuccess(res, toPublicForm(row));
  })
);

formsPublicRoutes.post(
  "/:slug/responses",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug ?? "");
    const input = submitSchema.parse(req.body);
    const row = await prisma.clientForm.findUnique({ where: { slug } });
    if (!row) {
      throw new NotFoundError("Formulário não encontrado.", "FORM_NOT_FOUND");
    }
    if (row.status === "DRAFT" || row.status === "ARCHIVED") {
      throw new ValidationError("Este formulário não aceita respostas.");
    }

    const response = await prisma.clientFormResponse.create({
      data: {
        formId: row.id,
        clienteId: row.clienteId,
        answers: input.answers as object,
      },
    });

    if (row.status === "SENT") {
      await prisma.clientForm.update({
        where: { id: row.id },
        data: { status: "ANSWERED" },
      });
    }

    sendSuccess(
      res,
      {
        id: response.id,
        formId: response.formId,
        submittedAt: response.submittedAt.toISOString(),
      },
      "Resposta registrada."
    );
  })
);

/** Rotas autenticadas (painel). */
export const formsRoutes = Router();

formsRoutes.put(
  "/sync",
  asyncHandler(async (req, res) => {
    const input = syncSchema.parse(req.body);
    const status = STATUS_FROM_API[input.status];
    if (!status) throw new ValidationError("Status inválido.");

    const data = {
      clienteId: input.clientId,
      title: input.title,
      status,
      slug: input.slug,
      blocks: input.blocks as object[],
      version: input.version ?? 1,
      sentAt: input.sentAt ? new Date(input.sentAt) : null,
      meta: (input.meta ?? {}) as object,
    };

    const row = await prisma.clientForm.upsert({
      where: { id: input.id },
      create: {
        id: input.id,
        ...data,
        createdAt: input.createdAt ? new Date(input.createdAt) : undefined,
      },
      update: data,
    });

    sendSuccess(res, toPublicForm(row), "Formulário sincronizado.");
  })
);

formsRoutes.post(
  "/send-invite",
  asyncHandler(async (req, res) => {
    const input = sendInviteSchema.parse(req.body);
    const sent = await emailService.sendFormInviteEmail(input);
    if (!sent) {
      throw new ValidationError(
        "Não foi possível enviar o e-mail. Verifique o SMTP (MAIL_PASSWORD) no backend."
      );
    }
    sendSuccess(res, { sent: true }, "E-mail enviado.");
  })
);
