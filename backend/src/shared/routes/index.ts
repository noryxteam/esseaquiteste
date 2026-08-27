import { Router } from "express";
import { clientRoutes } from "@/modules/clients/routes/client.routes";
import { projectRoutes } from "@/modules/projects/routes/project.routes";
import { contractRoutes } from "@/modules/contracts/routes/contract.routes";
import { meetingRoutes } from "@/modules/meetings/routes/meeting.routes";
import { briefingRoutes } from "@/modules/briefings/routes/briefing.routes";
import { financeRoutes } from "@/modules/finance/routes/finance.routes";
import { taskRoutes } from "@/modules/tasks/routes/task.routes";
import { fileRoutes } from "@/modules/files/routes/file.routes";
import { userRoutes } from "@/modules/users/routes/user.routes";
import { notificationRoutes } from "@/modules/notifications/routes/notification.routes";
import { timelineRoutes } from "@/modules/timeline/routes/timeline.routes";
import { reportsRoutes } from "@/modules/reports/routes/reports.routes";
import { uploadRoutes } from "@/shared/routes/upload.routes";
import { authRoutes } from "@/modules/auth/routes/auth.routes";
import { searchRoutes } from "@/modules/search/routes/search.routes";
import { authMiddleware } from "@/modules/auth/middlewares/auth.middleware";
import { contractPortalRoutes } from "@/modules/security/routes/contract-portal.routes";
import { securityRoutes } from "@/modules/security/routes/trusted-device.routes";
import { mountContractSecurityRoutes } from "@/modules/security/routes/contract-security.routes";
import { formsRoutes, formsPublicRoutes } from "@/modules/forms/forms.routes";

export const apiRoutes = Router();

// Rotas públicas
apiRoutes.use("/contracts/portal", contractPortalRoutes);
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/forms/public", formsPublicRoutes);

// Rotas protegidas
apiRoutes.use(authMiddleware);

apiRoutes.use("/clients", clientRoutes);
apiRoutes.use("/projects", projectRoutes);
mountContractSecurityRoutes(contractRoutes);
apiRoutes.use("/contracts", contractRoutes);
apiRoutes.use("/forms", formsRoutes);
apiRoutes.use("/meetings", meetingRoutes);
apiRoutes.use("/briefings", briefingRoutes);
apiRoutes.use("/finance", financeRoutes);
apiRoutes.use("/tasks", taskRoutes);
apiRoutes.use("/files", fileRoutes);
apiRoutes.use("/users", userRoutes);
apiRoutes.use("/notifications", notificationRoutes);
apiRoutes.use("/timeline", timelineRoutes);
apiRoutes.use("/reports", reportsRoutes);
apiRoutes.use("/search", searchRoutes);
apiRoutes.use("/uploads", uploadRoutes);
apiRoutes.use("/security", securityRoutes);
