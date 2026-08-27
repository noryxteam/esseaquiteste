import type { ClauseBlock, ContractPageLayout } from "@/modules/contract-builder/types";
import {
  BLOCK_BASE_UNITS,
  PAGE_CONTENT_UNITS,
  PARAGRAPH_UNITS,
} from "@/modules/contract-builder/types";

function blockUnits(block: ClauseBlock): number {
  const paras = Math.max(1, block.paragrafos.filter((p) => p.trim()).length || 1);
  const textLen =
    block.paragrafos.reduce((acc, p) => acc + p.length, 0) + block.titulo.length;
  const textBonus = Math.floor(textLen / 180);
  return BLOCK_BASE_UNITS + paras * PARAGRAPH_UNITS + textBonus;
}

/**
 * Paginação automática: enche a página até o máximo.
 * Nunca corta uma cláusula — se não cabe inteira, vai toda para a próxima.
 */
export function paginateClauseBlocks(
  blocks: ClauseBlock[],
  opts?: { firstPageUnits?: number; pageUnits?: number }
): ContractPageLayout[] {
  const ordered = [...blocks].sort((a, b) => a.ordem - b.ordem);
  const pageUnits = opts?.pageUnits ?? PAGE_CONTENT_UNITS;
  const firstPageUnits = opts?.firstPageUnits ?? pageUnits;

  const pages: ContractPageLayout[] = [];
  let currentIds: string[] = [];
  let used = 0;
  let pageNumber = 1;
  let capacity = firstPageUnits;

  for (const block of ordered) {
    const units = blockUnits(block);
    const pageIsEmpty = currentIds.length === 0;
    const fits = pageIsEmpty || used + units <= capacity;

    if (!fits) {
      pages.push({ pageNumber, blockIds: currentIds });
      pageNumber += 1;
      currentIds = [];
      used = 0;
      capacity = pageUnits;
    }

    currentIds.push(block.id);
    used += units;
  }

  if (currentIds.length > 0) {
    pages.push({ pageNumber, blockIds: currentIds });
  }

  if (pages.length === 0) {
    pages.push({ pageNumber: 1, blockIds: [] });
  }

  return pages;
}
