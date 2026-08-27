# NORAX CORE

**Documento:** Constituição Comportamental do Sistema  
**Versão:** 1.0  
**Status:** Referência obrigatória para toda funcionalidade futura  
**Escopo:** Regras automáticas · Eventos · Estados · Consequências

---

> O CORE não é interface. Não é módulo. É o cérebro da Norax.  
> Toda mudança no sistema começa com um evento. Todo evento tem consequências definidas aqui.

---

## Índice

1. [Leis do CORE](#1-leis-do-core)
2. [Conceitos fundamentais](#2-conceitos-fundamentais)
3. [Máquina de estados](#3-máquina-de-estados)
4. [Catálogo de eventos](#4-catálogo-de-eventos)
5. [Matriz mestre](#5-matriz-mestre)
6. [Análise crítica](#6-análise-crítica)

---

## 1. Leis do CORE

Toda funcionalidade futura **deve** obedecer estas leis. Sem exceção.

### Lei 1 — Cliente é a âncora

Todo evento comercial ou operacional pertence a um **Cliente**. Não existe proposta, projeto, contrato ou pagamento sem `cliente_id`. Informação nunca flutua solta.

### Lei 2 — Evento antes de estado

Ninguém altera status diretamente. Status é **consequência** de um evento registrado. O fundador declara ações; o sistema emite eventos; o CORE executa consequências.

### Lei 3 — Timeline é sagrada

Todo evento gera entrada na **Timeline** do cliente (e do projeto, quando aplicável). Timeline é imutável: append-only, nunca editada, nunca apagada.

### Lei 4 — Ação só quando necessário

**Timeline** registra o que aconteceu. **Ação** (inbox) aparece apenas quando um humano precisa fazer algo. Não confundir os dois.

### Lei 5 — Gate bloqueia, CORE valida

Gates (G-01 a G-06 do Fluxo Operacional) impedem eventos inválidos. O CORE rejeita eventos que violam gates e explica o motivo.

### Lei 6 — Uma fonte de verdade

Dado pertence a um módulo. Outros módulos **referenciam**, nunca **copiam**. Exemplo: valor do contrato vive no Contrato; Financeiro referencia, não duplica.

### Lei 7 — Idempotência

O mesmo evento disparado duas vezes produz o mesmo resultado. Nunca duplicar timeline, ação ou registro financeiro.

### Lei 8 — Simplicidade no MVP

Automação marcada **[MVP]** entra no Dia 1. Marcada **[FUTURO]** só quando o gatilho existir de verdade. Automação sem problema real hoje é proibida.

### Lei 9 — WhatsApp não é histórico

O CORE nunca integra WhatsApp. Comunicação externa relevante entra no sistema por ação humana (observação ou evento manual documentado).

### Lei 10 — Extensibilidade sem ruptura

Novos eventos seguem o mesmo padrão deste documento. Novos módulos consomem eventos existentes; não recriam lógica paralela.

---

## 2. Conceitos fundamentais

### Evento

Algo que **aconteceu** e muda o estado do sistema.

```
Estrutura conceitual de um evento:

  evento:        cliente.criado
  disparador:    Fundador salva novo cliente
  timestamp:     automático
  ator:          fundador | sistema | cliente
  cliente_id:    obrigatório (quando aplicável)
  projeto_id:    opcional
  metadata:      dados específicos do evento
```

### Consequência

O que o CORE executa automaticamente após validar um evento.

| Tipo | Descrição | Obrigatório |
|------|-----------|-------------|
| **Timeline** | Registro imutável no histórico | Sempre |
| **Estado** | Atualização de status | Quando aplicável |
| **Ação** | Item na inbox do fundador | Só se humano precisa agir |
| **Notificação** | Alerta para o fundador | Só se urgente ou temporal |
| **Estrutura** | Criar container (workspace, pasta, checklist) | Quando aplicável |
| **Agendamento** | Timer futuro (lembrete, expiração) | Quando aplicável |

### Workspace do Cliente

Container lógico criado no primeiro evento do cliente. Não é tela — é o **contexto** onde tudo do cliente vive:

- Identidade (nome, contato, status)
- Timeline
- Raiz de arquivos
- Referências a projetos, propostas, contratos (quando existirem)

### Ação (Inbox)

Fila de pendências do fundador. Toda ação tem: título, prioridade, vencimento opcional, link para contexto, origem do evento.

**Regra:** máximo de clareza — *"Enviar proposta revisada — Empresa ABC"*, nunca *"Pendência"*.

---

## 3. Máquina de estados

### Cliente

```
                    ┌──────────┐
         ┌─────────│   LEAD   │◄──────── cliente.reativado
         │         └────┬─────┘
         │              │ cliente.qualificado
         │              ▼
         │         ┌──────────┐
         │         │  ATIVO   │◄──── contrato.assinado
         │         └────┬─────┘       pagamento.recebido (inicial)
         │              │
         │    ┌─────────┼─────────┐
         │    │         │         │
         │    ▼         ▼         ▼
         │ ┌──────┐ ┌────────┐ ┌─────────┐
         │ │PERDIDO│ │INATIVO │ │ ARQUIVADO│
         │ └──────┘ └────────┘ └─────────┘
         │     ▲         ▲
         │     │         │ projeto.encerrado (sem outros projetos)
         └─────┘         │
              cliente.descartado
              proposta.recusada
```

| Status | Significado |
|--------|-------------|
| **Lead** | Cadastrado, em qualificação ou negociação |
| **Ativo** | Contrato em vigor ou projeto em andamento |
| **Inativo** | Relacionamento pausado, sem projetos ativos |
| **Perdido** | Não fechou, sem perspectiva imediata |
| **Arquivado** | Fora de operação, preservado para histórico |

### Projeto

```
PLANEJAMENTO → EM_ANDAMENTO → EM_REVISAO → AGUARDANDO_CLIENTE
     → APROVADO → ENTREGUE → EM_GARANTIA → CONCLUIDO → ARQUIVADO
```

| Status | Disparado por |
|--------|---------------|
| Planejamento | projeto.criado |
| Em andamento | materiais.completos |
| Em revisão | projeto.desenvolvimento_concluido |
| Aguardando cliente | projeto.apresentado |
| Aprovado | projeto.aprovado |
| Entregue | projeto.entregue |
| Em garantia | projeto.garantia_iniciada |
| Concluído | projeto.encerrado |
| Arquivado | projeto.arquivado |

### Proposta

```
RASCUNHO → ENVIADA → [VISUALIZADA] → APROVADA | RECUSADA | EXPIRADA | EM_NEGOCIACAO
```

### Contrato

```
RASCUNHO → ENVIADO → ASSINADO | CANCELADO
```

### Hospedagem

```
ATIVA → ALERTA_RENOVACAO → RENOVADA | EM_TRANSFERENCIA → TRANSFERIDA | DESLIGADA
```

---

## 4. Catálogo de eventos

Legenda: **[MVP]** = Dia 1 · **[FUTURO]** = quando módulo existir

---

### E-01 · cliente.criado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Inicializar o workspace do cliente no sistema |
| **Disparador** | Fundador salva novo cadastro (P-02) |
| **Validações** | Nome obrigatório; verificar duplicata (nome, email, telefone) |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Gerar identificador único do cliente |
| 2 | Criar Workspace do Cliente |
| 3 | Criar Timeline vazia (primeira entrada: este evento) |
| 4 | Criar raiz de arquivos do cliente |
| 5 | Definir status inicial: **Lead** |
| 6 | Registrar data de entrada |
| 7 | Registrar origem (se informada) |

**Módulos afetados:** Clientes · Timeline · Arquivos

**Informações registradas:** nome, contato, telefone, email, status, origem, observações, criado_em

**Notificações:** Nenhuma

**Ação criada [MVP]:** *"Qualificar lead — [Nome do Cliente]"*

**Erros a evitar:** Duplicar workspace se evento reemitido; criar projeto automaticamente

**Exceções:** Duplicata detectada → alertar fundador antes de confirmar criação

**Próximo estado do cliente:** **Lead**

---

### E-02 · cliente.atualizado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar mudança de dados do cliente |
| **Disparador** | Fundador edita ficha do cliente |
| **Validações** | Nome não vazio; duplicata se email/telefone alterados |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Registrar na Timeline: campos alterados |
| 2 | Atualizar `atualizado_em` |

**Módulos afetados:** Clientes · Timeline

**Notificações:** Nenhuma

**Ação criada:** Nenhuma (atualização não exige pendência)

**Erros a evitar:** Sobrescrever histórico; perder versão anterior de observações sem registro

**Exceções:** Mudança de status usa eventos específicos (E-03, E-04), não este

**Próximo estado do cliente:** Inalterado

---

### E-03 · cliente.qualificado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Confirmar que o lead vale investimento de tempo |
| **Disparador** | Fundador marca lead como qualificado (P-03) |
| **Validações** | Cliente deve estar em status **Lead** |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Timeline: "Lead qualificado" |
| 2 | Registrar critérios nas observações (se informados) |

**Ação criada [MVP]:** *"Agendar reunião de descoberta — [Nome]"*

**Erros a evitar:** Qualificar cliente já **Perdido** sem reativação prévia

**Exceções:** Cliente retornando → usar E-20 cliente.reativado antes

**Próximo estado do cliente:** **Lead** (qualificado, mas ainda lead até contrato)

---

### E-04 · cliente.descartado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Encerrar lead sem perspectiva comercial |
| **Disparador** | Fundador marca como Perdido (P-03 ou P-07) |
| **Validações** | Motivo obrigatório; sem projetos ativos |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status → **Perdido** |
| 2 | Timeline: "Cliente descartado — [motivo]" |
| 3 | Registrar motivo |
| 4 | Cancelar ações pendentes deste cliente |

**Ação criada [FUTURO]:** *"Recontatar em 90 dias — [Nome]"* (se fundador optar)

**Erros a evitar:** Descartar cliente com contrato ativo ou pagamento pendente

**Exceções:** Proposta recusada → mesmo evento com motivo da recusa

**Próximo estado do cliente:** **Perdido**

---

### E-05 · lead.sem_atividade

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Evitar leads esquecidos |
| **Disparador** | Sistema: 7 dias sem evento no cliente em status **Lead** |
| **Validações** | Status = Lead; nenhum evento nos últimos 7 dias |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Timeline: "Lead sem atividade há 7 dias" |

**Ação criada [MVP]:** *"Follow-up ou descartar — [Nome]"*

**Erros a evitar:** Disparar para clientes **Ativos** ou **Inativos**

**Próximo estado do cliente:** Inalterado

---

### E-06 · reuniao.agendada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar compromisso de descoberta |
| **Disparador** | Fundador agenda reunião (P-04) |
| **Validações** | Cliente existe; data futura |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Criar registro de reunião vinculado ao cliente |
| 2 | Timeline: "Reunião agendada — [data/hora]" |
| 3 | Agendar lembrete 1h antes [FUTURO] |

**Módulos afetados:** Clientes · Reuniões · Timeline

**Ação criada:** Nenhuma (compromisso já agendado)

**Erros a evitar:** Duplicar reunião para mesmo horário sem intenção

**Próximo estado do cliente:** **Lead**

---

### E-07 · reuniao.realizada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar que a descoberta aconteceu |
| **Disparador** | Fundador marca reunião como realizada |
| **Validações** | Reunião deve existir e estar agendada |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status da reunião → Realizada |
| 2 | Timeline: "Reunião de descoberta realizada" |

**Ação criada [MVP]:** *"Registrar escopo e preparar proposta — [Nome]"*

**Erros a evitar:** Marcar realizada sem registro posterior (escopo)

**Exceções:** Cliente faltou → usar E-08 reuniao.cancelada com motivo "no-show"

**Próximo estado do cliente:** **Lead**

---

### E-08 · reuniao.cancelada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar reunião não realizada |
| **Disparador** | Fundador cancela ou cliente falta |
| **Validações** | Reunião existente |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status da reunião → Cancelada |
| 2 | Timeline: "Reunião cancelada — [motivo]" |
| 3 | Invalidar link de sala [FUTURO] |

**Ação criada [MVP]:** *"Reagendar ou descartar lead — [Nome]"*

**Próximo estado do cliente:** Inalterado (ou **Perdido** se 2 no-shows — decisão manual)

---

### E-09 · escopo.registrado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Documentar escopo interno pós-reunião |
| **Disparador** | Fundador salva escopo (P-05) |
| **Validações** | Cliente qualificado; entregáveis e exclusões preenchidos |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Armazenar escopo vinculado ao cliente |
| 2 | Timeline: "Escopo registrado — [tipo de serviço]" |

**Ação criada [MVP]:** *"Preparar proposta — [Nome]"*

**Erros a evitar:** Criar proposta sem escopo registrado

**Próximo estado do cliente:** **Lead**

---

### E-10 · briefing.enviado · [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Enviar formulário estruturado ao cliente |
| **Disparador** | Fundador envia briefing pelo portal |
| **Validações** | Cliente com email; template de briefing selecionado |

**Ações automáticas:** Criar briefing · Timeline · Notificar cliente [FUTURO] · Ação: aguardar resposta

**Próximo estado do cliente:** **Lead**

---

### E-11 · briefing.concluido · [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar respostas do cliente |
| **Disparador** | Cliente submete briefing no portal |
| **Validações** | Briefing em status Enviado |

**Ações automáticas:** Status briefing → Concluído · Timeline · Ação: *"Revisar briefing — [Nome]"*

**Próximo estado do cliente:** **Lead**

---

### E-12 · proposta.criada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Iniciar documento comercial formal |
| **Disparador** | Fundador cria proposta (P-06) |
| **Validações** | Escopo registrado; valor > 0; validade definida |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Criar proposta vinculada ao cliente (status: Rascunho) |
| 2 | Gerar versão v1 |
| 3 | Timeline: "Proposta criada — R$ [valor]" |

**Módulos afetados:** Clientes · Comercial · Timeline

**Ação criada:** Nenhuma (ainda rascunho)

**Erros a evitar:** Criar proposta sem escopo; duplicar proposta ativa para mesmo escopo

**Próximo estado do cliente:** **Lead**

---

### E-13 · proposta.enviada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar envio ao cliente e iniciar contagem de validade |
| **Disparador** | Fundador envia proposta (P-06) |
| **Validações** | Proposta em Rascunho; revisão interna feita |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status proposta → **Enviada** |
| 2 | Registrar `enviada_em` e `valida_ate` |
| 3 | Timeline: "Proposta enviada — v[n] — R$ [valor]" |
| 4 | Agendar alerta: validade em 3 dias |
| 5 | Agendar alerta: sem resposta em 7 dias |

**Ação criada [FUTURO]:** Nenhuma imediata; alertas temporais criam ações

**Erros a evitar:** Enviar sem valor ou validade; reenviar mesma versão como nova

**Próximo estado do cliente:** **Lead**

---

### E-14 · proposta.visualizada · [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Saber que cliente abriu a proposta |
| **Disparador** | Cliente acessa proposta no portal |
| **Validações** | Proposta em status Enviada |

**Ações automáticas:** Status → Visualizada · Timeline · `visualizada_em`

**Notificação [FUTURO]:** *"Cliente visualizou proposta — [Nome]"*

**Próximo estado do cliente:** **Lead**

---

### E-15 · proposta.aprovada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Confirmar aceite comercial |
| **Disparador** | Fundador registra aprovação com comprovante escrito (P-07) |
| **Validações** | Proposta Enviada ou Em negociação; comprovante anexado ou referenciado |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status proposta → **Aprovada** |
| 2 | Registrar `aprovada_em` e comprovante |
| 3 | Timeline: "Proposta aprovada — v[n]" |
| 4 | Cancelar alertas de follow-up da proposta |
| 5 | Status cliente → **Ativo** |

**Ação criada [MVP]:** *"Gerar contrato — [Nome]"*

**Erros a evitar:** Aprovar sem comprovante escrito; aprovar proposta expirada sem renovar validade

**Exceções:** Aprovação verbal → CORE bloqueia até comprovante registrado

**Próximo estado do cliente:** **Ativo**

---

### E-16 · proposta.em_negociacao

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar que cliente pediu ajustes na proposta |
| **Disparador** | Fundador marca negociação (P-07) |
| **Validações** | Proposta Enviada; máximo 2 rodadas (validar contador) |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status proposta → **Em negociação** |
| 2 | Incrementar contador de rodadas |
| 3 | Timeline: "Proposta em negociação — rodada [n]" |

**Ação criada [MVP]:** *"Preparar proposta revisada — [Nome]"*

**Erros a evitar:** Mais de 2 rodadas sem decisão formal de exceção

**Exceções:** Fundador pode forçar 3ª rodada com justificativa registrada

**Próximo estado do cliente:** **Lead**

---

### E-17 · proposta.recusada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Encerrar oportunidade comercial |
| **Disparador** | Fundador registra recusa (P-07) |
| **Validações** | Motivo obrigatório |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status proposta → **Recusada** |
| 2 | Timeline: "Proposta recusada — [motivo]" |
| 3 | Disparar E-04 cliente.descartado (se sem outros projetos) |

**Erros a evitar:** Recusar sem motivo; manter ações de contrato pendentes

**Próximo estado do cliente:** **Perdido** (via E-04)

---

### E-18 · proposta.expirada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Encerrar proposta fora da validade |
| **Disparador** | Sistema: data atual > `valida_ate` sem resposta |
| **Validações** | Status Enviada ou Em negociação |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status proposta → **Expirada** |
| 2 | Timeline: "Proposta expirada" |

**Ação criada [MVP]:** *"Follow-up ou encerrar lead — [Nome]"*

**Próximo estado do cliente:** **Lead** (até decisão manual)

---

### E-19 · contrato.criado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Gerar documento legal a partir da proposta aprovada |
| **Disparador** | Fundador cria contrato (P-08) |
| **Validações** | Proposta aprovada existe; dados consistentes (valor, escopo) |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Criar contrato vinculado a cliente + proposta |
| 2 | Status contrato → **Rascunho** |
| 3 | Timeline: "Contrato criado" |

**Ação criada:** Nenhuma (aguarda envio)

**Erros a evitar:** Contrato com valor diferente da proposta sem aditivo

**Próximo estado do cliente:** **Ativo**

---

### E-20 · contrato.enviado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Enviar contrato para assinatura |
| **Disparador** | Fundador envia para assinatura digital |
| **Validações** | Contrato em Rascunho; conteúdo revisado |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status contrato → **Enviado** |
| 2 | Timeline: "Contrato enviado para assinatura" |
| 3 | Agendar alerta: não assinado em 7 dias |

**Próximo estado do cliente:** **Ativo**

---

### E-21 · contrato.assinado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Confirmar acordo legal formalizado |
| **Disparador** | Assinatura de ambas as partes confirmada (P-08) |
| **Validações** | Contrato Enviado; **Gate G-01** satisfeito |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status contrato → **Assinado** |
| 2 | Registrar `assinado_em` |
| 3 | Timeline: "Contrato assinado" |
| 4 | Cancelar alerta de assinatura pendente |

**Ação criada [MVP]:** *"Enviar cobrança inicial — [Nome]"*

**Erros a evitar:** Permitir kickoff ou desenvolvimento antes deste evento

**Próximo estado do cliente:** **Ativo**

---

### E-22 · pagamento.recebido

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar entrada financeira e destravar próxima fase |
| **Disparador** | Fundador confirma pagamento ou webhook de gateway [FUTURO] |
| **Validações** | Contrato assinado; valor e tipo informados (inicial / final / renovação) |

**Ações automáticas [MVP]** — variam por `tipo`:

| Tipo | Ações adicionais |
|------|------------------|
| **inicial** | Timeline · Cancelar cobrança pendente · **Ação:** *"Criar projeto e kickoff — [Nome]"* · Verificar **Gate G-02** |
| **final** | Timeline · Marcar financeiro quitado · **Ação:** *"Executar entrega — [Nome]"* · Verificar **Gate G-05** |
| **renovacao** | Timeline · Estender vencimento hospedagem +1 ano · Status hospedagem → Ativa |

**Módulos afetados:** Financeiro · Clientes · Projetos · Hospedagem · Timeline

**Erros a evitar:** Duplicar registro de pagamento; iniciar projeto sem tipo=inicial

**Exceções:** 100% upfront → tipo único dispara E-23 direto

**Próximo estado do cliente:** **Ativo**

---

### E-23 · pagamento.atrasado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Alertar sobre inadimplência |
| **Disparador** | Sistema: cobrança pendente há 5+ dias após evento esperado |
| **Validações** | Pagamento esperado não registrado |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Timeline: "Pagamento pendente — [tipo]" |

**Ação criada [MVP]:** *"Cobrar pagamento [tipo] — [Nome]"* — prioridade alta

**Erros a evitar:** Disparar após pagamento já registrado (idempotência)

**Próximo estado do cliente:** Inalterado

---

### E-24 · projeto.criado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Inicializar execução do trabalho |
| **Disparador** | Fundador cria projeto OU pagamento inicial confirmado (automático [FUTURO]) |
| **Validações** | **Gate G-02** — pagamento inicial recebido; contrato assinado |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Criar projeto vinculado a cliente + contrato |
| 2 | Status projeto → **Planejamento** |
| 3 | Aplicar checklist padrão por tipo (site / landing / sistema) |
| 4 | Criar Timeline do projeto |
| 5 | Criar pasta de arquivos do projeto |
| 6 | Timeline (cliente): "Projeto criado — [nome]" |
| 7 | Timeline (projeto): "Projeto iniciado" |

**Ação criada [MVP]:** *"Realizar kickoff — [Nome do Projeto]"*

**Erros a evitar:** Criar projeto sem contrato; duplicar projeto para mesmo contrato

**Próximo estado do cliente:** **Ativo**

---

### E-25 · projeto.kickoff_realizado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar início formal e solicitar materiais |
| **Disparador** | Fundador marca kickoff concluído (P-10) |
| **Validações** | Projeto em Planejamento |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Registrar data de kickoff |
| 2 | Gerar lista de materiais esperados por tipo |
| 3 | Timeline: "Kickoff realizado" |
| 4 | Agendar lembrete materiais: 3 dias |

**Ação criada [MVP]:** *"Aguardar materiais do cliente — [Projeto]"*

**Próximo estado do cliente:** **Ativo**

---

### E-26 · materiais.recebidos

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar chegada parcial ou total de materiais |
| **Disparador** | Fundador marca material recebido (P-11) |
| **Validações** | Projeto existe; item da lista identificado |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Marcar item como recebido + data |
| 2 | Timeline: "Material recebido — [item]" |
| 3 | Se todos recebidos → disparar E-27 materiais.completos |

**Erros a evitar:** Marcar completo sem todos os itens

**Próximo estado do cliente:** **Ativo**

---

### E-27 · materiais.completos

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Iniciar contagem oficial de prazo |
| **Disparador** | Todos os materiais da lista recebidos |
| **Validações** | **Gate G-03** — lista 100% completa |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Registrar `prazo_iniciado_em` |
| 2 | Status projeto → **Em andamento** |
| 3 | Timeline: "Materiais completos — prazo iniciado" |
| 4 | Cancelar lembretes de materiais pendentes |
| 5 | Calcular `prazo_limite` com base no contrato |
| 6 | Agendar alerta: prazo em 7 dias com progresso < 80% |

**Ação criada:** Cancelar *"Aguardar materiais"*; nenhuma nova (desenvolvimento flui)

**Erros a evitar:** Iniciar prazo com materiais parciais

**Próximo estado do cliente:** **Ativo**

---

### E-28 · materiais.atrasados

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Alertar bloqueio por culpa do cliente |
| **Disparador** | Sistema: material pendente há 7+ dias após kickoff |
| **Validações** | Projeto em Planejamento; materiais incompletos |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Timeline: "Projeto aguardando materiais há 7+ dias" |

**Ação criada [MVP]:** *"Cobrar materiais — [Projeto]"* — prioridade média

**Próximo estado do cliente:** **Ativo**

---

### E-29 · projeto.desenvolvimento_concluido

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar que checklist de desenvolvimento está 100% |
| **Disparador** | Todos os itens do checklist marcados concluídos (P-12) |
| **Validações** | Projeto em andamento; checklist sem itens pendentes |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Progresso → 100% |
| 2 | Status projeto → **Em revisão** |
| 3 | Timeline: "Desenvolvimento concluído" |

**Ação criada [MVP]:** *"Realizar revisão interna — [Projeto]"*

**Próximo estado do cliente:** **Ativo**

---

### E-30 · projeto.revisao_interna_concluida

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Liberar trabalho para apresentação ao cliente |
| **Disparador** | Fundador aprova checklist de revisão interna (P-13) |
| **Validações** | Projeto em revisão; checklist de QA aprovado |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Timeline: "Revisão interna aprovada" |

**Ação criada [MVP]:** *"Apresentar ao cliente — [Projeto]"*

**Erros a evitar:** Apresentar sem este evento

**Próximo estado do cliente:** **Ativo**

---

### E-31 · projeto.apresentado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar envio da versão ao cliente |
| **Disparador** | Fundador envia link de preview (P-14) |
| **Validações** | Revisão interna concluída |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status projeto → **Aguardando cliente** |
| 2 | Registrar URL de preview e rodada atual |
| 3 | Timeline: "Versão apresentada ao cliente — rodada [n]" |
| 4 | Agendar alerta: sem feedback em 5 dias |

**Ação criada [FUTURO]:** Alerta temporal cria *"Aguardando feedback — [Projeto]"*

**Próximo estado do cliente:** **Ativo**

---

### E-32 · projeto.ajustes_solicitados

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar feedback do cliente para correção |
| **Disparador** | Fundador registra lista de ajustes (P-15) |
| **Validações** | Projeto aguardando cliente; rodada ≤ 2 |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Armazenar lista de ajustes |
| 2 | Classificar: escopo / fora de escopo / bug |
| 3 | Timeline: "Ajustes solicitados — [n] itens — rodada [r]" |
| 4 | Itens fora do escopo → flag para aditivo, não implementar |

**Ação criada [MVP]:** *"Implementar ajustes — [Projeto]"*

**Erros a evitar:** Aceitar rodada 3+ sem exceção documentada

**Próximo estado do cliente:** **Ativo**

---

### E-33 · projeto.ajustes_concluidos

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar que feedback foi endereçado |
| **Disparador** | Fundador marca ajustes implementados |
| **Validações** | Ajustes solicitados existentes |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Timeline: "Ajustes concluídos — rodada [r]" |

**Ação criada [MVP]:** *"Reapresentar ou solicitar aprovação — [Projeto]"*

**Próximo estado do cliente:** **Ativo**

---

### E-34 · projeto.aprovado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Confirmar aceite final do cliente |
| **Disparador** | Fundador registra aprovação escrita (P-16) |
| **Validações** | **Gate G-04** — comprovante de aprovação anexado |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status projeto → **Aprovado** |
| 2 | Registrar `aprovado_em` |
| 3 | Timeline: "Projeto aprovado pelo cliente" |
| 4 | Cancelar alertas de feedback |

**Ação criada [MVP]:** Se pagamento pendente → *"Cobrar pagamento final — [Nome]"*; se quitado → *"Executar entrega — [Projeto]"*

**Erros a evitar:** Entregar sem este evento

**Próximo estado do cliente:** **Ativo**

---

### E-35 · projeto.entregue

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Publicar projeto e formalizar entrega |
| **Disparador** | Fundador confirma entrega (P-18) |
| **Validações** | **Gate G-04** + **Gate G-05** (se aplicável); aprovação registrada |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status projeto → **Entregue** |
| 2 | Registrar URL de produção, data, pacote de entrega |
| 3 | Timeline: "Projeto entregue — [URL]" |
| 4 | Disparar E-36 projeto.garantia_iniciada |
| 5 | Disparar E-39 hospedagem.registrada |
| 6 | **Gate G-06** — registrar vencimento hospedagem |

**Módulos afetados:** Projetos · Clientes · Hospedagem · Timeline

**Erros a evitar:** Entregar sem pagamento; esquecer registro de hospedagem

**Próximo estado do cliente:** **Ativo**

---

### E-36 · projeto.garantia_iniciada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Iniciar período de 30 dias para correção de bugs |
| **Disparador** | Automaticamente com E-35 projeto.entregue |
| **Validações** | Projeto entregue |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status projeto → **Em garantia** |
| 2 | Registrar `garantia_inicio` e `garantia_fim` (+30 dias) |
| 3 | Timeline: "Garantia iniciada — 30 dias" |
| 4 | Agendar alerta: garantia encerra em 7 dias |

**Próximo estado do cliente:** **Ativo**

---

### E-37 · garantia.chamado_aberto

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar solicitação do cliente durante garantia |
| **Disparador** | Fundador registra chamado |
| **Validações** | Projeto em garantia; dentro dos 30 dias |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Criar registro de chamado |
| 2 | Classificar: bug / feature nova |
| 3 | Timeline: "Chamado de garantia — [tipo]" |

**Ação criada [MVP]:** Se bug → *"Corrigir bug — [Projeto]"*; se feature → *"Orçar feature fora da garantia — [Projeto]"*

**Erros a evitar:** Implementar feature nova como bug

**Próximo estado do cliente:** **Ativo**

---

### E-38 · garantia.chamado_resolvido

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Encerrar chamado de garantia |
| **Disparador** | Fundador marca chamado resolvido |
| **Validações** | Chamado aberto existe |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status chamado → Resolvido |
| 2 | Timeline: "Chamado de garantia resolvido" |

**Próximo estado do cliente:** **Ativo**

---

### E-39 · hospedagem.registrada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Controlar ciclo de hospedagem e domínio incluso |
| **Disparador** | Automaticamente com E-35 projeto.entregue |
| **Validações** | **Gate G-06** — domínio e provedor informados |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Criar registro de hospedagem vinculado a projeto + cliente |
| 2 | Status → **Ativa** |
| 3 | `inicio` = data entrega; `vencimento` = entrega + 1 ano |
| 4 | Timeline: "Hospedagem registrada até [data]" |
| 5 | Agendar E-40 hospedagem.alerta_renovacao para `vencimento - 30 dias` |

**Erros a evitar:** Não agendar alerta; duplicar registro em reentrega

**Próximo estado do cliente:** **Ativo**

---

### E-40 · hospedagem.alerta_renovacao

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Avisar fundador e cliente sobre vencimento |
| **Disparador** | Sistema: 30 dias antes do vencimento |
| **Validações** | Hospedagem ativa; não renovada ainda |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status hospedagem → **Alerta renovação** |
| 2 | Timeline: "Alerta: hospedagem vence em 30 dias" |
| 3 | Agendar segundo alerta em 7 dias antes |

**Ação criada [MVP]:** *"Renovação de hospedagem — [Cliente] — vence [data]"* — prioridade alta

**Notificação [FUTURO]:** Email ao cliente com opções renovar/transferir

**Próximo estado do cliente:** **Ativo** ou **Inativo**

---

### E-41 · hospedagem.renovada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Estender hospedagem por mais 1 ano |
| **Disparador** | E-22 pagamento.recebido (tipo=renovacao) confirmado |
| **Validações** | Hospedagem em alerta ou ativa; pagamento confirmado |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | `vencimento` += 1 ano |
| 2 | Status → **Ativa** |
| 3 | Timeline: "Hospedagem renovada até [nova data]" |
| 4 | Reagendar E-40 para novo vencimento - 30 dias |
| 5 | Cancelar ações de renovação pendentes |

**Próximo estado do cliente:** **Ativo** ou **Inativo**

---

### E-42 · hospedagem.transferencia_solicitada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Iniciar processo de transferência |
| **Disparador** | Fundador registra pedido do cliente (P-22) |
| **Validações** | Hospedagem ativa ou em alerta |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status → **Em transferência** |
| 2 | Timeline: "Transferência de hospedagem solicitada" |

**Ação criada [MVP]:** *"Executar transferência — [Cliente]"* — prazo 7 dias úteis

**Próximo estado do cliente:** Inalterado

---

### E-43 · hospedagem.transferida

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Encerrar responsabilidade da Norax sobre hospedagem |
| **Disparador** | Fundador confirma transferência concluída |
| **Validações** | Status em transferência |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status → **Transferida** |
| 2 | Timeline: "Hospedagem transferida" |
| 3 | Cancelar todos os alertas de renovação |

**Próximo estado do cliente:** **Inativo** (se sem projetos)

---

### E-44 · hospedagem.desligada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Remover site após política de não resposta |
| **Disparador** | Fundador confirma desligamento (D+14 sem resposta) |
| **Validações** | Hospedagem vencida; avisos enviados conforme política |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status → **Desligada** |
| 2 | Timeline: "Hospedagem desligada — site removido" |

**Erros a evitar:** Desligar sem avisos prévios documentados; reter domínio do cliente

**Próximo estado do cliente:** **Inativo**

---

### E-45 · projeto.garantia_encerrada

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Encerrar período de garantia |
| **Disparador** | Sistema: data > `garantia_fim` OU fundador encerra manualmente |
| **Validações** | Projeto em garantia |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Timeline: "Garantia encerrada" |

**Ação criada [MVP]:** *"Encerrar projeto — [Projeto]"*

**Próximo estado do cliente:** **Ativo**

---

### E-46 · projeto.encerrado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Fechar ciclo do projeto |
| **Disparador** | Fundador confirma encerramento (P-20) |
| **Validações** | Entregue; garantia encerrada; financeiro quitado |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status projeto → **Concluído** |
| 2 | Registrar `encerrado_em` |
| 3 | Timeline (projeto e cliente): "Projeto encerrado" |
| 4 | Verificar outros projetos ativos do cliente |
| 5 | Se nenhum → disparar mudança cliente para **Inativo** |

**Ação criada:** Nenhuma

**Próximo estado do cliente:** **Inativo** (se sem projetos ativos)

---

### E-47 · projeto.arquivado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Remover projeto da operação ativa preservando histórico |
| **Disparador** | Fundador arquiva manualmente |
| **Validações** | Projeto em Concluído |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status projeto → **Arquivado** |
| 2 | Timeline: "Projeto arquivado" |

**Próximo estado do cliente:** Inalterado

---

### E-48 · cliente.reativado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Retomar relacionamento com cliente existente |
| **Disparador** | Fundador reativa cliente **Inativo** ou **Perdido** |
| **Validações** | Cliente não arquivado |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status → **Lead** (se novo ciclo comercial) ou **Ativo** (se projeto em andamento) |
| 2 | Timeline: "Cliente reativado" |

**Ação criada [MVP]:** *"Qualificar e definir próximo passo — [Nome]"*

**Próximo estado do cliente:** **Lead** ou **Ativo**

---

### E-49 · cliente.arquivado

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Remover cliente da operação preservando histórico |
| **Disparador** | Fundador arquiva manualmente |
| **Validações** | Sem projetos ativos; sem contratos pendentes; sem pagamentos em aberto |

**Ações automáticas [MVP]**

| # | Ação |
|---|------|
| 1 | Status → **Arquivado** |
| 2 | Timeline: "Cliente arquivado" |
| 3 | Cancelar todas as ações pendentes |

**Erros a evitar:** Arquivar com hospedagem ativa sem transferência ou desligamento

**Próximo estado do cliente:** **Arquivado**

---

## 5. Matriz mestre

```
Evento  →  Disparador  →  Automações  →  Resultado Final
```

### Aquisição e qualificação

| Evento | Disparador | Automações principais | Resultado final |
|--------|------------|----------------------|-----------------|
| **cliente.criado** | Fundador salva cadastro | Workspace · Timeline · Arquivos · Status Lead | Cliente operacional no sistema |
| **cliente.atualizado** | Fundador edita ficha | Timeline de alteração | Dados atualizados |
| **cliente.qualificado** | Fundador qualifica | Timeline · Ação: agendar reunião | Lead qualificado |
| **cliente.descartado** | Fundador descarta | Status Perdido · Cancelar ações | Lead encerrado |
| **lead.sem_atividade** | Sistema (7 dias) | Timeline · Ação: follow-up | Lead alertado |

### Descoberta

| Evento | Disparador | Automações principais | Resultado final |
|--------|------------|----------------------|-----------------|
| **reuniao.agendada** | Fundador agenda | Registro reunião · Timeline | Compromisso registrado |
| **reuniao.realizada** | Fundador confirma | Timeline · Ação: registrar escopo | Pronto para proposta |
| **reuniao.cancelada** | Fundador cancela | Timeline · Ação: reagendar ou descartar | Reunião encerrada |
| **escopo.registrado** | Fundador salva escopo | Escopo armazenado · Ação: preparar proposta | Base comercial pronta |
| **briefing.enviado** [F] | Fundador envia | Briefing criado · Timeline | Aguardando cliente |
| **briefing.concluido** [F] | Cliente responde | Timeline · Ação: revisar briefing | Briefing disponível |

### Comercial

| Evento | Disparador | Automações principais | Resultado final |
|--------|------------|----------------------|-----------------|
| **proposta.criada** | Fundador cria | Proposta rascunho v1 · Timeline | Proposta em elaboração |
| **proposta.enviada** | Fundador envia | Status Enviada · Alertas 3d/7d | Aguardando resposta |
| **proposta.visualizada** [F] | Cliente abre portal | Timeline · Notificação | Cliente engajado |
| **proposta.aprovada** | Fundador registra aceite | Status Aprovada · Cliente Ativo · Ação: contrato | Pronto para contrato |
| **proposta.em_negociacao** | Fundador registra | Contador rodadas · Ação: revisar proposta | Em negociação |
| **proposta.recusada** | Fundador registra | Status Recusada · Cliente Perdido | Oportunidade encerrada |
| **proposta.expirada** | Sistema (validade) | Status Expirada · Ação: follow-up | Proposta inválida |

### Fechamento

| Evento | Disparador | Automações principais | Resultado final |
|--------|------------|----------------------|-----------------|
| **contrato.criado** | Fundador cria | Contrato rascunho · Timeline | Contrato em elaboração |
| **contrato.enviado** | Fundador envia assinatura | Status Enviado · Alerta 7d | Aguardando assinatura |
| **contrato.assinado** | Assinatura confirmada | Status Assinado · Ação: cobrar inicial | Gate G-01 liberado |
| **pagamento.recebido** | Fundador confirma | Timeline · Ações por tipo · Gates | Fase seguinte destravada |
| **pagamento.atrasado** | Sistema (5 dias) | Timeline · Ação: cobrar | Cobrança alertada |

### Execução

| Evento | Disparador | Automações principais | Resultado final |
|--------|------------|----------------------|-----------------|
| **projeto.criado** | Pós-pagamento inicial | Projeto · Checklist · Timeline · Ação: kickoff | Projeto em planejamento |
| **projeto.kickoff_realizado** | Fundador confirma | Lista materiais · Alerta 3d | Aguardando materiais |
| **materiais.recebidos** | Fundador registra | Item marcado · Timeline | Parcial ou completo |
| **materiais.completos** | Lista 100% | Prazo iniciado · Status Em andamento | Gate G-03 liberado |
| **materiais.atrasados** | Sistema (7 dias) | Timeline · Ação: cobrar materiais | Bloqueio alertado |
| **projeto.desenvolvimento_concluido** | Checklist 100% | Status Em revisão · Ação: revisão interna | Pronto para QA |
| **projeto.revisao_interna_concluida** | Fundador aprova QA | Timeline · Ação: apresentar | Pronto para cliente |
| **projeto.apresentado** | Fundador envia preview | Status Aguardando cliente · Alerta 5d | Feedback esperado |
| **projeto.ajustes_solicitados** | Fundador registra feedback | Lista ajustes · Ação: implementar | Em correção |
| **projeto.ajustes_concluidos** | Fundador confirma | Timeline · Ação: reapresentar | Pronto para nova rodada |
| **projeto.aprovado** | Aprovação escrita | Status Aprovado · Ação: pagar ou entregar | Gate G-04 liberado |

### Entrega e pós-venda

| Evento | Disparador | Automações principais | Resultado final |
|--------|------------|----------------------|-----------------|
| **projeto.entregue** | Fundador confirma | Status Entregue · Garantia · Hospedagem | Ciclo entrega completo |
| **projeto.garantia_iniciada** | Auto (entrega) | 30 dias · Alerta encerramento | Em garantia |
| **garantia.chamado_aberto** | Fundador registra | Classificação bug/feature · Ação | Chamado rastreado |
| **garantia.chamado_resolvido** | Fundador resolve | Timeline | Chamado fechado |
| **projeto.garantia_encerrada** | Sistema ou fundador | Timeline · Ação: encerrar projeto | Garantia fim |
| **projeto.encerrado** | Fundador confirma | Status Concluído · Cliente Inativo? | Projeto fechado |
| **projeto.arquivado** | Fundador arquiva | Status Arquivado | Fora da operação ativa |

### Hospedagem

| Evento | Disparador | Automações principais | Resultado final |
|--------|------------|----------------------|-----------------|
| **hospedagem.registrada** | Auto (entrega) | Vencimento +1a · Alerta 30d agendado | Hospedagem controlada |
| **hospedagem.alerta_renovacao** | Sistema (30d antes) | Ação alta prioridade · Alerta 7d | Renovação pendente |
| **hospedagem.renovada** | Pagamento renovação | Vencimento +1a · Reagendar alertas | Ciclo renovado |
| **hospedagem.transferencia_solicitada** | Fundador registra | Status Em transferência · Ação 7d | Transferência em curso |
| **hospedagem.transferida** | Fundador confirma | Status Transferida · Cancelar alertas | Norax liberada |
| **hospedagem.desligada** | Fundador (D+14) | Status Desligada | Site removido |

### Ciclo de vida do cliente

| Evento | Disparador | Automações principais | Resultado final |
|--------|------------|----------------------|-----------------|
| **cliente.reativado** | Fundador reativa | Status Lead/Ativo · Ação: próximo passo | Relacionamento retomado |
| **cliente.arquivado** | Fundador arquiva | Status Arquivado · Cancelar ações | Cliente preservado, inativo |

*[F] = Futuro*

---

### Cadeias de eventos automáticos (cascata)

O CORE permite que um evento dispare outros. Cadeias obrigatórias:

```
contrato.assinado
    └── (ação) aguardar pagamento.recebido (inicial)

pagamento.recebido (inicial)
    └── projeto.criado (automático [FUTURO] ou ação manual [MVP])

materiais.completos
    └── projeto status → Em andamento
    └── prazo calculado

projeto.entregue
    ├── projeto.garantia_iniciada (automático)
    └── hospedagem.registrada (automático)

hospedagem.registrada
    └── hospedagem.alerta_renovacao (agendado +335 dias)

projeto.encerrado
    └── cliente → Inativo (se sem projetos ativos)

proposta.recusada
    └── cliente.descartado (se sem projetos)
```

**Regra:** eventos em cascata são transacionais — ou todos executam, ou nenhum (consistência).

---

### Mapa de Gates no CORE

| Gate | Evento que exige | Evento bloqueado sem gate |
|------|------------------|---------------------------|
| G-01 | contrato.assinado | projeto.criado · materiais.* · desenvolvimento |
| G-02 | pagamento.recebido (inicial) | projeto.criado · kickoff |
| G-03 | materiais.completos | projeto status Em andamento |
| G-04 | projeto.aprovado | projeto.entregue |
| G-05 | pagamento.recebido (final) | projeto.entregue (se 50/50) |
| G-06 | hospedagem.registrada | (consequência de entrega, não gate de entrada) |

---

## 6. Análise crítica

### Existem automações desnecessárias?

| Automação | Veredito | Motivo |
|-----------|----------|--------|
| proposta.visualizada | **[FUTURO]** — ok adiar | Sem portal, evento não existe |
| briefing.* | **[FUTURO]** — ok adiar | Sem módulo briefing no MVP |
| Notificação email ao cliente | **[FUTURO]** — ok adiar | Fundador comunica manualmente hoje |
| projeto.criado automático pós-pagamento | **Útil quando crescer** | MVP: ação manual basta para 1 usuário |
| Contador de rodadas de negociação | **Necessário** | Evita negociação infinita |
| lead.sem_atividade | **Necessário** | Resolve esquecimento — problema real hoje |
| hospedagem.alerta_renovacao | **Crítico** | Requisito explícito do negócio |
| garantia.chamado_* | **Simplificar no MVP** | Fundador pode usar observações até volume justificar |

**Conclusão:** 38 eventos definidos; **~28 são MVP**, **~10 são futuro**. Não remover eventos — marcar prioridade evita implementação prematura.

---

### Existem riscos de duplicação de informação?

| Risco | Onde | Mitigação (Lei 6) |
|-------|------|-------------------|
| Valor em proposta + contrato + financeiro | Comercial | Contrato referencia proposta; financeiro referencia contrato |
| Escopo em observações + escopo registrado + proposta | Descoberta | Escopo registrado é fonte; proposta copia na criação, não sincroniza depois |
| Timeline + observações | Clientes | Timeline = eventos; observações = contexto livre — funções diferentes |
| Materiais em lista + arquivos | Projetos | Lista = checklist de status; arquivos = storage — vincular por referência |
| Status manual + status derivado | Todos | Lei 2: status muda só por evento |

**Maior risco:** fundador editar status manualmente contornando CORE. **Solução:** interface não oferece mudança de status direta — apenas ações que disparam eventos.

---

### Existem eventos que deveriam ser unidos?

| Eventos atuais | Unir? | Recomendação |
|----------------|-------|--------------|
| contrato.criado + contrato.enviado | Talvez no MVP | Manter separados — envio é momento comercial relevante |
| materiais.recebidos + materiais.completos | Não | Parcial vs completo são estados distintos |
| projeto.garantia_iniciada + projeto.entregue | Não | Garantia é ciclo próprio com eventos próprios |
| cliente.descartado + proposta.recusada | Parcialmente | proposta.recusada **dispara** cliente.descartado — não unir, encadear |
| garantia.chamado_aberto + garantia.chamado_resolvido | Não no futuro; **sim no MVP** | MVP: usar observação + timeline manual |

**Unificação recomendada para MVP:**

```
garantia.chamado_aberto + garantia.chamado_resolvido
    → substituir por: observação no projeto durante garantia
    → reintroduzir eventos quando houver volume de chamados
```

---

### Existem eventos que estão faltando?

| Evento faltante | Necessário? | Prioridade |
|-----------------|-------------|------------|
| **escopo.alterado** | Sim — quando cliente muda requisitos mid-project | v1.1 |
| **aditivo.criado / aditivo.assinado** | Sim — scope creep formalizado | v2.0 |
| **projeto.pausado / projeto.retomado** | Sim — cliente some, fundador pausa | v1.1 |
| **pagamento.estornado** | Sim — chargeback ou cancelamento | v2.0 |
| **cliente.duplicata_detectada** | Sim — na validação de E-01 | MVP |
| **acao.concluida** | Sim — fechar loop da inbox | MVP |
| **acao.expirada** | Opcional — ação ignorada há muito tempo | v1.2 |
| **comunicacao.registrada** | Sim — registrar decisão tomada por WhatsApp | v1.1 |

**MVP crítico faltando:** `acao.concluida` — sem ele a inbox não fecha loop.

---

### Como manter o CORE simples quando a Norax crescer?

| Princípio | Aplicação |
|-----------|-----------|
| **Eventos não mudam, handlers evoluem** | `contrato.assinado` sempre existe; handler ganha "notificar equipe" quando houver equipe |
| **Ator como parâmetro** | `ator: fundador \| sistema \| cliente` — mesma regra, destinos diferentes |
| **MVP handlers minimalistas** | Implementar só Timeline + Ação; email e webhook entram depois |
| **Sem lógica nos módulos** | Módulos emitem e consomem eventos; CORE centraliza consequências |
| **Feature flags por handler** | `[FUTURO]` handlers desligados até módulo existir |
| **Não multiplicar eventos por role** | Um evento, N consequências condicionais por role — não um evento por pessoa |
| **Agendamentos como eventos** | `lead.sem_atividade` é evento sistema, não cron solto |

**Regra de ouro:** se a Norax contratar um comercial, `proposta.aprovada` não muda — apenas ganha consequência *"notificar PM"*.

---

### Como garantir que futuras funcionalidades respeitem o CORE?

| Mecanismo | Descrição |
|-----------|-----------|
| **Checklist de PR** | Toda feature nova: qual evento dispara? Quais consequências? Violam alguma Lei? |
| **Registro de eventos** | Novo evento = entrada neste documento antes de implementar |
| **Proibição de status manual** | UI não expõe dropdown de status — só botões de ação |
| **Teste de consequência** | Cada evento tem cenário: "quando X, então Y na timeline e Z na inbox" |
| **Versionamento do CORE** | CORE v1.1, v1.2 — mudanças documentadas, nunca silenciosas |
| **CORE > módulo** | Se módulo conflita com CORE, módulo está errado |
| **Gate review** | Features que cruzam fases comerciais passam por validação de gates |

### Perguntas obrigatórias antes de qualquer feature nova

1. Qual evento isso dispara?
2. Esse evento já existe no CORE? Se não, foi adicionado aqui primeiro?
3. Quais gates são afetados?
4. Gera Timeline? Gera Ação? Os dois?
5. Resolve problema real hoje? (Lei 8)
6. Funciona com 1 usuário e com 10? (Lei 10)

---

## Apêndice A — Inventário completo de eventos

| ID | Evento | MVP |
|----|--------|-----|
| E-01 | cliente.criado | ✓ |
| E-02 | cliente.atualizado | ✓ |
| E-03 | cliente.qualificado | ✓ |
| E-04 | cliente.descartado | ✓ |
| E-05 | lead.sem_atividade | ✓ |
| E-06 | reuniao.agendada | ✓ |
| E-07 | reuniao.realizada | ✓ |
| E-08 | reuniao.cancelada | ✓ |
| E-09 | escopo.registrado | ✓ |
| E-10 | briefing.enviado | Futuro |
| E-11 | briefing.concluido | Futuro |
| E-12 | proposta.criada | ✓ |
| E-13 | proposta.enviada | ✓ |
| E-14 | proposta.visualizada | Futuro |
| E-15 | proposta.aprovada | ✓ |
| E-16 | proposta.em_negociacao | ✓ |
| E-17 | proposta.recusada | ✓ |
| E-18 | proposta.expirada | ✓ |
| E-19 | contrato.criado | ✓ |
| E-20 | contrato.enviado | ✓ |
| E-21 | contrato.assinado | ✓ |
| E-22 | pagamento.recebido | ✓ |
| E-23 | pagamento.atrasado | ✓ |
| E-24 | projeto.criado | ✓ |
| E-25 | projeto.kickoff_realizado | ✓ |
| E-26 | materiais.recebidos | ✓ |
| E-27 | materiais.completos | ✓ |
| E-28 | materiais.atrasados | ✓ |
| E-29 | projeto.desenvolvimento_concluido | ✓ |
| E-30 | projeto.revisao_interna_concluida | ✓ |
| E-31 | projeto.apresentado | ✓ |
| E-32 | projeto.ajustes_solicitados | ✓ |
| E-33 | projeto.ajustes_concluidos | ✓ |
| E-34 | projeto.aprovado | ✓ |
| E-35 | projeto.entregue | ✓ |
| E-36 | projeto.garantia_iniciada | ✓ |
| E-37 | garantia.chamado_aberto | Simplificado MVP |
| E-38 | garantia.chamado_resolvido | Simplificado MVP |
| E-39 | hospedagem.registrada | ✓ |
| E-40 | hospedagem.alerta_renovacao | ✓ |
| E-41 | hospedagem.renovada | ✓ |
| E-42 | hospedagem.transferencia_solicitada | ✓ |
| E-43 | hospedagem.transferida | ✓ |
| E-44 | hospedagem.desligada | ✓ |
| E-45 | projeto.garantia_encerrada | ✓ |
| E-46 | projeto.encerrado | ✓ |
| E-47 | projeto.arquivado | ✓ |
| E-48 | cliente.reativado | ✓ |
| E-49 | cliente.arquivado | ✓ |

**Total: 49 eventos** (43 MVP pleno · 4 simplificados · 2 futuros)

---

## Apêndice B — Evento proposto para adicionar (MVP)

### E-50 · acao.concluida

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Fechar loop da inbox |
| **Disparador** | Fundador marca ação como concluída |
| **Validações** | Ação existe e está pendente |

**Ações automáticas**

| # | Ação |
|---|------|
| 1 | Status ação → Concluída |
| 2 | Registrar `concluida_em` |
| 3 | Timeline (se vinculada a cliente): "Ação concluída — [título]" |

**Erros a evitar:** Concluir ação sem executar o que ela pedia

---

*Documento constitucional Norax · CORE v1.0*  
*Referências: NORAX-FLUXO-OPERACIONAL.md · Filosofia Norax*  
*Toda funcionalidade futura obedece às Leis do CORE.*



