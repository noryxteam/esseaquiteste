"use client";

import { useCallback, useMemo, useState } from "react";

export function useStageLibrarySelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  const selectedIds = useMemo(() => [...selected], [selected]);
  const count = selected.size;

  return { selected, selectedIds, count, toggle, clear, isSelected: (id: string) => selected.has(id) };
}
