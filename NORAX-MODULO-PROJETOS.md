# NORAX — Módulo Projetos

**Documento:** Especificação Oficial de Produto  
**Versão:** 1.0  
**Status:** Pré-desenvolvimento  
**Dependências:** Filosofia · Relatório Estratégico · Fluxo Operacional · CORE v1.0 · Módulo Comercial

---

> *O Comercial termina quando o Projeto começa. Daqui até a entrega, tudo vive no Workspace do Projeto.*

---

## Alinhamento com documentos oficiais

### Fronteira Comercial → Projetos

| Momento | Dono | Evento CORE |
|---------|------|-------------|
| Pagamento inicial confirmado | Comercial | `pagamento.recebido` (inicial) |
| Fundador confirma conversão | Comercial dispara | `projeto.criado` (E-24) |
| A partir daqui | **Projetos** | Todos os eventos E-25 a E-47 |

**Regra absoluta:** Após `projeto.criado`, nenhuma alteração comercial altera escopo sem **aditivo** [FUTURO]. O Projeto lê o comercial; não reescreve.

### Conflito resolvido: Briefing vs Escopo

| Documento | Conceito |
|-----------|----------|
| **Comercial** | Escopo = o que foi **vendido** (entregáveis, exclusões, valor, prazo) |
| **Projetos** | Briefing de execução = o que é **necessário para construir** (materiais, acessos, decisões de kickoff) |

**Solução:** O Projeto **herda** o escopo comercial (somente leitura) e mantém **briefing de execução** próprio — sem duplicar entregáveis.

### Conflito resolvido: Tarefas vs Checklist

No MVP (fundador solo), **checklist = tarefas**. Não existem dois sistemas paralelos. Cada item do checklist é uma tarefa com status, responsável [FUTURO] e prazo opcional.

### Conflito resolvido: Cronograma

O Fluxo Operacional define prazo condicionado a materiais + checklist com datas. **Não há Gantt no MVP.** Cronograma = data de início do prazo + data limite + marcos derivados do checklist.

---

## Índice

1. [Missão e objetivos](#1-missão-e-objetivos)
2. [Handoff do Comercial](#2-handoff-do-comercial)
3. [Workspace do Projeto](#3-workspace-do-projeto)
4. [Estados do projeto](#4-estados-do-projeto)
5. [Etapas do módulo](#5-etapas-do-módulo)
6. [Checklist automático](#6-checklist-automático)
7. [Organização de arquivos](#7-organização-de-arquivos)
8. [Controle de revisões](#8-controle-de-revisões)
9. [Aprovações do cliente](#9-aprovações-do-cliente)
10. [Controle da garantia](#10-controle-da-garantia)
11. [Timeline do projeto](#11-timeline-do-projeto)
12. [Integrações](#12-integrações)
13. [Catálogo de funcionalidades](#13-catálogo-de-funcionalidades)
14. [Experiência do fundador](#14-experiência-do-fundador)
15. [Análise crítica](#15-análise-crítica)

---

## 1. Missão e objetivos

### Missão

> Transformar um projeto vendido em um projeto entregue — com rastreabilidade total, zero ambiguidade sobre pendências e handoff reversível para qualquer pessoa em minutos.

### Objetivos

| Objetivo | Como |
|----------|------|
| Receber handoff do Comercial | Pacote por referência em `projeto.criado` |
| Criar Workspace do Projeto | Automático no E-24 |
| Organizar arquivos | Estrutura fixa por tipo |
| Centralizar briefing | Escopo herdado + briefing de execução |
| Controlar tarefas | Checklist único |
| Controlar cronograma | Prazo oficial + marcos |
| Registrar aprovações | Comprovante obrigatório |
| Registrar revisões | Rodadas numeradas, limite do contrato |
| Registrar entregas | Pacote de entrega |
| Registrar garantia | 30 dias, chamados classificados |
| Encerrar corretamente | E-46 com validações |

### O módulo NÃO faz

- Vender ou negociar (Comercial)
- Registrar pagamento inicial (Financeiro — já feito no handoff)
- Gerir hospedagem pós-entrega (evento dispara, módulo Hospedagem [FUTURO] ou registro no projeto)
- Substituir ficha do Cliente

---

## 2. Handoff do Comercial

### Pacote recebido (referências)

| Campo | Origem | Uso no Projeto |
|-------|--------|----------------|
| `cliente_id` | Cliente | Âncora |
| `negociacao_id` | Comercial | Link somente leitura |
| `contrato_id` | Comercial | Referência legal |
| `proposta_aprovada_id` | Comercial | Referência comercial |
| `escopo_id` | Comercial | Exibido em "Escopo vendido" |
| Nome sugerido | Gerado | `[Tipo] — [Cliente]` |
| Tipo de serviço | Escopo | site / landing / sistema |
| Valor | Contrato | Referência financeira |
| Prazo estimado | Escopo | Base do cronograma |
| Condições | Contrato | Revisões incluídas, garantia, hospedagem |

### O que o CORE executa em `projeto.criado` (E-24)

1. Criar entidade Projeto
2. Criar Workspace do Projeto
3. Criar Timeline do projeto
4. Vincular referências do handoff
5. Importar escopo comercial (snapshot somente leitura)
6. Aplicar checklist template por tipo
7. Criar estrutura de pastas de arquivos
8. Status → **Planejamento**
9. Timeline (cliente + projeto): "Projeto criado"
10. Ação: *"Realizar kickoff — [Projeto]"*

### Validações no handoff (gates)

| Gate | Validação |
|------|-----------|
| G-01 | `contrato.assinado` existe |
| G-02 | `pagamento.recebido` tipo inicial existe |
| Integridade | `cliente_id` + `negociacao_id` válidos |

### Zero perda de informação

| Risco | Mitigação |
|-------|-----------|
| Escopo não visível no projeto | Snapshot read-only na criação |
| Valor divergente | Exibir valor do contrato, não editável |
| Histórico comercial perdido | Link "Ver negociação" → Comercial (leitura) |
| Repetir perguntas ao cliente | Briefing de execução ≠ reescrever escopo |

---

## 3. Workspace do Projeto

O Workspace é o **único lugar** onde a execução vive.

### Estrutura conceitual

```
WORKSPACE DO PROJETO
│
├── Cabeçalho
│   ├── Nome · Cliente (link) · Tipo · Status
│   ├── Progresso (% checklist)
│   ├── Prazo (início · limite · dias restantes)
│   └── BLOQUEIO ATUAL (se houver) ← nunca vazio sem motivo
│
├── Próximo passo (1 ação sugerida)
│
├── Escopo vendido (herdado — somente leitura)
│
├── Briefing de execução
│   ├── Materiais esperados
│   ├── Acessos necessários
│   └── Notas de kickoff
│
├── Checklist / Tarefas
│
├── Cronograma (prazo + marcos)
│
├── Revisões e aprovações
│
├── Arquivos
│
├── Garantia (após entrega)
│
└── Timeline
```

### Regra de ouro do Workspace

> Em 3 minutos de leitura, qualquer pessoa entende: **o que é**, **onde está**, **o que falta**, **quem deve agir**.

---

## 4. Estados do projeto

### Máquina de estados (CORE)

```
PLANEJAMENTO
    │ kickoff + materiais pendentes
    ▼
PLANEJAMENTO (aguardando materiais)  ← bloqueio: cliente
    │ materiais.completos [G-03]
    ▼
EM_ANDAMENTO
    │ checklist 100%
    ▼
EM_REVISAO
    │ revisao_interna_concluida
    ▼
AGUARDANDO_CLIENTE  ← pode alternar com ajustes
    │ projeto.aprovado [G-04]
    ▼
APROVADO
    │ pagamento final [G-05] se aplicável
    ▼
ENTREGUE
    │ automático
    ▼
EM_GARANTIA
    │ garantia_encerrada
    ▼
CONCLUIDO
    │ arquivar
    ▼
ARQUIVADO
```

### Tabela de estados

| Estado | Significado | Responsável típico |
|--------|-------------|-------------------|
| **Planejamento** | Criado; kickoff ou materiais | Fundador |
| **Em andamento** | Prazo correndo; desenvolvimento | Fundador |
| **Em revisão** | Checklist completo; QA interno | Fundador |
| **Aguardando cliente** | Preview enviado ou materiais pendentes | Cliente |
| **Aprovado** | Cliente aprovou; pré-entrega | Fundador |
| **Entregue** | Em produção; pacote enviado | — |
| **Em garantia** | 30 dias pós-entrega | Fundador |
| **Concluído** | Ciclo fechado | — |
| **Arquivado** | Fora da operação ativa | — |

### Bloqueios (projeto nunca "parado" sem motivo)

| Tipo | Código | Exemplo |
|------|--------|---------|
| Aguardando cliente | `cliente` | Materiais, feedback, aprovação |
| Aguardando interno | `interno` | Fundador não iniciou próxima tarefa |
| Nenhum | `nenhum` | Progresso normal |

**Regra RB-P10:** Todo projeto não-terminal deve ter `bloqueio` definido OU checklist com item em andamento.

---

## 5. Etapas do módulo

Mapeamento: Fluxo Operacional P-10 a P-20.

---

### ETAPA 1 · Recepção do handoff (`projeto.criado`)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Materializar o projeto vendido no sistema de execução |
| **Entrada** | Ação "Converter em projeto" concluída no Comercial |
| **Saída** | Workspace completo, checklist aplicado, status Planejamento |

**Eventos:** `projeto.criado` (E-24)

**Integrações:** Comercial (leitura) · Clientes · Timeline · Ações · Arquivos

**Regras:** Gates G-01, G-02 · Uma negociação → um projeto (padrão) · Escopo snapshot

**Erros:** Criar projeto sem pagamento · Escopo vazio · Duplicar projeto para mesmo contrato

**Prevenção:** CORE valida gates · Idempotência em `negociacao_id` · Comercial marca negociação **ganha** só após E-24

---

### ETAPA 2 · Kickoff (`projeto.kickoff_realizado`)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Alinhar início formal e solicitar materiais |
| **Entrada** | Projeto em Planejamento |
| **Saída** | Kickoff registrado · Lista de materiais ativa · Mensagem ao cliente (manual MVP) |

**Eventos:** `projeto.kickoff_realizado` (E-25)

**Integrações:** Briefing de execução · Arquivos · Timeline · Ações

**Regras:** Briefing de execução preenchido (mínimo: lista materiais) · Prazo contratual **não** inicia aqui

**Erros:** Iniciar desenvolvimento sem kickoff · Não comunicar cliente

**Prevenção:** Ação obrigatória pós-E-24 · Template mensagem kickoff

---

### ETAPA 3 · Coleta de materiais (`materiais.recebidos` / `materiais.completos`)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Obter insumos do cliente para desenvolver |
| **Entrada** | Kickoff realizado |
| **Saída** | Materiais 100% → prazo oficial iniciado · Status Em andamento |

**Eventos:** `materiais.recebidos` (E-26) · `materiais.completos` (E-27) · `materiais.atrasados` (E-28)

**Integrações:** Arquivos (uploads) · Briefing de execução · Timeline · Ações

**Regras:** **Gate G-03** · `prazo_iniciado_em` só em materiais.completos · Bloqueio = `cliente` enquanto pendente

**Erros:** Contar prazo antes dos materiais · Perder arquivos em WhatsApp

**Prevenção:** Lista fixa por tipo · Lembretes 3d/7d · Upload obrigatório no sistema

---

### ETAPA 4 · Desenvolvimento (`projeto.desenvolvimento_concluido`)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Executar entregáveis do escopo via checklist |
| **Entrada** | Materiais completos · Status Em andamento |
| **Saída** | Checklist 100% · Status Em revisão |

**Eventos:** `projeto.desenvolvimento_concluido` (E-29) — disparado quando checklist completo

**Integrações:** Checklist · Cronograma · Timeline · Arquivos

**Regras:** Pedido fora do escopo → flag aditivo, não implementar · Atualizar progresso diariamente · Comunicação proativa 7-10 dias

**Erros:** Scope creep · Projeto sem progresso visível · Item concluído sem critério

**Prevenção:** Checklist com critérios de aceite · Referência ao escopo vendido visível · Alerta prazo em risco

---

### ETAPA 5 · Revisão interna (`projeto.revisao_interna_concluida`)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Garantir qualidade antes do cliente ver |
| **Entrada** | Desenvolvimento concluído |
| **Saída** | QA aprovado · Liberado para apresentação |

**Eventos:** `projeto.revisao_interna_concluida` (E-30)

**Integrações:** Checklist QA (subconjunto ou fase) · Timeline

**Regras:** Checklist QA obrigatório · Não apresentar sem este evento

**Erros:** Pular QA · Apresentar com bugs críticos

**Prevenção:** QA como itens fixos no template · Bloqueio `interno` até QA completo

---

### ETAPA 6 · Apresentação ao cliente (`projeto.apresentado`)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Enviar preview e obter feedback estruturado |
| **Entrada** | Revisão interna aprovada |
| **Saída** | URL preview registrada · Status Aguardando cliente |

**Eventos:** `projeto.apresentado` (E-31)

**Integrações:** Portal [FUTURO] · Timeline · Ações · Revisões

**Regras:** Registrar rodada (1, 2…) · Lembrete feedback 5 dias · Bloqueio = `cliente`

**Erros:** Feedback vago aceito sem pedir detalhe

**Prevenção:** Formulário de feedback estruturado · Lembrete contrato: X revisões incluídas

---

### ETAPA 7 · Ajustes (`projeto.ajustes_solicitados` / `projeto.ajustes_concluidos`)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Implementar correções dentro do contrato |
| **Entrada** | Feedback registrado |
| **Saída** | Ajustes feitos · Reapresentação ou aprovação |

**Eventos:** `projeto.ajustes_solicitados` (E-32) · `projeto.ajustes_concluidos` (E-33)

**Integrações:** Revisões · Escopo · Timeline · Contrato (limite rodadas)

**Regras:** Máx. 2 rodadas (contrato) · Bug nosso não conta · Fora do escopo → aditivo

**Erros:** Revisão infinita · Implementar feature como "ajuste"

**Prevenção:** Contador de rodadas visível · Classificação obrigatória por item

---

### ETAPA 8 · Aprovação final (`projeto.aprovado`)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Aceite formal do cliente |
| **Entrada** | Cliente satisfeito com versão |
| **Saída** | Aprovação registrada · Status Aprovado |

**Eventos:** `projeto.aprovado` (E-34)

**Integrações:** Aprovações · Arquivos (comprovante) · Financeiro · Timeline

**Regras:** **Gate G-04** · Comprovante escrito obrigatório

**Erros:** Aprovação verbal · Entregar sem aprovação

**Prevenção:** Upload/link comprovante · Bloqueio entrega sem E-34

---

### ETAPA 9 · Pagamento final (integração Financeiro)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Confirmar saldo antes da entrega definitiva |
| **Entrada** | Projeto aprovado · Modelo 50/50 ou milestones |
| **Saída** | Financeiro quitado · Liberado para entrega |

**Eventos:** `pagamento.recebido` (E-22, tipo: final) — registrado no **Financeiro**, consumido pelo Projeto

**Integrações:** Financeiro · Contrato · Timeline

**Regras:** **Gate G-05** · 100% upfront pula esta etapa

**Erros:** Entregar sem pagamento final

**Prevenção:** Ação automática pós-E-34 · Status Aprovado bloqueia E-35 até pagamento

---

### ETAPA 10 · Entrega (`projeto.entregue`)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Publicar e entregar pacote ao cliente |
| **Entrada** | Aprovado + pagamento quitado |
| **Saída** | URL produção · Pacote entrega · Garantia iniciada · Hospedagem registrada |

**Eventos:** `projeto.entregue` (E-35) → cascata `projeto.garantia_iniciada` (E-36) + `hospedagem.registrada` (E-39)

**Integrações:** Arquivos · Hospedagem · Cliente · Timeline

**Regras:** **Gate G-06** via hospedagem · Pacote entrega checklist

**Erros:** Entregar sem SSL · Esquecer vencimento hospedagem

**Prevenção:** Checklist entrega · Hospedagem automática no E-35

---

### ETAPA 11 · Garantia (`projeto.garantia_*`)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Corrigir bugs por 30 dias |
| **Entrada** | Projeto entregue |
| **Saída** | Garantia encerrada sem pendências críticas |

**Eventos:** E-36, E-37, E-38, E-45

**Integrações:** Timeline · Chamados garantia

**Regras:** Bug vs feature · 30 dias fixos · Resposta 48h

**Erros:** Feature nova como bug

**Prevenção:** Classificação obrigatória no chamado

---

### ETAPA 12 · Encerramento (`projeto.encerrado`)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Fechar ciclo operacional do projeto |
| **Entrada** | Garantia encerrada · Financeiro ok |
| **Saída** | Status Concluído · Cliente Inativo se sem outros projetos |

**Eventos:** `projeto.encerrado` (E-46)

**Integrações:** Clientes · Timeline · Dashboard

**Regras:** Mensagem encerramento · Projeto sai de lista ativa

**Erros:** Nunca encerrar formalmente · Deixar projeto "zumbi"

**Prevenção:** Ação pós-E-45 · Validação financeira

---

## 6. Checklist automático

### Princípio

Checklist é aplicado em `projeto.criado` conforme **tipo de serviço** do handoff. Itens são **tarefas** — única lista de trabalho no MVP.

### Estrutura de um item

| Campo | Obrigatório |
|-------|-------------|
| Título | Sim |
| Descrição / critério de aceite | Recomendado |
| Fase (planejamento / dev / qa) | Sim |
| Status | Sim |
| Ordem | Sim |
| Responsável | [FUTURO] |
| Data limite | Opcional |
| Vinculado a entregável do escopo | Recomendado |

### Template · Site institucional

| # | Item | Fase |
|---|------|------|
| 1 | Configurar ambiente / repositório | Planejamento |
| 2 | Receber e validar materiais | Planejamento |
| 3 | Wireframe / estrutura | Desenvolvimento |
| 4 | Design / UI | Desenvolvimento |
| 5 | Desenvolvimento Home | Desenvolvimento |
| 6 | Desenvolvimento páginas internas | Desenvolvimento |
| 7 | Formulário de contato | Desenvolvimento |
| 8 | Responsivo mobile | Desenvolvimento |
| 9 | SEO básico (meta, títulos) | Desenvolvimento |
| 10 | QA — links e formulários | QA |
| 11 | QA — mobile e performance | QA |
| 12 | Deploy staging | Desenvolvimento |
| 13 | Deploy produção | Entrega |

### Template · Landing page

| # | Item | Fase |
|---|------|------|
| 1 | Configurar ambiente | Planejamento |
| 2 | Receber materiais | Planejamento |
| 3 | Design / UI | Desenvolvimento |
| 4 | Desenvolvimento página | Desenvolvimento |
| 5 | Integração formulário / pixel | Desenvolvimento |
| 6 | Responsivo | Desenvolvimento |
| 7 | QA completo | QA |
| 8 | Deploy produção | Entrega |

### Template · Sistema web

| # | Item | Fase |
|---|------|------|
| 1 | Configurar ambiente | Planejamento |
| 2 | Receber materiais e regras de negócio | Planejamento |
| 3 | Modelagem de dados | Desenvolvimento |
| 4+ | Uma linha por funcionalidade do escopo | Desenvolvimento |
| n-2 | Testes integrados | QA |
| n-1 | QA segurança básica | QA |
| n | Deploy produção | Entrega |

**Regra:** Para sistemas, checklist é gerado **a partir dos entregáveis do escopo** no handoff — uma linha por funcionalidade vendida.

### Progresso

```
progresso = itens_concluidos / itens_totais × 100
```

Disparo `projeto.desenvolvimento_concluido` quando progresso = 100% e fase desenvolvimento+qa sem pendentes.

---

## 7. Organização de arquivos

### Estrutura fixa (criada em E-24)

```
projeto-[id]/
├── comercial/              ← link simbólico, arquivos read-only do handoff
│   ├── proposta-aprovada.pdf
│   └── contrato-assinado.pdf
├── materiais-cliente/      ← uploads do cliente
│   ├── logo/
│   ├── textos/
│   └── fotos/
├── trabalho/               ← arquivos internos Norax
│   ├── design/
│   ├── desenvolvimento/
│   └── staging/
├── entregas/               ← versões apresentadas ao cliente
│   ├── rodada-1/
│   └── rodada-2/
├── aprovacoes/             ← comprovantes escritos
├── entrega-final/          ← pacote de entrega
└── garantia/               ← evidências de correções
```

### Regras

| Regra | Descrição |
|-------|-----------|
| RF-A01 | Toda versão apresentada salva em `entregas/rodada-n/` |
| RF-A02 | Comprovante de aprovação em `aprovacoes/` |
| RF-A03 | Material do cliente nunca só no WhatsApp — upload obrigatório |
| RF-A04 | Arquivos do handoff copiados uma vez, referência ao original |
| RF-A05 | Nunca sobrescrever — nova versão = nova pasta/arquivo |

---

## 8. Controle de revisões

### Modelo

| Conceito | Definição |
|----------|-----------|
| **Rodada** | Ciclo apresentar → feedback → ajustar |
| **Limite** | Definido no contrato (padrão: 2) |
| **Contador** | Incrementa em `projeto.ajustes_solicitados` |

### Classificação de feedback

| Tipo | Ação | Conta rodada? |
|------|------|---------------|
| Bug (erro nosso) | Corrigir | Não |
| Ajuste no escopo | Implementar | Sim |
| Fora do escopo | Aditivo | Não implementar |
| Mudança estética | Implementar | Sim |

### Registro por rodada

```
Rodada 1
├── Data apresentação
├── URL preview
├── Feedback (lista)
├── Itens implementados
└── Status: concluída / aguardando reapresentação
```

### Integração com contrato

O Workspace exibe: **"Revisões: 1 de 2 utilizadas"** — lido do contrato, não editável no Projeto.

---

## 9. Aprovações do cliente

### Tipos de aprovação no Projeto

| Tipo | Evento | Comprovante |
|------|--------|-------------|
| Aprovação final | `projeto.aprovado` | Obrigatório |
| Aprovação parcial | Não existe — só final para entrega | — |

### Fluxo

```
Cliente envia "Aprovado" (email/WhatsApp)
    → Fundador registra aprovação
    → Anexa screenshot ou encaminha email
    → projeto.aprovado (E-34)
    → Arquivo em aprovacoes/
```

### O que a aprovação desbloqueia

| Modelo pagamento | Próximo passo |
|------------------|---------------|
| 50/50 | Cobrança final → entrega |
| 100% upfront | Entrega direta |
| Milestones | Próximo milestone ou entrega |

---

## 10. Controle da garantia

### Período

30 dias a partir de `projeto.entregue`. Início e fim visíveis no Workspace.

### Chamado de garantia

| Campo | Obrigatório |
|-------|-------------|
| Descrição | Sim |
| Tipo (bug / feature) | Sim |
| Data abertura | Automático |
| Status | aberto / resolvido |
| Resolução | Se resolvido |

### MVP simplificado

Chamados formais (E-37, E-38) podem ser **observação estruturada + Timeline** até volume justificar UI dedicada. Regra de negócio permanece.

### Encerramento

`projeto.garantia_encerrada` (E-45) — automático na data ou manual pelo fundador.

---

## 11. Timeline do projeto

### Duas timelines, uma leitura

| Timeline | Conteúdo |
|----------|----------|
| **Cliente** | Eventos do projeto aparecem na timeline do cliente |
| **Projeto** | Todos os eventos E-24 a E-47 filtrados ao projeto |

### Eventos na Timeline (ordem típica)

```
projeto.criado
projeto.kickoff_realizado
materiais.recebidos (×n)
materiais.completos
[checklist itens — opcional agrupado: "5 itens concluídos esta semana"]
projeto.desenvolvimento_concluido
projeto.revisao_interna_concluida
projeto.apresentado
projeto.ajustes_solicitados / ajustes_concluidos
projeto.aprovado
pagamento.recebido (final)
projeto.entregue
projeto.garantia_iniciada
garantia.chamado_* (se houver)
projeto.garantia_encerrada
projeto.encerrado
```

### Regra

Nenhum evento manual de "atualização" — apenas eventos CORE e conclusão de checklist agrupada [opcional].

---

## 12. Integrações

### Comercial (somente leitura)

| Dado | Direção |
|------|---------|
| Escopo vendido | Comercial → Projeto (snapshot) |
| Proposta / Contrato | Link + PDF em comercial/ |
| Negociação | Link "Ver negociação" |
| Alteração comercial pós-handoff | **Proibida** sem aditivo |

### Clientes

| Dado | Direção |
|------|---------|
| Ficha cliente | Link no cabeçalho do projeto |
| Seção Projetos na ficha | Lista projetos do cliente |
| Status cliente | Ativo durante projeto · Inativo após E-46 se único |

### Financeiro

| Momento | Integração |
|---------|------------|
| Handoff | Pagamento inicial já registrado — exibir ✓ |
| Pós-aprovação | Ação cobrar final · `pagamento.recebido` (final) |
| Quitado | Badge no projeto · Desbloqueia entrega |

### Dashboard ("Hoje")

| Card | Fonte |
|------|-------|
| Projetos ativos | Contagem por status |
| Em risco de prazo | Prazo 7d + progresso < 80% |
| Aguardando cliente | bloqueio = cliente |
| Aguardando materiais | materiais pendentes |
| Garantia encerrando | 7 dias restantes |

Deep links → Workspace do projeto.

### Portal do Cliente [FUTURO]

| Funcionalidade | Fase |
|----------------|------|
| Ver progresso % | v1 |
| Aprovar entrega | v1 |
| Enviar materiais | v1 |
| Ver cronograma | v2 |
| Abrir chamado garantia | v2 |

### Timeline

Todo evento do projeto alimenta Timeline do projeto e do cliente (Lei 3 do CORE).

---

## 13. Catálogo de funcionalidades

### F-P01 · Receber handoff (automático)

**Quem:** Sistema em `projeto.criado`  
**CORE:** E-24  
**Automático:** Workspace completo

### F-P02 · Realizar kickoff

**Quando:** Após criação  
**CORE:** E-25  
**Automático:** Lista materiais · Ação removida · Nova ação materiais

### F-P03 · Registrar material recebido

**Quando:** Cliente envia arquivo  
**CORE:** E-26 → E-27 se completo  
**Automático:** Upload em materiais-cliente/ · Progresso bloqueio

### F-P04 · Concluir item do checklist

**Quando:** Tarefa feita  
**CORE:** Nenhum até 100% → E-29  
**Automático:** Progresso % · Próximo item destacado

### F-P05 · Registrar bloqueio

**Quando:** Projeto parado por motivo claro  
**CORE:** `projeto.bloqueio_registrado` (E-56 proposto)  
**Automático:** Exibir no cabeçalho · Timeline

### F-P06 · Resolver bloqueio

**CORE:** `projeto.bloqueio_resolvido` (E-57 proposto)

### F-P07 · Concluir revisão interna

**CORE:** E-30

### F-P08 · Apresentar ao cliente

**CORE:** E-31  
**Automático:** Salvar em entregas/rodada-n/

### F-P09 · Registrar feedback / ajustes

**CORE:** E-32, E-33

### F-P10 · Registrar aprovação final

**CORE:** E-34 · Comprovante obrigatório

### F-P11 · Confirmar pagamento final (link Financeiro)

**CORE:** E-22 (final) — ação no Financeiro, leitura no Projeto

### F-P12 · Executar entrega

**CORE:** E-35 + cascata E-36, E-39

### F-P13 · Registrar chamado garantia

**CORE:** E-37, E-38 (ou simplificado MVP)

### F-P14 · Encerrar projeto

**CORE:** E-46

### F-P15 · Arquivar projeto

**CORE:** E-47

### F-P16 · Buscar projeto

Busca por cliente, nome, status, tipo — < 10 segundos

### F-P17 · Ver escopo vendido

Somente leitura — link Comercial

### F-P18 · Editar briefing de execução

Notas operacionais — não altera escopo vendido

---

## 14. Experiência do fundador

### Visão permanente no Workspace

```
┌─────────────────────────────────────────────────────────┐
│  Site Institucional — Empresa ABC          Em andamento │
│  ████████░░░░  65%          Prazo: 12 dias restantes    │
├─────────────────────────────────────────────────────────┤
│  ⏸ BLOQUEIO: Aguardando cliente — textos da página Sobre│
├─────────────────────────────────────────────────────────┤
│  PRÓXIMO PASSO                                          │
│  Cobrar material pendente ou trabalhar em item sem      │
│  dependência: Desenvolvimento Home                      │
├─────────────────────────────────────────────────────────┤
│  PENDENTE NORAX          │  PENDENTE CLIENTE           │
│  • Desenvolvimento Home   │  • Textos página Sobre      │
│  • QA mobile              │  • Aprovação rodada 1       │
└─────────────────────────────────────────────────────────┘
```

### Três perguntas respondidas sempre

| Pergunta | Onde |
|----------|------|
| O que está pendente? | Checklist + seção Pendente Norax |
| O que depende do cliente? | Bloqueio + Pendente Cliente |
| Qual o próximo passo? | Banner único no topo |

### Projeto nunca parado sem motivo

| Situação | Sistema mostra |
|----------|----------------|
| Falta material | Bloqueio: cliente · Lista materiais |
| Falta feedback | Bloqueio: cliente · Rodada X aguardando |
| Fundador não avançou | Alerta: item interno vencido |
| Prazo em risco | Dashboard + banner amarelo |

### Dia típico (projeto ativo)

**09:00** Dashboard → *"Empresa ABC — material pendente há 5 dias"* → 1 clique → Workspace.

**09:05** Envia WhatsApp cobrando · **Registra interação** no briefing · Mantém bloqueio.

**10:00** Cliente envia textos · **Upload** · Marca material recebido · Bloqueio parcial removido.

**10:30** Trabalha checklist · Marca 2 itens · Progresso 65% → 72%.

**17:00** Nenhum projeto sem bloqueio ou item ativo — se sim, Dashboard alerta.

### Novo desenvolvedor assume projeto [FUTURO]

Leitura de 3 minutos do Workspace:

1. Escopo vendido — o que foi prometido  
2. Briefing de execução — materiais e acessos  
3. Checklist — o que falta  
4. Timeline — o que já aconteceu  
5. Bloqueio — por que está parado (se parado)

---

## 15. Análise crítica

### Quais partes ficaram complexas?

| Área | Complexidade | Mitigação |
|------|--------------|-----------|
| Handoff multi-referência | Alta | Snapshot escopo + links |
| Revisões + aprovações + pagamento | Média | Gates visíveis |
| Dois briefings (comercial vs execução) | Média | Nomenclatura clara |
| Garantia como submódulo | Baixa-média | MVP simplificado |
| Checklist sistema web dinâmico | Média | Gerar do escopo automaticamente |

### O que pode ser simplificado?

| Simplificação | MVP |
|---------------|-----|
| Checklist = tarefas (um sistema) | ✓ |
| Sem Gantt | ✓ |
| Chamados garantia = observação | ✓ |
| Cronograma = prazo + % | ✓ |
| QA como itens no checklist | ✓ |
| Portal para materiais = upload manual pelo fundador | ✓ |

### Funcionalidades que NÃO pertencem ao módulo Projetos

| Fora | Módulo correto |
|------|----------------|
| Proposta, contrato, negociação | Comercial |
| Pagamento inicial no handoff | Financeiro (já feito) |
| Hospedagem renovação | Hospedagem / pós-entrega |
| Cadastro cliente | Clientes |
| Time tracking avançado | [FUTURO] ou ferramenta externa |
| Git integration | Ferramenta externa |
| SEO contínuo pós-entrega | Serviço / aditivo |

### Centenas de projetos ativos — como manter simples?

| Estratégia | Como |
|------------|------|
| Lista ativa vs arquivados | Só ativos na vista padrão |
| Filtros fixos | Em andamento · Aguardando cliente · Em garantia |
| Busca global | ⌘K por cliente ou projeto |
| Dashboard como triagem | Não abrir lista de 100 |
| Projetos concluídos arquivados em 30 dias | Automático [FUTURO] |

### Como evitar retrabalho?

| Risco | Prevenção |
|-------|-----------|
| Repetir perguntas ao cliente | Escopo vendido visível |
| Reescopo silencioso | Flag aditivo |
| Perder versão apresentada | entregas/rodada-n/ |
| Aprovação verbal | Comprovante obrigatório |
| Material só no WhatsApp | Upload no sistema |
| Prazo errado | G-03 materiais antes do prazo |
| Handoff incompleto | Validação pacote E-24 |

### Novo desenvolvedor em poucos minutos?

| Elemento | Minutos |
|----------|---------|
| Escopo vendido | 0:30 |
| Briefing execução | 0:30 |
| Checklist pendente | 1:00 |
| Timeline recente | 0:30 |
| Bloqueio atual | 0:30 |
| **Total** | **~3 min** |

**Regra de documentação:** Workspace autoexplicativo — não depende de README externo.

---

## Apêndice A — Eventos CORE utilizados

| Evento | Etapa |
|--------|-------|
| E-24 projeto.criado | Handoff |
| E-25 kickoff | Kickoff |
| E-26, E-27, E-28 materiais | Materiais |
| E-29 desenvolvimento_concluido | Dev |
| E-30 revisao_interna | QA |
| E-31 apresentado | Apresentação |
| E-32, E-33 ajustes | Revisões |
| E-34 aprovado | Aprovação |
| E-22 pagamento final | Financeiro |
| E-35 entregue | Entrega |
| E-36, E-37, E-38, E-45 garantia | Garantia |
| E-39 hospedagem | Entrega (cascata) |
| E-46 encerrado | Encerramento |
| E-47 arquivado | Arquivo |

### Eventos novos propostos (CORE v1.1)

| ID | Evento | Uso |
|----|--------|-----|
| E-56 | projeto.bloqueio_registrado | F-P05 |
| E-57 | projeto.bloqueio_resolvido | F-P06 |

---

## Apêndice B — Regras de negócio (RB-P)

| ID | Regra |
|----|-------|
| RB-P01 | Projeto só nasce via handoff (E-24) |
| RB-P02 | Escopo vendido somente leitura |
| RB-P03 | Prazo inicia em materiais.completos (G-03) |
| RB-P04 | Entrega exige projeto.aprovado (G-04) |
| RB-P05 | Entrega exige pagamento quitado (G-05) |
| RB-P06 | Máx. 2 rodadas revisão (contrato) |
| RB-P07 | Bug nosso não conta rodada |
| RB-P08 | Fora do escopo → aditivo, não checklist |
| RB-P09 | Comprovante obrigatório na aprovação |
| RB-P10 | Projeto ativo tem bloqueio OU item em andamento |
| RB-P11 | Material do cliente no sistema, não WhatsApp |
| RB-P12 | Encerramento exige garantia fim + financeiro ok |

---

## Apêndice C — Checklist de conformidade

- [ ] Handoff usa referências, não cópias soltas?
- [ ] Escopo vendido read-only?
- [ ] Eventos CORE em cada transição?
- [ ] Gates G-03, G-04, G-05 respeitados?
- [ ] Bloqueio visível quando parado?
- [ ] Próximo passo único?
- [ ] Não duplica Comercial?
- [ ] Timeline alimentada?
- [ ] Arquivos na estrutura fixa?

---

*Especificação oficial · Módulo Projetos Norax · v1.0*

