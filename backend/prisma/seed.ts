import {
  PrismaClient,
  UserRole,
  UserStatus,
  UserType,
  ContractStatus,
  ClientStatus,
  ProjectStatus,
  ProjectPriority,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("norax123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@norax.dev" },
    update: {},
    create: {
      nome: "Murilo Lima",
      email: "admin@norax.dev",
      password,
      role: UserRole.ADMINISTRADOR,
      userType: UserType.ADMINISTRATOR,
      status: UserStatus.ACTIVE,
      cargo: "Administrador",
      empresa: "Norax",
    },
  });

  const client = await prisma.client.upsert({
    where: { id: "cli-001" },
    update: {},
    create: {
      id: "cli-001",
      nome: "Ana Costa",
      empresa: "TechFlow Solutions",
      email: "ana.costa@techflow.com.br",
      telefone: "(11) 98765-4321",
      segmento: "Tecnologia",
      cidade: "São Paulo",
      estado: "SP",
      status: ClientStatus.ATIVO,
      responsavelId: admin.id,
    },
  });

  const project = await prisma.project.upsert({
    where: { id: "prj-001" },
    update: {},
    create: {
      id: "prj-001",
      clienteId: client.id,
      nome: "App Mobile — TechFlow",
      descricao: "Desenvolvimento de aplicativo mobile",
      status: ProjectStatus.EM_ANDAMENTO,
      progresso: 45,
      responsavelId: admin.id,
      dataInicio: new Date("2024-06-01"),
      prazo: new Date("2024-12-31"),
      prioridade: ProjectPriority.ALTA,
      valor: 78500,
    },
  });

  const contracts = [
    {
      id: "ctr-001",
      numeroContrato: "NX-20240001",
      uniqueSlug: "ctr-001",
      status: ContractStatus.AGUARDANDO_ASSINATURA,
      valor: 78500,
    },
    {
      id: "ctr-002",
      numeroContrato: "NX-20240002",
      uniqueSlug: "ctr-002",
      status: ContractStatus.ASSINADO,
      valor: 120000,
    },
    {
      id: "ctr-003",
      numeroContrato: "NX-20240003",
      uniqueSlug: "ctr-003",
      status: ContractStatus.RASCUNHO,
      valor: 45000,
    },
  ];

  for (const c of contracts) {
    await prisma.contract.upsert({
      where: { id: c.id },
      update: { uniqueSlug: c.uniqueSlug, status: c.status },
      create: {
        id: c.id,
        clienteId: client.id,
        projetoId: project.id,
        numeroContrato: c.numeroContrato,
        uniqueSlug: c.uniqueSlug,
        titulo: `Contrato — ${project.nome}`,
        valor: c.valor,
        status: c.status,
        clauseBlocks: [
          {
            id: "cl-1",
            titulo: "OBJETO DO CONTRATO",
            paragrafos: [
              "O presente contrato tem por objeto a prestação de serviços de desenvolvimento conforme escopo acordado entre as partes.",
            ],
            ordem: 0,
          },
          {
            id: "cl-2",
            titulo: "PRAZO E VALORES",
            paragrafos: [
              "O prazo e os valores estão definidos nas condições comerciais anexas a este instrumento.",
            ],
            ordem: 1,
          },
        ],
        formaPagamento: "PIX",
        parcelas: 1,
        responsavelId: admin.id,
        dataEnvio: c.status !== ContractStatus.RASCUNHO ? new Date() : null,
        assinado: c.status === ContractStatus.ASSINADO,
      },
    });
  }

  console.log("Seed concluído.");
  console.log("Admin:", admin.email, "| senha: norax123");
  console.log("Contratos:", contracts.map((c) => c.id).join(", "));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
