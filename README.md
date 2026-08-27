# Norax — Fase 1 · Estrutura Visual

Interface completa navegável. **Sem backend, sem lógica de negócio** — apenas estrutura visual com dados fictícios.

## Rodar

```bash
npm install
npm run dev
```

Abra **http://localhost:3000** → redireciona para `/dashboard`.

## Páginas (15)

| Rota | Página |
|------|--------|
| `/dashboard` | Visão Geral |
| `/clientes` | Clientes |
| `/projetos` | Projetos (kanban) |
| `/reunioes` | Reuniões (calendário) |
| `/propostas` | Propostas |
| `/contratos` | Contratos |
| `/financeiro` | Financeiro |
| `/briefings` | Briefings |
| `/tasks` | Tasks |
| `/equipe` | Equipe |
| `/arquivos` | Arquivos |
| `/modelos` | Modelos |
| `/relatorios` | Relatórios |
| `/configuracoes` | Configurações |
| `/integracoes` | Integrações |

## Componentes reutilizáveis

- `AppShell` · `Sidebar` · `Header`
- `Card` · `Table` · `Chart` (Bar, Line, Donut)
- `MetricCard` · `StatusBadge` · `ProgressBar`
- `SectionTitle` · `PageTitle` · `ActionButton` · `SearchBar`

## Layout

- Sidebar fixa com logo, menu agrupado, usuário no rodapé, botão recolher
- Header com busca, notificações, avatar e ação "Novo"
- Dark theme minimalista — cores apenas para estados (verde, azul, laranja, vermelho, roxo)
