import { prisma } from "@/database";

export class LoginAttemptRepository {
  async record(data: {
    email: string;
    userId?: string;
    success: boolean;
    ip?: string;
    userAgent?: string;
    reason?: string;
  }) {
    return prisma.loginAttempt.create({ data });
  }

  async countRecentFailures(email: string, windowMinutes = 15): Promise<number> {
    const since = new Date(Date.now() - windowMinutes * 60 * 1000);
    return prisma.loginAttempt.count({
      where: { email, success: false, createdAt: { gte: since } },
    });
  }
}

export const loginAttemptRepository = new LoginAttemptRepository();
