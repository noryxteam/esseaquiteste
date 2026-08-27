import Link from "next/link";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";

export default function SessionExpiredPage() {
  return (
    <AuthLayout
      title="Sessão expirada"
      subtitle="Por segurança, sua sessão foi encerrada"
    >
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Faça login novamente para continuar usando o Norax.
        </p>
        <Link href="/login">
          <PrimaryButton className="w-full">Fazer login</PrimaryButton>
        </Link>
      </div>
    </AuthLayout>
  );
}
