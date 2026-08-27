import { createApp } from "@/app";
import { env } from "@/config";
import { connectDatabase } from "@/database";
import { registerEventHandlers } from "@/shared/events/register-handlers";
import { logger } from "@/shared/services/logger.service";

async function bootstrap() {
  await connectDatabase();
  registerEventHandlers();
  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info(`Norax API rodando em http://localhost:${env.PORT}${env.API_PREFIX}`);
  });
}

bootstrap().catch((error) => {
  logger.error("Falha ao iniciar servidor", { error });
  process.exit(1);
});
