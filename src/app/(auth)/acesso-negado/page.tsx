import Link from "next/link";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";

export default function AccessDeniedPage() {
  return (
    <AuthLayout
      title="Acesso negado"
      subtitle="Você não tem permissão para acessar esta área"
    >
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Entre em contato com o administrador se acredita que isso é um erro.
        </p>
        <Link href="/dashboard">
          <PrimaryButton className="w-full">Voltar ao início</PrimaryButton>
        </Link>
      </div>
    </AuthLayout>
  );
}
