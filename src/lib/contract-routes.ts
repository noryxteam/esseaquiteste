export function getContractViewPath(idOrSlug: string, opts?: { staffPreview?: boolean }) {
  const base = `/contract/${idOrSlug}/visualizar`;
  return opts?.staffPreview ? `${base}?preview=staff` : base;
}

export function getContractAccessPath(idOrSlug: string) {
  return `/contract/${idOrSlug}`;
}

export function getContractAdminPath(id: string) {
  return `/contratos/${id}`;
}

export function getContractEditPath(id: string) {
  return `/contratos/${id}/editar`;
}

export function getContractNewPath() {
  return `/contratos/novo`;
}

export function getContractClientLink(slug: string) {
  return `https://contratos.norax.com/${slug}`;
}
