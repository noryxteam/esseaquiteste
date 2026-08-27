# NORAX — Blueprint Oficial da Interface

**Documento:** Mapa completo de telas  
**Versão:** 1.0  
**Fase:** 1 do desenvolvimento (projeto de interface)  
**Status:** Nenhuma tela desenhada — apenas arquitetura visual

---

> Este documento lista **todas as telas** que existem na Norax. Cada tela é um destino navegável ou fluxo modal principal. Não contém wireframes, código ou banco de dados.

---

## Convenções

| Símbolo | Significado |
|---------|-------------|
| **[MVP]** | Entra na primeira versão utilizável |
| **[FUTURO]** | Documentada agora; implementação após MVP |
| **App Admin** | `app.norax` — equipe interna |
| **App Portal** | `portal.norax` — clientes |
| **App Meet** | `meet.norax` — sala de espera |

### Tipos de tela

| Tipo | Descrição |
|------|-----------|
| **Página** | Rota própria na navegação |
| **Workspace** | Página densa com seções (negociação, projeto, cliente) |
| **Modal** | Fluxo curto sobre lista/workspace |
| **Overlay** | Confirmação, busca ⌘K [FUTURO] |

---

## Navegação global — App Admin [MVP]

```
Sidebar fixa
├── ⌘K Busca [FUTURO]
├── Hoje
├── Ações
├── Clientes
├── Comercial
├── Projetos
├── Financeiro
├── Arquivos
├── ─────────
└── Configurações
```

**Fora da sidebar MVP:** Reuniões, Relatórios, Equipe — [FUTURO]

---

# APP ADMIN — Telas

---

## A-00 · Login [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Autenticar membro da equipe no Admin |
| **Quando** | Acesso ao sistema sem sessão válida |
| **Quem** | Fundador (MVP); equipe [FUTURO] |
| **Exibe** | Logo Norax · Email · Senha · Link recuperar senha |
| **Ações** | Entrar · Recuperar senha |
| **Módulos** | Identidade |
| **Eventos CORE** | Nenhum (auth fora do domínio de negócio) |
| **Navega para** | Hoje (sucesso) · Recuperar senha |

---

## A-01 · Recuperar senha [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Iniciar fluxo de reset de senha |
| **Quando** | Usuário esqueceu senha |
| **Quem** | Fundador |
| **Exibe** | Campo email · Instruções |
| **Ações** | Enviar link · Voltar ao login |
| **Módulos** | Identidade |
| **Eventos CORE** | Nenhum |
| **Navega para** | Login · Confirmação envio (inline) |

---

## A-02 · Hoje (Dashboard) [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Responder em 30s: "Como está minha empresa hoje?" |
| **Quando** | Primeiro acesso do dia; retorno ao sistema |
| **Quem** | Fundador |
| **Exibe** | Data · **3 prioridades** (Ações urgentes) · Agenda 48h · Cards clicáveis: projetos ativos, pipeline, pagamentos pendentes, leads parados · Atividade recente (5 itens) |
| **Ações** | Clicar qualquer item (deep link) · Ver todas Ações · Ver todos Projetos |
| **Módulos** | Ações · Comercial · Projetos · Financeiro · Clientes |
| **Eventos CORE** | Leitura apenas; itens originados de E-05, E-13, E-18, E-23, E-28, E-40, etc. |
| **Navega para** | Ações · Workspace Negociação · Workspace Projeto · Workspace Cliente · Financeiro |

---

## A-03 · Ações (Inbox) [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Lista universal do que o fundador precisa fazer agora |
| **Quando** | Triagem diária; após notificação mental "o que falta?" |
| **Quem** | Fundador |
| **Exibe** | Filtros: Todas · Hoje · Vencidas · Aguardando cliente · Concluídas hoje · Lista: título · prioridade · vencimento · origem (módulo) |
| **Ações** | Abrir contexto (deep link) · Marcar concluída (`acao.concluida` E-50) · Adiar [FUTURO] |
| **Módulos** | Todos (espelho das ações geradas pelo CORE) |
| **Eventos CORE** | E-50 `acao.concluida` · leitura de ações criadas por todos os eventos |
| **Navega para** | Workspace destino conforme `entity_type` |

---

## A-04 · Clientes — Lista [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Ver e encontrar todos os clientes |
| **Quando** | Buscar cliente; visão geral da base |
| **Quem** | Fundador |
| **Exibe** | Busca · Filtro status (Todos · Lead · Ativo · Inativo · Perdido) · Tabela: Nome · Contato · Status · Projetos ativos · Última atualização |
| **Ações** | Novo cliente (modal) · Clicar linha → Ficha · Ordenar por nome/data |
| **Módulos** | Clientes |
| **Eventos CORE** | Leitura |
| **Navega para** | A-05 Modal Novo Cliente · A-06 Ficha Cliente |

---

## A-05 · Clientes — Modal Novo / Editar [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Cadastrar ou editar cliente em < 30s |
| **Quando** | Novo contato; atualizar dados |
| **Quem** | Fundador |
| **Exibe** | Nome · Contato · Telefone · Email · Status (Lead/Ativo/Inativo/Perdido) · Origem [opcional] · Observações |
| **Ações** | Salvar · Cancelar · Alerta duplicata se similar |
| **Módulos** | Clientes |
| **Eventos CORE** | E-01 `cliente.criado` · E-02 `cliente.atualizado` · E-04 `cliente.descartado` (se Perdido) |
| **Navega para** | A-06 Ficha Cliente (após criar) · A-04 Lista (cancelar) |

---

## A-06 · Clientes — Ficha (Workspace) [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Contexto completo do cliente em um lugar |
| **Quando** | Trabalhar relacionamento; antes de reunião; histórico |
| **Quem** | Fundador |
| **Exibe** | Header: nome · status · editar · Contato · **Próximo passo sugerido** · Seções: Observações · Projetos (lista) · Comercial (negociação ativa + link) · Documentos (arquivos) · Timeline |
| **Ações** | Editar (modal) · Nova negociação · Abrir projeto · Abrir negociação · Editar observações |
| **Módulos** | Clientes · Comercial · Projetos · Arquivos · Timeline |
| **Eventos CORE** | Leitura; E-02 ao editar |
| **Navega para** | A-05 Editar · A-08 Nova Negociação · A-21 Workspace Projeto · A-10 Workspace Negociação |

**Nota:** Sem abas no MVP — seções em uma página (progressive disclosure).

---

## A-07 · Comercial — Lista de Negociações [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Ver pipeline comercial ativo e valor total |
| **Quando** | Revisão comercial; início de fluxo de venda |
| **Quem** | Fundador |
| **Exibe** | Busca · Filtros status (chips): Aberta · Proposta enviada · Em negociação · Aguardando contrato · Aguardando pagamento · Ganha · Perdida · Arquivada · Total R$ pipeline · Tabela: Cliente · Título · Status · Valor · Atualizado |
| **Ações** | Nova negociação · Clicar → Workspace · Filtrar |
| **Módulos** | Comercial · Clientes |
| **Eventos CORE** | Leitura |
| **Navega para** | A-08 Modal Nova Negociação · A-10 Workspace Negociação |

---

## A-08 · Comercial — Modal Nova Negociação [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Abrir ciclo comercial (com ou sem cliente novo) |
| **Quando** | Novo lead comercial; nova demanda de cliente existente |
| **Quem** | Fundador |
| **Exibe** | Buscar cliente existente OU mini-cadastro (nome, contato, telefone) · Título sugerido · Tipo serviço estimado |
| **Ações** | Criar · Cancelar |
| **Módulos** | Comercial · Clientes |
| **Eventos CORE** | E-01 (se cliente novo) · E-54 `negociacao.criada` |
| **Navega para** | A-10 Workspace Negociação |

---

## A-09 · Comercial — Modal Qualificar / Descartar [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar qualificação ou perda do lead |
| **Quando** | Após primeiro contato |
| **Quem** | Fundador |
| **Exibe** | Critérios (notas) · Motivo (se descartar) |
| **Ações** | Qualificar · Descartar |
| **Módulos** | Comercial · Clientes |
| **Eventos CORE** | E-03 `cliente.qualificado` · E-04 `cliente.descartado` |
| **Navega para** | A-10 Workspace (qualificado) · A-07 Lista (descartado) |

---

## A-10 · Comercial — Workspace Negociação [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Operar toda a venda até handoff |
| **Quando** | Todo o ciclo P-03 a P-09 |
| **Quem** | Fundador |
| **Exibe** | Header: cliente (link) · título · status · **Próximo passo** · Valor · Validade proposta · Revisões usadas · Seções colapsáveis: **Escopo** · **Proposta** (versões) · **Contrato** · **Interações** · **Financeiro** (parcelas) · **Timeline** |
| **Ações** | Próximo passo (CTA contextual) · Registrar interação · Registrar reunião [MVP manual] · Salvar escopo · Criar/editar/duplicar/enviar proposta · Registrar resposta · Criar/enviar contrato · Registrar assinatura · Registrar pagamento inicial · Converter em projeto · Arquivar |
| **Módulos** | Comercial · Clientes · Financeiro · Projetos (handoff) · Arquivos · Timeline |
| **Eventos CORE** | E-06 a E-08 reunião · E-09 escopo · E-12 a E-18 proposta · E-19 a E-21 contrato · E-22 pagamento · E-24 projeto · E-51 interação · E-52 arquivar |
| **Navega para** | A-06 Cliente · A-11 a A-19 Modais · A-21 Workspace Projeto · A-33 Financeiro |

---

## A-11 · Comercial — Modal Registrar Escopo [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Documentar entregáveis antes da proposta |
| **Quando** | Após reunião de descoberta (P-05) |
| **Quem** | Fundador |
| **Exibe** | Tipo · Objetivo · Entregáveis (lista) · Não inclui (lista) · Prazo estimado · Valor interno |
| **Ações** | Salvar |
| **Módulos** | Comercial |
| **Eventos CORE** | E-09 `escopo.registrado` |
| **Navega para** | A-10 Workspace |

---

## A-12 · Comercial — Modal Proposta (Criar / Editar / Duplicar) [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Montar ou revisar proposta comercial |
| **Quando** | Escopo registrado; nova versão após negociação |
| **Quem** | Fundador |
| **Exibe** | Pré-preenchido do escopo · Seções editáveis · Valor · Validade · Preview PDF |
| **Ações** | Salvar rascunho · Enviar (→ A-13 confirmação) |
| **Módulos** | Comercial · Arquivos |
| **Eventos CORE** | E-12 `proposta.criada` · E-13 `proposta.enviada` |
| **Navega para** | A-10 Workspace |

---

## A-13 · Comercial — Modal Enviar Proposta (Confirmação) [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Checklist pré-envio |
| **Quando** | Antes de marcar proposta como enviada |
| **Quem** | Fundador |
| **Exibe** | Checklist: nome · valor · prazo · exclusões · validade · Canal envio (email manual MVP) |
| **Ações** | Confirmar envio · Voltar |
| **Módulos** | Comercial |
| **Eventos CORE** | E-13 `proposta.enviada` |
| **Navega para** | A-10 Workspace |

---

## A-14 · Comercial — Modal Registrar Resposta [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar decisão do cliente |
| **Quando** | Cliente respondeu à proposta |
| **Quem** | Fundador |
| **Exibe** | Opções: Aprovada · Em negociação · Recusada · Campo comprovante (se aprovada) · Motivo (se recusada) |
| **Ações** | Confirmar |
| **Módulos** | Comercial |
| **Eventos CORE** | E-15 aprovada · E-16 negociação · E-17 recusada |
| **Navega para** | A-10 Workspace · A-15 Contrato (se aprovada) |

---

## A-15 · Comercial — Modal Contrato (Criar / Enviar / Assinatura) [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Gerenciar contrato até assinatura |
| **Quando** | Proposta aprovada (P-08) |
| **Quem** | Fundador |
| **Exibe** | Pré-preenchido da proposta · Preview · Status assinatura · Data envio/assinatura |
| **Ações** | Salvar · Marcar enviado · Registrar assinatura (upload comprovante MVP) |
| **Módulos** | Comercial · Arquivos |
| **Eventos CORE** | E-19 criado · E-20 enviado · E-21 assinado |
| **Navega para** | A-10 Workspace · A-16 Pagamento |

---

## A-16 · Comercial — Modal Registrar Pagamento Inicial [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Confirmar recebimento e destravar handoff |
| **Quando** | Contrato assinado (P-09) |
| **Quem** | Fundador |
| **Exibe** | Valor esperado · Data · Método · Comprovante |
| **Ações** | Confirmar recebimento |
| **Módulos** | Comercial · Financeiro |
| **Eventos CORE** | E-22 `pagamento.recebido` (inicial) |
| **Navega para** | A-10 Workspace · A-17 Converter Projeto |

---

## A-17 · Comercial — Modal Converter em Projeto [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Executar handoff Comercial → Projetos |
| **Quando** | Pagamento inicial confirmado |
| **Quem** | Fundador |
| **Exibe** | Resumo handoff: cliente · escopo · valor · prazo · Nome projeto sugerido (editável) |
| **Ações** | Confirmar criação |
| **Módulos** | Comercial · Projetos |
| **Eventos CORE** | E-24 `projeto.criado` |
| **Navega para** | A-21 Workspace Projeto |

---

## A-18 · Comercial — Modal Registrar Interação [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar ligação/email/WhatsApp importante |
| **Quando** | Após comunicação externa relevante |
| **Quem** | Fundador |
| **Exibe** | Tipo · Resumo · Data |
| **Ações** | Salvar |
| **Módulos** | Comercial · Timeline |
| **Eventos CORE** | E-51 `negociacao.interacao_registrada` |
| **Navega para** | A-10 Workspace |

---

## A-19 · Comercial — Modal Arquivar Negociação [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Remover da lista ativa |
| **Quando** | Perdida, expirada ou cancelada |
| **Quem** | Fundador |
| **Exibe** | Confirmação · Motivo opcional |
| **Ações** | Arquivar |
| **Módulos** | Comercial |
| **Eventos CORE** | E-52 `negociacao.arquivada` |
| **Navega para** | A-07 Lista |

---

## A-20 · Projetos — Lista [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Ver todos os projetos e status |
| **Quando** | Triagem operacional; busca de projeto |
| **Quem** | Fundador |
| **Exibe** | Busca · Filtros: Em andamento · Aguardando cliente · Em revisão · Em garantia · Concluídos · Tabela: Nome · Cliente · Tipo · Progresso % · Prazo · Bloqueio |
| **Ações** | Clicar → Workspace · Filtrar |
| **Módulos** | Projetos · Clientes |
| **Eventos CORE** | Leitura |
| **Navega para** | A-21 Workspace Projeto |

---

## A-21 · Projetos — Workspace Projeto [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Executar projeto do kickoff à entrega |
| **Quando** | Todo P-10 a P-20 |
| **Quem** | Fundador |
| **Exibe** | Header: nome · cliente · status · progresso · prazo · **Bloqueio** · **Próximo passo** · Colunas lógicas: Pendente Norax \| Pendente Cliente · Seções: Escopo vendido (read-only) · Briefing execução · Checklist · Cronograma (prazo + marcos) · Revisões · Aprovações · Arquivos · Garantia (pós-entrega) · Timeline |
| **Ações** | Kickoff · Registrar material · Concluir item checklist · Registrar bloqueio/resolver · QA interno · Apresentar · Registrar feedback · Registrar aprovação · Registrar pagamento final · Entregar · Chamado garantia · Encerrar · Arquivar |
| **Módulos** | Projetos · Clientes · Comercial (link) · Financeiro · Arquivos · Timeline |
| **Eventos CORE** | E-25 a E-35 · E-45 a E-47 · E-56/E-57 bloqueio · E-22 final |
| **Navega para** | A-06 Cliente · A-33 Financeiro · A-23 a A-32 Modais · A-35 Arquivos |

---

## A-22 · Projetos — Modal Kickoff [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Confirmar início e lista de materiais |
| **Quando** | Projeto recém-criado |
| **Quem** | Fundador |
| **Exibe** | Checklist materiais por tipo · Notas kickoff · Template mensagem cliente |
| **Ações** | Confirmar kickoff |
| **Módulos** | Projetos |
| **Eventos CORE** | E-25 `projeto.kickoff_realizado` |
| **Navega para** | A-21 Workspace |

---

## A-23 · Projetos — Modal Registrar Material [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Marcar material recebido + upload |
| **Quando** | Cliente envia arquivos |
| **Quem** | Fundador |
| **Exibe** | Lista itens esperados · Upload · Status por item |
| **Ações** | Marcar recebido · Upload |
| **Módulos** | Projetos · Arquivos |
| **Eventos CORE** | E-26 `materiais.recebidos` · E-27 `materiais.completos` |
| **Navega para** | A-21 Workspace |

---

## A-24 · Projetos — Modal Registrar Bloqueio [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Explicar por que projeto parou |
| **Quando** | Aguardando cliente ou impedimento interno |
| **Quem** | Fundador |
| **Exibe** | Tipo: Cliente / Interno · Descrição |
| **Ações** | Salvar · Resolver bloqueio |
| **Módulos** | Projetos |
| **Eventos CORE** | E-56 bloqueio · E-57 resolvido |
| **Navega para** | A-21 Workspace |

---

## A-25 · Projetos — Modal Revisão Interna (QA) [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Checklist QA antes do cliente ver |
| **Quando** | Checklist desenvolvimento 100% |
| **Quem** | Fundador |
| **Exibe** | Itens QA fixos · Marcar cada um |
| **Ações** | Aprovar QA |
| **Módulos** | Projetos |
| **Eventos CORE** | E-30 `projeto.revisao_interna_concluida` |
| **Navega para** | A-26 Apresentar |

---

## A-26 · Projetos — Modal Apresentar ao Cliente [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar envio do preview |
| **Quando** | QA aprovado |
| **Quem** | Fundador |
| **Exibe** | URL preview · Rodada · Lembrete revisões contratuais |
| **Ações** | Confirmar apresentação |
| **Módulos** | Projetos · Arquivos |
| **Eventos CORE** | E-31 `projeto.apresentado` |
| **Navega para** | A-21 Workspace · A-27 Feedback |

---

## A-27 · Projetos — Modal Registrar Feedback / Ajustes [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Classificar e registrar pedidos do cliente |
| **Quando** | Após apresentação |
| **Quem** | Fundador |
| **Exibe** | Lista itens · Classificação: bug / escopo / fora · Contador rodadas |
| **Ações** | Salvar · Marcar ajustes concluídos |
| **Módulos** | Projetos |
| **Eventos CORE** | E-32 `ajustes_solicitados` · E-33 `ajustes_concluidos` |
| **Navega para** | A-21 Workspace · A-28 Aprovação |

---

## A-28 · Projetos — Modal Aprovação Final [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar aceite formal |
| **Quando** | Cliente aprovou versão |
| **Quem** | Fundador |
| **Exibe** | Upload comprovante · Quem aprovou · Data |
| **Ações** | Confirmar aprovação |
| **Módulos** | Projetos · Arquivos |
| **Eventos CORE** | E-34 `projeto.aprovado` |
| **Navega para** | A-29 Pagamento final · A-30 Entrega |

---

## A-29 · Projetos — Modal Pagamento Final [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar saldo antes da entrega (se 50/50) |
| **Quando** | Projeto aprovado; modelo parcelado |
| **Quem** | Fundador |
| **Exibe** | Valor · Comprovante (igual A-16) |
| **Ações** | Confirmar |
| **Módulos** | Projetos · Financeiro |
| **Eventos CORE** | E-22 `pagamento.recebido` (final) |
| **Navega para** | A-30 Entrega |

---

## A-30 · Projetos — Modal Entrega [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Publicar e registrar entrega |
| **Quando** | Aprovado + quitado |
| **Quem** | Fundador |
| **Exibe** | URL produção · Dados hospedagem/domínio · Checklist pacote entrega |
| **Ações** | Confirmar entrega |
| **Módulos** | Projetos · Hospedagem (registro) |
| **Eventos CORE** | E-35 `projeto.entregue` → E-36 garantia · E-39 hospedagem |
| **Navega para** | A-21 Workspace (estado garantia) |

---

## A-31 · Projetos — Modal Chamado Garantia [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar bug ou pedido na garantia |
| **Quando** | Cliente reporta pós-entrega |
| **Quem** | Fundador |
| **Exibe** | Descrição · Tipo bug/feature · Status |
| **Ações** | Abrir · Resolver |
| **Módulos** | Projetos |
| **Eventos CORE** | E-37 · E-38 · E-45 encerramento garantia |
| **Navega para** | A-21 Workspace |

---

## A-32 · Projetos — Modal Encerrar Projeto [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Fechar ciclo operacional |
| **Quando** | Garantia encerrada |
| **Quem** | Fundador |
| **Exibe** | Checklist: entregue · pago · garantia ok · Confirmação |
| **Ações** | Encerrar |
| **Módulos** | Projetos · Clientes |
| **Eventos CORE** | E-46 `projeto.encerrado` |
| **Navega para** | A-20 Lista |

---

## A-33 · Financeiro — Visão Geral [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Ver receitas, pendências e quitações |
| **Quando** | Controle financeiro; cobrança |
| **Quem** | Fundador |
| **Exibe** | Cards: recebido mês · pendente · atrasado · Lista: cliente · projeto · tipo · valor · status · vencimento |
| **Ações** | Registrar pagamento · Filtrar · Deep link cliente/projeto |
| **Módulos** | Financeiro · Clientes · Projetos · Comercial |
| **Eventos CORE** | E-22 · E-23 atrasado · leitura |
| **Navega para** | A-34 Modal Pagamento · A-06 · A-21 |

---

## A-34 · Financeiro — Modal Registrar Pagamento [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Registrar entrada (inicial, final, renovação) |
| **Quando** | Cobrança recebida |
| **Quem** | Fundador |
| **Exibe** | Cliente · Projeto/contrato · Tipo parcela · Valor · Método · Comprovante |
| **Ações** | Salvar |
| **Módulos** | Financeiro |
| **Eventos CORE** | E-22 `pagamento.recebido` |
| **Navega para** | A-33 · Workspace origem |

---

## A-35 · Arquivos — Biblioteca [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Encontrar qualquer arquivo da empresa |
| **Quando** | Buscar documento; upload avulso |
| **Quem** | Fundador |
| **Exibe** | Busca · Filtros: cliente · projeto · tipo · data · Grid/lista arquivos |
| **Ações** | Upload · Download · Abrir contexto (cliente/projeto) |
| **Módulos** | Arquivos · Clientes · Projetos |
| **Eventos CORE** | Nenhum (upload não muda estado comercial) |
| **Navega para** | A-06 · A-21 |

---

## A-36 · Configurações — Geral [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Dados básicos da Norax e do usuário |
| **Quando** | Setup inicial; alterar perfil |
| **Quem** | Fundador |
| **Exibe** | Perfil: nome · email · senha · Empresa: nome · logo · Dados renovação hospedagem (tabela preço) |
| **Ações** | Salvar |
| **Módulos** | Identidade · Config |
| **Eventos CORE** | Nenhum |
| **Navega para** | Qualquer módulo (sidebar) |

---

## A-37 · Busca Global ⌘K [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Encontrar qualquer coisa em < 2s |
| **Quando** | Atalho teclado de qualquer tela |
| **Quem** | Fundador |
| **Exibe** | Input · Resultados: clientes · negociações · projetos · ações |
| **Ações** | Navegar · Enter |
| **Módulos** | Todos |
| **Eventos CORE** | Leitura |
| **Navega para** | Qualquer workspace |

---

## A-38 · Reuniões — Lista e Agenda [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Agendar e ver reuniões |
| **Quando** | Gestão de agenda comercial |
| **Quem** | Fundador |
| **Exibe** | Calendário · Lista · Link meet |
| **Ações** | Agendar · Concluir · Cancelar |
| **Módulos** | Reuniões · Comercial |
| **Eventos CORE** | E-06 · E-07 · E-08 |
| **Navega para** | A-10 · Meet P-01 |

---

## A-39 · Relatórios [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Analytics e exportação |
| **Quando** | Revisão mensal |
| **Quem** | Fundador · gestor |
| **Exibe** | Receita · conversão · prazos |
| **Ações** | Exportar CSV |
| **Módulos** | Todos (leitura) |
| **Eventos CORE** | Leitura |
| **Navega para** | Hoje |

---

## A-40 · Equipe [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Gerir membros e permissões |
| **Quando** | Contratação |
| **Quem** | Fundador |
| **Exibe** | Lista membros · roles |
| **Ações** | Convidar · desativar |
| **Módulos** | Identidade |
| **Eventos CORE** | Nenhum |
| **Navega para** | Configurações |

---

## A-41 · Erro / Página não encontrada [MVP]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Estado de rota inválida |
| **Quando** | URL inexistente |
| **Quem** | Qualquer |
| **Exibe** | Mensagem · link Hoje |
| **Ações** | Voltar |
| **Módulos** | — |
| **Eventos CORE** | Nenhum |
| **Navega para** | Hoje |

---

# APP PORTAL — Telas [FUTURO — fora do MVP]

> App separado (`portal.norax`). Auth por magic link. Cliente vê apenas seus dados.

---

## P-00 · Login (Magic Link) [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Autenticar cliente sem senha |
| **Quando** | Primeiro acesso ou sessão expirada |
| **Quem** | Cliente |
| **Exibe** | Email · Instrução "enviamos um link" |
| **Ações** | Solicitar link · Abrir link recebido |
| **Módulos** | Identidade Portal |
| **Eventos CORE** | Nenhum |
| **Navega para** | P-01 Home |

---

## P-01 · Home do Cliente [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Visão do que precisa da atenção do cliente |
| **Quando** | Acesso ao portal |
| **Quem** | Cliente |
| **Exibe** | Saudação · **Próxima ação** (aprovar, enviar material, pagar) · Projeto ativo · Status resumido |
| **Ações** | Ir para ação pendente |
| **Módulos** | Projetos · Comercial (leitura) |
| **Eventos CORE** | Leitura |
| **Navega para** | P-02 a P-07 conforme pendência |

---

## P-02 · Proposta (Visualização) [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Cliente lê proposta enviada |
| **Quando** | Link na proposta ou portal |
| **Quem** | Cliente |
| **Exibe** | PDF/HTML proposta · Validade · Valor |
| **Ações** | Aceitar · Pedir alteração · Recusar [integração futura] |
| **Módulos** | Comercial |
| **Eventos CORE** | E-15 a E-17 (via ação cliente) |
| **Navega para** | P-01 · P-03 Contrato |

---

## P-03 · Contrato (Assinatura) [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Cliente assina contrato digitalmente |
| **Quando** | Proposta aprovada |
| **Quem** | Cliente |
| **Exibe** | Contrato · Status assinatura |
| **Ações** | Assinar (Clicksign [FUTURO]) |
| **Módulos** | Comercial |
| **Eventos CORE** | E-21 `contrato.assinado` |
| **Navega para** | P-04 Pagamento |

---

## P-04 · Pagamento [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Cliente paga parcela (inicial ou final) |
| **Quando** | Contrato assinado ou pré-entrega |
| **Quem** | Cliente |
| **Exibe** | Valor · Métodos · Status |
| **Ações** | Pagar (Stripe [FUTURO]) |
| **Módulos** | Financeiro |
| **Eventos CORE** | E-22 `pagamento.recebido` |
| **Navega para** | P-01 · P-05 Projeto |

---

## P-05 · Projeto — Andamento [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Cliente acompanha execução (read-only + ações dele) |
| **Quando** | Projeto em andamento |
| **Quem** | Cliente |
| **Exibe** | Status · Progresso · O que falta do cliente · Preview link · Timeline pública |
| **Ações** | Enviar material · Aprovar versão · Abrir chamado garantia |
| **Módulos** | Projetos · Arquivos |
| **Eventos CORE** | E-26 · E-34 · E-37 (lado cliente) |
| **Navega para** | P-06 Materiais · P-07 Aprovação |

---

## P-06 · Enviar Materiais [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Cliente faz upload do que foi pedido |
| **Quando** | Kickoff solicitou materiais |
| **Quem** | Cliente |
| **Exibe** | Lista itens esperados · Upload por item |
| **Ações** | Upload · Marcar enviado |
| **Módulos** | Projetos · Arquivos |
| **Eventos CORE** | E-26 `materiais.recebidos` |
| **Navega para** | P-05 |

---

## P-07 · Aprovação de Versão [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Cliente aprova formalmente o preview |
| **Quando** | Projeto apresentado |
| **Quem** | Cliente |
| **Exibe** | Preview · Checklist · Termo aceite |
| **Ações** | Aprovar · Solicitar ajustes |
| **Módulos** | Projetos |
| **Eventos CORE** | E-34 · E-32 |
| **Navega para** | P-05 |

---

## P-08 · Arquivos do Cliente [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Documentos compartilhados com o cliente |
| **Quando** | Buscar contrato, proposta, entrega |
| **Quem** | Cliente |
| **Exibe** | Lista arquivos por projeto |
| **Ações** | Download |
| **Módulos** | Arquivos |
| **Eventos CORE** | Leitura |
| **Navega para** | P-01 · P-05 |

---

## P-09 · Briefing (Formulário) [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Cliente preenche briefing estruturado |
| **Quando** | Pós-contrato, pré-kickoff |
| **Quem** | Cliente |
| **Exibe** | Formulário por tipo de projeto |
| **Ações** | Salvar · Enviar |
| **Módulos** | Projetos |
| **Eventos CORE** | E-53 `briefing.preenchido` [proposto CORE v1.1] |
| **Navega para** | P-05 |

---

## P-10 · Garantia — Abrir Chamado [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Cliente reporta problema pós-entrega |
| **Quem** | Cliente |
| **Exibe** | Formulário · Histórico chamados |
| **Ações** | Abrir chamado |
| **Módulos** | Projetos |
| **Eventos CORE** | E-37 `garantia.chamado_aberto` |
| **Navega para** | P-05 |

---

# APP MEET — Telas [FUTURO]

> App minimal (`meet.norax`). Uma tela principal.

---

## M-01 · Sala de Espera [FUTURO]

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Cliente entra na reunião agendada |
| **Quando** | Link enviado no convite |
| **Quem** | Cliente (e fundador entra por outro fluxo) |
| **Exibe** | Logo Norax · Título reunião · Data/hora · Nome participante · Botão "Entrar" |
| **Ações** | Entrar na sala (vídeo [FUTURO]) |
| **Módulos** | Reuniões |
| **Eventos CORE** | E-07 `reuniao.iniciada` |
| **Navega para** | Sala de vídeo [FUTURO] · P-01 Portal (pós-reunião) |

---

# COMPONENTES TRANSVERSAIS (não são telas, mas aparecem em várias)

| Componente | Onde aparece | Função |
|------------|--------------|--------|
| **Timeline** | Cliente, Negociação, Projeto | Histórico imutável de eventos |
| **Próximo passo** | Hoje, Workspaces | CTA único contextual |
| **Banner bloqueio** | Workspace Projeto, Hoje | Alerta projeto parado |
| **Toast confirmação** | Global | Feedback ação salva |
| **Empty state** | Listas vazias | Orientar primeira ação |

---

# ÁRVORE COMPLETA DO SISTEMA

```
NORAX
│
├── APP ADMIN (app.norax) [MVP]
│   │
│   ├── Autenticação
│   │   ├── A-00 Login
│   │   └── A-01 Recuperar senha
│   │
│   ├── Hoje (A-02)
│   │   ├── → Ações
│   │   ├── → Workspace Negociação
│   │   ├── → Workspace Projeto
│   │   ├── → Ficha Cliente
│   │   └── → Financeiro
│   │
│   ├── Ações (A-03)
│   │   └── → [deep link para qualquer workspace]
│   │
│   ├── Clientes
│   │   ├── A-04 Lista
│   │   ├── A-05 Modal Novo / Editar
│   │   └── A-06 Ficha Cliente
│   │       ├── → Comercial (negociação)
│   │       ├── → Projetos
│   │       ├── → Arquivos
│   │       └── → Timeline
│   │
│   ├── Comercial
│   │   ├── A-07 Lista Negociações
│   │   ├── A-08 Modal Nova Negociação
│   │   └── A-10 Workspace Negociação
│   │       ├── A-09 Qualificar / Descartar
│   │       ├── A-11 Escopo
│   │       ├── A-12 Proposta (criar/editar)
│   │       ├── A-13 Enviar Proposta
│   │       ├── A-14 Resposta Cliente
│   │       ├── A-15 Contrato
│   │       ├── A-16 Pagamento Inicial
│   │       ├── A-17 Converter Projeto ──→ Projetos
│   │       ├── A-18 Interação
│   │       ├── A-19 Arquivar
│   │       └── → Ficha Cliente
│   │
│   ├── Projetos
│   │   ├── A-20 Lista
│   │   └── A-21 Workspace Projeto
│   │       ├── A-22 Kickoff
│   │       ├── A-23 Materiais
│   │       ├── A-24 Bloqueio
│   │       ├── A-25 QA Interno
│   │       ├── A-26 Apresentar
│   │       ├── A-27 Feedback / Ajustes
│   │       ├── A-28 Aprovação
│   │       ├── A-29 Pagamento Final
│   │       ├── A-30 Entrega
│   │       ├── A-31 Garantia
│   │       ├── A-32 Encerrar
│   │       └── → Ficha Cliente · Financeiro · Arquivos
│   │
│   ├── Financeiro
│   │   ├── A-33 Visão Geral
│   │   └── A-34 Modal Pagamento
│   │
│   ├── Arquivos
│   │   └── A-35 Biblioteca
│   │
│   ├── Configurações
│   │   └── A-36 Geral
│   │
│   ├── [FUTURO]
│   │   ├── A-37 Busca ⌘K
│   │   ├── A-38 Reuniões
│   │   ├── A-39 Relatórios
│   │   └── A-40 Equipe
│   │
│   └── A-41 Erro 404
│
├── APP PORTAL (portal.norax) [FUTURO]
│   │
│   ├── P-00 Login Magic Link
│   │
│   └── P-01 Home
│       ├── P-02 Proposta
│       ├── P-03 Contrato
│       ├── P-04 Pagamento
│       ├── P-05 Projeto (andamento)
│       │   ├── P-06 Enviar Materiais
│       │   └── P-07 Aprovação Versão
│       ├── P-08 Arquivos
│       ├── P-09 Briefing
│       └── P-10 Garantia
│
└── APP MEET (meet.norax) [FUTURO]
    │
    └── M-01 Sala de Espera
        └── → Sala de vídeo [FUTURO]
```

---

## Árvore simplificada — visão do fundador [MVP]

```
Login
  ↓
Hoje
├── Ações
├── Clientes
│   └── Ficha Cliente
├── Comercial
│   └── Workspace Negociação
├── Projetos
│   └── Workspace Projeto
├── Financeiro
├── Arquivos
└── Configurações
```

---

## Contagem de telas

| App | MVP | Futuro | Total |
|-----|-----|--------|-------|
| Admin | 37 | 4 | 41 |
| Portal | 0 | 11 | 11 |
| Meet | 0 | 1 | 1 |
| **Total** | **37** | **16** | **53** |

*Modais contam como telas lógicas (fluxos distintos), não como rotas separadas na sidebar.*

---

## Matriz rápida: Módulo → Telas principais

| Módulo | Telas âncora |
|--------|--------------|
| **Hoje** | A-02 |
| **Ações** | A-03 |
| **Clientes** | A-04, A-06 |
| **Comercial** | A-07, A-10 |
| **Projetos** | A-20, A-21 |
| **Financeiro** | A-33 |
| **Arquivos** | A-35 |
| **Timeline** | Componente em A-06, A-10, A-21 |
| **Portal** | P-01 a P-10 [FUTURO] |
| **Meet** | M-01 [FUTURO] |

---

## Próximo passo documental (Fase 1)

| # | Entrega | Status |
|---|---------|--------|
| 1 | Blueprint Interface (este doc) | ✅ |
| 2 | Wireframes por workspace (Hoje, Negociação, Projeto, Cliente) | Pendente |
| 3 | Design system (tokens, componentes) | Pendente |

---

*NORAX Blueprint Oficial da Interface v1.0 — Fase 1 — Julho 2026*
