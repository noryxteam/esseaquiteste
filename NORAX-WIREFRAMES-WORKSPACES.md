# NORAX — Wireframes Estruturais dos Workspaces

**Documento:** Estrutura de interface (sem design visual)  
**Versão:** 1.0  
**Escopo:** 4 workspaces principais do App Admin  
**Público:** Fundador solo — uso diário

---

> **Regras deste documento**
>
> - Descreve **estrutura**, não aparência (sem cores, tipografia ou ícones definitivos).
> - Wireframes em **ASCII** representam hierarquia e posição, não pixel-perfect.
> - Alinhado ao Blueprint (A-02, A-06, A-10, A-21) e aos módulos oficiais.
> - **MVP:** seções colapsáveis em uma página — **sem abas** nos workspaces Cliente, Negociação e Projeto.

---

## Convenções globais (todos os workspaces)

### Shell da aplicação

```
┌──────────┬────────────────────────────────────────────────────────┐
│          │  Breadcrumb / Voltar                                   │
│ SIDEBAR  ├────────────────────────────────────────────────────────┤
│ (fixa)   │                                                        │
│          │              ÁREA DE CONTEÚDO                          │
│          │              (workspace)                               │
│          │                                                        │
└──────────┴────────────────────────────────────────────────────────┘
```

| Elemento | Comportamento |
|----------|---------------|
| **Sidebar** | Sempre visível em desktop; drawer em mobile |
| **Breadcrumb** | Contexto de navegação: módulo → entidade |
| **Área de conteúdo** | Scroll vertical independente |
| **Largura máxima** | Conteúdo centralizado com margens laterais em telas largas |

### Padrões transversais

| Padrão | Uso |
|--------|-----|
| **Próximo passo** | Faixa fixa abaixo do header — 1 CTA principal |
| **Timeline** | Lista vertical cronológica, mais recente no topo |
| **Skeleton** | Placeholders animados durante carregamento |
| **Empty state** | Ícone neutro + texto orientador + 1 ação primária |
| **Deep link** | Qualquer item clicável abre o contexto certo, não lista genérica |

### Breakpoints de responsividade

| Breakpoint | Largura | Comportamento |
|------------|---------|---------------|
| **Mobile** | < 640px | Sidebar oculta (hamburger) · Cards empilhados · Tabelas viram lista de cards |
| **Tablet** | 640–1024px | Sidebar colapsada (ícones) · Grid 2 colunas onde couber |
| **Desktop** | > 1024px | Layout completo · Grid até 4 colunas em métricas |

---

# 1. HOJE (Home)

**Rota:** `/hoje`  
**Objetivo:** Responder em 30 segundos — *"Como está minha empresa hoje?"*

---

## 1.1 Hierarquia da informação

```
Nível 1 — O que fazer AGORA
    └── Prioridades do dia (máx. 3 itens)

Nível 2 — Contexto operacional
    └── Métricas resumidas (4 cards clicáveis)

Nível 3 — Tempo
    └── Agenda próximas 48h

Nível 4 — Consciência situacional
    └── Atividade recente (últimos 5 eventos)

Nível 5 — Escape hatch
    └── Links "ver todas" → Ações, módulos
```

**Princípio:** Se o fundador ler só o Nível 1, o dia já tem direção.

---

## 1.2 Estrutura completa da tela

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Hoje                                              [Data por extenso]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SUAS PRIORIDADES                                    [Ver todas Ações →]│
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ [P] Título da ação — Contexto (cliente/projeto)     vencimento   │  │
│  │ [P] Título da ação — Contexto                       vencimento   │  │
│  │ [P] Título da ação — Contexto                       vencimento   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌──────────────────┐  │
│  │ CARD: Receita mês   │ │ CARD: Pipeline      │ │ CARD: Projetos   │  │
│  │ valor               │ │ valor + qtd         │ │ ativos + alertas │  │
│  │ variação vs anterior│ │                     │ │                  │  │
│  └─────────────────────┘ └─────────────────────┘ └──────────────────┘  │
│  ┌─────────────────────┐                                               │
│  │ CARD: Pagamentos    │                                               │
│  │ pendentes           │                                               │
│  └─────────────────────┘                                               │
│                                                                         │
│  AGENDA (48h)                                        [Ver agenda →]     │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ hora   título evento — cliente/contexto                          │  │
│  │ hora   título evento — cliente/contexto                          │  │
│  │ hora   título evento — cliente/contexto                          │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ATIVIDADE RECENTE                                                      │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ texto do evento — entidade                    tempo relativo       │  │
│  │ texto do evento — entidade                    tempo relativo       │  │
│  │ ... (máx. 5)                                                      │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1.3 Cards

| Card | Conteúdo | Clique leva a |
|------|----------|---------------|
| **Receita do mês** | Valor recebido no mês corrente · Variação % vs mês anterior | Financeiro (filtro: recebidos no mês) |
| **Pipeline** | Soma R$ negociações ativas · Qtd oportunidades | Comercial (filtro: ativas) |
| **Projetos ativos** | Contagem total · Subtexto: "X em risco" se aplicável | Projetos (filtro: em andamento) |
| **Pagamentos pendentes** | Qtd parcelas · Valor total pendente | Financeiro (filtro: pendentes) |

**Regra:** Máximo **4 cards** no MVP. Sem gráficos pesados — número + subtexto.

---

## 1.4 Tabelas

Hoje **não usa tabela principal**. Listas densas substituem tabelas:

| Lista | Formato | Colunas visuais |
|-------|---------|-----------------|
| **Prioridades** | Lista ordenada | Prioridade · Título · Contexto · Vencimento |
| **Agenda** | Lista cronológica | Hora · Título · Contexto |
| **Atividade** | Feed compacto | Descrição · Tempo relativo |

Em **mobile**, cada linha vira card empilhado com título em destaque.

---

## 1.5 Timeline

Hoje exibe **feed resumido**, não timeline completa:

| Campo por item | Exemplo |
|----------------|---------|
| Descrição | "Proposta v2 enviada — Empresa ABC" |
| Tempo | "há 2h" |
| Clique | Deep link para workspace origem |

Máximo **5 itens**. Link implícito: rolar não expande — "ver histórico" leva à Timeline do Cliente/Projeto.

---

## 1.6 Botões e ações

| Elemento | Tipo | Ação |
|----------|------|------|
| **Ver todas Ações** | Link secundário | `/acoes` |
| **Ver agenda** | Link secundário | Reuniões [FUTURO] ou Ações filtradas |
| **Linha de prioridade** | Clique na linha inteira | Deep link workspace |
| **Card métrica** | Clique no card | Módulo com filtro pré-aplicado |
| **Item atividade** | Clique | Deep link origem |

**Sem botões primários soltos no corpo** — o CTA vive nas prioridades.

---

## 1.7 CTA principal

**Não há um único botão fixo no Hoje.** O CTA principal é **dinâmico**:

| Situação | CTA |
|----------|-----|
| Existe prioridade urgente | Clicar na **1ª prioridade** da lista (vencida ou hoje) |
| Sem prioridades | Card "Pipeline" ou link "Ver Ações" |
| Primeiro uso (sistema vazio) | "Cadastrar primeiro cliente" |

A primeira linha de **SUAS PRIORIDADES** funciona como CTA implícito — maior contraste visual da página.

---

## 1.8 Estados vazios

### Sistema novo (zero dados)

```
┌─────────────────────────────────────────────────────────┐
│  Hoje                                    [data]         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Bem-vindo à Norax                                     │
│                                                         │
│  Comece cadastrando seu primeiro cliente ou             │
│  abrindo uma negociação.                                │
│                                                         │
│  [ Cadastrar cliente ]    [ Nova negociação ]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Dia sem prioridades (positivo)

```
SUAS PRIORIDADES
┌─────────────────────────────────────────────────────────┐
│  Nada urgente hoje.                                     │
│  Revise o pipeline ou avance um projeto.                  │
│                                                         │
│  [ Ver projetos ativos ]                                │
└─────────────────────────────────────────────────────────┘
```

Cards de métricas mostram `0` ou `—` com subtexto neutro.

### Agenda vazia

```
AGENDA (48h)
┌─────────────────────────────────────────────────────────┐
│  Nenhum compromisso nas próximas 48 horas.              │
└─────────────────────────────────────────────────────────┘
```

### Atividade vazia

```
ATIVIDADE RECENTE
┌─────────────────────────────────────────────────────────┐
│  Nenhuma atividade registrada ainda.                    │
└─────────────────────────────────────────────────────────┘
```

---

## 1.9 Estados de carregamento

Carregamento **por seção** (streaming) — página aparece imediatamente, seções preenchem em ordem:

| Ordem | Seção | Skeleton |
|-------|-------|----------|
| 1 | Header + data | Texto fixo (sem skeleton) |
| 2 | Prioridades | 3 retângulos de altura de linha |
| 3 | Cards | 4 retângulos em grid |
| 4 | Agenda | 3 linhas |
| 5 | Atividade | 5 linhas curtas |

**Erro por seção:** Mensagem inline "Não foi possível carregar" + link "Tentar novamente" — outras seções permanecem visíveis.

---

## 1.10 Estados de bloqueio

Hoje **não bloqueia** a tela inteira. Alertas de bloqueio aparecem **dentro das prioridades**:

| Origem | Como aparece em Hoje |
|--------|----------------------|
| Projeto com bloqueio cliente | Prioridade: "Material pendente há X dias — [Projeto]" |
| Proposta sem resposta 7d | Prioridade: "Follow-up proposta — [Cliente]" |
| Pagamento atrasado | Prioridade ou card Pagamentos destacado |
| Lead sem atividade | Prioridade: "Lead parado há X dias — [Cliente]" |

Indicador visual de severidade na linha (3 níveis: urgente · atenção · informativo) — sem definir cor aqui.

---

## 1.11 Responsividade

| Elemento | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Prioridades | Lista full-width | Idem | Idem |
| Cards métricas | 1 coluna (empilhados) | 2×2 grid | 4 colunas ou 2×2 |
| Agenda | Cards por evento | Lista | Lista |
| Atividade | Ocultar coluna tempo em telas muito estreitas; tempo abaixo do texto | Lista completa | Lista completa |
| Sidebar | Hamburger | Ícones | Expandida |

**Scroll:** Prioridades sempre visíveis sem scroll em mobile (máx. 3 itens garante isso).

---

# 2. WORKSPACE CLIENTE

**Rota:** `/clientes/[id]`  
**Objetivo:** Contexto completo do relacionamento — comercial + projetos + histórico

---

## 2.1 Hierarquia da informação

```
Nível 1 — Quem é
    └── Header: nome · status · contato

Nível 2 — O que fazer com este cliente
    └── Próximo passo sugerido (derivado de Ações/CORE)

Nível 3 — Resumo rápido
    └── Cards de contagem (projetos · comercial · financeiro)

Nível 4 — Trabalho ativo
    └── Seção Projetos · Seção Comercial

Nível 5 — Contexto e histórico
    └── Observações · Documentos · Timeline
```

---

## 2.2 Estrutura completa da tela

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Clientes                                                             │
├─────────────────────────────────────────────────────────────────────────┤
│  [Avatar/inicial]  NOME DO CLIENTE                    Status: [chip]  │
│                    Contato · telefone · email                           │
│                                                    [ Editar ] [ ··· ]   │
├─────────────────────────────────────────────────────────────────────────┤
│  PRÓXIMO PASSO                                                          │
│  Texto da ação sugerida para este cliente          [ CTA principal ]  │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                     │
│  │ Projetos     │ │ Comercial    │ │ Em aberto    │                     │
│  │ ativos: N    │ │ negociação   │ │ R$ valor     │                     │
│  └──────────────┘ └──────────────┘ └──────────────┘                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ▼ OBSERVAÇÕES                                          [ Editar ]      │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Texto livre de notas sobre o cliente                              │  │
│  │ (vazio: placeholder orientador)                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ PROJETOS                                    [ Ver todos projetos → ] │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Nome projeto · status · progresso bar · prazo                     │  │
│  │ Nome projeto · status · progresso bar · prazo                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ COMERCIAL                              [ + Nova negociação ]         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ NEGOCIAÇÃO ATIVA (se houver)                                      │  │
│  │ Título · estágio · valor · próximo passo        [ Abrir negociação]│  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │ HISTÓRICO COMERCIAL (colapsado por padrão)                        │  │
│  │ Negociações anteriores · propostas · contratos (resumo)           │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ DOCUMENTOS                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Lista compacta: nome arquivo · tipo · data · origem (projeto/com.)│  │
│  │ [ Ver biblioteca filtrada → ]                                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ TIMELINE                                    [ Filtro: Todos ▾ ]      │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ ● evento — descrição                         data/hora           │  │
│  │ ● evento — descrição                         data/hora           │  │
│  │ ● evento — descrição                         data/hora           │  │
│  │ [ Carregar mais ]                                                 │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Menu ··· (overflow):** Nova negociação · Marcar inativo · Descartar lead (se Lead)

---

## 2.3 Cards

| Card | Dado | Clique |
|------|------|--------|
| **Projetos ativos** | Contagem projetos não-terminal | Expande seção Projetos |
| **Comercial** | "1 negociação ativa" ou "Nenhuma" | Expande seção Comercial |
| **Em aberto** | Valor total pendente (propostas + parcelas) | Financeiro filtrado por cliente |

Cards são **resumo**, não navegação principal — deep links estão nas seções.

---

## 2.4 Tabelas

| Onde | Formato MVP | Colunas |
|------|-------------|---------|
| **Projetos** | Lista densa (não tabela em mobile) | Nome · Status · Progresso · Prazo |
| **Documentos** | Lista compacta | Nome · Tipo · Data · Origem |
| **Histórico comercial** | Lista colapsada | Título negociação · Status · Valor · Data |

Desktop: Projetos pode usar tabela com 4 colunas. Mobile: cada projeto vira card.

---

## 2.5 Timeline

Timeline **unificada** — comercial + projetos + financeiro do cliente.

| Campo | Descrição |
|-------|-----------|
| **Marcador** | Ponto na linha vertical |
| **Título** | Texto humano do evento CORE |
| **Timestamp** | Data/hora absoluta + relativa no hover [desktop] |
| **Link** | Clique abre negociação ou projeto se aplicável |

**Filtros [dropdown]:** Todos · Comercial · Projetos · Financeiro

**Paginação:** 20 itens iniciais · "Carregar mais" (não scroll infinito no MVP)

**Ordem:** Mais recente primeiro (imutável — Lei 3 CORE)

---

## 2.6 Botões

| Botão | Posição | Ação |
|-------|---------|------|
| **Editar** | Header | Modal editar cliente |
| **CTA principal** | Faixa Próximo passo | Ação contextual (ver 2.7) |
| **Nova negociação** | Seção Comercial | Modal nova negociação |
| **Abrir negociação** | Card negociação ativa | Workspace Negociação |
| **Editar** | Seção Observações | Inline ou modal |
| **Ver biblioteca** | Seção Documentos | Arquivos filtrados |
| **Ver todos projetos** | Seção Projetos | Lista projetos filtrada |

**Secundários:** Links texto, não botões preenchidos.

---

## 2.7 CTA principal

Dinâmico conforme estado do cliente:

| Estado cliente | CTA na faixa "Próximo passo" |
|----------------|------------------------------|
| Lead, sem qualificar | `Qualificar lead` |
| Lead qualificado, sem reunião | `Agendar reunião` [manual MVP] |
| Negociação aberta, sem escopo | `Registrar escopo` |
| Proposta enviada | `Registrar resposta` |
| Contrato assinado, sem pagamento | `Registrar pagamento` |
| Projeto ativo com bloqueio | `Abrir projeto` (leva ao workspace) |
| Cliente inativo, sem pendências | `Nova negociação` |
| Nada pendente | Faixa oculta ou "Nenhuma ação pendente" |

**Regra:** 1 CTA visível. Ação secundária no menu ···

---

## 2.8 Estados vazios

### Cliente recém-criado

| Seção | Empty state |
|-------|-------------|
| Observações | "Adicione notas sobre este cliente." + link Editar |
| Projetos | "Nenhum projeto ainda." |
| Comercial | "Nenhuma negociação." + botão Nova negociação |
| Documentos | "Nenhum arquivo." |
| Timeline | "Cliente criado em [data]." (único item) |

### Cliente Lead sem atividade

Banner sutil abaixo do header: "Lead sem atividade há X dias."

### Cliente Perdido / Inativo

Header com status visual distinto. Seções colapsadas por padrão exceto Timeline. CTA: "Reabrir negociação" ou oculto.

---

## 2.9 Estados de carregamento

| Bloco | Skeleton |
|-------|----------|
| Header | Retângulo nome + 2 linhas contato |
| Próximo passo | Faixa com 1 linha |
| Cards resumo | 3 retângulos |
| Seções | Título fixo + 2–3 linhas por seção |

**Estratégia:** Header primeiro → Próximo passo → restante em paralelo.

---

## 2.10 Estados de bloqueio

Cliente **não tem bloqueio próprio** — herda dos filhos:

| Situação | Onde aparece |
|----------|--------------|
| Projeto bloqueado | Card projeto com badge "Aguardando cliente" · Próximo passo aponta projeto |
| Negociação travada (contrato/pagamento) | Seção Comercial destaca estágio · Próximo passo comercial |
| Múltiplas pendências | Próximo passo mostra a de **maior prioridade** (CORE); demais nas Ações |

Sem banner de bloqueio full-width no Cliente — bloqueio detalhado vive no Workspace Projeto.

---

## 2.11 Responsividade

| Elemento | Mobile | Desktop |
|----------|--------|---------|
| Header | Nome + status empilhados · Editar no ··· | Linha única |
| Cards resumo | Scroll horizontal ou 1 coluna | 3 colunas |
| Seções | Todas colapsáveis; Comercial e Projetos abertas por padrão | Idem |
| Projetos | Card por projeto | Tabela/lista |
| Timeline | Full width | Max 720px legível |
| CTA próximo passo | Botão full-width | Alinhado à direita |

**Âncora mobile:** Próximo passo sticky abaixo do header ao rolar (opcional, recomendado).

---

# 3. WORKSPACE NEGOCIAÇÃO

**Rota:** `/comercial/[id]`  
**Objetivo:** Operar venda completa até handoff — escopo → proposta → contrato → pagamento → projeto

---

## 3.1 Hierarquia da informação

```
Nível 1 — Contexto da venda
    └── Header: cliente · título · status

Nível 2 — Ação imediata
    └── Próximo passo (sempre visível, sticky)

Nível 3 — Metadados da negociação
    └── Valor · validade · dias desde envio · revisões

Nível 4 — Documentos do ciclo
    └── Seções: Escopo · Proposta · Contrato

Nível 5 — Relacionamento
    └── Interações

Nível 6 — Auditoria
    └── Timeline da negociação
```

---

## 3.2 Estrutura completa da tela

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Comercial                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│  TÍTULO DA NEGOCIAÇÃO                              Status: [chip]     │
│  Cliente: [link nome] · Tipo serviço estimado                           │
│                                              [ Arquivar ] [ ··· ]       │
├─────────────────────────────────────────────────────────────────────────┤
│  PRÓXIMO PASSO                                                          │
│  Descrição da ação necessária                      [ CTA principal ]  │
├─────────────────────────────────────────────────────────────────────────┤
│  R$ 8.000  ·  Validade: 15/07  ·  Enviada há 3 dias  ·  Revisões: 0/2 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ▼ ESCOPO                                    [ Editar escopo ]          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Objetivo                                                          │  │
│  │ Entregáveis (lista)                                               │  │
│  │ Não inclui (lista)                                                │  │
│  │ Prazo estimado · Valor interno                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ PROPOSTA                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Versão atual: v2 · Status: Enviada · Data envio                   │  │
│  │ [ Preview ]  [ Duplicar ]  [ Editar rascunho ]  [ Enviar ]          │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │ Versões anteriores (colapsado)                                    │  │
│  │ v1 · Enviada · data · [ ver PDF ]                                 │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ CONTRATO                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Status: Aguardando assinatura                                     │  │
│  │ [ Preview ]  [ Marcar enviado ]  [ Registrar assinatura ]         │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ FINANCEIRO (parcelas desta negociação)                               │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Parcela inicial: Paga ✓ · R$ 4.000 · data                         │  │
│  │ Parcela final: Pendente · R$ 4.000 · vencimento                   │  │
│  │                              [ Registrar pagamento ]              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ INTERAÇÕES                                    [ + Registrar ]        │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ tipo · resumo · data                                              │  │
│  │ tipo · resumo · data                                              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ TIMELINE                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ ● evento comercial                           data                 │  │
│  │ ● evento comercial                           data                 │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ── HANDOFF (visível quando pagamento inicial confirmado) ──            │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Pagamento inicial recebido. Pronto para criar projeto.            │  │
│  │                              [ Converter em projeto ]             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Deep link:** Ao abrir de Hoje/Ações, a seção relevante abre expandida e scroll até ela (ex: proposta vencendo → seção Proposta).

---

## 3.3 Cards

Negociação usa **poucos cards** — metadados em faixa horizontal:

| Elemento | Função |
|----------|--------|
| **Faixa de metadados** | Valor · validade · tempo · revisões — não clicável |
| **Card handoff** | Aparece só quando elegível — CTA converter projeto |
| **Status chips** | Proposta: rascunho/enviada/aprovada · Contrato: pendente/assinado |

Seções colapsáveis substituem cards para conteúdo denso.

---

## 3.4 Tabelas

| Onde | Uso |
|------|-----|
| **Versões de proposta** | Lista: versão · status · data · ação ver PDF |
| **Interações** | Lista: tipo · resumo · data (últimas 10; resto em Timeline) |
| **Financeiro** | Lista 2 linhas (inicial + final) — não tabela complexa |

---

## 3.5 Timeline

Timeline **da negociação** (subset da Timeline do Cliente).

| Eventos típicos | Texto |
|-----------------|-------|
| negociacao.criada | "Negociação aberta" |
| escopo.registrado | "Escopo registrado — [tipo]" |
| proposta.enviada | "Proposta v[N] enviada — R$ X" |
| proposta.aprovada | "Proposta aprovada" |
| contrato.assinado | "Contrato assinado" |
| pagamento.recebido | "Pagamento inicial — R$ X" |
| negociacao.interacao | "Ligação — [resumo]" |

Sem filtro na negociação (já é contexto único). Link para Timeline completa do Cliente no footer da seção.

---

## 3.6 Botões

| Botão | Seção | Quando visível |
|-------|-------|----------------|
| **CTA principal** | Próximo passo | Sempre (dinâmico) |
| **Editar escopo** | Escopo | Negociação não ganha/perdida |
| **Criar proposta** | Proposta | Escopo registrado, sem proposta ativa |
| **Enviar** | Proposta | Rascunho pronto |
| **Duplicar** | Proposta | Existe versão anterior |
| **Registrar resposta** | Proposta | Status enviada |
| **Marcar enviado / Registrar assinatura** | Contrato | Fase contrato |
| **Registrar pagamento** | Financeiro | Contrato assinado |
| **Converter em projeto** | Handoff | Pagamento inicial ✓ |
| **Registrar interação** | Interações | Sempre |
| **Arquivar** | Header | Perdida ou cancelada |

**Estados terminais (ganha/perdida):** Botões de edição ocultos; somente leitura + link projeto (se ganha).

---

## 3.7 CTA principal

Máquina de estados → CTA único:

| Status negociação | CTA |
|-------------------|-----|
| aberta | `Qualificar` ou `Registrar escopo` |
| descoberta | `Registrar escopo` |
| escopo registrado | `Criar proposta` |
| proposta rascunho | `Enviar proposta` |
| proposta enviada | `Registrar resposta do cliente` |
| em negociação | `Duplicar proposta` ou `Registrar resposta` |
| aguardando contrato | `Registrar assinatura` |
| aguardando pagamento | `Registrar pagamento inicial` |
| pagamento recebido | `Converter em projeto` |
| ganha | `Abrir projeto` (link) |
| perdida | CTA oculto |

---

## 3.8 Estados vazios

| Seção | Empty |
|-------|-------|
| Escopo | "Registre o escopo após a reunião de descoberta." + CTA |
| Proposta | "Crie a proposta a partir do escopo." + CTA |
| Contrato | "Disponível após proposta aprovada." (desabilitado visualmente) |
| Financeiro | "Parcelas definidas no contrato." |
| Interações | "Registre ligações e mensagens importantes." |
| Timeline | "Negociação aberta em [data]." |

---

## 3.9 Estados de carregamento

| Prioridade | Bloco |
|------------|-------|
| 1 | Header + status |
| 2 | Próximo passo + CTA |
| 3 | Faixa metadados |
| 4 | Seção contextual (deep link) ou Escopo |
| 5 | Demais seções colapsadas com skeleton 2 linhas |

Negociação **ganha:** carregamento rápido modo leitura — sem skeleton em seções vazias.

---

## 3.10 Estados de bloqueio

Negociação não usa "bloqueio" como Projeto — usa **aguardando**:

| Aguardando | Indicador | Onde |
|------------|-----------|------|
| Resposta cliente | Subtexto "Sem resposta há X dias" na faixa metadados | Header area |
| Assinatura | Status contrato + alerta se > 7 dias | Seção Contrato |
| Pagamento | Status parcela + alerta se > 5 dias | Seção Financeiro |
| Proposta vencendo | "Validade em X dias" na faixa | Header area |

**Banner de alerta** (faixa abaixo metadados, acima seções): aparece quando alerta temporal CORE dispara — texto + CTA repetido do próximo passo.

Não confundir com gate G-01/G-02 — gates são validações no fluxo, alertas são visuais.

---

## 3.11 Responsividade

| Elemento | Mobile | Desktop |
|----------|--------|---------|
| Próximo passo | Sticky top ao rolar | Sticky abaixo header |
| Metadados | Empilhados (valor / validade / dias) | Linha horizontal |
| Seções | Uma aberta por vez recomendado | Múltiplas abertas |
| Botões proposta | Empilhados full-width | Inline |
| Handoff card | Full-width destaque | Mesmo |
| Preview PDF | Nova aba / viewer nativo | Painel lateral [FUTURO] |

**Scroll inteligente:** Deep link posiciona seção alvo no topo da viewport mobile.

---

# 4. WORKSPACE PROJETO

**Rota:** `/projetos/[id]`  
**Objetivo:** Executar do kickoff à entrega — único lugar da operação

---

## 4.1 Hierarquia da informação

```
Nível 1 — Identidade e saúde
    └── Nome · cliente · status · progresso · prazo

Nível 2 — Por que parou (se parou)
    └── Banner de bloqueio

Nível 3 — O que fazer agora
    └── Próximo passo

Nível 4 — Divisão de responsabilidade
    └── Pendente Norax | Pendente Cliente

Nível 5 — O que foi vendido vs o que executar
    └── Escopo vendido (read-only) · Briefing execução

Nível 6 — Trabalho
    └── Checklist · Cronograma · Revisões · Aprovações

Nível 7 — Artefatos e pós-entrega
    └── Arquivos · Garantia

Nível 8 — Histórico
    └── Timeline
```

**Regra de ouro:** Em 3 minutos de leitura — o que é, onde está, o que falta, quem deve agir.

---

## 4.2 Estrutura completa da tela

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Projetos                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│  NOME DO PROJETO                                   Status: [chip]      │
│  Cliente: [link] · Tipo: Site institucional                           │
│  Progresso: [████████░░░░] 65%                                        │
│  Prazo: início · limite · X dias restantes              [ ··· ]         │
├─────────────────────────────────────────────────────────────────────────┤
│  BLOQUEIO: Aguardando cliente — textos da página Sobre (há 5 dias)     │
│  [ Registrar material ]  [ Resolver bloqueio ]                          │
├─────────────────────────────────────────────────────────────────────────┤
│  PRÓXIMO PASSO                                                          │
│  Cobrar material OU avançar: Desenvolvimento Home    [ CTA principal ] │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐        │
│  │ PENDENTE NORAX             │ │ PENDENTE CLIENTE            │        │
│  │ • Item checklist            │ │ • Material: textos Sobre    │        │
│  │ • Item checklist            │ │ • Aprovação rodada 1        │        │
│  └─────────────────────────────┘ └─────────────────────────────┘        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ▼ ESCOPO VENDIDO (somente leitura)              [ Ver negociação → ] │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Snapshot do escopo comercial no handoff                             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ BRIEFING DE EXECUÇÃO                                                 │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Materiais esperados: lista com status (pendente/recebido)         │  │
│  │ Acessos necessários: lista                                        │  │
│  │ Notas de kickoff: texto                                           │  │
│  │ [ Registrar material ]  [ Editar notas ]                          │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ CHECKLIST                                                            │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ [ ] Item — responsável · prazo opcional                           │  │
│  │ [x] Item concluído                                                │  │
│  │ [ ] Item em destaque (próximo)                                    │  │
│  │ [ + Adicionar item ] [FUTURO MVP: checklist fixo por tipo]        │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ CRONOGRAMA                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Marco · data prevista · status                                      │  │
│  │ Marco · data prevista · status                                      │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ REVISÕES E APROVAÇÕES                                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Revisões contratuais: 1 de 2 utilizadas                           │  │
│  │ Rodada atual: aguardando feedback / ajustes / aprovada              │  │
│  │ [ Apresentar ao cliente ] [ Registrar feedback ] [ Aprovação ]      │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ ARQUIVOS                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Pasta materiais-cliente/ · entregas/rodada-n/ · ...               │  │
│  │ [ Upload ]  [ Ver biblioteca → ]                                  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ GARANTIA (visível após entrega)                                      │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Período: início — fim (30 dias) · Status: ativa                   │  │
│  │ Chamados abertos: N                                               │  │
│  │ [ Registrar chamado ]  [ Encerrar garantia ]                        │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ▼ TIMELINE                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ ● evento projeto                             data                 │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ── AÇÕES DE CICLO (footer contextual por estado) ──                   │
│  [ Encerrar projeto ]  (visível em Concluído/Garantia encerrada)        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Menu ···:** Registrar bloqueio · Link negociação origem · Financeiro · Arquivar [estado terminal]

---

## 4.3 Cards

| Card / bloco | Conteúdo | Quando |
|--------------|----------|--------|
| **Pendente Norax** | Até 5 itens do checklist + bloqueio interno | Projeto ativo |
| **Pendente Cliente** | Materiais pendentes + aprovações aguardando | Projeto ativo |
| **Banner bloqueio** | Tipo · descrição · dias parado | bloqueio ≠ nenhum |
| **Garantia** | Datas · chamados | pós E-35 |
| **Alerta prazo** | "Prazo em 7 dias — progresso 65%" | regra Dashboard | 

Cards de pendência são **operacionais** — item clicável marca checklist ou abre modal material.

---

## 4.4 Tabelas

| Seção | Formato | Colunas |
|-------|---------|---------|
| **Checklist** | Lista interativa com checkbox | Item · status · [ações] |
| **Materiais** | Lista com status | Nome · esperado/recebido · data · upload |
| **Cronograma** | Lista ou mini-tabela | Marco · data · status |
| **Arquivos** | Lista compacta | Nome · pasta · data |
| **Chamados garantia** | Lista | ID · descrição · status · data |

Checklist **não** é tabela em mobile — cards com checkbox grande à esquerda.

---

## 4.5 Timeline

Eventos do projeto + espelho na Timeline do Cliente.

| Fase | Eventos |
|------|---------|
| Início | projeto.criado · kickoff · materiais |
| Execução | checklist 100% · revisão interna |
| Cliente | apresentado · ajustes · aprovado |
| Fim | pagamento final · entregue · garantia |

**Diferencial:** Eventos de bloqueio (E-56/E-57) aparecem com duração ("bloqueio resolvido após 5 dias").

---

## 4.6 Botões

| Botão | Contexto |
|-------|----------|
| **CTA principal** | Próximo passo |
| **Registrar material** | Briefing / banner bloqueio |
| **Resolver bloqueio** | Banner bloqueio |
| **Concluir item** | Checklist (checkbox = ação) |
| **Apresentar ao cliente** | Revisões, pós-QA |
| **Registrar feedback** | Pós-apresentação |
| **Registrar aprovação** | Pré-entrega |
| **Confirmar entrega** | Pós-aprovação + pagamento |
| **Registrar chamado** | Garantia |
| **Encerrar projeto** | Pós-garantia |
| **Ver negociação** | Escopo vendido (link read-only) |

Botões destrutivos (encerrar, arquivar) no menu ··· ou footer, nunca ao lado do CTA principal.

---

## 4.7 CTA principal

| Estado projeto | CTA |
|----------------|-----|
| Planejamento (sem kickoff) | `Realizar kickoff` |
| Aguardando materiais | `Registrar material` ou `Cobrar cliente` [interação] |
| Em andamento | `Concluir: [próximo item checklist]` |
| Checklist 100% | `Iniciar revisão interna` |
| Em revisão (QA) | `Aprovar QA` |
| Pronto para cliente | `Apresentar ao cliente` |
| Aguardando cliente (feedback) | `Registrar feedback` |
| Ajustes em curso | `Marcar ajustes concluídos` |
| Aprovado | `Registrar pagamento final` ou `Executar entrega` |
| Entregue / Garantia | `Registrar chamado` ou oculto |
| Concluído | `Encerrar projeto` |

Se bloqueio cliente ativo: CTA pode ser **cobrar material** mesmo com item interno disponível — texto do próximo passo deixa claro: "OU avançar item sem dependência".

---

## 4.8 Estados vazios

| Seção | Empty |
|-------|-------|
| Briefing materiais | "Defina materiais no kickoff." |
| Checklist | Gerado automaticamente no handoff — se vazio, erro de sistema |
| Cronograma | "Prazo definido no escopo: [data]. Adicione marcos." |
| Revisões | "Apresente ao cliente para iniciar rodadas." |
| Arquivos | "Nenhum arquivo. Upload em materiais ou entregas." |
| Garantia | Seção oculta até entrega |
| Timeline | "Projeto criado em [data] — handoff de [negociação]." |

### Projeto recém-criado (pós-handoff)

Próximo passo: `Realizar kickoff`. Escopo vendido preenchido. Checklist pré-populado. Banner: nenhum bloqueio até kickoff definir materiais.

---

## 4.9 Estados de carregamento

| Ordem | Bloco |
|-------|-------|
| 1 | Header (nome, status) |
| 2 | Progresso + prazo |
| 3 | Bloqueio (se houver — prioridade alta) |
| 4 | Próximo passo |
| 5 | Cards pendente Norax/Cliente |
| 6 | Seções restantes (skeleton) |

Handoff recente: checklist pode carregar por último (geração automática).

---

## 4.10 Estados de bloqueio

**Componente central do Workspace Projeto.**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  BLOQUEIO: [Tipo] — [Descrição]                        há [N] dias      │
│                                                                         │
│  [ Ação primária do bloqueio ]    [ Resolver bloqueio ]                 │
└─────────────────────────────────────────────────────────────────────────┘
```

| Tipo | Exemplo | Ação primária |
|------|---------|---------------|
| **cliente** | Aguardando textos página Sobre | Registrar material |
| **cliente** | Aguardando aprovação rodada 1 | Registrar feedback/aprovação |
| **interno** | Próxima tarefa não iniciada | Ir para checklist item |
| **nenhum** | Banner **oculto** | — |

**Regra RB-P10:** Projeto ativo sem banner = deve ter item checklist em andamento destacado.

**Prazo em risco + bloqueio:** segundo banner abaixo do bloqueio (não substitui): "Prazo em X dias — progresso Y%".

**Múltiplos materiais pendentes:** descrição lista o mais antigo; seção Briefing tem lista completa.

---

## 4.11 Responsividade

| Elemento | Mobile | Desktop |
|----------|--------|---------|
| Header progresso | Barra full-width abaixo do nome | Inline com status |
| Banner bloqueio | Full-width · botões empilhados | Botões inline |
| Pendente Norax/Cliente | Empilhados (Cliente primeiro se bloqueio cliente) | 2 colunas 50/50 |
| Checklist | Checkbox grande · swipe opcional [FUTURO] | Lista densa |
| Seções | Briefing + Checklist abertos; resto colapsado | Briefing, Checklist, Revisões abertos |
| CTA próximo passo | Sticky bottom bar [recomendado mobile] | Sticky abaixo header |
| Cronograma | Lista vertical | Tabela 3 colunas |

**Prioridade mobile:** Bloqueio → Próximo passo → Pendente Cliente → Checklist.

---

# 5. Mapa de relação entre workspaces

```
                    ┌─────────────┐
                    │    HOJE     │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  CLIENTE   │◄─┤ NEGOCIAÇÃO │  │  PROJETO   │
    └─────┬──────┘  └──────┬─────┘  └─────▲──────┘
          │                │              │
          │                └──── handoff ─┘
          └────── timeline unificada ──────┘
```

| De | Para | Gatilho |
|----|------|---------|
| Hoje | Qualquer | Deep link em prioridade/card |
| Cliente | Negociação | Seção Comercial |
| Cliente | Projeto | Seção Projetos |
| Negociação | Cliente | Link no header |
| Negociação | Projeto | Converter em projeto |
| Projeto | Cliente | Link no header |
| Projeto | Negociação | Escopo vendido (read-only) |

---

# 6. Checklist de validação UX (fundador diário)

| Pergunta | Workspace que responde |
|----------|------------------------|
| O que faço agora? | Hoje → Prioridades · Ações |
| Como está a empresa? | Hoje → Cards |
| Quem é este cliente? | Cliente → Header + Observações |
| Onde está esta venda? | Negociação → Status + Próximo passo |
| Por que este projeto parou? | Projeto → Banner bloqueio |
| O que falta entregar? | Projeto → Checklist + Pendente |
| O que aconteceu antes? | Qualquer → Timeline |

---

# 7. Próximo passo documental

| # | Entrega | Status |
|---|---------|--------|
| 1 | Blueprint Interface | ✅ |
| 2 | Wireframes estruturais (este doc) | ✅ |
| 3 | Design system (tokens, componentes) | Pendente |
| 4 | Protótipo navegável | Pendente |

---

*NORAX Wireframes Estruturais dos Workspaces v1.0 — Fase 1 — Julho 2026*
