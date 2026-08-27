import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/esqueci-senha",
  "/nova-senha",
  "/sessao-expirada",
  "/acesso-negado",
  "/conta-bloqueada",
  "/contract",
  "/forms",
];

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/clientes",
  "/projetos",
  "/reunioes",
  "/propostas",
  "/contratos",
  "/apaga-logo",
  "/financeiro",
  "/briefings",
  "/tasks",
  "/equipe",
  "/arquivos",
  "/modelos",
  "/relatorios",
  "/configuracoes",
  "/integracoes",
];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function publicOrigin(request: NextRequest): string {
  const fromEnv = process.env.APP_PUBLIC_URL?.replace(/\/$/, "");
  if (fromEnv && !/localhost|127\.0\.0\.1/i.test(fromEnv)) {
    return fromEnv;
  }

  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    "";
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    "http";

  if (host && !/localhost|127\.0\.0\.1/i.test(host)) {
    return `${proto}://${host}`;
  }

  return fromEnv || request.nextUrl.origin;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const hasAuth = request.cookies.get("norax-auth")?.value === "1";

  if (!isPublic && isProtectedPath(pathname) && !hasAuth) {
    return NextResponse.redirect(new URL("/login", `${publicOrigin(request)}/`));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
