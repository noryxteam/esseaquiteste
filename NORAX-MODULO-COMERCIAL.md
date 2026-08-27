# NORAX — Módulo Comercial

**Documento:** Especificação Oficial de Produto  
**Versão:** 1.0  
**Status:** Pré-desenvolvimento  
**Dependências:** Filosofia Norax · Relatório Estratégico · Fluxo Operacional · CORE

---

> *Todo dinheiro da Norax passa por este módulo. Todo cliente passa por ele. Ele transforma interesse em projeto.*

---

## Alinhamento com documentos oficiais

Antes de qualquer decisão neste módulo, validamos contra a verdade absoluta do projeto.

| Documento | O que o Comercial obedece |
|-----------|---------------------------|
| **Filosofia** | Simplicidade · Próximo passo automático · WhatsApp não é histórico |
| **Fluxo Operacional** | P-03 a P-09 mapeados integralmente |
| **CORE** | Eventos E-03 a E-23, E-24 como handoff |
| **Módulo Clientes** | Cliente é âncora; Lead é **status**, não entidade |

### Conflito resolvido: "Lead" vs "Comercial"

O pedido menciona *"organizar Leads"*. Nos documentos oficiais, **Lead não é um módulo nem uma entidade separada**.

| Conceito errado | Conceito correto |
|-----------------|------------------|
| Módulo Comercial cria Leads | Módulo **Clientes** cria o cadastro com status Lead |
| Lead e Cliente são coisas diferentes | Lead **é** um Cliente em status Lead |
| CRM com duas listas | Uma lista de Clientes; Comercial filtra e opera sobre negociações |

**Solução:** O Comercial opera sobre **Negociações** vinculadas a Clientes existentes. Criar um "novo lead" no Comercial = criar Cliente (atalho) + abrir Negociação — ou abrir Negociação em Cliente já cadastrado.

### Conflito resolvido: Escopo

O Fluxo Operacional define **P-05 Registro do escopo** antes da proposta. O CORE define **E-09 escopo.registrado**.

O Escopo **pertence ao Comercial**, vive na Negociação e alimenta a Proposta na criação. Não duplica observações do Cliente — é documento comercial estruturado (entregáveis + exclusões).

### Conflito resolvido: Quem cria o Projeto

O CORE define **E-24 projeto.criado** após **E-22 pagamento.recebido (inicial)**. O Comercial **não executa** o projeto — dispara o handoff. A ação *"Criar projeto"* aparece na inbox; confirmação dispara o evento que o módulo Projetos consome.

---

## Índice

1. [Objetivo do módulo](#1-objetivo-do-módulo)
2. [Problemas que resolve](#2-problemas-que-resolve)
3. [Filosofia do módulo](#3-filosofia-do-módulo)
4. [Fluxo completo](#4-fluxo-completo)
5. [Estados possíveis](#5-estados-possíveis)
6. [Regras de negócio](#6-regras-de-negócio)
7. [Eventos disparados ao CORE](#7-eventos-disparados-ao-core)
8. [Integração com Clientes](#8-integração-com-clientes)
9. [Integração com Projetos](#9-integração-com-projetos)
10. [Integração com Financeiro](#10-integração-com-financeiro)
11. [Integração com Dashboard](#11-integração-com-dashboard)
12. [Integração com Timeline](#12-integração-com-timeline)
13. [Integração com Portal do Cliente](#13-integração-com-portal-do-cliente)
14. [Integração com Arquivos](#14-integração-com-arquivos)
15. [Catálogo de funcionalidades](#15-catálogo-de-funcionalidades)
16. [Experiência do fundador — um dia inteiro](#16-experiência-do-fundador--um-dia-inteiro)
17. [Navegação e UX](#17-navegação-e-ux)
18. [Análise crítica](#18-análise-crítica)

---

## 1. Objetivo do módulo

O módulo Comercial é o **motor de receita** da Norax.

**Missão em uma frase:**

> Transformar interesse comercial em projeto pago, com zero informação perdida e zero ambiguidade sobre o próximo passo.

**Responsabilidades:**

| Faz | Não faz |
|-----|---------|
| Qualificar oportunidades | Executar desenvolvimento |
| Registrar escopo e negociação | Gerenciar checklist de projeto |
| Criar, enviar e rastrear propostas | Cobrar hospedagem (Financeiro) |
| Gerar e rastrear contratos | Substituir o módulo Clientes |
| Registrar aprovações e recusas | Duplicar dados do cliente |
| Handoff para Projeto após pagamento inicial | Registrar bugs de garantia |

**Métrica de sucesso do módulo:**

| Métrica | Target |
|---------|--------|
| Tempo do escopo à proposta enviada | < 5 dias úteis |
| Propostas sem resposta esquecidas | 0 (alertas CORE) |
| Negociação encontrada | < 10 segundos |
| Handoff para Projeto sem retrabalho | 100% dos campos herdados |

---

## 2. Problemas que resolve

### Hoje (fundador solo)

| Problema real | Como o Comercial resolve |
|---------------|--------------------------|
| "Esqueci de fazer follow-up na proposta" | Alertas automáticos (E-18, E-13) |
| "Não lembro o que combinamos" | Escopo + Timeline + versões de proposta |
| "Mandei proposta com valor errado" | Versionamento + rascunho antes de enviar |
| "Comecei a trabalhar sem contrato" | Gate G-01 bloqueia handoff |
| "Cliente aprovou no WhatsApp e sumiu" | Exige comprovante registrado (E-15) |
| "Não sei quanto tenho no pipeline" | Visão consolidada de negociações abertas |
| "Criei proposta sem entender o escopo" | Escopo obrigatório antes de proposta |
| "Perdi o histórico da negociação" | Toda interação gera Timeline |

### Amanhã (empresa crescendo)

| Problema futuro | Preparação no desenho |
|-----------------|----------------------|
| Comercial + fundador | Negociação com responsável [FUTURO] |
| Volume alto de propostas | Busca + filtros, não kanban complexo |
| Cliente com múltiplas negociações | Uma negociação por oportunidade, histórico preservado |

---

## 3. Filosofia do módulo

### Princípios herdados (não negociáveis)

1. **Negociação, não CRM** — não é pipeline de vendas genérico; é o caminho Lead → Projeto da Norax.
2. **Uma fonte de verdade** — Cliente no módulo Clientes; Comercial referencia, nunca copia email/telefone.
3. **Evento antes de estado** — mudanças disparam CORE; status é consequência.
4. **Próximo passo visível** — toda negociação mostra uma ação sugerida.
5. **Documento vivo até assinatura** — proposta versionada; contrato referencia proposta aprovada.
6. **WhatsApp registra, não armazena** — interações importantes viram `interacao.registrada`, não integração.

### Princípio exclusivo do Comercial

> **"Se não está na negociação, não aconteceu comercialmente."**

Proposta verbal, desconto combinado, prazo prometido — tudo entra na negociação (escopo, proposta, interação ou observação da negociação).

### O que "simples" significa aqui

| Simples | Não simples |
|---------|-------------|
| Lista de negociações com filtros | Kanban com 8 colunas |
| 4 estágios de negociação | 12 estágios customizáveis |
| 1 negociação ativa por cliente (regra padrão) | Múltiplas negociações paralelas sem controle |
| Template de proposta fixo | Editor livre estilo Notion |

---

## 4. Fluxo completo

### Visão macro

```
CLIENTE (status: Lead)
        │
        ▼
   NEGOCIAÇÃO criada
        │
        ├── Qualificar (E-03)
        ├── Reunião (E-06, E-07) — registrada na negociação
        ├── Interações (ligações, mensagens importantes)
        │
        ▼
   ESCOPO registrado (E-09)
        │
        ▼
   PROPOSTA criada → enviada (E-12, E-13)
        │
        ├── Expirada (E-18) → follow-up ou encerrar
        ├── Em negociação (E-16) → nova versão
        ├── Recusada (E-17) → negociação perdida
        │
        ▼
   PROPOSTA aprovada (E-15)
        │
        ▼
   CONTRATO criado → enviado → assinado (E-19, E-20, E-21)
        │
        ▼
   PAGAMENTO inicial (E-22)
        │
        ▼
   HANDOFF → Projeto (E-24)
        │
        ▼
   Negociação: GANHA · Cliente: Ativo
```

### Mapeamento Fluxo Operacional

| Processo | Etapa operacional | Entidade Comercial |
|----------|-------------------|-------------------|
| Qualificação | P-03 | Negociação (estágio: descoberta) |
| Reunião | P-04 | Interação + link reunião |
| Escopo | P-05 | Escopo da negociação |
| Proposta | P-06 | Proposta v1..vn |
| Resposta | P-07 | Status proposta |
| Contrato | P-08 | Contrato |
| Pagamento | P-09 | Referência financeira |
| Kickoff | P-10 | Handoff → Projetos |

---

## 5. Estados possíveis

### Entidades e estados

O Comercial gerencia **três entidades** com estados próprios:

```
NEGOCIAÇÃO ──contém──▶ ESCOPO (documento)
        │
        ├──▶ PROPOSTA (1..n versões)
        │
        └──▶ CONTRATO (0..1 por negociação ganha)
```

### Negociação

| Estado | Significado | Próximo passo típico |
|--------|-------------|----------------------|
| **aberta** | Oportunidade em andamento, pré-proposta | Registrar escopo ou qualificar |
| **proposta_enviada** | Proposta enviada, aguardando resposta | Follow-up ou registrar resposta |
| **em_negociacao** | Cliente pediu ajustes | Nova versão da proposta |
| **aguardando_contrato** | Proposta aprovada | Gerar e enviar contrato |
| **aguardando_pagamento** | Contrato assinado | Confirmar pagamento inicial |
| **ganha** | Pagamento inicial confirmado; projeto criado | Sair do Comercial → Projetos |
| **perdida** | Recusada ou descartada | Arquivar |
| **arquivada** | Fora da operação ativa | Reabrir se cliente retornar |

### Proposta (CORE)

| Estado | Evento CORE |
|--------|-------------|
| Rascunho | proposta.criada |
| Enviada | proposta.enviada |
| Visualizada | proposta.visualizada [FUTURO] |
| Em negociação | proposta.em_negociacao |
| Aprovada | proposta.aprovada |
| Recusada | proposta.recusada |
| Expirada | proposta.expirada |

### Contrato (CORE)

| Estado | Evento CORE |
|--------|-------------|
| Rascunho | contrato.criado |
| Enviado | contrato.enviado |
| Assinado | contrato.assinado |
| Cancelado | Manual com justificativa |

### Cliente (módulo Clientes — visão do Comercial)

| Status cliente | Quando no Comercial |
|----------------|---------------------|
| Lead | Negociação aberta até aprovação |
| Ativo | Proposta aprovada ou projeto em andamento |
| Perdido | Negociação perdida |
| Inativo | Após projetos encerrados (fora do Comercial) |

---

## 6. Regras de negócio

### RB-C01 · Cliente obrigatório

Toda negociação pertence a um `cliente_id`. Não existe negociação órfã.

### RB-C02 · Uma negociação ativa por cliente (padrão)

Um cliente pode ter apenas **uma** negociação nos estados: aberta, proposta_enviada, em_negociacao, aguardando_contrato, aguardando_pagamento.

Exceção: fundador pode forçar segunda negociação com justificativa registrada [FUTURO volume].

### RB-C03 · Escopo antes de proposta

Não é possível criar proposta sem escopo registrado na negociação (validação + gate de UX).

### RB-C04 · Proposta enviada é imutável

Após `proposta.enviada`, o conteúdo não edita — apenas nova versão (duplicar → editar → enviar).

### RB-C05 · Máximo 2 rodadas de negociação

Após 2 eventos `proposta.em_negociacao`, sistema exige decisão: aprovar, recusar ou exceção documentada.

### RB-C06 · Aprovação exige comprovante

`proposta.aprovada` bloqueia sem referência a mensagem/email do cliente.

### RB-C07 · Contrato referencia proposta

Contrato sempre vinculado à proposta aprovada. Valor e escopo devem ser consistentes.

### RB-C08 · Gate G-01

Nenhum handoff para Projeto sem `contrato.assinado`.

### RB-C09 · Gate G-02

Nenhum `projeto.criado` sem `pagamento.recebido` tipo inicial.

### RB-C10 · Validade da proposta

Toda proposta enviada tem `valida_ate`. Sistema dispara `proposta.expirada` automaticamente.

### RB-C11 · Negociação ganha fecha o ciclo comercial

Estado **ganha** é terminal no Comercial. Projeto passa a ser dono da relação operacional.

### RB-C12 · Perda exige motivo

`proposta.recusada` e negociação **perdida** exigem motivo (lista + texto livre).

### RB-C13 · Interação não substitui evento

Registrar ligação cria Timeline, mas **não** substitui aprovar proposta ou assinar contrato.

### RB-C14 · Handoff herda contexto

Ao converter em projeto, o módulo Projetos recebe: escopo, proposta aprovada, contrato, valor, tipo de serviço, prazo — por referência, não cópia desconectada.

---

## 7. Eventos disparados ao CORE

| Ação do usuário | Evento CORE | Prioridade |
|-----------------|-------------|------------|
| Qualificar lead | `cliente.qualificado` (E-03) | MVP |
| Descartar | `cliente.descartado` (E-04) | MVP |
| Agendar reunião | `reuniao.agendada` (E-06) | MVP |
| Concluir reunião | `reuniao.realizada` (E-07) | MVP |
| Cancelar reunião | `reuniao.cancelada` (E-08) | MVP |
| Salvar escopo | `escopo.registrado` (E-09) | MVP |
| Criar proposta | `proposta.criada` (E-12) | MVP |
| Enviar proposta | `proposta.enviada` (E-13) | MVP |
| Registrar negociação | `proposta.em_negociacao` (E-16) | MVP |
| Registrar aprovação | `proposta.aprovada` (E-15) | MVP |
| Registrar recusa | `proposta.recusada` (E-17) | MVP |
| Criar contrato | `contrato.criado` (E-19) | MVP |
| Enviar contrato | `contrato.enviado` (E-20) | MVP |
| Confirmar assinatura | `contrato.assinado` (E-21) | MVP |
| Confirmar pagamento | `pagamento.recebido` (E-22) | MVP |
| Converter em projeto | `projeto.criado` (E-24) | MVP |
| Registrar interação | `negociacao.interacao_registrada` (E-51)* | MVP |
| Arquivar negociação | `negociacao.arquivada` (E-52)* | MVP |
| Reabrir negociação | `negociacao.reaberta` (E-53)* | v1.1 |

\*Eventos novos propostos para este módulo — devem ser adicionados ao CORE v1.1 antes da implementação.

### Evento novo: E-51 · negociacao.interacao_registrada

| Campo | Detalhe |
|-------|---------|
| **Disparador** | Fundador registra ligação, email ou reunião informal |
| **Consequências** | Timeline · Atualizar `ultima_atividade_em` na negociação |
| **Não faz** | Mudar status da negociação automaticamente |

### Evento novo: E-52 · negociacao.arquivada

| Campo | Detalhe |
|-------|---------|
| **Disparador** | Fundador arquiva negociação perdida ou cancelada |
| **Consequências** | Status negociação → arquivada · Cancelar ações pendentes da negociação |

### Evento novo: E-53 · negociacao.reaberta

| Campo | Detalhe |
|-------|---------|
| **Disparador** | Fundador reabre negociação arquivada |
| **Consequências** | Status → aberta · Ação: definir próximo passo |

---

## 8. Integração com Clientes

### Relação

```
Módulo Clientes          Módulo Comercial
─────────────────        ──────────────────
Cliente (âncora)    ◄──── Negociação (1..n ao longo do tempo)
Status do cliente        Estágio da negociação
Observações gerais       Escopo + histórico comercial
Workspace                Seção "Comercial" na ficha do cliente
```

### Regras de integração

| Regra | Descrição |
|-------|-----------|
| **Criação** | Cliente criado no módulo Clientes (ou atalho no Comercial que dispara `cliente.criado`) |
| **Leitura** | Comercial lê nome, contato, telefone, email — não edita inline; link "Editar cliente" |
| **Status** | Comercial **sugere** mudança de status; CORE executa via eventos |
| **Ficha do cliente** | Mostra: negociação ativa, última proposta, status, valor em aberto |
| **Filtro** | Lista Comercial filtra clientes com negociação ativa; lista Clientes filtra por status Lead |

### O que aparece na ficha do Cliente (seção Comercial)

| Informação | Fonte |
|------------|-------|
| Negociação ativa (se houver) | Comercial |
| Estágio e próximo passo | Comercial |
| Valor da última proposta | Proposta |
| Propostas anteriores (colapsado) | Comercial |
| Contratos | Comercial |
| Link "Abrir negociação" | Comercial |

### O que NÃO duplicar

- Nome, email, telefone → só no Cliente
- Observações gerais do relacionamento → Cliente
- Escopo comercial estruturado → Negociação (não observações do cliente)

---

## 9. Integração com Projetos

### Handoff (momento crítico)

O Comercial **termina** quando `projeto.criado` é disparado.

```
pagamento.recebido (inicial)
        │
        ▼
Ação na inbox: "Criar projeto — [Negociação]"
        │
        ▼
Fundador confirma (1 clique)
        │
        ▼
projeto.criado (E-24)
        │
        ├── Negociação → ganha
        ├── Cliente → Ativo
        └── Projetos recebe pacote de handoff
```

### Pacote de handoff (referências, não cópias)

| Campo herdado | Origem |
|---------------|--------|
| `cliente_id` | Cliente |
| `negociacao_id` | Negociação |
| `contrato_id` | Contrato |
| `proposta_aprovada_id` | Proposta |
| Nome do projeto | Sugerido: "[Tipo] — [Nome Cliente]" |
| Tipo de serviço | Escopo |
| Valor | Contrato |
| Prazo estimado | Escopo |
| Escopo (leitura) | Escopo da negociação |

### Após handoff

| Comercial | Projetos |
|-----------|----------|
| Negociação em **ganha** (somente leitura) | Dono da execução |
| Novas propostas para mesmo cliente | Novo ciclo = nova negociação |
| Aditivos de escopo mid-project | Módulo Projetos + evento `aditivo.*` [FUTURO] |

---

## 10. Integração com Financeiro

### Divisão de responsabilidade

| Comercial | Financeiro |
|-----------|------------|
| Dispara cobrança (ação) | Registra pagamento |
| Sabe valor esperado (contrato) | Fonte de verdade de recebimentos |
| Bloqueia handoff sem pagamento | Relatórios de receita |

### Fluxo financeiro no Comercial

```
contrato.assinado
    → Ação: "Solicitar pagamento inicial — R$ X"
    → Fundador envia link/cobrança (manual MVP)

pagamento.recebido (inicial)
    → Financeiro registra
    → Comercial destrava handoff

projeto.aprovado (fora do Comercial, em Projetos)
    → pagamento.recebido (final) no Financeiro
```

### O que o Comercial mostra (leitura do Financeiro)

| Na negociação | Dado |
|---------------|------|
| Valor total do contrato | Contrato |
| Parcela inicial: paga / pendente | Financeiro |
| Parcela final: paga / pendente | Financeiro (após handoff, link no projeto) |

### O que o Comercial NÃO faz

- Emitir NF-e
- Conciliação bancária
- Relatórios de fluxo de caixa
- Gestão de despesas

---

## 11. Integração com Dashboard ("Hoje")

### O que o Dashboard puxa do Comercial

| Card / seção | Dado |
|--------------|------|
| Pipeline | Soma de propostas enviadas + em negociação |
| Prioridades do dia | Ações comerciais da inbox |
| Propostas vencendo | `valida_ate` em 3 dias |
| Sem resposta há 7 dias | proposta.enviada sem resposta |
| Aguardando assinatura | contrato.enviado |
| Aguardando pagamento | contrato.assinado sem pagamento |
| Leads parados | cliente Lead + lead.sem_atividade |

### Clique no Dashboard → Comercial

Todo item comercial no Dashboard é **deep link** para a negociação específica, não para lista genérica.

Exemplo: *"Proposta vence amanhã — Empresa ABC"* → abre Negociação da Empresa ABC na aba Proposta.

---

## 12. Integração com Timeline

### Regra

**Todo evento comercial gera entrada na Timeline do Cliente.** Eventos com `negociacao_id` também geram entrada na Timeline da Negociação.

### Formato conceitual das entradas

| Evento | Texto na Timeline |
|--------|-------------------|
| escopo.registrado | "Escopo registrado — Site institucional" |
| proposta.enviada | "Proposta v2 enviada — R$ 8.000" |
| proposta.aprovada | "Proposta aprovada pelo cliente" |
| contrato.assinado | "Contrato assinado" |
| pagamento.recebido | "Pagamento inicial recebido — R$ 4.000" |
| negociacao.interacao_registrada | "Ligação registrada — [resumo]" |

### Ordenação

Timeline unificada na ficha do Cliente (comercial + projetos + financeiro). Filtro opcional: "Só comercial".

---

## 13. Integração com Portal do Cliente [FUTURO]

### MVP

Comercial opera sem Portal. Proposta enviada por email/PDF manual; aprovação registrada pelo fundador.

### Fase Portal v1

| Funcionalidade | Evento CORE |
|----------------|-------------|
| Cliente visualiza proposta | proposta.visualizada |
| Cliente aceita proposta | Fundador confirma → proposta.aprovada |
| Cliente assina contrato | Integração Clicksign → contrato.assinado |
| Cliente paga | Webhook → pagamento.recebido |

### O que o Portal NÃO faz

- Ver outras negociações
- Editar proposta
- Negociar pelo portal (v1) — negociação continua por comunicação + fundador registra

---

## 14. Integração com Arquivos

### Estrutura no Workspace do Cliente

```
Workspace Cliente/
├── comercial/
│   ├── negociacao-[id]/
│   │   ├── propostas/
│   │   │   ├── proposta-v1.pdf
│   │   │   └── proposta-v2.pdf
│   │   ├── contratos/
│   │   │   └── contrato-assinado.pdf
│   │   └── comprovantes/
│   │       ├── aprovacao-cliente.png
│   │       └── pagamento-inicial.pdf
```

### Regras

| Regra | Descrição |
|-------|-----------|
| **Auto-arquivo** | PDF gerado ao enviar proposta/contrato salvo automaticamente |
| **Comprovante** | Aprovação e pagamento exigem anexo ou link |
| **Versão** | Cada versão de proposta = arquivo separado, nunca sobrescrever |
| **Referência** | Proposta e Contrato no Comercial apontam para `file_id` |

---

## 15. Catálogo de funcionalidades

Legenda: **Fundador** = único usuário MVP

---

### F-01 · Nova negociação (atalho: "novo lead comercial")

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Iniciar ciclo comercial para um prospect |
| **Quando** | Primeiro contato qualificado ou cliente existente com nova demanda |
| **Quem** | Fundador |

**Fluxo:**

1. Se cliente não existe → mini-cadastro (nome, contato) → `cliente.criado` → status Lead
2. Se cliente existe → selecionar da busca
3. Criar negociação vinculada → status **aberta**
4. Sugerir título: "[Tipo estimado] — [Nome Cliente]"

**Automático:** Timeline "Negociação aberta" · Ação: "Qualificar ou agendar reunião"

**CORE:** `cliente.criado` (se novo) · `negociacao.criada` (E-54 proposto)

**Módulos atualizados:** Clientes · Comercial · Timeline · Ações

---

### F-02 · Qualificar lead

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Confirmar que vale investir tempo |
| **Quando** | Após cadastro ou primeiro contato registrado |
| **Quem** | Fundador |

**Automático:** Ação: "Agendar reunião de descoberta"

**CORE:** `cliente.qualificado` (E-03)

---

### F-03 · Descartar lead / perder negociação

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Encerrar oportunidade sem projeto |
| **Quando** | Lead não qualificado ou proposta recusada |
| **Quem** | Fundador |

**Validação:** Motivo obrigatório

**Automático:** Negociação → perdida · Cliente → Perdido (se sem projetos) · Cancelar ações

**CORE:** `cliente.descartado` (E-04) ou `proposta.recusada` (E-17)

---

### F-04 · Mover estágio da negociação

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Refletir progresso na pipeline |
| **Quando** | Mudança real de fase (não substitui eventos CORE) |
| **Quem** | Fundador |

**Estágios manuais permitidos:** descoberta → proposta → fechamento

**Regra:** Estágio **não pode** pular validações (ex: fechamento sem proposta aprovada)

**Automático:** Timeline com mudança de estágio

**CORE:** `negociacao.estagio_alterado` (E-55 proposto) — ou derivado de outros eventos sem evento separado [recomendado: derivar, não evento manual]

**Simplificação MVP:** Estágio é **derivado do estado**, não movido manualmente. Fundador não "move card" — eventos movem automaticamente.

---

### F-05 · Registrar interação (ligação, email, mensagem)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Preservar decisões tomadas fora do sistema |
| **Quando** | Após ligação ou conversa importante no WhatsApp/email |
| **Quem** | Fundador |

**Campos:** Tipo (ligação / email / mensagem / presencial) · Resumo (1-3 linhas) · Data (default: agora)

**Automático:** Timeline · Atualizar última atividade da negociação

**CORE:** `negociacao.interacao_registrada` (E-51)

**Não faz:** Substituir aprovação formal de proposta

---

### F-06 · Agendar reunião de descoberta

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar compromisso de descoberta |
| **Quando** | Lead qualificado |
| **Quem** | Fundador |

**Campos:** Data, hora, link (opcional MVP)

**Automático:** Lembrete 1h antes [FUTURO] · Ação removida "agendar" · Nova ação pós-reunião: "Registrar escopo"

**CORE:** `reuniao.agendada` (E-06)

---

### F-07 · Concluir reunião

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Marcar descoberta como realizada |
| **Quando** | Após reunião P-04 |
| **Quem** | Fundador |

**Automático:** Ação: "Registrar escopo"

**CORE:** `reuniao.realizada` (E-07)

---

### F-08 · Registrar escopo

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Documentar o que será proposto |
| **Quando** | Após reunião de descoberta |
| **Quem** | Fundador |

**Campos obrigatórios:** Tipo (site / landing / sistema) · Objetivo · Entregáveis · Não inclui · Prazo estimado · Valor interno estimado

**Automático:** Negociação atualizada · Ação: "Criar proposta"

**CORE:** `escopo.registrado` (E-09)

---

### F-09 · Criar proposta

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Gerar documento comercial a partir do escopo |
| **Quando** | Escopo registrado |
| **Quem** | Fundador |

**Automático:** Proposta rascunho v1 · Pré-preenchida com escopo · PDF preview

**CORE:** `proposta.criada` (E-12)

---

### F-10 · Editar proposta

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Ajustar rascunho antes do envio |
| **Quando** | Status Rascunho apenas |
| **Quem** | Fundador |

**Validação:** Proposta enviada não edita — usar F-11

**CORE:** Nenhum (edição de rascunho não é evento até envio)

---

### F-11 · Duplicar proposta (nova versão)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Criar v2+ após negociação ou correção |
| **Quando** | Negociação em andamento ou proposta anterior enviada |
| **Quem** | Fundador |

**Automático:** Nova versão v(n+1) em rascunho · Versão anterior preservada

**CORE:** `proposta.criada` (E-12) com `versao: n+1`

---

### F-12 · Enviar proposta

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Formalizar envio ao cliente |
| **Quando** | Rascunho revisado |
| **Quem** | Fundador |

**Checklist pré-envio:** Nome correto · Valor · Prazo · Exclusões · Validade

**Automático:** PDF gerado e arquivado · Status Enviada · Alertas 3d/7d · Negociação → proposta_enviada

**CORE:** `proposta.enviada` (E-13)

---

### F-13 · Registrar resposta do cliente

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar decisão: aprovar, negociar ou recusar |
| **Quando** | Cliente respondeu |
| **Quem** | Fundador |

**Três caminhos:**

| Resposta | CORE | Próxima ação |
|----------|------|--------------|
| Aprovada | E-15 + comprovante | Gerar contrato |
| Negociação | E-16 | Duplicar proposta |
| Recusada | E-17 + motivo | Arquivar |

---

### F-14 · Gerar contrato

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Criar documento legal da proposta aprovada |
| **Quando** | proposta.aprovada |
| **Quem** | Fundador |

**Automático:** Pré-preenchido da proposta · Status Rascunho

**CORE:** `contrato.criado` (E-19)

---

### F-15 · Enviar contrato para assinatura

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Enviar para assinatura digital ou manual |
| **Quando** | Contrato revisado |
| **Quem** | Fundador |

**Automático:** Alerta 7 dias · Negociação → aguardando_contrato

**CORE:** `contrato.enviado` (E-20)

---

### F-16 · Registrar assinatura

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Confirmar contrato assinado |
| **Quando** | Ambas as partes assinaram |
| **Quem** | Fundador |

**Automático:** Negociação → aguardando_pagamento · Ação: "Solicitar pagamento inicial"

**CORE:** `contrato.assinado` (E-21)

---

### F-17 · Solicitar / registrar pagamento inicial

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Confirmar recebimento da primeira parcela |
| **Quando** | Contrato assinado |
| **Quem** | Fundador |

**MVP:** Fundador envia PIX/link manualmente; registra recebimento no sistema

**Automático:** Ação: "Converter em projeto"

**CORE:** `pagamento.recebido` (E-22, tipo: inicial)

---

### F-18 · Converter em projeto (handoff)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Entregar operação ao módulo Projetos |
| **Quando** | Pagamento inicial confirmado |
| **Quem** | Fundador (1 clique de confirmação) |

**Automático:** Projeto criado com handoff · Negociação → ganha · Cliente → Ativo

**CORE:** `projeto.criado` (E-24)

---

### F-19 · Arquivar negociação

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Remover da operação ativa sem apagar histórico |
| **Quando** | Perdida, expirada ou cancelada |
| **Quem** | Fundador |

**CORE:** `negociacao.arquivada` (E-52)

---

### F-20 · Reabrir negociação

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Retomar oportunidade arquivada |
| **Quando** | Cliente retorna após meses |
| **Quem** | Fundador |

**Validação:** Cria nova negociação ou reabre conforme política (preferir **nova negociação** vinculada ao mesmo cliente)

**CORE:** `cliente.reativado` (E-48) + `negociacao.criada` (E-54)

---

### F-21 · Buscar negociação

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Encontrar qualquer negociação em < 10 segundos |
| **Quando** | Sempre |
| **Quem** | Fundador |

**Busca em:** Nome cliente · Contato · Valor · Status · Título negociação

**CORE:** Nenhum (leitura)

---

### F-22 · Visualizar pipeline

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Ver todas as negociações abertas e valor total |
| **Quando** | Início do dia ou revisão semanal |
| **Quem** | Fundador |

**Agrupamento MVP:** Por estado (não kanban drag) · Total R$ por coluna

**CORE:** Nenhum (leitura)

---

## 16. Experiência do fundador — um dia inteiro

### 08:30 — Abre o sistema

**Primeiro clique:** Dashboard **"Hoje"** (não Comercial diretamente).

**Primeira informação vista:**

```
SUAS PRIORIDADES
🔴 Follow-up proposta — Loja Virtual XYZ (enviada há 7 dias)
🟡 Contrato aguardando assinatura — Empresa ABC
🔵 Registrar escopo — Startup Tech (reunião ontem)
```

Três itens. Não doze. Cada um é deep link para a **negociação** certa.

**Como sabe o que precisa de atenção:** Prioridades vêm das **Ações** geradas pelo CORE — não de memória.

---

### 08:35 — Clica no follow-up da Loja Virtual XYZ

Abre direto na **Negociação** · aba contextual **Proposta**.

Vê:
- Proposta v1 enviada há 7 dias · R$ 5.000 · válida até 15/07
- Timeline: enviada, visualizada [futuro]
- **Próximo passo sugerido:** *"Enviar follow-up ou registrar resposta"*

Registra interação: *"Ligação — cliente pediu até sexta para decidir"* → F-05 → Timeline.

**30 segundos. Nenhum WhatsApp necessário para lembrar depois.**

---

### 09:00 — Novo contato pelo Instagram

**Caminho:** Comercial → **+ Nova negociação** (2 cliques da Dashboard via ⌘K busca "comercial" — 1 clique se atalho na sidebar).

Mini-cadastro: Nome, WhatsApp → Salvar.

Sistema: Cliente Lead + Negociação aberta + Ação *"Qualificar"*.

**45 segundos.**

---

### 10:30 — Reunião de descoberta (Startup Tech)

Antes da call: abre negociação → vê observações do cliente + reunião agendada.

Após call: **Concluir reunião** (1 clique) → Ação *"Registrar escopo"*.

Preenche escopo em 10 min → **Salvar escopo** → Ação *"Criar proposta"*.

---

### 11:00 — Cria e envia proposta (Startup Tech)

**Criar proposta** → sistema pré-preenche do escopo → ajusta valor → **Enviar**.

Checklist automático antes de enviar. PDF arquivado. Email ao cliente (manual MVP).

Proposta some das "prioridades urgentes" · entra em "Aguardando resposta" com alerta D+7 agendado.

---

### 14:00 — Empresa ABC assinou contrato

Notificação/Ação: *"Contrato assinado — registrar e cobrar"*.

**Registrar assinatura** → Ação: *"Solicitar pagamento inicial — R$ 4.000"*.

Cliente paga PIX. Fundador **Registra pagamento** → Ação: *"Converter em projeto"*.

**Converter em projeto** (1 clique) → handoff completo → Negociação **ganha**.

Comercial libera. Projeto aparece no módulo Projetos.

---

### 16:00 — Como nunca esquece ninguém

| Mecanismo | O que cobre |
|-----------|-------------|
| Ações (inbox) | Tudo que precisa de decisão humana |
| Alertas temporais CORE | Proposta 7d, validade 3d, contrato 7d, pagamento 5d |
| `lead.sem_atividade` | Leads esquecidos |
| Dashboard "Hoje" | Agregação das 3-5 mais urgentes |

**Regra pessoal + sistema:** Se não está na inbox ou no Dashboard, não é prioridade hoje.

---

### 17:00 — Encontrar qualquer negociação em < 10 segundos

**Caminho 1:** ⌘K → digita "ABC" → Negociação Empresa ABC.

**Caminho 2:** Comercial → busca → filtro status.

**Caminho 3:** Cliente → seção Comercial → negociação ativa.

Três caminhos, mesmo destino.

---

### 18:00 — Sai do módulo

Não precisa "fechar" negociação. Estados ficam corretos via eventos.

Única ação: marcar Ações concluídas ao longo do dia (`acao.concluida`).

---

## 17. Navegação e UX

### Entrada no módulo

| Origem | Cliques até Comercial |
|--------|----------------------|
| Sidebar → Comercial | 1 |
| Dashboard → prioridade comercial | 1 (deep link negociação) |
| Cliente → seção Comercial | 1 |
| ⌘K → "comercial" ou nome cliente | 1-2 |

**Tela inicial do Comercial:** Lista de negociações ativas — não dashboard próprio. Motivo: Dashboard "Hoje" já é o resumo; Comercial é trabalho focal.

---

### Criar negociação (novo lead comercial)

```
Comercial (lista)
    → [+ Nova negociação]          (1 clique)
    → Buscar cliente existente      (0 cliques se novo)
       OU preencher mini-cadastro   (3 campos)
    → [Criar]                       (1 clique)
    → Abre negociação criada        (automático)
```

**Total: 2 cliques + campos mínimos.**

---

### Abrir uma negociação

```
Lista → clicar linha                  (1 clique)
```

**Layout conceitual da negociação (uma página, seções — não abas):**

```
┌─────────────────────────────────────────────────────────┐
│ ← Comercial    Empresa ABC · Site Institucional         │
│ Status: Proposta enviada              [Próximo passo ▾] │
├─────────────────────────────────────────────────────────┤
│ ▼ PRÓXIMO PASSO                                         │
│   Registrar resposta do cliente ou enviar follow-up     │
├─────────────────────────────────────────────────────────┤
│ Cliente (link) · R$ 8.000 · Enviada há 3 dias           │
├─────────────────────────────────────────────────────────┤
│ Escopo │ Proposta │ Contrato │ Interações │ Timeline    │
│ (seções colapsáveis — abre na relevante por contexto)   │
└─────────────────────────────────────────────────────────┘
```

**Próximo passo** é sempre visível no topo — 1 clique executa a ação.

---

### Acompanhar tudo

| Necessidade | Onde |
|-------------|------|
| Todas negociações abertas | Comercial → lista |
| Por estado | Filtro rápido (chips) |
| Valor total pipeline | Header da lista |
| O que vence | Dashboard + filtro "Vencendo" |
| Histórico de um cliente | Cliente → Comercial |

**Sem kanban no MVP.** Lista densa estilo Linear é mais rápida para 1 usuário com 5-20 negociações.

---

### Finalizar (ganhar ou perder)

**Ganhar:**
```
Pagamento inicial → Converter em projeto (1 clique)
```
Negociação some da lista ativa · aparece em "Ganhas" (colapsado).

**Perder:**
```
Registrar resposta → Recusada → Motivo (2 cliques)
```
Opcional: Arquivar (1 clique).

---

### Sair do módulo

Sem "salvar" global — cada ação salva ao confirmar. Sem rascunho perdido de negociação inteira; rascunho só em proposta/contrato.

---

### Orçamento de cliques por tarefa

| Tarefa | Cliques alvo |
|--------|--------------|
| Nova negociação | 2 |
| Registrar interação | 2 |
| Salvar escopo | 2 (abrir + salvar) |
| Enviar proposta | 3 (criar + revisar + enviar) |
| Registrar aprovação | 2 |
| Handoff projeto | 1 (após pagamento) |
| Encontrar negociação | 1-2 |

---

## 18. Análise crítica

### Quais partes ficaram complexas?

| Área | Complexidade | Motivo |
|------|--------------|--------|
| Três entidades (Negociação, Proposta, Contrato) | Média-alta | Necessária para versionamento e gates |
| Estados derivados vs manuais | Média | F-04 "mover negociação" conflita com eventos — resolvemos derivando |
| Handoff package | Média | Muitas referências cruzadas |
| Eventos E-51 a E-55 novos | Baixa | Precisam entrar no CORE antes de implementar |

**Maior risco de complexidade:** fundador perceber Negociação + Proposta + Contrato como "três lugares". **Mitigação:** uma página, seções colapsáveis, próximo passo único.

---

### O que pode ser simplificado?

| Simplificação | MVP |
|---------------|-----|
| Eliminar "mover estágio" manual | ✓ Estágio derivado de eventos |
| Uma negociação ativa por cliente | ✓ |
| Sem kanban | ✓ Lista + filtros |
| Contrato = template fixo, sem editor | ✓ |
| Pagamento manual sem gateway | ✓ |
| Interações = campo simples, não CRM activity | ✓ |
| Unificar "Descartar lead" e "Perder negociação" | ✓ Mesmo fluxo, motivo obrigatório |

---

### O que Linear, Stripe e Notion fariam diferente?

| Empresa | Abordagem | Aplicação Norax |
|---------|-----------|------------------|
| **Linear** | Issue tem status claro, inbox zero | Negociação = issue; Ações = inbox |
| **Stripe** | PaymentIntent com estados finitos | Proposta/Contrato/Pagamento como pipeline de cobrança |
| **Notion** | Template duplicável | Template de escopo + proposta por tipo de serviço |
| **Stripe** | Customer → Subscription → Invoice | Cliente → Negociação → Proposta → Contrato → Pagamento |
| **Linear** | Cycles e projects separados | Comercial termina; Projetos começa — fronteira rígida |

**O que NÃO copiar:**
- Linear tem 15 status de issue — Norax tem 8 de negociação máximo
- Notion deixa tudo livre — Norax estrutura escopo e proposta
- CRMs têm "deals" com 50 campos — Norax tem 6 campos por negociação

---

### Como manter simples com milhares de clientes?

| Estratégia | Como |
|------------|------|
| Busca primeiro | Lista não escala; ⌘K escala |
| Arquivar agressivamente | Negociações ganhas/perdidas saem da lista ativa |
| Filtros, não views infinitas | 5 filtros fixos |
| Paginação | 50 por página |
| Sem automação de email em massa | Norax é high-touch |
| Responsável por negociação [FUTURO] | Filtro "minhas" quando houver equipe |
| Métricas no Dashboard, detalhe no Comercial | Não carregar lista com gráficos |

---

### O que NÃO deve existir neste módulo?

| Proibido | Motivo |
|----------|--------|
| Cadastro completo de cliente | Módulo Clientes |
| Execução de projeto | Módulo Projetos |
| NF-e, boletos, conciliação | Financeiro |
| Pipeline kanban drag-and-drop | Complexidade; lista basta |
| Campos customizados | Over-engineering |
| Automação de email marketing | Não é a Norax |
| Scoring de lead por IA | Sem dados no MVP |
| Múltiplos vendedores / comissão | Sem equipe |
| Integração WhatsApp | Filosofia |
| Relatórios complexos | Dashboard + export futuro |
| Gestão de tarefas genérica | Ações do CORE |
| Catálogo de produtos | 3 tipos de serviço fixos |

---

### Como evitar virar CRM genérico?

| Anti-padrão CRM | Alternativa Norax |
|-----------------|-------------------|
| Lead scoring | Qualificação manual 3 perguntas |
| 20 campos no deal | Escopo estruturado + proposta |
| Sequências de email | Follow-up via Ações |
| Funil com 10 estágios | 8 estados derivados de eventos |
| "Atividades" infinitas | Interação com resumo curto |
| Contatos múltiplos | Um contato no Cliente [MVP] |
| Territórios e quotas | Não existe |
| Integração com tudo | CORE + 4 módulos |

**Teste anti-CRM:** Se a funcionalidade serve para uma imobiliária ou academia, **não entra**.

**Teste Norax:** Se a funcionalidade move Lead → Projeto Pago, **entra**.

---

## Apêndice A — Eventos novos para CORE v1.1

| ID | Evento | Disparador |
|----|--------|------------|
| E-51 | negociacao.interacao_registrada | F-05 |
| E-52 | negociacao.arquivada | F-19 |
| E-53 | negociacao.reaberta | F-20 |
| E-54 | negociacao.criada | F-01 |
| E-55 | negociacao.estagio_alterado | [Não usar — derivar de outros] |

---

## Apêndice B — Mapa de integrações

```
                    ┌─────────────┐
                    │  DASHBOARD  │
                    │   ("Hoje")  │
                    └──────┬──────┘
                           │ lê ações e métricas
                    ┌──────▼──────┐
     ┌──────────────│  COMERCIAL  │──────────────┐
     │              └──────┬──────┘              │
     │ referencia          │ eventos             │ handoff
     ▼                     ▼                     ▼
┌─────────┐         ┌─────────┐          ┌───────────┐
│ CLIENTES│         │  CORE   │          │ PROJETOS  │
└─────────┘         └────┬────┘          └───────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
        ┌─────────┐ ┌──────┐ ┌─────────┐
        │TIMELINE │ │AÇÕES │ │ ARQUIVOS│
        └─────────┘ └──────┘ └─────────┘
              ▲
              │ pagamentos
        ┌─────┴─────┐
        │ FINANCEIRO│
        └───────────┘

        ┌─────────────┐
        │   PORTAL    │  [FUTURO]
        └─────────────┘
```

---

## Apêndice C — Checklist de conformidade

Antes de implementar qualquer tela do Comercial:

- [ ] Respeita Leis do CORE?
- [ ] Dispara evento correto?
- [ ] Não duplica dados do Cliente?
- [ ] Respeita gates G-01 e G-02 no handoff?
- [ ] Gera Timeline?
- [ ] Cria Ação só se humano precisa agir?
- [ ] Próximo passo visível?
- [ ] Passa no teste anti-CRM?
- [ ] Funciona para fundador solo?
- [ ] Evento novo documentado no CORE?

---

*Especificação oficial · Módulo Comercial Norax · v1.0*  
*Documentos base: NORAX-CORE.md · NORAX-FLUXO-OPERACIONAL.md · Filosofia Norax*


