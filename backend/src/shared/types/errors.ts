import { AppError } from "@/shared/utils/app-error";

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado.", error = "NOT_FOUND") {
    super(message, 404, error);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Dados inválidos.", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Não autorizado.", error = "UNAUTHORIZED") {
    super(message, 401, error);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso negado.", error = "FORBIDDEN") {
    super(message, 403, error);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflito de dados.", error = "CONFLICT") {
    super(message, 409, error);
  }
}
