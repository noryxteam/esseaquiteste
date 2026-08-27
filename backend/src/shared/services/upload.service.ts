import { mkdir } from "node:fs/promises";
import path from "node:path";
import { env } from "@/config";
import { prisma } from "@/database";
import type { StorageProvider, UploadCategory } from "@prisma/client";
import { auditService } from "@/shared/services/audit.service";

export interface UploadInput {
  nomeOriginal: string;
  nomeArquivo: string;
  mimeType: string;
  tamanho: number;
  categoria: UploadCategory;
  buffer?: Buffer;
  uploadedById?: string;
  ip?: string;
  userAgent?: string;
}

/**
 * Serviço de upload desacoplado — estrutura preparada.
 * Atualmente usa armazenamento LOCAL. Providers externos (S3, GCS, Azure) podem ser plugados.
 */
export class UploadService {
  private readonly localPath: string;

  constructor() {
    this.localPath = path.resolve(env.UPLOAD_LOCAL_PATH);
  }

  async ensureLocalDir(): Promise<void> {
    await mkdir(this.localPath, { recursive: true });
  }

  async upload(input: UploadInput, provider: StorageProvider = "LOCAL") {
    const maxBytes = env.UPLOAD_MAX_SIZE_MB * 1024 * 1024;
    if (input.tamanho > maxBytes) {
      throw new Error(`Arquivo excede o limite de ${env.UPLOAD_MAX_SIZE_MB}MB`);
    }

    const storageKey = `${input.categoria.toLowerCase()}/${Date.now()}-${input.nomeArquivo}`;
    let url: string | null = null;

    if (provider === "LOCAL" && input.buffer) {
      await this.ensureLocalDir();
      const fs = await import("node:fs/promises");
      const fullPath = path.join(this.localPath, storageKey);
      await mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, input.buffer);
      url = `/uploads/${storageKey}`;
    }

    const record = await prisma.upload.create({
      data: {
        nomeOriginal: input.nomeOriginal,
        nomeArquivo: input.nomeArquivo,
        mimeType: input.mimeType,
        tamanho: input.tamanho,
        categoria: input.categoria,
        storageProvider: provider,
        storageKey,
        url,
        uploadedById: input.uploadedById,
      },
    });

    if (input.uploadedById) {
      await auditService.logUpload(input.uploadedById, record.id, input.ip, input.userAgent);
    }

    return record;
  }

  async findById(id: string) {
    return prisma.upload.findFirst({ where: { id, deletedAt: null } });
  }

  async softDelete(id: string) {
    return prisma.upload.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const uploadService = new UploadService();
