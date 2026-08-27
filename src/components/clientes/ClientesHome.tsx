"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { clientesData, getClientesData } from "@/lib/mock-data/clientes";
import type { ClientRow as ClientRowType } from "@/lib/mock-data/clientes-types";
import { StatsCard } from "@/components/clientes/StatsCard";
import { FiltersBar } from "@/components/clientes/FiltersBar";
import { ClientTable } from "@/components/clientes/ClientTable";
import { FunnelCard } from "@/components/clientes/FunnelCard";
import { StatusChart } from "@/components/clientes/StatusChart";
import { ActivityCard } from "@/components/clientes/ActivityCard";
import { useAppState } from "@/contexts/app-context";
import { routes } from "@/lib/app-routes";

interface ClientesHomeProps {
  data?: typeof clientesData;
}

function matchesQuery(client: ClientRowType, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    client.name.toLowerCase().includes(q) ||
    client.email.toLowerCase().includes(q) ||
    client.contactName.toLowerCase().includes(q)
  );
}

export function ClientesHome({ data: dataProp }: ClientesHomeProps) {
  const { version } = useAppState();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");

  const data = useMemo(() => {
    const base = dataProp ?? getClientesData();
    return {
      ...base,
      clients: [...base.clients],
      totalClients: base.clients.length,
    };
  }, [dataProp, version]);

  const filteredClients = useMemo(
    () => data.clients.filter((c) => matchesQuery(c, query)),
    [data.clients, query]
  );

  return (
    <div className="flex flex-col xl:flex-row xl:items-stretch gap-6 xl:gap-8">
      <div className="flex-1 min-w-0 flex flex-col gap-5 xl:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie todos os seus clientes em um só lugar.
          </p>
        </motion.div>

        <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {data.stats.map((stat, i) => (
            <StatsCard key={stat.id} {...stat} index={i} href={routes.clientes} />
          ))}
        </div>

        <div className="shrink-0">
          <FiltersBar
            query={query}
            onQueryChange={setQuery}
            view={view}
            onViewChange={setView}
          />
        </div>

        <ClientTable clients={filteredClients} total={data.totalClients} view={view} />
      </div>

      <aside className="w-full xl:w-[300px] shrink-0 space-y-4 xl:sticky xl:top-20">
        <FunnelCard stages={data.funnel} />
        <StatusChart segments={data.statusSegments} total={data.totalClients} />
        <ActivityCard items={data.activities} />
      </aside>
    </div>
  );
}
