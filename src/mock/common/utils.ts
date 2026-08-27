/** Utilitários compartilhados para geração de dados mock. */

export const SEGMENTS = [
  "E-commerce",
  "Saúde",
  "Educação",
  "Tecnologia",
  "Varejo",
  "Imobiliário",
  "Alimentação",
  "Serviços",
  "Indústria",
  "Moda",
  "Finanças",
  "Turismo",
] as const;

export const CITIES = [
  { city: "São Paulo", state: "SP" },
  { city: "Rio de Janeiro", state: "RJ" },
  { city: "Belo Horizonte", state: "MG" },
  { city: "Curitiba", state: "PR" },
  { city: "Porto Alegre", state: "RS" },
  { city: "Brasília", state: "DF" },
  { city: "Salvador", state: "BA" },
  { city: "Fortaleza", state: "CE" },
  { city: "Recife", state: "PE" },
  { city: "Florianópolis", state: "SC" },
  { city: "Campinas", state: "SP" },
  { city: "Goiânia", state: "GO" },
] as const;

export const COMPANY_PREFIXES = [
  "Infinity",
  "Nova",
  "Prime",
  "Atlas",
  "Vertex",
  "Lumen",
  "Apex",
  "Horizon",
  "Pulse",
  "Sigma",
  "Orion",
  "Zenith",
  "Nexus",
  "Vanguard",
  "Meridian",
  "Catalyst",
  "Fusion",
  "Elevate",
  "Quantum",
  "Stellar",
] as const;

export const COMPANY_SUFFIXES = [
  "Store",
  "Labs",
  "Digital",
  "Group",
  "Studio",
  "Tech",
  "Solutions",
  "Commerce",
  "Media",
  "Health",
  "Bank",
  "Foods",
  "Motors",
  "Homes",
  "Fashion",
] as const;

export const FIRST_NAMES = [
  "Murilo",
  "Ana",
  "Carlos",
  "Julia",
  "Pedro",
  "Fernanda",
  "Rafael",
  "Camila",
  "Lucas",
  "Beatriz",
  "Gabriel",
  "Mariana",
  "Bruno",
  "Larissa",
  "Diego",
] as const;

export const LAST_NAMES = [
  "Lima",
  "Silva",
  "Mendes",
  "Costa",
  "Santos",
  "Oliveira",
  "Ferreira",
  "Almeida",
  "Ribeiro",
  "Carvalho",
  "Souza",
  "Pereira",
] as const;

export function padId(prefix: string, index: number, length = 3): string {
  return `${prefix}-${String(index).padStart(length, "0")}`;
}

export function pick<T>(arr: readonly T[], index: number): T {
  return arr[index % arr.length];
}

export function pickRandom<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function isoDate(year: number, month: number, day: number): string {
  return new Date(year, month - 1, day).toISOString().split("T")[0];
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function randomAmount(seed: number, min: number, max: number): number {
  const range = max - min;
  return Math.round((min + ((seed * 7919) % range)) / 100) * 100;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
