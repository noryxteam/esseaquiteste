import type { ContractClause } from "@/modules/electronic-contracts";

export const DEFAULT_CLAUSES: ContractClause[] = [
  {
    id: "default-1",
    numero: "01",
    titulo: "OBJETO DO CONTRATO",
    paragrafos: [
      "O presente contrato tem por objeto a prestação de serviços de {{projeto}}, conforme escopo acordado entre {{empresa}} e {{cliente}}.",
    ],
  },
  {
    id: "default-2",
    numero: "02",
    titulo: "VALORES",
    paragrafos: ["O valor total dos serviços é de {{valor}}, conforme condições de pagamento acordadas."],
  },
  {
    id: "default-3",
    numero: "03",
    titulo: "PRAZO",
    paragrafos: ["O prazo de execução será conforme cronograma aprovado entre as partes."],
  },
  {
    id: "default-4",
    numero: "04",
    titulo: "FORO",
    paragrafos: ["Fica eleito o foro da comarca de São Paulo — SP."],
  },
];
