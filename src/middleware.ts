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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const hasAuth = request.cookies.get("norax-auth")?.value === "1";

  if (!isPublic && isProtectedPath(pathname) && !hasAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
