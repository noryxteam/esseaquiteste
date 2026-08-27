"use client";

import { Headphones, Lock, Shield, Users } from "lucide-react";

export function ClientPortalTrust() {
  return (
    <section className="portal-card rounded-xl border px-4 sm:px-5 py-5 flex flex-col lg:flex-row lg:items-center gap-5 lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg border portal-ring flex items-center justify-center">
          <Shield className="h-4 w-4 portal-fg" />
        </div>
        <p className="text-sm font-medium portal-fg">Seu projeto está seguro com a Norax</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TrustItem icon={Lock} title="Acesso seguro" subtitle="Seus dados protegidos" />
        <TrustItem icon={Users} title="Equipe especializada" subtitle="Profissionais dedicados" />
        <TrustItem icon={Headphones} title="Suporte contínuo" subtitle="Estamos com você" />
      </div>
    </section>
  );
}

function TrustItem({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Lock;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-3.5 w-3.5 portal-muted mt-0.5 shrink-0" />
      <div>
        <p className="text-xs portal-fg">{title}</p>
        <p className="text-[10px] portal-muted">{subtitle}</p>
      </div>
    </div>
  );
}
