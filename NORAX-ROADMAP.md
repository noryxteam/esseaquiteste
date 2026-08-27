# NORAX ROADMAP

**Documento:** Roadmap Oficial da Empresa  
**Versão:** 1.0  
**Data:** Julho de 2026  
**Tipo:** Evolução estratégica — não é roadmap de sprints ou código

---

> Este documento responde *onde a Norax está*, *para onde vai* e *em que ordem*. Toda decisão de produto, operação e crescimento deve ser legível aqui.

---

## Onde estamos hoje

| Dimensão | Situação atual |
|----------|----------------|
| **Empresa** | Agência de desenvolvimento web, fundador solo |
| **Serviços** | Sites institucionais · Landing pages · Sistemas web |
| **Sistema** | Não existe em produção — documentação oficial em construção |
| **Operação** | Manual (WhatsApp, memória, ferramentas dispersas) |
| **Documentação** | Fluxo, CORE, Comercial e Projetos especificados |

**Fase atual da empresa:** transição do fim da **Fase 1 — Fundação** para início da **Fase 2 — Operação** (especificação dos módulos restantes e consolidação).

---

## Visão de longo prazo (horizonte)

```
Hoje                    12–18 meses              3–5 anos
Agência solo     →     Agency OS interno    →    Plataforma escalável
                       (MVP em uso)              (equipe + opcional SaaS)
                                                    │
                                                    ▼
                                              Referência internacional
                                              em organização de agências digitais
```

A Norax não começa como SaaS. Começa como **sistema interno** que organiza a própria empresa — e só depois, se fizer sentido, vira produto.

---

## Índice de fases

| Fase | Nome | Essência |
|------|------|----------|
| 0 | Visão | Por que a Norax existe e para onde vai |
| 1 | Fundação | Processos, CORE e regras imutáveis |
| 2 | Operação | Módulos que fazem a empresa funcionar |
| 3 | Experiência | Como fundador e cliente sentem o produto |
| 4 | Engenharia | Arquitetura técnica para construir com segurança |
| 5 | MVP | Primeiro sistema utilizável no dia a dia |
| 6 | Escala | Crescimento, equipe e ambição internacional |

---

# FASE 0 — VISÃO

## Objetivo

Definir **identidade, filosofia e direção** da Norax antes de qualquer construção. Estabelecer o que a empresa é, o que não é, e o produto que o sistema deve se tornar ao longo dos anos.

## Importância

Sem visão clara, o sistema vira CRM genérico ou coleção de features. A Fase 0 impede desvio estratégico: cada módulo futuro é julgado contra a filosofia.

## Documentos relacionados

| Documento | Contribuição |
|-----------|--------------|
| Filosofia da Norax | Princípios inegociáveis |
| NORAX-RELATORIO-COMPLETO.md | Visão de produto, arquitetura macro, crítica estratégica |

## Módulos relacionados

Nenhum módulo de software. Apenas conceitos: Agency OS, Cliente como âncora, Comercial → Projetos.

## Dependências

Nenhuma — é o ponto de partida.

## Critérios para considerar concluída

- [x] Filosofia documentada e aceita
- [x] Posicionamento definido (não é CRM, é OS da agência)
- [x] Identidade visual definida (dark, minimalista, cor com significado)
- [x] Serviços atuais delimitados (site, landing, sistema)
- [x] North Star definido (tempo até próxima ação clara)
- [x] Horizonte internacional declarado sem prematuridade

## Riscos

| Risco | Mitigação |
|-------|-----------|
| Visão grande demais | MVP explícito na Fase 5 |
| Copiar Notion/Linear sem adaptar | Filosofia anti-CRM |
| Planejar SaaS antes de dogfood | Fase 6 condicionada ao sucesso interno |

## O que NÃO deve entrar nesta fase

- Especificação de telas ou código
- Definição de stack tecnológica detalhada
- Funcionalidades por módulo
- Metas financeiras ou de equipe
- Promessas ao mercado externo

## Status: **CONCLUÍDA**

---

# FASE 1 — FUNDAÇÃO

## Objetivo

Construir a **base imutável** da Norax: como a empresa opera do primeiro contato ao pós-venda, o que o sistema faz automaticamente (CORE) e as regras que nenhum módulo pode violar.

## Importância

A fundação é a constituição. Módulos mudam; processos e CORE evoluem por versão — mas as Leis do CORE e o Fluxo Operacional são a referência. Sem isso, cada módulo inventaria regras próprias.

## Documentos relacionados

| Documento | Contribuição |
|-----------|--------------|
| NORAX-FLUXO-OPERACIONAL.md | 22 processos (P-01 a P-22) |
| NORAX-CORE.md | 49+ eventos, gates G-01 a G-06, 10 Leis |
| Filosofia | Princípios operacionais |

## Módulos relacionados

Nenhum módulo implementado. Conceitos fundacionais:

- Cliente (âncora)
- Timeline
- Ações (inbox)
- Workspace
- Gates comerciais e de projeto

## Dependências

- **Fase 0** concluída

## Critérios para considerar concluída

- [x] Fluxo Lead → Pós-venda documentado (P-01 a P-22)
- [x] Gates obrigatórios definidos (G-01 a G-06)
- [x] CORE v1.0 com eventos de Cliente, Comercial, Projeto, Hospedagem
- [x] Matriz evento → disparador → automação → resultado
- [x] Análise crítica do CORE (simplicidade, anti-duplicação)
- [ ] CORE v1.1 com eventos de Negociação e Bloqueio de projeto (pendente consolidação)
- [ ] Índice mestre ligando todos os documentos (pendente)

## Riscos

| Risco | Mitigação |
|-------|-----------|
| CORE e Fluxo divergirem | Todo módulo referencia ambos |
| Gates ignorados na implementação | Checklist de conformidade por módulo |
| Eventos novos sem atualizar CORE | Regra: documento antes de feature |

## O que NÃO deve entrar nesta fase

- Especificação completa de cada módulo (Fase 2)
- Decisões de UX por tela
- Roadmap de desenvolvimento em sprints
- Integrações com terceiros (Clicksign, Stripe) em detalhe operacional

## Status: **~95% CONCLUÍDA**

Pendência: consolidar eventos E-51 a E-57 (Comercial + Projetos) no CORE v1.1.

---

# FASE 2 — OPERAÇÃO

## Objetivo

Especificar **cada módulo** que faz a Norax funcionar no dia a dia — como recebe informação, como processa, como entrega ao próximo módulo — sem sobreposição nem processos paralelos.

## Importância

A operação é o corpo da empresa. Comercial transforma lead em projeto vendido; Projetos transforma vendido em entregue. Módulos mal definidos geram retrabalho, dados duplicados e fundador perdido.

## Documentos relacionados

| Documento | Status |
|-----------|--------|
| NORAX-MODULO-COMERCIAL.md | Concluído |
| NORAX-MODULO-PROJETOS.md | Concluído |
| Módulo Clientes | Especificado em sessão — **documento oficial pendente** |
| Módulo Financeiro | Não especificado |
| Módulo Ações (Inbox) | Definido no CORE — **documento oficial pendente** |
| Módulo Dashboard ("Hoje") | Parcial no Relatório — **documento oficial pendente** |
| Hospedagem / Pós-venda | No Fluxo + CORE — **documento oficial pendente** |

## Módulos relacionados

| Módulo | Papel | Prioridade MVP |
|--------|-------|----------------|
| **Clientes** | Âncora; status Lead/Ativo/Inativo/Perdido | Crítica |
| **Comercial** | Lead → Projeto vendido | Alta |
| **Projetos** | Vendido → Entregue | Crítica |
| **Ações** | "O que fazer agora" | Crítica |
| **Dashboard (Hoje)** | Visão em 30 segundos | Alta |
| **Financeiro** | Pagamentos e quitação | Média (MVP simplificado) |
| **Arquivos** | Workspace por cliente/projeto | Alta |
| **Timeline** | Histórico imutável | Crítica (transversal) |
| **Reuniões** | Agendamento + escopo | Baixa MVP (manual) |
| **Portal do Cliente** | Experiência externa | Fora MVP |
| **Equipe** | Permissões e atribuição | Fora MVP (solo) |
| **Relatórios** | Analytics | Fora MVP |

## Dependências

- **Fase 1** concluída (Fluxo + CORE)
- Comercial e Projetos dependem de **Clientes** como âncora
- Projetos depende de **handoff Comercial** definido
- Financeiro depende de **Contrato** (Comercial)

## Ordem correta de especificação (restante)

```
1. Módulo Clientes        (documento oficial)
2. Módulo Ações           (documento oficial)
3. Módulo Dashboard       (documento oficial)
4. Módulo Financeiro      (MVP: pagamento manual)
5. Módulo Arquivos        (estrutura já nos módulos)
6. Hospedagem / Pós-venda (consolidar Fluxo P-21, P-22)
── após MVP em uso ──
7. Reuniões
8. Portal do Cliente
9. Equipe
10. Relatórios
```

## Critérios para considerar concluída

- [x] Módulo Comercial especificado
- [x] Módulo Projetos especificado
- [ ] Módulo Clientes — documento oficial
- [ ] Módulo Ações — documento oficial
- [ ] Módulo Dashboard — documento oficial
- [ ] Módulo Financeiro — documento oficial (escopo MVP)
- [ ] Handoff Comercial → Projetos validado em todos os documentos
- [ ] Nenhum processo paralelo ao Fluxo Operacional
- [ ] Índice de módulos com fronteiras claras

## Riscos

| Risco | Mitigação |
|-------|-----------|
| Especificar módulos que não serão usados no MVP | Marcar MVP vs Futuro em cada módulo |
| Clientes sem documento oficial | Priorizar NORAX-MODULO-CLIENTES.md |
| Financeiro virar Conta Azul | Escopo mínimo: recebido/pendente + link |
| Duplicar Lead e Cliente | Regra já no Comercial |

## O que NÃO deve entrar nesta fase

- Implementação de software
- IA pós-reunião
- Multi-tenancy / SaaS
- NF-e, conciliação bancária
- Permissões granulares de equipe
- Kanban comercial complexo

## Status: **EM ANDAMENTO (~40%)**

---

# FASE 3 — EXPERIÊNCIA

## Objetivo

Definir **como se sente** usar a Norax — para o fundador e, no futuro, para o cliente. Garantir produto premium: rápido, minimalista, próximo passo sempre visível.

## Importância

Processos corretos com UX ruim não são adotados. A Norax compete com memória + WhatsApp; só vence se cada clique economizar tempo e transmitir confiança.

## Documentos relacionados

| Documento | Contribuição |
|-----------|--------------|
| Filosofia | "Premium, minimalista, rápido" |
| Relatório Estratégico | Design System, referências Linear/Stripe |
| Módulo Comercial | UX dia do fundador, navegação, cliques |
| Módulo Projetos | Workspace, bloqueio, pendências |
| Módulo Clientes (sessão) | Lista + ficha, progressive disclosure |

## Módulos relacionados

| Experiência | Onde vive |
|-------------|-----------|
| Dashboard "Hoje" | 3 prioridades + agenda + métricas |
| Ações (inbox) | Fila universal de pendências |
| Command Palette (⌘K) | Busca global [pós-MVP inicial] |
| Portal do Cliente | App separado [FUTURO] |
| Sala de reunião (meet) | Minimal [FUTURO] |
| Design System | Transversal |

## Dependências

- **Fase 2** — módulos especificados (sabe-se o que construir)
- Filosofia visual da Fase 0

## Critérios para considerar concluída

- [x] Princípios UX documentados (próximo passo, anti-sobrecarga)
- [x] Experiência do fundador descrita (Comercial + Projetos)
- [ ] Documento oficial Design System / Experiência
- [ ] Jornada do cliente no Portal (especificação)
- [ ] Princípios de animação e performance definidos
- [ ] Orçamento de cliques por tarefa crítica validado
- [ ] Teste: fundador encontra qualquer coisa em < 10s

## Riscos

| Risco | Mitigação |
|-------|-----------|
| Dashboard com 12 widgets | Máximo 3 prioridades + métricas clicáveis |
| Portal antes do interno | Portal só após dogfood interno |
| Light mode / temas | Apenas dark — decisão de produto |

## O que NÃO deve entrar nesta fase

- Mockups de alta fidelidade ou Figma
- Código de componentes
- A/B tests
- Localização i18n
- App mobile nativo

## Status: **PARCIAL (~30%)**

UX embutida nos módulos; falta documento unificado de Experiência + Design System.

---

# FASE 4 — ENGENHARIA

## Objetivo

Definir **como o sistema será construído** com segurança, velocidade e capacidade de crescer — sem implementar ainda. Arquitetura que suporta MVP solo e escala futura.

## Importância

Decisões erradas aqui custam meses. Monólito modular primeiro; três apps (Admin, Portal, Meet); event-driven interno — tudo já esboçado no Relatório, precisa ser **decisão oficial** antes do código.

## Documentos relacionados

| Documento | Contribuição |
|-----------|--------------|
| Relatório Estratégico | Stack, monorepo, bounded contexts |
| CORE | Event bus, idempotência, gates na API |
| Módulos | Contratos de handoff e integração |

## Decisões de engenharia (oficiais — do Relatório)

| Decisão | Escolha |
|---------|---------|
| Arquitetura | Monólito modular |
| Apps | Admin + Portal + Meet (separados) |
| Backend | API type-safe (tRPC/Hono) |
| Banco | PostgreSQL |
| Auth Admin | Email + 2FA |
| Auth Portal | Magic link |
| Filas | Redis para workers e alertas CORE |
| Arquivos | Object storage (R2/S3) |
| Busca | Typesense [pós-MVP] |

## Módulos relacionados

Infraestrutura transversal: CORE runtime, workers (email, alertas, webhooks), migrations.

## Dependências

- **Fase 1** (CORE — comportamento a implementar)
- **Fase 2** (módulos — boundaries)
- **Fase 3** (Design System — pacote UI)

## Critérios para considerar concluída

- [x] Direção arquitetural no Relatório
- [ ] Documento NORAX-ARQUITETURA.md oficial (consolidar Relatório seções 2, 13–16)
- [ ] ADRs para decisões críticas (monólito vs micro, 3 apps)
- [ ] Mapa de workers ↔ eventos CORE
- [ ] Estratégia de ambiente (dev, staging, prod)
- [ ] Estratégia de backup e segurança alinhada ao CORE

## Riscos

| Risco | Mitigação |
|-------|-----------|
| Microserviços cedo | Monólito até dor real |
| Compartilhar sessão Admin/Portal | Apps e JWT issuers separados |
| Implementar antes de especificar módulos | Fase 2 antes de código |

## O que NÃO deve entrar nesta fase

- Código de produção
- CI/CD configurado
- Infra provisionada
- Otimização prematura para milhões de usuários

## Status: **PARCIAL (~25%)**

Visão no Relatório; falta documento de arquitetura consolidado e ADRs.

---

# FASE 5 — MVP

## Objetivo

Colocar nas mãos do fundador um **sistema utilizável todos os dias** que substitua memória e WhatsApp como fonte de verdade — com escopo mínimo e disciplinado.

## Importância

Sem MVP em uso, documentação é teoria. Dogfood é o teste real. O MVP não é a empresa completa — é o núcleo que gera valor imediato.

## Documentos relacionados

Todos os anteriores + critérios de aceite do MVP abaixo.

## Escopo oficial do MVP

### Dentro do MVP

| Área | Escopo |
|------|--------|
| **Clientes** | CRUD, status, ficha, observações, duplicata |
| **Comercial** | Negociação, escopo, proposta (criar/enviar/aprovar), contrato (registro manual assinatura), handoff |
| **Projetos** | Handoff, checklist, materiais, progresso, revisão, aprovação, entrega, garantia simples |
| **Ações** | Inbox, prioridades, `acao.concluida` |
| **Dashboard** | Hoje: 3 prioridades + projetos ativos + alertas CORE |
| **Timeline** | Automática em todo evento |
| **Arquivos** | Upload por cliente/projeto, estrutura fixa |
| **Financeiro** | Registrar pagamento inicial/final manualmente |
| **Alertas CORE** | Lead 7d, proposta 7d/3d, materiais 7d, prazo projeto, hospedagem 30d |

### Fora do MVP (explícito)

| Fora | Alternativa temporária |
|------|------------------------|
| Portal do Cliente | Email + PDF |
| Reuniões com vídeo | Calendário manual |
| IA pós-reunião | Formulário de escopo manual |
| Assinatura digital integrada | Registro manual + PDF |
| Gateway de pagamento | PIX manual + registro |
| Busca global ⌘K | Busca por módulo |
| Equipe / permissões | Um usuário |
| Relatórios | Dashboard apenas |
| NF-e / conciliação | Planilha externa |
| Hospedagem automática | Registro manual vencimento |

## Módulos do MVP

```
Clientes + Timeline + Ações
    ↓
Comercial (negociação → contrato)
    ↓
Financeiro (mínimo)
    ↓
Projetos (handoff → entrega)
    ↓
Dashboard (Hoje)
```

## Dependências

- **Fase 2** concluída para módulos MVP
- **Fase 3** — UX mínima (Design System tokens + 5 primitives)
- **Fase 4** — Arquitetura decidida
- Fundador comprometido com **adoção** (parar de operar só no WhatsApp)

## Critérios para considerar concluída

- [ ] Fundador usa sistema em **projeto real** de ponta a ponta
- [ ] Pelo menos 1 cliente completo: lead → entrega no sistema
- [ ] Zero projeto ativo sem bloqueio ou checklist
- [ ] Alertas de hospedagem funcionando
- [ ] Nenhum gate G-01 a G-05 violado em produção
- [ ] Tempo criar cliente < 30s; encontrar negociação < 10s
- [ ] WhatsApp não é única fonte de decisões comerciais

## Riscos

| Risco | Mitigação |
|-------|-----------|
| Scope creep no MVP | Lista "fora do MVP" acima |
| Nunca lançar | MVP 90 dias (Relatório Apêndice A) |
| Adoção zero | Regra: cadastrar no mesmo dia do contato |
| Construir Comercial antes de Clientes | Ordem de implementação do Relatório |

## O que NÃO deve entrar nesta fase

Tudo listado em "Fora do MVP". Qualquer feature que falhe nas duas perguntas da filosofia:
1. Resolve problema real hoje?
2. Continua útil quando crescer?

## Estimativa de esforço (referência — não sprint)

| Contexto | Tempo até MVP utilizável |
|----------|--------------------------|
| 1 dev full-time | ~3–4 meses |
| Fundador + 1 dev | ~2–3 meses documentação + build |

## Status: **NÃO INICIADA (0%)**

Aguarda conclusão Fase 2 (docs restantes) + Fase 4 (arquitetura oficial).

---

# FASE 6 — ESCALA

## Objetivo

Evoluir de **ferramenta interna de agência solo** para **operação robusta** — equipe, volume, opcionalmente produto para outras agências e presença internacional.

## Importância

Esta fase só faz sentido após MVP validado internamente. Escalar processo antes de processo funcionar multiplica caos.

## Horizontes dentro da Fase 6

### 6A — Crescimento da agência (primeiro)

| Marco | Conteúdo |
|-------|----------|
| Equipe | 2–5 pessoas; roles no CORE; atribuição em projetos |
| Volume | 20–50 clientes ativos; busca global; filtros avançados |
| Portal v1 | Cliente vê proposta, envia arquivos, aprova entrega |
| Integrações | Clicksign, Stripe/MP, Daily.co |
| Financeiro | Cobrança automática, parcelas, previsão receita |
| Reuniões | Agendamento + link + ata estruturada |
| IA | Resumo reunião como rascunho (humano aprova) |

### 6B — Produto (opcional)

| Marco | Conteúdo |
|-------|----------|
| Multi-tenant | Outras agências como clientes |
| White-label | Portal e domínio customizado |
| API pública | Integrações Zapier/n8n |
| Billing SaaS | Assinatura por assentos |

### 6C — Internacional

| Marco | Conteúdo |
|-------|----------|
| i18n | PT, EN, ES |
| Pagamentos | Multi-moeda |
| Compliance | GDPR + LGPD maduro |
| Marca | Norax como referência em Agency OS |

## Documentos a criar (quando entrar em 6)

- NORAX-MODULO-PORTAL.md
- NORAX-MODULO-EQUIPE.md
- NORAX-MULTI-TENANT.md [se SaaS]
- NORAX-CORE v2.0 (roles, webhooks outbound)

## Dependências

- **Fase 5** — MVP em uso há **mínimo 3–6 meses**
- Métricas de sucesso do MVP atingidas
- Dor real de equipe (não antecipar solo)
- Receita estável para financiar expansão

## Critérios para considerar concluída (6A)

- [ ] 3+ pessoas usando sistema diariamente
- [ ] Nenhum processo crítico fora do sistema
- [ ] Portal em uso por clientes
- [ ] Tempo de onboarding novo membro < 1 dia

## Riscos

| Risco | Mitigação |
|-------|-----------|
| SaaS antes de dogfood | 6B só após 6A estável |
| Complexidade de permissões | Roles fixos antes de custom |
| Internacional antes de PMF local | 6C por último |

## O que NÃO deve entrar até MVP validado

- Multi-tenant
- App mobile nativo
- Marketplace de templates
- IA autônoma sem revisão humana
- 15 módulos simultâneos

## Status: **NÃO INICIADA** — condicionada à Fase 5

---

# Tabela geral do roadmap

| Fase | Nome | Status | Prioridade | Dependências | Complexidade |
|------|------|--------|------------|--------------|--------------|
| **0** | Visão | ✅ Concluída | — | Nenhuma | Baixa |
| **1** | Fundação | 🟡 ~95% | Alta | Fase 0 | Média |
| **2** | Operação | 🟡 ~40% | **Crítica** | Fase 1 | Alta |
| **3** | Experiência | 🟡 ~30% | Alta | Fase 2 | Média |
| **4** | Engenharia | 🟡 ~25% | Alta | Fase 1–2 | Alta |
| **5** | MVP | ⬜ Não iniciada | **Crítica** | Fases 2–4 | Muito alta |
| **6** | Escala | ⬜ Não iniciada | Baixa (agora) | Fase 5 + 3–6 meses uso | Muito alta |

**Legenda status:** ✅ Concluída · 🟡 Em andamento · ⬜ Não iniciada

---

# O que já foi concluído (consolidado)

| Entregável | Fase |
|------------|------|
| Filosofia e posicionamento Agency OS | 0 |
| Relatório Estratégico completo | 0, 4 (parcial) |
| Fluxo Operacional P-01 a P-22 | 1 |
| CORE v1.0 + análise crítica | 1 |
| Módulo Comercial — especificação | 2 |
| Módulo Projetos — especificação | 2 |
| UX embutida em Comercial e Projetos | 3 (parcial) |
| Escopo MVP definido | 5 (planejamento) |

---

# O que ainda falta (ordem correta)

| # | Entregável | Fase |
|---|------------|------|
| 1 | CORE v1.1 (eventos Negociação + Bloqueio) | 1 |
| 2 | NORAX-MODULO-CLIENTES.md | 2 |
| 3 | NORAX-MODULO-ACOES.md | 2 |
| 4 | NORAX-MODULO-DASHBOARD.md | 2 |
| 5 | NORAX-MODULO-FINANCEIRO.md (MVP) | 2 |
| 6 | NORAX-EXPERIENCIA.md + Design System | 3 |
| 7 | NORAX-ARQUITETURA.md | 4 |
| 8 | Índice mestre de documentos | 1 |
| 9 | **Implementação MVP** | 5 |
| 10 | Dogfood 3–6 meses | 5 |
| 11 | Expansão equipe + Portal | 6 |

---

# Dependências entre fases (diagrama)

```
FASE 0  Visão
   │
   ▼
FASE 1  Fundação ─────────────────────────┐
   │                                       │
   ▼                                       ▼
FASE 2  Operação ──────────►  FASE 3  Experiência
   │                              │
   └──────────┬───────────────────┘
              ▼
         FASE 4  Engenharia
              │
              ▼
         FASE 5  MVP  ──── dogfood 3–6 meses ────►  FASE 6  Escala
```

**Regra:** Fases 2, 3 e 4 podem avançar em **paralelo** na documentação, mas **implementação (Fase 5)** só começa quando 2 + 4 estiverem suficientes e 3 tiver Design System mínimo.

---

# O que pertence ao MVP vs futuro (resumo)

| MVP (Fase 5) | Futuro (Fase 6) |
|--------------|-----------------|
| Clientes, Comercial, Projetos | Portal completo |
| Ações + Dashboard Hoje | Equipe + permissões |
| Timeline automática | IA reuniões |
| Arquivos estruturados | Assinatura + pagamento integrados |
| Financeiro manual | NF-e, conciliação |
| Alertas CORE | Busca global ⌘K |
| 1 usuário | Multi-tenant SaaS |
| Sites, landing, sistemas | Novos tipos de serviço |
| Hospedagem registro + alerta | Gestão hospedagem completa |

---

# Princípios do roadmap

1. **Documentação antes de código** — Fases 0–4 antes da 5.
2. **MVP antes de escala** — Fase 6 bloqueada sem dogfood.
3. **Nenhuma feature sem evento CORE** — quando aplicável.
4. **Não contradizer documentos oficiais** — este roadmap referencia, não substitui.
5. **Revisão trimestral** — status e % atualizados; novas fases só com justificativa.

---

*Roadmap oficial Norax · v1.0 · Julho 2026*  
*Próxima revisão sugerida: após conclusão Fase 2 (módulos restantes)*
