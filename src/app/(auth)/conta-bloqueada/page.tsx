import Link from "next/link";
import { OutlineButton } from "@/components/buttons/OutlineButton";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";

export default function BlockedAccountPage() {
  return (
    <AuthLayout
      title="Conta bloqueada"
      subtitle="O acesso à sua conta foi temporariamente suspenso"
    >
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Entre em contato com o suporte da Norax para mais informações.
        </p>
        <Link href="/login">
          <OutlineButton className="w-full">Voltar ao login</OutlineButton>
        </Link>
      </div>
    </AuthLayout>
  );
}
