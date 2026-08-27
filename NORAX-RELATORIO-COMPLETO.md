# NORAX — Relatório Completo de Arquitetura e Produto

**Versão:** 1.0  
**Data:** 6 de julho de 2026  
**Papel:** CTO / Arquiteto de Software / Product Manager / UX & UI Designer  
**Status:** Pré-desenvolvimento (greenfield)  
**Princípio reitor:** *O sistema responde "o que fazer agora?" antes que o usuário pergunte.*

---

## Índice

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Arquitetura Completa](#2-arquitetura-completa)
3. [Estrutura das Páginas](#3-estrutura-das-páginas)
4. [Fluxo do Cliente](#4-fluxo-do-cliente)
5. [Fluxo Administrativo](#5-fluxo-administrativo)
6. [Fluxo Comercial](#6-fluxo-comercial)
7. [Fluxo do Desenvolvedor](#7-fluxo-do-desenvolvedor)
8. [Fluxo das Reuniões](#8-fluxo-das-reuniões)
9. [Fluxo do Portal do Cliente](#9-fluxo-do-portal-do-cliente)
10. [Banco de Dados Sugerido](#10-banco-de-dados-sugerido)
11. [Estrutura das Entidades](#11-estrutura-das-entidades)
12. [Relacionamentos](#12-relacionamentos)
13. [Tecnologias Recomendadas](#13-tecnologias-recomendadas)
14. [Arquitetura Backend](#14-arquitetura-backend)
15. [Arquitetura Frontend](#15-arquitetura-frontend)
16. [Estrutura de Componentes](#16-estrutura-de-componentes)
17. [Design System](#17-design-system)
18. [Sistema de Permissões](#18-sistema-de-permissões)
19. [Sistema de Segurança](#19-sistema-de-segurança)
20. [Roadmap de Desenvolvimento](#20-roadmap-de-desenvolvimento)
21. [Ordem Ideal para Desenvolver Cada Módulo](#21-ordem-ideal-para-desenvolver-cada-módulo)
22. [Funcionalidades Premium](#22-funcionalidades-premium)
23. [Funcionalidades Inovadoras](#23-funcionalidades-inovadoras)
24. [Pontos Fracos da Ideia](#24-pontos-fracos-da-ideia)
25. [Riscos Técnicos](#25-riscos-técnicos)
26. [Melhorias Sugeridas](#26-melhorias-sugeridas)
27. [O Que Remover](#27-o-que-remover)
28. [O Que Adicionar](#28-o-que-adicionar)
29. [O Que Simplificar](#29-o-que-simplificar)
30. [Crítica Completa do Projeto](#30-crítica-completa-do-projeto)

---

## 1. Visão Geral do Produto

### O que é a Norax (como produto)

A Norax não é um CRM. É um **Sistema Operacional da Agência (Agency OS)** — uma plataforma única que unifica comercial, operação, financeiro, comunicação estruturada e experiência do cliente em um fluxo contínuo.

A analogia correta não é HubSpot ou Pipedrive. É a interseção entre:

- **Linear** — foco, velocidade, prioridades claras
- **Notion** — contexto centralizado por entidade
- **Stripe Dashboard** — clareza financeira, confiança
- **Vercel** — minimalismo premium, performance

### Proposta de valor

| Para quem | Valor |
|-----------|-------|
| Fundador | Visão em 30s; empresa funciona sem depender da memória dele |
| Comercial | Pipeline → proposta → contrato sem sair do sistema |
| Operação | Cada projeto tem contexto, checklist, equipe e histórico |
| Cliente | Portal premium; zero confusão; zero acesso a dados internos |
| Empresa (futuro) | Base escalável para sistemas, IA, automações |

### North Star Metric

**Tempo até a próxima ação clara** — medido como: % de sessões em que o usuário executa uma ação sugerida pelo sistema em menos de 60 segundos.

### Posicionamento estratégico

Começar como **ferramenta interna da Norax** (dogfooding), com arquitetura preparada para, no futuro, virar produto SaaS para outras agências. Isso muda decisões de multi-tenancy, billing e white-label — mas não precisa ser implementado no MVP.

### Filosofia operacional (traduzida em produto)

| Princípio da empresa | Implementação no sistema |
|----------------------|--------------------------|
| Organização acima de tudo | Cada entidade tem uma Central com estrutura fixa |
| Cada clique economiza tempo | Ações contextuais, deep links, ⌘K |
| Nenhuma informação depende da memória | Activity Spine + histórico imutável |
| Toda informação tem um local específico | Central do Cliente, Hub do Projeto |
| WhatsApp é só comunicação | Log manual de comunicações externas |
| Histórico pertence ao sistema | Audit log + activity feed |
| Usuário nunca pensa "o que fazer agora?" | Módulo Ações + sugestões contextuais |

---

## 2. Arquitetura Completa

### Visão macro (C4 — Nível 1)

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUÁRIOS                                  │
│   Equipe Norax          Clientes           Convidados Reunião   │
└──────────┬───────────────────┬────────────────────┬──────────────┘
           │                   │                    │
    ┌──────▼──────┐    ┌───────▼───────┐    ┌───────▼───────┐
    │  Admin App  │    │  Portal App   │    │ Meeting Room  │
    │  (app.nex)  │    │ (portal.nex)  │    │ (meet.nex)    │
    └──────┬──────┘    └───────┬───────┘    └───────┬───────┘
           │                   │                    │
           └───────────────────┼────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │     API Gateway      │
                    │  (Auth + Rate Limit) │
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
  ┌──────▼──────┐      ┌────────▼────────┐   ┌───────▼───────┐
  │ Core API    │      │  Worker Service │   │  Webhook Hub  │
  │ (REST/tRPC) │      │  (Jobs + IA)    │   │  (Integrações)│
  └──────┬──────┘      └────────┬────────┘   └───────┬───────┘
         │                      │                    │
         └──────────────────────┼────────────────────┘
                                │
    ┌───────────┬───────────────┼───────────────┬──────────────┐
    │           │               │               │              │
┌───▼───┐  ┌───▼───┐      ┌────▼────┐    ┌─────▼─────┐  ┌────▼────┐
│Postgres│  │ Redis │      │   R2/S3  │    │Typesense  │  │External │
│  (OLTP)│  │Cache/ │      │  Files   │    │  Search   │  │  APIs   │
│        │  │ Queue │      │          │    │           │  │         │
└────────┘  └───────┘      └──────────┘    └───────────┘  └─────────┘
```

### Três aplicações, um backend

| App | Domínio | Autenticação | Público |
|-----|---------|--------------|---------|
| **Admin** | `app.norax.com.br` | Email + 2FA (equipe) | Interno |
| **Portal** | `portal.norax.com.br` | Magic link / convite | Clientes |
| **Meeting** | `meet.norax.com.br/{token}` | Token único, expirável | Cliente + equipe |

**Regra de ouro:** nunca compartilhar bundle, rotas ou sessão entre Admin e Portal. São produtos distintos que conversam com a mesma API.

### Bounded Contexts (DDD)

```
norax/
├── identity/          # Auth, roles, permissions, audit
├── crm/               # Clients, contacts, client hub
├── commercial/        # Leads, proposals, contracts
├── projects/          # Projects, tasks, checklists, deliveries
├── meetings/          # Scheduling, video, AI summaries
├── finance/           # Invoices, payments, forecasts
├── files/             # Storage, versions, permissions
├── communications/    # Notifications, activity feed
├── portal/            # Client-facing views
├── intelligence/      # AI pipelines, suggestions, automations
└── reporting/         # Analytics, exports
```

### Padrões arquiteturais

- **Event-driven interno:** toda ação relevante gera um `DomainEvent` (ex: `contract.signed` → cria projeto, notifica equipe, agenda kickoff)
- **Activity Spine:** feed unificado alimentado por eventos — é o "histórico" de qualquer entidade
- **Polymorphic attachments:** arquivos vinculados a qualquer entidade via `attachable_type + attachable_id`
- **Soft deletes** em entidades críticas (clientes, projetos, contratos)
- **Idempotência** em webhooks de pagamento e assinatura
- **Monólito modular** no início — microserviços apenas quando houver dor real de escala

### Integrações externas

| Serviço | Função | Prioridade |
|---------|--------|------------|
| Daily.co | Salas de vídeo temporárias | Fase 4 |
| Deepgram | Transcrição de reuniões | Fase 4 |
| OpenAI / Claude | Resumos e sugestões IA | Fase 4 |
| Clicksign / D4Sign | Assinatura digital | Fase 3 |
| Stripe + Mercado Pago | Pagamentos (PIX, cartão) | Fase 3 |
| Resend | Emails transacionais | Fase 1 |
| Cloudflare R2 | Armazenamento de arquivos | Fase 1 |
| Typesense | Busca global | Fase 5 |

---

## 3. Estrutura das Páginas

### Navegação global (Admin)

Sidebar fixa, minimalista, 10 itens no máximo:

```
[Logo Norax]

⌘K  Busca global

── PRINCIPAL ──
◎  Hoje          ← Dashboard renomeado (mais humano)
◎  Ações         ← Inbox de prioridades (CRÍTICO)
◎  Clientes
◎  Projetos

── NEGÓCIO ──
◎  Comercial
◎  Financeiro

── OPERAÇÃO ──
◎  Reuniões
◎  Arquivos
◎  Equipe

── SISTEMA ──
◎  Relatórios
◎  Configurações
```

### Mapa completo de páginas

#### Hoje (Dashboard)
```
/hoje
├── Resumo executivo (cards clicáveis)
├── Prioridades do dia (lista ordenada por IA + regras)
├── Agenda (próximas 48h)
├── Projetos em risco
├── Pagamentos pendentes
├── Atividades recentes
└── Indicadores (sparklines, não gráficos pesados)
```

#### Ações (Inbox — módulo crítico)
```
/acoes
├── Minhas pendências (ordenadas por urgência)
├── Aguardando minha aprovação
├── Aguardando resposta do cliente
├── Vencidas
└── Concluídas hoje
```

#### Clientes
```
/clientes
├── Lista (tabela densa estilo Linear)
├── /clientes/novo
└── /clientes/[id]          ← CENTRAL DO CLIENTE
    ├── /visao-geral
    ├── /projetos
    ├── /reunioes
    ├── /financeiro
    ├── /arquivos
    ├── /briefings
    ├── /contratos
    ├── /propostas
    ├── /historico
    └── /observacoes
```

#### Projetos
```
/projetos
├── Lista (kanban + lista toggle)
├── /projetos/novo
└── /projetos/[id]
    ├── /visao-geral
    ├── /cronograma
    ├── /checklist
    ├── /entregas
    ├── /equipe
    ├── /arquivos
    ├── /observacoes
    └── /historico
```

#### Comercial
```
/comercial
├── /pipeline              ← Kanban de oportunidades
├── /propostas
│   ├── /propostas/nova
│   └── /propostas/[id]
└── /contratos
    ├── /contratos/novo
    └── /contratos/[id]
```

#### Reuniões
```
/reunioes
├── /reunioes              ← Calendário + lista
├── /reunioes/agendar
└── /reunioes/[id]
    ├── Detalhes
    ├── Participantes
    ├── Gravação (se houver)
    ├── Resumo IA
    └── Pendências geradas
```

#### Financeiro
```
/financeiro
├── /visao-geral
├── /receitas
├── /despesas
├── /faturas
├── /pagamentos
└── /previsoes
```

#### Arquivos
```
/arquivos
├── /arquivos              ← Biblioteca global
└── Busca + filtros por cliente, projeto, tipo
```

#### Equipe
```
/equipe
├── /equipe                ← Lista de membros
├── /equipe/[id]           ← Perfil + projetos atribuídos
└── /equipe/convidar
```

#### Relatórios
```
/relatorios
├── /relatorios/receita
├── /relatorios/projetos
├── /relatorios/comercial
└── /relatorios/exportar
```

#### Configurações
```
/configuracoes
├── /configuracoes/empresa
├── /configuracoes/equipe
├── /configuracoes/permissoes
├── /configuracoes/templates
├── /configuracoes/integracoes
├── /configuracoes/notificacoes
└── /configuracoes/seguranca
```

#### Portal do Cliente (app separado)
```
/portal
├── /login
├── /home
├── /projetos/[id]
├── /propostas/[id]
├── /contratos/[id]
├── /briefings/[id]
├── /pagamentos
├── /arquivos
├── /solicitacoes
└── /reunioes/[token]
```

### Layout padrão de página (Admin)

```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumb minimal    [Ações contextuais] [···]         │
├─────────────────────────────────────────────────────────┤
│ Título                                    Status badge  │
│ Subtítulo contextual (1 linha)                          │
├─────────────────────────────────────────────────────────┤
│ ┌─ Tabs contextuais (se entidade) ─────────────────┐  │
│ │                                                   │  │
│ │   CONTEÚDO PRINCIPAL                              │  │
│ │                                                   │  │
│ │   ┌─ Próxima ação sugerida (banner sutil) ────┐  │  │
│ │   └────────────────────────────────────────────┘  │  │
│ │                                                   │  │
│ └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│ Painel lateral (opcional): contexto, equipe, tags       │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Fluxo do Cliente

### Jornada completa (Lead → Pós-venda)

```
Primeiro Contato
    ↓
Lead no Sistema
    ↓
Qualificação
    ↓
┌─ Não qualificado → Arquivado com motivo
└─ Qualificado
        ↓
    Briefing enviado (Portal)
        ↓
    Briefing respondido
        ↓
    Reunião de descoberta
        ↓
    Proposta criada
        ↓
    Proposta visualizada no Portal
        ↓
┌─ Recusada → Negociação / revisão → Nova proposta
└─ Aceita
        ↓
    Contrato gerado
        ↓
    Assinatura digital (Portal)
        ↓
    Pagamento inicial (Portal)
        ↓
    Projeto criado AUTOMATICAMENTE
        ↓
    Kickoff + cronograma
        ↓
    Desenvolvimento
        ↓
    Entregas parciais → Aprovação cliente
        ↓
    Entrega final
        ↓
    Pós-venda / suporte
```

### Detalhamento por etapa

| Etapa | Sistema faz | Cliente vê |
|-------|-------------|------------|
| Lead | Cria registro, atribui responsável comercial | Nada ainda |
| Briefing | Envia link no Portal | Formulário estruturado no Portal |
| Reunião | Gera link `meet.norax/abc123` | Tela minimal: logo, nome, horário, entrar |
| Proposta | PDF + visualização interativa no Portal | Proposta com aceite/recusa |
| Contrato | Integração assinatura digital | Assinatura no Portal |
| Pagamento | Link de pagamento (Stripe/MP) | Checkout no Portal |
| Projeto | Criado automaticamente pós-contrato+pagamento | Andamento, cronograma, arquivos |
| Entrega | Notificação + aprovação | Download + feedback |

### Regra crítica

Cada transição de estado é **automática** quando possível. O comercial não "cria projeto manualmente" — o sistema cria quando contrato assinado + pagamento confirmado.

### Estados do cliente

| Status | Significado | Cor |
|--------|-------------|-----|
| `lead` | Primeiro contato, não qualificado | Cinza |
| `qualified` | Qualificado, em negociação | Azul |
| `active` | Contrato ativo, projeto em andamento | Branco |
| `inactive` | Sem projetos ativos, relacionamento mantido | Cinza |
| `churned` | Cliente perdido / não renovou | Vermelho |

---

## 5. Fluxo Administrativo

### Rotina diária do fundador/gestor

```
08:00  Abre "Hoje"
       → Sistema mostra: 3 prioridades, 2 reuniões, 1 pagamento atrasado

08:05  Clica em pagamento atrasado
       → Vai direto para fatura + botão "enviar lembrete"

08:10  Clica em reunião das 10h
       → Vê briefing do cliente, histórico, proposta anterior

10:00  Reunião termina
       → IA processa (2-5 min)
       → Pendências aparecem em "Ações"

10:30  Aprova pendências geradas
       → Tarefas criadas automaticamente nos projetos corretos
```

### Fluxo de criação de cliente

```
Comercial → Clientes → Novo
├── Dados básicos (nome, email, telefone, segmento)
├── Contato principal
├── Origem (indicação, orgânico, ads)
├── Responsável interno
└── Salvar → Central do Cliente criada (vazia mas estruturada)
```

### Princípio: Zero telas órfãs

Toda entidade criada abre automaticamente sua "Central" com tabs prontas, mesmo vazias. O usuário nunca vê uma página em branco sem estrutura.

### Fluxo de handoff Comercial → Operação

```
Contrato assinado + Pagamento confirmado
    ↓
Sistema cria projeto automaticamente
    ↓
Aplica template de checklist (ex: "Site institucional")
    ↓
Notifica PM atribuído
    ↓
PM recebe em "Ações":
  "Novo projeto: Site Empresa ABC — revisar escopo e agendar kickoff"
    ↓
PM abre projeto → vê:
  - Briefing respondido
  - Proposta aprovada
  - Contrato assinado
  - Resumo da reunião de vendas
  - Checklist pré-populado
```

---

## 6. Fluxo Comercial

### Pipeline de oportunidades

```
Oportunidade
    ↓
Estágio: Descoberta (20%)
    ↓
Estágio: Qualificação (40%)
    ↓
Estágio: Proposta (60%)
    ↓
Estágio: Negociação (80%)
    ↓
Estágio: Fechamento (95%)
    ↓
┌─ Ganho → Contrato
└─ Perdido → Motivo registrado
```

### Pipeline stages

| Estágio | Probabilidade | Ação esperada |
|---------|---------------|---------------|
| Descoberta | 20% | Agendar reunião |
| Qualificação | 40% | Enviar briefing |
| Proposta | 60% | Criar e enviar proposta |
| Negociação | 80% | Ajustar proposta |
| Fechamento | 95% | Contrato + pagamento |

### Fluxo de proposta

```
Comercial cria proposta (template + customização)
    ↓
Revisão interna (opcional)
    ↓
Envia ao Portal do cliente
    ↓
Cliente recebe notificação (email)
    ↓
Sistema registra: visualizada, tempo de leitura
    ↓
┌─ Aceita → Gera contrato automaticamente
├─ Dúvida → Solicitação no Portal → aparece em "Ações"
└─ Recusa → Motivo obrigatório → oportunidade "perdida" ou "negociação"
```

### Estrutura da proposta

- Template reutilizável (módulos: escopo, prazo, investimento, condições)
- Versionamento (v1, v2, v3...)
- Validade automática
- Visualização premium no Portal (não PDF solto)
- Tracking: visualizada, tempo de leitura, seção mais vista

### Métricas comerciais

| Métrica | Onde aparece |
|---------|--------------|
| Taxa de conversão por estágio | Relatórios / Comercial |
| Tempo médio de fechamento | Dashboard "Hoje" |
| Valor do pipeline | Dashboard "Hoje" |
| Propostas pendentes de resposta | Ações (comercial) |

---

## 7. Fluxo do Desenvolvedor

### Rotina diária

```
Dev abre "Hoje"
    ↓
Vê: "Projeto Site XYZ — entregar homepage (vence hoje)"
    ↓
Clica → Projeto → Checklist → Item específico
    ↓
Dentro do item:
  ├── Descrição e critérios de aceite
  ├── Arquivos de referência
  ├── Comentários
  ├── Link para Figma/arquivos
  └── Botão: "Marcar como concluído"
    ↓
Ao concluir:
  ├── Próximo item do checklist destacado
  ├── Se era último da fase → notifica PM
  └── Atividade registrada no histórico do projeto
```

### O que o dev NÃO precisa ver

- Dados financeiros do cliente
- Margem do projeto
- Outros clientes
- Pipeline comercial

### Permissão de desenvolvedor

Escopo: projetos atribuídos + arquivos do projeto + reuniões que participa. Nada mais.

### Modo Foco (feature premium)

```
Dev ativa "Modo Foco" em um item do checklist
    ↓
Interface esconde sidebar, notificações, outros projetos
    ↓
Mostra apenas: tarefa atual + arquivos + comentários + timer
    ↓
Ao concluir → volta ao modo normal
```

---

## 8. Fluxo das Reuniões

### Sequência completa

```
1. Equipe agenda reunião no sistema
2. Sistema gera token único + link meet.norax
3. Cliente recebe email com link (via Portal)
4. Cliente acessa meet.norax/token
5. Sistema redireciona para sala do provedor de vídeo
6. Equipe entra na mesma sala
7. Reunião acontece
8. Provedor envia webhook: reunião encerrada
9. Sistema invalida token
10. Se gravada: transcrição enviada para IA
11. IA gera: resumo + pendências + próximos passos
12. Equipe recebe notificação: revisar resumo IA
13. Equipe aprova/edita resumo
14. Sistema salva no histórico do cliente
15. Tarefas pendentes criadas em "Ações"
```

### Tela da sala de espera (meet.norax)

```
┌─────────────────────────────────┐
│                                 │
│         [Logo Norax]           │
│                                 │
│    Reunião de Kickoff           │
│    Site Empresa ABC             │
│                                 │
│    Hoje, 10:00 - 11:00         │
│                                 │
│    ┌─────────────────────┐      │
│    │      ENTRAR         │      │
│    └─────────────────────┘      │
│                                 │
└─────────────────────────────────┘
```

Fundo preto. Tipografia branca. Um botão. Nada mais.

### Integração de vídeo — comparativo

| Opção | Prós | Contras |
|-------|------|---------|
| **Daily.co** | API excelente, salas temporárias, gravação | Custo por minuto |
| **Whereby** | Embedded, simples | Menos controle |
| **Livekit** | Open source, self-host | Mais complexo |

**Recomendação:** Daily.co para MVP. Migrar para Livekit se custo escalar.

### Pipeline IA pós-reunião

1. Transcrição (Deepgram ou AssemblyAI)
2. LLM estruturado (GPT-4o / Claude) com prompt fixo:
   - Resumo executivo (3-5 linhas)
   - Decisões tomadas
   - Pendências (com responsável sugerido)
   - Próximos passos
   - Tarefas acionáveis
3. Humano revisa antes de publicar (modo "rascunho" obrigatório no MVP)

### Regras de expiração do link

| Cenário | Comportamento |
|---------|---------------|
| Cliente chega no horário | Link funciona normalmente |
| Cliente chega 15min atrasado | Link ainda funciona (janela de tolerância) |
| Reunião reagendada | Novo token gerado, antigo invalidado |
| Reunião cancelada | Token invalidado, notificação enviada |
| 24h após reunião | Token expira definitivamente |

---

## 9. Fluxo do Portal do Cliente

### Princípios

- **Separado fisicamente** do admin (subdomínio, bundle, design system compartilhado mas não código de rotas)
- **Magic link** como autenticação primária (sem senha para cliente)
- **Escopo rígido:** cliente só vê dados do `client_id` vinculado ao seu usuário
- **Linguagem diferente:** "Seu projeto" não "Projeto #1234"

### Home do Portal

```
┌─────────────────────────────────────────────────┐
│  Olá, João                    [Notificações]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  SEU PROJETO ATIVO                              │
│  ┌─────────────────────────────────────────┐   │
│  │  Site Empresa ABC                        │   │
│  │  ████████░░░░  65% concluído            │   │
│  │  Próxima entrega: Homepage — 15/07      │   │
│  │  [Ver detalhes]                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  AÇÕES PENDENTES                                │
│  • Responder briefing de identidade visual      │
│  • Aprovar proposta de navegação                │
│  • Pagamento da 2ª parcela — vence em 3 dias   │
│                                                 │
│  DOCUMENTOS                                     │
│  • Contrato assinado — 01/06                    │
│  • Proposta aprovada — 28/05                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Ações do cliente no Portal

| Ação | Onde | Resultado no Admin |
|------|------|-------------------|
| Responder briefing | `/briefings/[id]` | Notificação + status atualizado |
| Aprovar entrega | `/projetos/[id]/entregas` | Tarefa concluída no checklist |
| Enviar arquivo | `/arquivos` | Aparece na Central do Cliente |
| Assinar contrato | `/contratos/[id]` | Evento `contract.signed` |
| Pagar fatura | `/pagamentos` | Webhook confirma pagamento |
| Enviar solicitação | `/solicitacoes` | Cria item em "Ações" da equipe |
| Entrar em reunião | Link direto | Registra presença |

### Segurança do Portal

- JWT com `client_id` no payload — middleware valida em toda request
- Row-Level Security no Postgres como segunda camada
- Rate limiting: 30 req/min por IP
- Sem listagem de rotas administrativas no bundle
- Audit log de todo acesso do cliente

---

## 10. Banco de Dados Sugerido

**PostgreSQL 16+** — única fonte de verdade relacional.

### Schemas lógicos

```sql
-- Organização
organizations
users
roles
permissions
role_permissions
user_roles

-- CRM
clients
client_contacts
client_notes
client_tags

-- Comercial
opportunities
proposals
proposal_versions
proposal_items
contracts
contract_signatures

-- Projetos
projects
project_phases
project_milestones
project_tasks
project_task_assignments
project_deliverables
checklists
checklist_items

-- Reuniões
meetings
meeting_participants
meeting_recordings
meeting_summaries
meeting_action_items

-- Briefings
briefing_templates
briefings
briefing_questions
briefing_responses

-- Financeiro
invoices
invoice_items
payments
payment_methods
expenses
financial_forecasts

-- Arquivos
files
file_versions

-- Sistema
activities          -- feed unificado
notifications
actions             -- inbox de pendências
domain_events       -- event sourcing light
audit_logs
settings
portal_users
```

### Índices críticos

```sql
CREATE INDEX idx_clients_status ON clients(status, assigned_to);
CREATE INDEX idx_projects_client ON projects(client_id, status);
CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_activities_client ON activities(client_id, created_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id, read_at NULLS FIRST);
CREATE INDEX idx_actions_user ON actions(assigned_to, status, due_at);
CREATE INDEX idx_meetings_scheduled ON meetings(scheduled_at, status);
```

### Row-Level Security (exemplo)

```sql
-- Portal users só veem dados do seu client_id
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY portal_projects ON projects
  FOR SELECT
  USING (client_id = current_setting('app.client_id')::uuid);
```

---

## 11. Estrutura das Entidades

### Organization

```yaml
Organization:
  id: uuid (PK)
  name: string
  slug: string (unique)
  logo_url: string?
  settings: jsonb
  created_at: timestamp
  updated_at: timestamp
```

### User (equipe interna)

```yaml
User:
  id: uuid (PK)
  organization_id: uuid (FK)
  email: string (unique)
  name: string
  avatar_url: string?
  role_id: uuid (FK)
  status: enum [active, inactive, invited]
  last_login_at: timestamp?
  two_factor_enabled: boolean
  created_at: timestamp
  updated_at: timestamp
```

### Client (Central do Cliente)

```yaml
Client:
  id: uuid (PK)
  organization_id: uuid (FK)
  name: string
  slug: string
  type: enum [company, individual]
  status: enum [lead, qualified, active, inactive, churned]
  segment: string?
  source: enum [referral, organic, ads, social, other]
  assigned_to: uuid (FK → users)
  logo_url: string?
  website: string?
  document: string?          # CPF/CNPJ (criptografado)
  address: jsonb
  metadata: jsonb
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp?     # soft delete
```

### ClientContact

```yaml
ClientContact:
  id: uuid (PK)
  client_id: uuid (FK)
  name: string
  email: string
  phone: string?
  role: string?              # "CEO", "Marketing", etc.
  is_primary: boolean
  portal_user_id: uuid? (FK) # link para PortalUser
  created_at: timestamp
```

### Project

```yaml
Project:
  id: uuid (PK)
  client_id: uuid (FK)
  name: string
  type: enum [website, landing_page, system, app, automation, other]
  status: enum [planning, in_progress, review, completed, paused, cancelled]
  priority: enum [low, medium, high, urgent]
  start_date: date
  due_date: date
  completed_at: timestamp?
  budget: decimal?
  description: text
  pm_id: uuid (FK → users)
  progress: integer          # 0-100, calculado do checklist
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp?
```

### ChecklistItem

```yaml
ChecklistItem:
  id: uuid (PK)
  project_id: uuid (FK)
  phase_id: uuid? (FK)
  title: string
  description: text?
  status: enum [pending, in_progress, completed, blocked]
  assigned_to: uuid? (FK → users)
  due_date: date?
  completed_at: timestamp?
  order: integer
  created_at: timestamp
```

### Meeting

```yaml
Meeting:
  id: uuid (PK)
  client_id: uuid (FK)
  project_id: uuid? (FK)
  title: string
  scheduled_at: timestamp
  duration_minutes: integer
  status: enum [scheduled, in_progress, completed, cancelled]
  room_token: string (unique)
  room_url: string
  provider: enum [daily, whereby, livekit]
  recording_url: string?
  created_by: uuid (FK → users)
  expires_at: timestamp
  created_at: timestamp
```

### MeetingSummary

```yaml
MeetingSummary:
  id: uuid (PK)
  meeting_id: uuid (FK)
  status: enum [processing, draft, approved]
  summary: text
  decisions: jsonb           # array de strings
  action_items: jsonb        # array de {title, assignee, due_date}
  next_steps: jsonb
  approved_by: uuid? (FK → users)
  approved_at: timestamp?
  created_at: timestamp
```

### Proposal

```yaml
Proposal:
  id: uuid (PK)
  client_id: uuid (FK)
  opportunity_id: uuid? (FK)
  title: string
  status: enum [draft, sent, viewed, accepted, rejected, expired]
  current_version: integer
  valid_until: date
  total_amount: decimal
  currency: string           # BRL
  sent_at: timestamp?
  viewed_at: timestamp?
  responded_at: timestamp?
  created_by: uuid (FK → users)
  created_at: timestamp
  updated_at: timestamp
```

### Contract

```yaml
Contract:
  id: uuid (PK)
  client_id: uuid (FK)
  proposal_id: uuid? (FK)
  title: string
  status: enum [draft, sent, signed, cancelled]
  content: text              # ou referência a template
  external_id: string?       # ID no Clicksign/D4Sign
  signed_at: timestamp?
  created_at: timestamp
```

### Invoice

```yaml
Invoice:
  id: uuid (PK)
  client_id: uuid (FK)
  project_id: uuid? (FK)
  contract_id: uuid? (FK)
  number: string
  status: enum [draft, sent, paid, overdue, cancelled]
  amount: decimal
  due_date: date
  paid_at: timestamp?
  payment_url: string?       # link Stripe/MP
  external_id: string?       # ID no gateway
  created_at: timestamp
```

### Briefing

```yaml
Briefing:
  id: uuid (PK)
  client_id: uuid (FK)
  project_id: uuid? (FK)
  template_id: uuid? (FK)
  title: string
  status: enum [draft, sent, in_progress, completed]
  sent_at: timestamp?
  completed_at: timestamp?
  created_at: timestamp
```

### File

```yaml
File:
  id: uuid (PK)
  organization_id: uuid (FK)
  attachable_type: string    # "client", "project", "proposal", etc.
  attachable_id: uuid
  name: string
  mime_type: string
  size_bytes: integer
  storage_key: string        # path no R2/S3
  uploaded_by: uuid (FK)
  version: integer
  created_at: timestamp
```

### Activity (spine do sistema)

```yaml
Activity:
  id: uuid (PK)
  organization_id: uuid (FK)
  actor_id: uuid?
  actor_type: enum [user, system, client]
  action: string             # "created", "updated", "signed", "paid"
  entity_type: string        # "project", "contract", "meeting"
  entity_id: uuid
  client_id: uuid?             # denormalizado para queries rápidas
  description: string        # human-readable
  metadata: jsonb
  created_at: timestamp
```

### Action (inbox de pendências)

```yaml
Action:
  id: uuid (PK)
  organization_id: uuid (FK)
  assigned_to: uuid (FK → users)
  title: string
  description: text?
  status: enum [pending, in_progress, completed, cancelled]
  priority: enum [low, medium, high, urgent]
  due_at: timestamp?
  entity_type: string?
  entity_id: uuid?
  client_id: uuid? (FK)
  source: enum [manual, meeting, automation, client_request]
  completed_at: timestamp?
  created_at: timestamp
```

### PortalUser

```yaml
PortalUser:
  id: uuid (PK)
  client_contact_id: uuid (FK)
  client_id: uuid (FK)       # denormalizado
  email: string
  magic_link_token: string?
  token_expires_at: timestamp?
  last_login_at: timestamp?
  created_at: timestamp
```

---

## 12. Relacionamentos

### Diagrama ER

```
Organization ──1:N── User
Organization ──1:N── Client

Client ──1:N── ClientContact
Client ──1:N── Project
Client ──1:N── Meeting
Client ──1:N── Proposal
Client ──1:N── Contract
Client ──1:N── Invoice
Client ──1:N── Briefing
Client ──1:N── File
Client ──1:N── Activity

ClientContact ──1:1── PortalUser (opcional)

Opportunity ──N:1── Client
Opportunity ──1:N── Proposal

Proposal ──1:N── ProposalVersion
Proposal ──1:1── Contract (quando aceita)

Contract ──1:N── ContractSignature
Contract ──1:N── Project (pode gerar múltiplos)

Project ──1:N── ProjectPhase
Project ──1:N── ProjectTask
Project ──1:N── ChecklistItem
Project ──1:N── ProjectDeliverable
Project ──N:N── User (equipe via project_members)

Meeting ──1:N── MeetingParticipant
Meeting ──1:1── MeetingSummary
Meeting ──1:N── MeetingActionItem

Briefing ──1:N── BriefingResponse

Invoice ──1:N── Payment

File ──N:1── (polymorphic) attachable
```

### Regras de relacionamento

1. **Client é a raiz** — quase tudo pertence a um cliente
2. **Project pertence a Client** — nunca projeto órfão
3. **Contract → Project** é 1:1 ou 1:N (um contrato pode gerar múltiplos projetos)
4. **Activity** denormaliza `client_id` para performance
5. **PortalUser** linka a `ClientContact`, nunca a `User` interno
6. **Action** sempre tem `assigned_to` — toda pendência tem dono
7. **File** é polimórfico — um arquivo pode pertencer a qualquer entidade

---

## 13. Tecnologias Recomendadas

### Stack principal

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| **Monorepo** | Turborepo + pnpm | Admin + Portal + packages compartilhados |
| **Frontend** | Next.js 15 (App Router) | RSC, streaming, performance |
| **Linguagem** | TypeScript (strict) | Segurança de tipos end-to-end |
| **UI** | Tailwind CSS + Radix UI | Acessível, customizável, premium |
| **Animações** | Framer Motion | Suaves, declarativas |
| **Estado servidor** | TanStack Query | Cache, invalidação, optimistic updates |
| **Estado cliente** | Zustand (mínimo) | Apenas UI state (sidebar, modals) |
| **Backend API** | tRPC ou Hono | Type-safe, leve |
| **ORM** | Drizzle ORM | Performance, SQL-like, migrations |
| **Banco** | PostgreSQL 16 (Neon) | Confiável, escalável, branching |
| **Cache/Queue** | Redis (Upstash) | Serverless-friendly |
| **Busca** | Typesense | Rápido, typo-tolerant |
| **Arquivos** | Cloudflare R2 | S3-compatible, sem egress fee |
| **Auth Admin** | Auth.js v5 + 2FA | Controle total |
| **Auth Portal** | Magic link custom | Simplicidade para cliente |
| **Email** | Resend | DX excelente |
| **Vídeo** | Daily.co | API de salas temporárias |
| **Transcrição** | Deepgram | Precisão, velocidade, PT-BR |
| **IA** | OpenAI GPT-4o / Claude | Resumos estruturados |
| **Assinatura** | Clicksign ou D4Sign | Compliance BR |
| **Pagamentos** | Stripe + Mercado Pago | Internacional + PIX BR |
| **Monitoramento** | Sentry + Axiom | Erros + logs |
| **CI/CD** | GitHub Actions + Vercel | Deploy automático |

### O que NÃO usar

| Tecnologia | Motivo |
|------------|--------|
| MongoDB | Relacionamentos complexos exigem SQL |
| Firebase como backend principal | Vendor lock-in, queries limitadas |
| Redux | Overkill para este caso |
| GraphQL no MVP | Complexidade desnecessária |
| Microserviços no início | Monólito modular primeiro |
| Prisma | Drizzle é mais performático e SQL-like |
| Material UI / Ant Design | Visual genérico, difícil customizar para premium |

### Estrutura do monorepo

```
norax/
├── apps/
│   ├── admin/              # Next.js — app.norax.com.br
│   ├── portal/             # Next.js — portal.norax.com.br
│   ├── meet/               # Next.js — meet.norax.com.br
│   └── api/                # Hono/tRPC server
├── packages/
│   ├── ui/                 # Design system
│   ├── database/           # Drizzle schema + client
│   ├── api-client/         # tRPC client tipado
│   ├── config/             # ESLint, TSConfig, Tailwind
│   ├── utils/              # Funções compartilhadas
│   └── types/              # Tipos compartilhados
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 14. Arquitetura Backend

### Estrutura monólito modular

```
apps/api/src/
├── modules/
│   ├── identity/
│   │   ├── identity.router.ts
│   │   ├── identity.service.ts
│   │   ├── identity.repository.ts
│   │   └── identity.schema.ts
│   ├── clients/
│   ├── projects/
│   ├── commercial/
│   ├── meetings/
│   ├── finance/
│   ├── files/
│   ├── portal/
│   └── actions/
├── shared/
│   ├── database/
│   ├── events/
│   ├── auth/
│   └── errors/
└── workers/
    ├── ai-summary.worker.ts
    ├── email.worker.ts
    └── webhook.worker.ts
```

### Padrão por módulo

Cada módulo segue a mesma estrutura:

```
modules/clients/
├── clients.router.ts       # rotas/endpoints
├── clients.service.ts      # lógica de negócio
├── clients.repository.ts   # queries
├── clients.schema.ts       # validação Zod
├── clients.events.ts       # domain events
└── clients.types.ts
```

### Event bus interno

```
EventBus.emit('contract.signed', { contractId, clientId })

Handlers registrados:
  on('contract.signed') → createProject()
  on('contract.signed') → notifyTeam()
  on('contract.signed') → sendWelcomeEmail()
  on('contract.signed') → createOnboardingChecklist()
  on('contract.signed') → createInvoice()
```

### Domain Events principais

| Evento | Handlers |
|--------|----------|
| `client.created` | Index search, notify assigned |
| `proposal.sent` | Email client, create activity |
| `proposal.accepted` | Generate contract |
| `contract.signed` | Create project, notify PM, create invoice |
| `payment.received` | Update invoice, notify finance |
| `meeting.completed` | Queue AI summary, invalidate token |
| `meeting.summary.approved` | Create actions, update client history |
| `project.task.completed` | Update progress, check phase completion |
| `checklist.completed` | Notify PM, suggest next phase |

### Workers assíncronos

| Worker | Trigger | Ação |
|--------|---------|------|
| `ai-summary` | `meeting.completed` | Transcreve → resume → cria pendências |
| `email` | Vários | Envia emails transacionais |
| `webhook-processor` | HTTP incoming | Processa Stripe, Clicksign, Daily |
| `notification` | Vários | Cria notificações in-app |
| `search-indexer` | CRUD | Atualiza Typesense |
| `action-generator` | Vários | Cria itens no inbox de Ações |

### API Design

- RESTful com recursos nomeados (`/clients`, `/projects`)
- tRPC para type-safety end-to-end entre frontend e backend
- Versionamento via header (`API-Version: 1`)
- Paginação cursor-based
- Filtros via query params padronizados
- Respostas sempre com envelope: `{ data, meta, errors }`

---

## 15. Arquitetura Frontend

### Três apps, packages compartilhados

```
apps/admin/     → Equipe Norax (app.norax.com.br)
apps/portal/    → Clientes (portal.norax.com.br)
apps/meet/      → Sala de espera (meet.norax.com.br)
packages/ui/    → Design system compartilhado
```

### Padrões frontend

| Padrão | Implementação |
|--------|---------------|
| Server Components por padrão | Client Components apenas para interatividade |
| Streaming com Suspense | Cada seção da Dashboard carrega independente |
| Optimistic updates | Checkbox, status changes |
| Command Palette (⌘K) | Em todo o admin |
| URL como estado | Filtros, tabs, paginação na URL |
| Prefetch on hover | Links pre-carregam dados |
| Error boundaries | Por seção, não por página |
| Skeleton loading | Nunca spinner genérico |

### Estrutura de uma página (App Router)

```
apps/admin/app/
├── (auth)/
│   ├── login/
│   └── layout.tsx
├── (dashboard)/
│   ├── layout.tsx          # Sidebar + header
│   ├── hoje/
│   │   └── page.tsx
│   ├── acoes/
│   │   └── page.tsx
│   ├── clientes/
│   │   ├── page.tsx
│   │   ├── novo/page.tsx
│   │   └── [id]/
│   │       ├── layout.tsx  # Hub layout
│   │       ├── page.tsx    # Visão geral
│   │       ├── projetos/page.tsx
│   │       └── ...
│   └── ...
└── layout.tsx
```

### Performance targets

| Métrica | Target |
|---------|--------|
| LCP | < 1.5s |
| FID | < 50ms |
| CLS | < 0.05 |
| Time to Interactive | < 2s |
| API p95 | < 200ms |
| Bundle size (admin) | < 200kb gzipped (initial) |

---

## 16. Estrutura de Componentes

### Hierarquia do Design System (`packages/ui`)

```
ui/
├── primitives/           # Radix wrappers
│   ├── Button
│   ├── Input
│   ├── Select
│   ├── Dialog
│   ├── Dropdown
│   ├── Tabs
│   ├── Tooltip
│   ├── Badge
│   ├── Avatar
│   ├── Checkbox
│   ├── Switch
│   └── ...
├── components/           # Compostos
│   ├── DataTable
│   ├── CommandPalette
│   ├── StatusBadge
│   ├── EmptyState
│   ├── LoadingSkeleton
│   ├── ActivityFeed
│   ├── Timeline
│   ├── FileUploader
│   ├── RichTextEditor
│   ├── DatePicker
│   ├── SearchInput
│   ├── NotificationBell
│   ├── PriorityCard
│   ├── ProgressBar
│   ├── Sidebar
│   ├── PageHeader
│   └── EntityHub/
│       ├── HubHeader
│       ├── HubTabs
│       └── HubSidebar
├── patterns/             # Padrões de página
│   ├── ListPage
│   ├── DetailPage
│   ├── FormPage
│   └── DashboardGrid
└── tokens/               # Design tokens
    ├── colors.ts
    ├── typography.ts
    ├── spacing.ts
    └── animations.ts
```

### Componentes exclusivos da Norax

| Componente | Função |
|------------|--------|
| `PriorityQueue` | Lista ordenada de "o que fazer agora" |
| `ClientHub` | Layout completo da Central do Cliente |
| `ProjectTimeline` | Cronograma visual interativo |
| `SmartSuggestion` | Banner de próxima ação contextual |
| `ActivitySpine` | Feed vertical conectando eventos |
| `MeetingCard` | Card com countdown + entrar |
| `ProposalViewer` | Visualização premium de proposta |
| `PortalActionCard` | Ação pendente no Portal do Cliente |
| `ChecklistProgress` | Progresso visual do checklist |
| `StatusPipeline` | Pipeline visual de oportunidades |

---

## 17. Design System

### Filosofia visual

> **"Silêncio visual, voz nos momentos certos."**

A interface é predominantemente preta e cinza. Cor é informação, não decoração.

### Tokens de cor

```yaml
# Base (95% da interface)
background:     "#090909"
surface:        "#111111"
surface-hover:  "#1a1a1a"
border:         "#222222"
border-subtle:  "#1a1a1a"

# Texto
text-primary:   "#FFFFFF"
text-secondary: "#A0A0A0"
text-tertiary:  "#666666"
text-disabled:  "#444444"

# Semânticas (usadas com parcimônia)
success:        "#22C55E"    # Verde — concluído
warning:        "#EAB308"    # Amarelo — atenção
error:          "#EF4444"    # Vermelho — problema
info:           "#3B82F6"    # Azul — informação
```

### Tipografia

```yaml
Font UI:     "Inter" (ou system font stack)
Font Mono:   "Geist Mono" (código/dados)

Scale:
  xs:   12px / 16px line-height
  sm:   13px / 20px
  base: 14px / 22px     # Corpo principal
  lg:   16px / 24px
  xl:   20px / 28px
  2xl:  24px / 32px
  3xl:  30px / 36px     # Títulos de página
```

### Espaçamento e forma

- Grid base: **4px** — todos os espaçamentos são múltiplos de 4
- Border-radius: 6px (padrão), 8px (cards), 12px (modals)
- Sombras: quase nenhuma; usar border sutil
- Hover: background shift sutil (100ms ease)
- Transições: 150ms para micro, 300ms para layout
- Densidade: alta (estilo Linear, não estilo Notion espaçoso)
- Dark mode apenas — sem toggle, sem light mode

### Iconografia

**Lucide Icons** — stroke 1.5px, 16px padrão, 20px em headers.

---

## 18. Sistema de Permissões

### Modelo RBAC + escopo

```
Permissão = Recurso + Ação + Escopo
Exemplo: projects:read:assigned
```

### Roles pré-definidos

| Role | Escopo | Descrição |
|------|--------|-----------|
| `owner` | Tudo | Fundador — irrestrito |
| `admin` | Tudo exceto billing da org | Gerente geral |
| `commercial` | Clientes, comercial, propostas | Vendas |
| `pm` | Projetos, clientes (leitura), equipe | Project Manager |
| `developer` | Projetos atribuídos | Dev/Designer |
| `finance` | Financeiro, contratos (leitura) | Financeiro |
| `viewer` | Leitura ampla | Estagiário/observador |

### Matriz de permissões

| Recurso | Owner | Admin | Commercial | PM | Dev | Finance |
|---------|-------|-------|------------|-----|-----|---------|
| Clientes | CRUD | CRUD | CRUD | R | - | R |
| Projetos | CRUD | CRUD | R | CRUD | RU* | R |
| Financeiro | CRUD | R | - | - | - | CRUD |
| Propostas | CRUD | CRUD | CRUD | R | - | R |
| Contratos | CRUD | CRUD | CRUD | R | - | R |
| Equipe | CRUD | CRUD | - | R | - | - |
| Config | CRUD | CRUD | - | - | - | - |
| Relatórios | R | R | R** | R** | - | R |

*RU = Read + Update apenas nos projetos atribuídos  
**Apenas relatórios do seu escopo

### Portal do Cliente

Permissão fixa: `portal:client:{client_id}` — sem roles internos.

---

## 19. Sistema de Segurança

### Camadas de defesa

```
1. Rede         → Cloudflare WAF + DDoS protection
2. Auth         → JWT (15min) + Refresh (7d) + 2FA admin
3. Autorização  → RBAC middleware + RLS Postgres
4. Dados        → Encryption at rest (AES-256) + TLS 1.3
5. Aplicação    → Input validation (Zod), CSRF, rate limiting
6. Auditoria    → Audit log imutável de ações sensíveis
7. Backup       → Point-in-time recovery (Neon) + R2 versioning
```

### Separação Admin / Portal

| Aspecto | Admin | Portal |
|---------|-------|--------|
| JWT issuer | `auth-admin.norax` | `auth-portal.norax` |
| Session store | Redis separado | Redis separado |
| CORS | `app.norax.com.br` | `portal.norax.com.br` |
| Rate limit | 100 req/min | 30 req/min |
| 2FA | Obrigatório | Não (magic link) |

### Dados sensíveis

- CPF/CNPJ: criptografado em repouso (AES-256-GCM)
- Dados de pagamento: nunca armazenados (tokenização Stripe/MP)
- Senhas: bcrypt (se usadas) — preferir magic link
- Logs: sem PII em plaintext

### Audit log (imutável)

Registrar obrigatoriamente:
- Login/logout
- Alteração de permissões
- Visualização de dados financeiros
- Exportação de dados
- Assinatura de contrato
- Exclusão (soft delete)
- Acesso ao Portal por cliente

### Compliance (LGPD)

- Consentimento explícito no Portal
- Direito ao esquecimento (soft delete + anonimização)
- DPO designado
- Política de retenção de dados desde o início
- Exportação de dados do cliente sob demanda

---

## 20. Roadmap de Desenvolvimento

### Fase 0 — Fundação (4-6 semanas)

- Monorepo (Turborepo + pnpm)
- CI/CD (GitHub Actions + Vercel)
- Design system base (tokens + 5 primitives)
- Auth admin (Auth.js + 2FA)
- Banco de dados + migrations (Drizzle)
- Layout admin (sidebar, header, command palette)
- Módulo de equipe/usuários

### Fase 1 — MVP Operacional (8-10 semanas)

- Clientes (CRUD + Central do Cliente)
- Projetos (CRUD + checklist + status)
- Dashboard "Hoje" (versão simples)
- Módulo Ações (inbox básico)
- Arquivos (upload/download)
- Atividades (feed básico)
- Briefings (criação + resposta manual)

### Fase 2 — Comercial (6-8 semanas)

- Pipeline de oportunidades
- Propostas (criação + templates)
- Portal do Cliente v1 (visualizar proposta + responder briefing)
- Envio de propostas por email

### Fase 3 — Contratos e Financeiro (6-8 semanas)

- Contratos + integração assinatura digital (Clicksign)
- Faturas + pagamentos (Stripe/MP)
- Portal: assinar contrato + pagar
- Automação: contrato assinado → cria projeto

### Fase 4 — Reuniões (4-6 semanas)

- Agendamento de reuniões
- Integração Daily.co
- Tela meet.norax (sala de espera)
- Formulário manual de ata (pré-IA)
- IA pós-reunião (transcrição + resumo)

### Fase 5 — Premium (6-8 semanas)

- Dashboard completa com indicadores
- Relatórios
- Busca global (Typesense)
- Notificações inteligentes
- Portal completo (todas as funcionalidades)
- Templates de projeto

### Fase 6 — Inteligência (ongoing)

- Sugestões automáticas de prioridade
- Alertas preditivos (projeto em risco)
- Automações customizáveis (if/then)
- Templates inteligentes
- Health score do cliente
- Scope Guard (IA)

### Timeline visual

```
Mês:  1    2    3    4    5    6    7    8    9   10   11   12
      ├────┤
      Fase 0 (Fundação)
           ├──────────┤
           Fase 1 (MVP Operacional)
                      ├────────┤
                      Fase 2 (Comercial)
                               ├────────┤
                               Fase 3 (Contratos + Financeiro)
                                        ├──────┤
                                        Fase 4 (Reuniões)
                                               ├────────┤
                                               Fase 5 (Premium)
                                                        ├────→
                                                        Fase 6 (IA)
```

**Total estimado:** 9-12 meses com 2-3 desenvolvedores full-time.

**MVP utilizável no dia a dia:** Fase 0 + Fase 1 = ~3 meses.

---

## 21. Ordem Ideal para Desenvolver Cada Módulo

```
 1. Infra + Monorepo + CI/CD
 2. Design System (primitives + tokens)
 3. Auth + Permissões
 4. Layout Admin (sidebar, header, ⌘K)
 5. Equipe/Usuários
 6. Clientes + Central do Cliente
 7. Projetos + Checklist
 8. Arquivos
 9. Activity Feed
10. Módulo Ações (inbox)
11. Dashboard "Hoje" (MVP)
12. Briefings
13. Comercial (pipeline + propostas)
14. Portal v1
15. Contratos + assinatura
16. Financeiro básico
17. Automações (contrato → projeto)
18. Reuniões + vídeo
19. IA pós-reunião
20. Dashboard completa
21. Relatórios
22. Busca global
23. Notificações avançadas
24. Portal completo
25. Features premium e IA
```

### Justificativa da ordem

| Decisão | Motivo |
|---------|--------|
| Clientes + Projetos primeiro | É o que a equipe usa todo dia |
| Ações antes da Dashboard completa | "O que fazer agora" é mais importante que métricas |
| Comercial antes de financeiro | Vendas gera receita |
| Portal só após propostas | Primeira interação real do cliente |
| Reuniões por último | Depende de clientes e projetos existentes |
| IA por último | Enhancement, não core |

---

## 22. Funcionalidades Premium

| Feature | Impacto | Esforço | Fase |
|---------|---------|---------|------|
| Command Palette (⌘K) | Altíssimo | Médio | 0 |
| Módulo Ações (Inbox) | Altíssimo | Médio | 1 |
| Sugestão de prioridade por IA | Altíssimo | Alto | 6 |
| Proposta interativa no Portal | Alto | Médio | 2 |
| Timeline visual do projeto | Alto | Médio | 5 |
| Resumo IA de reuniões | Alto | Alto | 4 |
| Automações visuais (if/then) | Alto | Alto | 6 |
| Dashboard personalizável por role | Médio | Médio | 5 |
| Templates de projeto por tipo | Médio | Baixo | 5 |
| Versionamento de arquivos | Médio | Médio | 3 |
| Modo foco (esconde tudo exceto tarefa) | Médio | Baixo | 5 |
| Digest diário por email | Médio | Baixo | 5 |
| Health score do cliente | Alto | Alto | 6 |
| Smart Handoff (comercial → PM) | Alto | Médio | 3 |
| Scope Guard (IA) | Alto | Alto | 6 |

---

## 23. Funcionalidades Inovadoras

Funcionalidades que poucas empresas do segmento possuem:

### 1. Project DNA
Ao criar projeto, IA analisa briefings + reuniões anteriores do cliente e sugere cronograma, checklist e riscos baseado em projetos similares anteriores.

### 2. Client Pulse
Score automático de satisfação baseado em: tempo de resposta do cliente, aprovações sem revisão, pagamentos em dia, tom das comunicações.

### 3. Revenue Forecasting
Previsão de receita baseada em pipeline + histórico de conversão + sazonalidade.

### 4. Smart Handoff
Quando comercial fecha venda, sistema gera automaticamente documento de handoff para PM com tudo que foi discutido — zero reunião de "passagem".

### 5. Contextual Time Tracking
Timer integrado que sabe em qual tarefa/projeto você está pelo contexto da página (não precisa "iniciar timer").

### 6. Client Portal como PWA
Cliente instala no celular, recebe push de aprovações e pagamentos.

### 7. Decisão Log
Registro imutável de TODAS as decisões do projeto (manual + extraídas de reuniões). Nunca mais "quem aprovou isso?".

### 8. Scope Guard
IA compara solicitações do cliente com escopo do contrato e alerta quando está fora do acordado.

### 9. Communication Log
Registro estruturado de comunicações externas (WhatsApp, telefone, email) com data e resumo — sem depender de integração com WhatsApp.

### 10. Playbooks internos
Fluxos documentados dentro do sistema (ex: "Como fazer kickoff de site institucional") — conhecimento da empresa preservado.

---

## 24. Pontos Fracos da Ideia

### 1. Escopo colossal para uma agência
14 módulos interconectados é um produto SaaS de $50M ARR, não uma ferramenta interna. **Risco #1: nunca lançar.**

### 2. "Tudo em um lugar" pode virar "tudo bagunçado"
Central do Cliente com 10 tabs pode ser tão confusa quanto 10 sistemas separados se a informação não for priorizada.

### 3. IA pós-reunião é mais difícil do que parece
Transcrição em português com jargão técnico + nomes próprios + sotaques brasileiros = qualidade inconsistente. Resumos errados destroem confiança.

### 4. Financeiro brasileiro é um buraco negro
NF-e, impostos, regime tributário, boleto, PIX, conciliação bancária — cada um é um módulo inteiro. "Financeiro" como módulo único é ingênuo.

### 5. Portal do Cliente com muitas funções
Quanto mais o portal faz, mais o cliente espera. E mais bugs potenciais em superfície de ataque.

### 6. Reuniões com link que expira
E se o cliente chegar 5 minutos atrasado? E se precisar reagendar em cima da hora? Rigidez demais gera atrito.

### 7. Ausência de comunicação estruturada
"WhatsApp é só comunicação" — mas sem registro no sistema, informações continuam se perdendo. Onde fica o email? A mensagem do Instagram?

### 8. Sem gestão de capacidade da equipe
Projetos + equipe sem workload view = burnout e atrasos invisíveis.

### 9. Sem gestão de conhecimento
Briefings e reuniões geram conhecimento. Onde ficam os aprendizados reutilizáveis?

### 10. Multi-projeto por cliente sem priorização
Cliente com 3 projetos ativos — qual é a prioridade? O sistema não define isso.

### 11. Sem estratégia de adoção interna
O melhor sistema falha se a equipe continuar usando WhatsApp para tudo. Tecnologia é 30% do problema. Adoção é 70%.

### 12. Sem métricas de sucesso definidas
Como saber que o sistema funciona? Sem KPIs, não há como medir ROI.

---

## 25. Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Scope creep mata o projeto | **Alta** | Crítico | MVP rigoroso, Fase 0-1 apenas |
| Custo de IA/transcrição escala rápido | **Alta** | Alto | Cache, só processar se gravado, limites |
| Integração assinatura digital falha | Média | Alto | Abstração de provider, fallback manual |
| Performance com muitos dados | Média | Alto | Paginação, índices, cache desde dia 1 |
| Segurança Portal (acesso cruzado) | Baixa | **Crítico** | RLS + testes de penetração + audit |
| Vendor lock-in (Daily, Clicksign) | Média | Médio | Abstração de providers |
| Complexidade do monorepo | Média | Médio | Turborepo, conventions claras |
| Migração de dados futura | Baixa | Alto | Migrations versionadas, seeds |
| Equipe pequena mantendo tudo | **Alta** | Crítico | Monólito modular, não microserviços |
| Qualidade IA em PT-BR | **Alta** | Alto | Revisão humana obrigatória, modo rascunho |
| Adoção interna falha | **Alta** | **Crítico** | Onboarding, incentivos, treinamento |

---

## 26. Melhorias Sugeridas

1. **Adicionar módulo "Ações" (Inbox)** — lista universal de tudo que precisa de ação do usuário logado. É o coração do "o que fazer agora".

2. **Adicionar Workload View** — calendário de capacidade da equipe por semana.

3. **Adicionar Communication Log** — registrar emails enviados pelo sistema + campo para registrar comunicações externas (WhatsApp, telefone) com data e resumo.

4. **Adicionar Templates de Projeto** — "Site institucional" gera checklist, cronograma e equipe padrão.

5. **Adicionar SLA tracking** — tempo de resposta, tempo de entrega, alertas de violação.

6. **Renomear Dashboard para "Hoje"** — comunica propósito.

7. **Adicionar onboarding wizard** — primeiro acesso configura equipe, templates, integrações.

8. **Adicionar modo "Apresentação"** — para mostrar andamento ao cliente em reunião presencial.

9. **Adicionar tags/labels universais** — cross-module filtering.

10. **Adicionar Playbooks** — fluxos documentados dentro do sistema.

11. **Definir KPIs de sucesso** desde o início (ver seção 30).

12. **Plano de adoção interna** — migração gradual do WhatsApp/planilhas para o sistema.

---

## 27. O Que Remover

| Remover do MVP | Motivo | Alternativa temporária |
|----------------|--------|------------------------|
| Módulo Relatórios | Dashboard + export CSV resolve 90% | Google Sheets |
| Múltiplos tipos de projeto | Começar só com "Site" | Adicionar tipos depois |
| Despesas no financeiro | Foco em receita primeiro | Planilha |
| Reuniões com vídeo | Complexo demais para MVP | Calendly + link manual |
| IA no MVP | Qualidade inconsistente | Formulário manual de ata |
| Cronograma Gantt complexo | Checklist com datas basta | Lista com due dates |
| Múltiplos contatos por cliente | Um contato principal basta | Adicionar depois |
| Configurações avançadas | Hardcode o razoável | Config manual no banco |
| Notificações push | Email basta no MVP | Resend |
| Busca global | Lista com filtros basta | Filtro por módulo |

---

## 28. O Que Adicionar

| Adicionar | Motivo | Prioridade |
|-----------|--------|------------|
| **Inbox/Ações** | Responde "o que fazer agora" | Crítica — Fase 1 |
| **Templates de tudo** | Proposta, contrato, checklist, briefing, email | Alta — Fase 1-2 |
| **Onboarding da equipe** | Sistema só funciona se a equipe adotar | Alta — Fase 0 |
| **Import de dados** | Clientes de planilha no setup inicial | Média — Fase 1 |
| **Webhook outbound** | Para automações futuras (n8n, Zapier) | Baixa — Fase 5 |
| **API pública** | Para integrações e produto SaaS | Baixa — Fase 6 |
| **Changelog interno** | Equipe sabe o que mudou no sistema | Média — Fase 2 |
| **Feature flags** | Deploy sem medo | Alta — Fase 0 |
| **Health check de integrações** | Status de Daily, Clicksign, Stripe | Média — Fase 3 |
| **Communication Log** | Registrar interações fora do sistema | Alta — Fase 2 |
| **Workload View** | Capacidade da equipe | Média — Fase 5 |
| **KPIs de sucesso** | Medir ROI do sistema | Alta — Fase 1 |

---

## 29. O Que Simplificar

### Dashboard "Hoje"
- **De:** 12 widgets simultâneos
- **Para:** 3 prioridades + agenda + 3 métricas. Clicável para aprofundar.

### Central do Cliente
- **De:** 10 tabs sempre visíveis
- **Para:** 4 tabs principais (Visão Geral, Projetos, Documentos, Histórico) + "Mais" para o restante.

### Comercial
- **De:** Pipeline + Propostas + Contratos como módulos separados
- **Para:** Um fluxo linear: Oportunidade → Proposta → Contrato (estágios, não módulos).

### Financeiro
- **De:** Receitas + Despesas + Faturas + Pagamentos + Previsões
- **Para:** Faturas + Pagamentos no MVP. Previsão como card na Dashboard.

### Permissões
- **De:** RBAC granular customizável
- **Para:** 5 roles fixos no MVP. Customização na Fase 6.

### Reuniões
- **De:** Integração vídeo + IA + transcrição + tarefas
- **Para:** Agendamento + link + formulário manual de ata no MVP.

### Projetos
- **De:** Fases + milestones + Gantt + checklist + entregas
- **Para:** Checklist com due dates + status no MVP.

---

## 30. Crítica Completa do Projeto

### O que está excelente

**Visão clara e diferenciada.** Você não quer um CRM — quer um OS. Isso é a decisão certa. CRMs genéricos falham para agências porque não entendem o fluxo projeto-venda-entrega.

**Filosofia de produto madura.** "Cada clique economiza tempo", "nenhuma informação depende da memória", "o sistema responde o que fazer agora" — esses princípios são de nível Linear/Notion. Se executados, criam vantagem real.

**Separação Admin/Portal/Meeting.** Muitos sistemas falham aqui. Três apps é a decisão correta de segurança e UX.

**Identidade visual definida.** Dark, minimalista, cor com significado. Isso elimina debates estéticos durante o desenvolvimento.

**Central do Cliente como conceito.** Ter um hub por cliente (não espalhar informação) é o padrão correto. É assim que o Stripe trata cada customer.

### O que me preocupa como CTO

**1. Este documento descreve 18 meses de trabalho, não um MVP.**

Você listou 14 módulos com funcionalidades profundas em cada um. Com 2 devs, são 12-18 meses antes de ter algo utilizável no dia a dia. O maior risco de startups de software interno é **nunca sair do modo desenvolvimento**.

**Recomendação forte:** defina o MVP como Fase 0 + Fase 1 + metade da Fase 2. Isso é Clientes + Projetos + Briefings + Dashboard simples. Use Calendly para reuniões. Use Clicksign standalone para contratos. Use planilha para financeiro por 3 meses. **Dogfood parcial é melhor que produto completo que nunca lança.**

**2. A Dashboard com 12 elementos não responde em 30 segundos — responde em 30 segundos de sobrecarga cognitiva.**

Linear tem UMA lista. Raycast tem UM input. Sua Dashboard tem 12 widgets. Contradição direta com "minimalista". A Dashboard deve ter **3 coisas**, não 12. O resto é um clique de distância.

**3. "O sistema deve responder o que fazer agora" — mas Ações/Inbox não estava na lista original de módulos.**

Este é o recurso mais importante do produto inteiro. Sem ele, você tem informação organizada mas não tem **direção**. Ações deve ser módulo #2, logo após Hoje.

**4. Financeiro brasileiro vai consumir 40% do tempo de desenvolvimento para 5% do valor.**

Integrar NF-e, conciliação, múltiplos métodos de pagamento, impostos — isso é um produto em si (Conta Azul, Omie). Para MVP: **link de pagamento Stripe/MP + registro manual de "pago/não pago"**. Integração profunda na Fase 3+.

**5. IA é feature, não fundação.**

Resumo automático de reunião é incrível — quando funciona. Quando erra (e vai errar, especialmente em PT-BR), destrói confiança. No MVP: formulário estruturado de ata com campos obrigatórios (decisões, pendências, próximos passos). Introduza IA como "sugestão" que o humano aprova, nunca como publicação automática.

**6. Falta estratégia de adoção interna.**

O melhor sistema do mundo falha se a equipe continuar usando WhatsApp para tudo. Onde está o plano de migração? Incentivos? Punições? Onboarding da equipe? **Tecnologia é 30% do problema. Adoção é 70%.**

**7. Sem métricas de sucesso definidas.**

Como você saberá que o sistema funciona? Defina agora:

| KPI | Target |
|-----|--------|
| Tempo para encontrar informação de um cliente | < 10 segundos |
| % de projetos com checklist completo | > 80% |
| % de reuniões com ata registrada | > 90% |
| Tempo do lead ao contrato assinado | Redução de 20% |
| NPS interno da equipe usando o sistema | > 8 |
| % de ações resolvidas no dia | > 70% |

**8. Escalabilidade para "sistemas, IA, apps" é prematura.**

Você é uma empresa de sites. O sistema deve ser excelente para **sites** primeiro. Quando fizer o 10º sistema, adicione o tipo "sistema" com template próprio. Não projete para casos que ainda não existem.

### Veredito final

| Aspecto | Nota | Comentário |
|---------|------|------------|
| Visão de produto | 9/10 | Clara, diferenciada, inspirada nos melhores |
| Escopo | 3/10 | Perigosamente grande |
| UX/UI | 8/10 | Princípios corretos, risco de sobrecarga na Dashboard |
| Arquitetura | 8/10 | Sólida se mantiver monólito modular |
| Segurança | 7/10 | Bem pensada, falta plano de compliance |
| Viabilidade | 5/10 | Viável com MVP cortado; inviável como descrito |
| Inovação | 8/10 | IA + Portal + Agency OS é diferenciador real |
| Adoção | 4/10 | Não endereçada |

### Recomendação estratégica

```
Ano 1, Q1-Q2:  MVP (Clientes + Projetos + Ações + Comercial básico)
Ano 1, Q2-Q3:  Dogfood com equipe real em projetos reais
Ano 1, Q4:     Contratos + Financeiro + Portal v1
Ano 2, Q1-Q2:  Reuniões + IA
Ano 2, Q3-Q4:  Premium + Relatórios + Automações
Ano 3+:        Produto SaaS para outras agências (se desejado)
```

### Frase final

**A Norax tem potencial real de ser um produto de nível mundial** — mas apenas se você tiver a disciplina de lançar algo "incompleto" em 3 meses e iterar com uso real, em vez de construir a catedral perfeita por 18 meses.

O maior inimigo deste projeto não é tecnologia. É **perfeccionismo de escopo**.

---

## Apêndice A — MVP de 90 Dias

Escopo mínimo para ter algo utilizável:

### Semana 1-2: Fundação
- [ ] Monorepo setup
- [ ] Design tokens + Button, Input, Badge
- [ ] Auth admin
- [ ] Layout (sidebar + header)

### Semana 3-4: Equipe + Clientes
- [ ] CRUD usuários
- [ ] CRUD clientes
- [ ] Central do Cliente (tabs vazias)

### Semana 5-6: Projetos
- [ ] CRUD projetos
- [ ] Checklist básico
- [ ] Atribuição de equipe

### Semana 7-8: Operação
- [ ] Upload de arquivos
- [ ] Activity feed
- [ ] Módulo Ações (inbox)

### Semana 9-10: Dashboard + Briefings
- [ ] Dashboard "Hoje" (3 prioridades + agenda)
- [ ] Briefings (criar + responder)

### Semana 11-12: Polish + Deploy
- [ ] Testes com equipe real
- [ ] Bug fixes
- [ ] Deploy produção

### O que fica DE FORA do MVP de 90 dias
- Portal do Cliente
- Comercial / Propostas
- Contratos
- Financeiro
- Reuniões com vídeo
- IA
- Relatórios
- Busca global

---

## Apêndice B — Wireframe Textual: Dashboard "Hoje"

```
┌─────────────────────────────────────────────────────────────────┐
│  Hoje                                          seg, 6 jul 2026  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SUAS PRIORIDADES                                    ver todas →│
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔴 Enviar proposta revisada — Empresa ABC      vence hoje│   │
│  │ 🟡 Revisar homepage — Site XYZ                  vence amanhã│   │
│  │ 🔵 Preparar kickoff — Cliente Novo              sex, 10/07 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ Receita do mês       │  │ Pipeline             │            │
│  │ R$ 45.000            │  │ R$ 120.000           │            │
│  │ ▲ 12% vs mês anterior│  │ 4 oportunidades      │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ Projetos ativos: 8   │  │ Pagamentos pendentes │            │
│  │ 2 em risco ⚠️        │  │ 3 — R$ 18.500        │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                 │
│  AGENDA                                              ver tudo →│
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 10:00  Kickoff — Site Empresa ABC                       │   │
│  │ 14:00  Revisão interna — Landing Page XYZ               │   │
│  │ 16:30  Call comercial — Lead Novo                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ATIVIDADE RECENTE                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ João concluiu "Header homepage" — Site XYZ    há 2h     │   │
│  │ Maria enviou proposta — Empresa ABC           há 4h     │   │
│  │ Cliente ABC assinou contrato                  ontem    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Apêndice C — Wireframe Textual: Central do Cliente

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Clientes                                                     │
│                                                                 │
│  [Logo] Empresa ABC                              Status: Ativo  │
│  Contato: João Silva — joao@empresa.com                        │
│  Responsável: Maria (Comercial)                                 │
│                                                                 │
│  ┌─ Próxima ação ──────────────────────────────────────────┐   │
│  │ Enviar proposta revisada (vence hoje)         [Enviar]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Visão Geral | Projetos | Documentos | Histórico | Mais ▾      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  RESUMO                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ 2 Projetos   │ │ 1 Proposta   │ │ R$ 25.000    │            │
│  │ ativos       │ │ pendente     │ │ em aberto    │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│  PROJETOS ATIVOS                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Site Institucional    ████████░░  80%    Entrega: 15/07  │   │
│  │ Landing Page Black    ███░░░░░░░  30%    Entrega: 30/07  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ATIVIDADE RECENTE                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Proposta v2 enviada                           há 2 dias │   │
│  │ Reunião de kickoff realizada                  há 5 dias │   │
│  │ Briefing respondido pelo cliente              há 1 sem  │   │
│  │ Cliente criado                                há 2 sem  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

*Documento gerado em 6 de julho de 2026.*  
*Norax — Agency OS*
