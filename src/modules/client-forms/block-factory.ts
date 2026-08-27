import type { FormBlock, FormBlockType, FormOption } from "@/modules/client-forms/types";

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function emptyOption(index: number): FormOption {
  return { id: uid("opt"), label: `Opção ${index}` };
}

/** Cria bloco estrutural vazio — sem perguntas prontas. */
export function createEmptyBlock(type: FormBlockType): FormBlock {
  const base: FormBlock = {
    id: uid("blk"),
    type,
    label: "",
    content: "",
    options: [],
    required: false,
    isNewField: false,
    settings: {},
  };

  if (type === "multiple_choice" || type === "checkbox" || type === "select") {
    return {
      ...base,
      options: [emptyOption(1), emptyOption(2)],
    };
  }

  return base;
}

export function createOption(label = ""): FormOption {
  return { id: uid("opt"), label };
}

export function createPublicSlug(): string {
  return Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 8);
}
