"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getProjectWorkspace,
  subscribeProjectWorkspace,
} from "@/modules/project-workspace/store";
import type { ProjectWorkspaceState } from "@/modules/project-workspace/types";

/**
 * Snapshot estável: a mesma referência em cache enquanto o store não mudar.
 * getProjectWorkspace nunca notifica listeners nem cria objeto novo a cada leitura.
 */
export function useProjectWorkspace(projectId: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeProjectWorkspace(onStoreChange),
    []
  );

  const getSnapshot = useCallback((): ProjectWorkspaceState => {
    return getProjectWorkspace(projectId);
  }, [projectId]);

  const getServerSnapshot = useCallback((): ProjectWorkspaceState => {
    return getProjectWorkspace(projectId);
  }, [projectId]);

  const workspace = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return { workspace };
}
