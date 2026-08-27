import { prisma } from "@/database";

export class PasswordResetRepository {
  async create(userId: string, token: string, expiresAt: Date) {
    await prisma.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });
    return prisma.passwordResetToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findValid(token: string) {
    return prisma.passwordResetToken.findFirst({
      where: { token, usedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
  }

  async markUsed(id: string) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }
}

export const passwordResetRepository = new PasswordResetRepository();
