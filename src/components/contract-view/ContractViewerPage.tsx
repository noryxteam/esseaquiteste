"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { ContractViewData } from "@/lib/mock-data/contract-view-types";
import { ContractViewerHeader } from "@/components/contract-view/ContractViewerHeader";
import { ContractTimeline } from "@/components/contract-view/ContractTimeline";
import { ContractMetadata, ContractSecurityCard } from "@/components/contract-view/ContractMetadata";
import { ContractActionsCard } from "@/components/contract-view/ContractActionsCard";
import { OpeningContractOverlay } from "@/components/contract-view/OpeningContractOverlay";
import { getContractViewPath } from "@/lib/contract-routes";
import { Button } from "@/components/ui/button-shadcn";
import { electronicContractService } from "@/modules/electronic-contracts";
import { ensureContractSyncedInBackend } from "@/modules/electronic-contracts/sync-api";

interface ContractViewerPageProps {
  data: ContractViewData;
}

export function ContractViewerPage({ data }: ContractViewerPageProps) {
  const router = useRouter();
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");

  const handleOpenFull = async () => {
    if (opening) return;
    setOpening(true);
    setError("");

    try {
      const electronic =
        electronicContractService.getById(data.id) ??
        electronicContractService.getById(data.uniqueSlug || "");

      let publicId = data.uniqueSlug || data.id;

      if (electronic) {
        // Sync rápido (máx. 1.2s). Se demorar, abre com o slug local e termina em background.
        const syncPromise = ensureContractSyncedInBackend(electronic);
        const synced = await Promise.race([
          syncPromise,
          new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 1200)),
        ]);
        if (synced) {
          publicId = synced.uniqueSlug || synced.id;
        } else {
          void syncPromise.catch((err) => {
            console.error("[norax] Sync do contrato ainda em andamento falhou:", err);
          });
        }
      }

      router.push(getContractViewPath(publicId, { staffPreview: true }));
    } catch (e) {
      setOpening(false);
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível publicar o contrato no servidor. Tente novamente."
      );
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <OpeningContractOverlay open={opening} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 lg:space-y-8"
      >
        <ContractViewerHeader data={data} />

        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-start">
          <main className="flex-1 min-w-0 space-y-6 w-full">
            <div className="rounded-lg border border-border-subtle bg-surface/30 p-6 flex flex-col items-center gap-3">
              <Button
                type="button"
                className="h-10 gap-2 bg-foreground text-accent-foreground hover:bg-foreground/90"
                onClick={() => void handleOpenFull()}
                disabled={opening}
              >
                <ExternalLink className="h-4 w-4" />
                Abrir contrato completo
              </Button>
              {error ? <p className="text-xs text-state-red text-center">{error}</p> : null}
            </div>

            <ContractMetadata data={data} />

            <ContractSecurityCard data={data} />
          </main>

          <aside className="w-full xl:w-[300px] shrink-0 xl:sticky xl:top-8 xl:self-start space-y-4">
            <ContractTimeline events={data.timeline} />
            <ContractActionsCard contractId={data.id} />
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
