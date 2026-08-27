# NORAX BIBLE

**A Constituição Oficial da Norax**

**Versão:** 1.0  
**Data:** Julho de 2026  
**Autoridade:** Este documento prevalece sobre opiniões individuais. Em caso de dúvida, consulte a Bible. Em caso de conflito com documentos técnicos, a Bible define o *porquê*; documentos especializados definem o *como*.

---

## Documentos que esta Bible consolida

| Documento | Papel |
|-----------|-------|
| Filosofia da Norax | Origem dos princípios |
| NORAX-RELATORIO-COMPLETO.md | Visão estratégica e produto |
| NORAX-FLUXO-OPERACIONAL.md | Processos P-01 a P-22 |
| NORAX-CORE.md | Comportamento automático do sistema |
| NORAX-MODULO-COMERCIAL.md | Motor de receita |
| NORAX-MODULO-PROJETOS.md | Motor de entrega |
| NORAX-ROADMAP.md | Evolução da empresa |

### Nota sobre conflitos

Todos os documentos foram escritos em sequência lógica e são compatíveis. Onde surgir aparente contradição, prevalece esta hierarquia:

1. **NORAX BIBLE** — princípios e valores  
2. **CORE** — regras de comportamento do sistema  
3. **Fluxo Operacional** — processos humanos  
4. **Módulos** — especificações de domínio  
5. **Roadmap** — ordem e timing  

Exemplo já resolvido: *"Lead"* é status de Cliente, não módulo separado. O Comercial opera **Negociações**, não uma lista paralela de leads.

---

## Índice

1. [História da Norax](#capítulo-1--história-da-norax)
2. [Missão](#capítulo-2--missão)
3. [Visão](#capítulo-3--visão)
4. [Valores](#capítulo-4--valores)
5. [Filosofia](#capítulo-5--filosofia)
6. [Princípios do Produto](#capítulo-6--princípios-do-produto)
7. [Princípios de UX](#capítulo-7--princípios-de-ux)
8. [Princípios de Interface](#capítulo-8--princípios-de-interface)
9. [Princípios de Desenvolvimento](#capítulo-9--princípios-de-desenvolvimento)
10. [Princípios de Arquitetura](#capítulo-10--princípios-de-arquitetura)
11. [Como tomamos decisões](#capítulo-11--como-tomamos-decisões)
12. [Como criamos novas funcionalidades](#capítulo-12--como-criamos-novas-funcionalidades)
13. [Como tratamos nossos clientes](#capítulo-13--como-tratamos-nossos-clientes)
14. [Como organizamos projetos](#capítulo-14--como-organizamos-projetos)
15. [Como documentamos tudo](#capítulo-15--como-documentamos-tudo)
16. [Como a Norax deve evoluir](#capítulo-16--como-a-norax-deve-evoluir)

---

# Capítulo 1 — História da Norax

## Objetivo

Registrar a origem e o propósito da empresa para que qualquer pessoa entenda *por que* a Norax existe e *por que* o sistema está sendo construído.

## Princípios

- A Norax nasceu de um problema real, não de uma moda de software.
- A empresa veio antes do produto; o produto serve a empresa.
- Documentar antes de construir é parte da história, não atraso.

## A história

A Norax é uma empresa de desenvolvimento web fundada com o propósito de criar sites institucionais, landing pages e sistemas web com alto padrão de qualidade.

Nasceu da constatação de que agências pequenas — mesmo excelentes tecnicamente — operam no caos: informação no WhatsApp, propostas em pastas soltas, prazos na memória do fundador, clientes sem visibilidade do andamento. O trabalho entregue é profissional; a operação, muitas vezes, não.

Em vez de adotar um CRM genérico que não entende o fluxo de uma agência, a Norax decidiu construir seu próprio **Sistema Operacional da Agência** — primeiro para uso interno, com ambição de se tornar referência no setor.

Em julho de 2026, a empresa está na fase de **fundação intelectual**: processos, CORE e módulos especificados antes da primeira linha de código. Essa escolha é deliberada: empresas que constroem sem constituição repetem os mesmos erros para sempre.

## Boas práticas

- Contar a história da Norax a novos colaboradores no primeiro dia.
- Relacionar cada módulo do sistema a um problema vivido na operação.
- Atualizar este capítulo quando marcos reais ocorrerem (primeiro cliente no sistema, primeira equipe, etc.).

## O que sempre deve ser feito

- Lembrar que a Norax é, antes de tudo, uma empresa que **entrega projetos web**.
- Tratar o sistema como meio, não como fim.

## O que nunca deve ser feito

- Apresentar a Norax como "startup de software" enquanto o core do negócio é prestação de serviço.
- Esquecer que o sistema existe porque a operação manual falhou.

## Exemplos práticos

| Situação | Resposta alinhada à história |
|----------|------------------------------|
| "Por que não usamos HubSpot?" | Porque não foi feito para o fluxo Lead → Projeto → Entrega de uma agência web. |
| "Por que tanta documentação?" | Porque já perdemos informação demais no improviso. |
| "Podemos pular o MVP?" | Não — a história ensina que sistema grande demais nunca lança. |

---

# Capítulo 2 — Missão

## Objetivo

Declarar o propósito central da Norax — o que fazemos todos os dias pelo cliente e pela operação.

## Princípios

- Missão é ação, não slogan.
- Deve caber em uma frase e guiar decisões difíceis.

## Missão oficial

> **Criar soluções web excepcionais, operando com organização extrema, para que cada cliente tenha clareza, cada projeto tenha previsibilidade e cada pessoa na Norax saiba exatamente o que fazer a seguir.**

## Boas práticas

- Avaliar novos serviços contra a missão (sites, landing, sistemas — sim; serviços sem entrega clara — questionar).
- Usar a missão em reuniões de priorização.

## O que sempre deve ser feito

- Entregar o que foi acordado no escopo.
- Comunicar com profissionalismo e transparência.
- Registrar decisões no sistema, não na memória.

## O que nunca deve ser feito

- Prometer o que não está no escopo sem aditivo.
- Sacrificar organização por velocidade aparente.

## Exemplos práticos

| Decisão | Alinhada à missão? |
|---------|-------------------|
| Aceitar projeto fora da capacidade | Não — prejudica previsibilidade |
| Registrar escopo antes da proposta | Sim — clareza para o cliente |
| Comprar CRM genérico | Não — não resolve o fluxo real |

---

# Capítulo 3 — Visão

## Objetivo

Descrever o futuro desejado da Norax — a direção de longo prazo que orienta investimentos e paciência estratégica.

## Princípios

- Visão é ambiciosa mas crível.
- Internacional é horizonte, não tarefa de hoje.
- Produto interno precede produto externo.

## Visão oficial

> **Ser a agência de desenvolvimento web mais organizada do seu mercado — e, no longo prazo, a referência internacional em como uma agência digital deve operar, com um sistema que transforma caos em clareza.**

### Horizontes

| Prazo | Visão operacional |
|-------|-------------------|
| **Hoje** | Fundador solo; sistema em construção; excelência na entrega manual |
| **12–18 meses** | Agency OS em uso diário; operação sem depender de memória |
| **3–5 anos** | Equipe estruturada; clientes no portal; opcionalmente produto para outras agências |
| **Longo prazo** | Referência global em organização operacional para agências digitais |

## Boas práticas

- Revisar visão anualmente; não mudar a cada sprint.
- Medir progresso por indicadores de organização, não só receita.

## O que sempre deve ser feito

- Construir para durar anos, não para demo.
- Manter identidade premium em toda interação.

## O que nunca deve ser feito

- Perseguir SaaS antes de dominar a operação interna.
- Copiar visão de empresas de outro segmento.

## Exemplos práticos

| Pergunta | Resposta pela visão |
|----------|---------------------|
| "Vendemos o sistema agora?" | Não — primeiro dogfood, depois avaliar. |
| "Contratamos 10 devs?" | Só quando processo suportar — visão é organização, não tamanho. |

---

# Capítulo 4 — Valores

## Objetivo

Definir os pilares éticos e culturais inegociáveis da Norax.

## Princípios

Valores são testados sob pressão — prazo apertado, cliente difícil, receita tentadora.

## Valores oficiais

| Valor | Significado |
|-------|-------------|
| **Organização** | Toda informação tem um lugar. Nada importante vive só na cabeça de alguém. |
| **Clareza** | Cliente e equipe sempre sabem o que foi combinado, o que falta e o que vem depois. |
| **Respeito ao tempo** | Seu tempo, do cliente e do colaborador. Cada interação deve economizar minutos. |
| **Honestidade** | Escopo, prazo e limite dito antes, não depois do problema. |
| **Excelência** | Entrega que o fundador assina sem vergonha. Premium não é luxo — é padrão. |
| **Simplicidade** | O caminho mais simples que resolve o problema real. |
| **Responsabilidade** | O que foi registrado é o que vale. Promessa no WhatsApp sem registro não existe. |

## Boas práticas

- Citar valores em feedback e decisões de escopo.
- Contratar e demitir alinhado a valores, não só a habilidade técnica.

## O que sempre deve ser feito

- Dizer não a projetos que exigem desonestidade comercial.
- Corrigir erros próprios antes de culpar o cliente.

## O que nunca deve ser feito

- Retenção de domínio ou arquivos do cliente após término.
- Prometer prazo ou valor na reunião sem análise registrada.

## Exemplos práticos

| Situação | Valor aplicado |
|----------|----------------|
| Cliente pede feature extra "de graça" | Honestidade + Clareza → aditivo |
| Fundador esquece follow-up | Organização → sistema alerta, não memória |
| Interface cheia de opções | Simplicidade → um próximo passo |

---

# Capítulo 5 — Filosofia

## Objetivo

Articular a forma de pensar da Norax — o sistema operacional mental da empresa.

## Princípios

A filosofia da Norax foi declarada na fundação do projeto e permeia todos os documentos oficiais.

## Filosofia oficial

1. **Organização acima de tudo.**  
2. **Cada clique deve economizar tempo.**  
3. **Nenhuma informação importante pode depender da memória.**  
4. **Toda informação deve possuir um local específico.**  
5. **O WhatsApp serve apenas para conversar.** Toda informação pertence ao sistema.  
6. **Todo o histórico da empresa pertence ao sistema.**  
7. **O usuário nunca deve pensar: "O que preciso fazer agora?"** O sistema deve responder isso automaticamente.

## A regra das duas perguntas

Antes de qualquer funcionalidade, processo ou compromisso:

1. Isso resolve um problema real que existe **hoje**?  
2. Continua sendo útil quando a empresa **crescer**?

Se **não** para qualquer uma → não existe.

## Boas práticas

- Repetir a regra das duas perguntas em toda reunião de produto.
- Preferir registrar no sistema em até 24h após conversa relevante.

## O que sempre deve ser feito

- Tratar o sistema como fonte de verdade.
- Projetar para o fundador de hoje e a equipe de amanhã.

## O que nunca deve ser feito

- Integrar WhatsApp como CRM.
- Adicionar funcionalidade "porque pode ser útil um dia".

## Exemplos práticos

| Ideia | Pergunta 1 | Pergunta 2 | Veredito |
|-------|------------|------------|----------|
| Alerta proposta 7 dias | Sim | Sim | Entra |
| Lead scoring por IA | Não hoje | Talvez | Fora do MVP |
| Inbox de ações | Sim | Sim | Crítico |

---

# Capítulo 6 — Princípios do Produto

## Objetivo

Definir o que o produto Norax (Agency OS) é e como deve se comportar como produto.

## Princípios

- Não é CRM. É **Sistema Operacional da Agência**.
- Cliente é âncora; Comercial vende; Projetos entrega.
- Evento antes de estado; CORE é constituição comportamental.

## Princípios oficiais

| # | Princípio |
|---|-----------|
| P1 | O produto cobre o fluxo completo: primeiro contato → pós-venda |
| P2 | Um cliente, um workspace; tudo referencia o cliente |
| P3 | Comercial termina quando o projeto começa — handoff sem perda |
| P4 | Status é consequência de eventos, nunca edição manual arbitrária |
| P5 | Timeline é imutável e completa |
| P6 | Ações (inbox) só quando humano precisa agir |
| P7 | Gates comerciais e de projeto são invioláveis |
| P8 | Uma fonte de verdade por dado; referência, não duplicação |
| P9 | MVP disciplinado; futuro preparado, não implementado prematuramente |
| P10 | Admin, Portal e Reuniões são produtos separados com mesma alma |

## Boas práticas

- Novo módulo = novo documento oficial antes de implementar.
- Handoff sempre por pacote de referências (cliente, negociação, contrato, escopo).

## O que sempre deve ser feito

- Validar features contra CORE e Fluxo Operacional.
- Manter próximo passo visível em toda entidade ativa.

## O que nunca deve ser feito

- Criar módulo que duplica outro (ex: leads separados de clientes).
- Permitir desenvolvimento antes de contrato assinado (Gate G-01).

## Exemplos práticos

| Cenário | Princípio |
|---------|-----------|
| Pagamento recebido | E-22 destrava E-24 projeto.criado — P7 |
| Editar status do projeto no dropdown | Viola P4 — usar eventos |
| Valor na proposta e no financeiro | Contrato é fonte; financeiro referencia — P8 |

---

# Capítulo 7 — Princípios de UX

## Objetivo

Garantir que usar a Norax seja rápido, claro e sem carga cognitiva desnecessária.

## Princípios

- Inspirar-se em Linear (densidade, foco), Stripe (confiança, clareza), Notion (contexto) — sem copiar features irrelevantes.
- O usuário nunca pergunta "o que faço agora?".

## Princípios oficiais

| # | Princípio |
|---|-----------|
| U1 | **Um próximo passo** por contexto — nunca três competindo |
| U2 | **Deep links** — Dashboard e Ações abrem o lugar certo, não listas genéricas |
| U3 | **Progressive disclosure** — seções aparecem quando há conteúdo |
| U4 | **Criar rápido, enriquecer depois** — cadastro mínimo, detalhes ao longo do tempo |
| U5 | **Encontrar em < 10 segundos** — busca e filtros sempre acessíveis |
| U6 | **Projeto nunca parado sem motivo** — bloqueio visível (cliente ou interno) |
| U7 | **Orçamento de cliques** — tarefas frequentes em ≤ 3 cliques |
| U8 | **Feedback imediato** — toda ação confirma o que aconteceu |
| U9 | **Erro explica e orienta** — não mensagem genérica |
| U10 | **Consistência entre módulos** — mesma anatomia de página |

## Boas práticas

- Testar fluxos com cronômetro: criar cliente, enviar proposta, handoff.
- Remover widget que ninguém clica em 30 dias de uso.

## O que sempre deve ser feito

- Mostrar pendências do cliente vs pendências internas separadamente.
- Priorizar lista densa sobre cards espaçosos para operação diária.

## O que nunca deve ser feito

- Dashboard com 12 widgets iguais em importância.
- Abas vazias "para o futuro".
- Onboarding de 15 telas antes de usar.

## Exemplos práticos

| Tela | UX correta |
|------|------------|
| Negociação | Banner: "Registrar resposta ou follow-up" |
| Projeto | Bloqueio: "Aguardando textos do cliente" |
| Dashboard | 3 prioridades, não 15 métricas |

---

# Capítulo 8 — Princípios de Interface

## Objetivo

Definir a identidade visual e comportamental da interface — premium, minimalista, durável.

## Princípios

- Dark mode único. Cor é informação, não decoração.
- Silêncio visual; voz nos momentos certos.

## Princípios oficiais

| # | Princípio |
|---|-----------|
| I1 | **Tema escuro exclusivo** — preto, branco, cinza como base |
| I2 | **Cor semântica apenas** — verde concluído, amarelo atenção, vermelho problema, azul informação |
| I3 | **Tipografia legível** — corpo 14px, hierarquia clara |
| I4 | **Densidade alta** — mais informação por tela, menos scroll vazio |
| I5 | **Bordas sutis** — sombras raras |
| I6 | **Animações suaves e curtas** — 150–300ms, nunca decorativas |
| I7 | **Ícones consistentes** — um sistema, um peso |
| I8 | **Estados vazios úteis** — orientam ação, não apenas "nada aqui" |
| I9 | **Acessibilidade mínima** — contraste, foco visível, alvos clicáveis |
| I10 | **Mesma qualidade no Portal** — cliente sente o mesmo premium |

## Boas práticas

- Design tokens centralizados; nunca cor hardcoded por tela.
- Revisar toda cor nova: "isso é informação ou decoração?"

## O que sempre deve ser feito

- Manter interface quieta; destacar só o urgente.
- Usar badges de status discretos.

## O que nunca deve ser feito

- Gradientes coloridos, ilustrações stock, light mode.
- Botões competindo visualmente sem hierarquia.
- Ícones sem label em ação crítica.

## Exemplos práticos

| Elemento | Correto | Incorreto |
|----------|---------|-----------|
| Status atrasado | Vermelho sutil + texto | Modal vermelho gigante |
| Concluído | Verde discreto | Confete animado |
| Background | #090909 | Azul escuro com pattern |

---

# Capítulo 9 — Princípios de Desenvolvimento

## Objetivo

Orientar como construímos software na Norax — sem prescrever ferramentas, focando em disciplina.

## Princípios

- Código serve ao CORE e aos módulos documentados.
- Menor diff que resolve o problema.
- Dogfood obrigatório.

## Princípios oficiais

| # | Princípio |
|---|-----------|
| D1 | **Documentação antes de código** para novos domínios |
| D2 | **CORE primeiro** — toda transição de estado passa por evento |
| D3 | **Testar gates** — G-01 a G-06 têm testes de comportamento |
| D4 | **Idempotência** em eventos e webhooks |
| D5 | **Convenções do monorepo** — apps e pacotes com fronteiras claras |
| D6 | **MVP cortado** — feature flag para o que é [FUTURO] |
| D7 | **Sem lógica de negócio na interface** — UI dispara ações, CORE decide |
| D8 | **Logs sem dados sensíveis** em texto claro |
| D9 | **Revisão obrigatória** contra checklist de conformidade do módulo |
| D10 | **Medir o que importa** — tempo para próxima ação, não vanity metrics |

## Boas práticas

- Pull request responde: qual evento CORE? Qual módulo? Passa nas duas perguntas?
- Implementar alertas temporais do CORE antes de features visuais novas.

## O que sempre deve ser feito

- Rejeitar status manual na API.
- Manter separação Admin / Portal em autenticação e deploy.

## O que nunca deve ser feito

- Atalho que contorna gate "temporariamente".
- Duplicar entidade cliente em módulo comercial.
- Commitar sem evento CORE para mudança de estado.

## Exemplos práticos

| Pedido | Resposta |
|--------|----------|
| "Só um dropdown de status" | Não — viola D7 e Lei 2 do CORE |
| "Integrar WhatsApp" | Não — Lei 9 |
| "Alerta hospedagem 30 dias" | Sim — CORE E-40, prioridade MVP |

---

# Capítulo 10 — Princípios de Arquitetura

## Objetivo

Definir como o sistema se organiza estruturalmente para crescer sem reescrita.

## Princípios

- Monólito modular antes de distribuído.
- Três experiências de usuário, um cérebro (CORE).
- Bounded contexts por domínio de negócio.

## Princípios oficiais

| # | Princípio |
|---|-----------|
| A1 | **Cliente como raiz de dados** comercial e operacional |
| A2 | **Event-driven interno** — domain events alimentam timeline, ações, workers |
| A3 | **Módulos com fronteira clara** — Clientes, Comercial, Projetos, Financeiro, etc. |
| A4 | **Referência sobre cópia** entre módulos |
| A5 | **Workers para tempo** — alertas, expirações, lembretes assíncronos |
| A6 | **Três aplicações** — Admin (equipe), Portal (cliente), Meet (reunião) |
| A7 | **Segurança em camadas** — auth, autorização, auditoria, backup |
| A8 | **Escalar leitura antes de escalar escrita** — listas paginadas, busca dedicada quando doer |
| A9 | **Extensão por eventos novos**, não por forks de lógica |
| A10 | **Preparado para multi-tenant, implementado single-tenant** até Fase 6 |

## Boas práticas

- ADR (Architecture Decision Record) para decisões irreversíveis.
- Novo integrador externo = adapter, não lógica espalhada.

## O que sempre deve ser feito

- Validar handoff Comercial → Projetos como contrato de integração.
- Versionar schema de eventos ao evoluir CORE.

## O que nunca deve ser feito

- Microserviços no MVP.
- Banco como única integração entre módulos sem eventos.
- Portal compartilhar sessão com Admin.

## Exemplos práticos

| Decisão | Alinhamento |
|---------|-------------|
| Um banco relacional único | A3, A4 — integridade referencial |
| Fila para lembretes | A5 — proposta expirada, materiais 7d |
| Snapshot escopo no projeto | A4 — read-only, comercial é fonte histórica |

---

# Capítulo 11 — Como tomamos decisões

## Objetivo

Estabelecer um processo de decisão repetível, rápido e alinhado à constituição.

## Princípios

- Decisões reversíveis: rápidas. Irreversíveis: com mais calma.
- Bible > opinião > urgência.
- Discordância resolvida por princípio, não por hierarquia cega.

## Processo oficial

```
1. Identificar o problema real (não sintoma)
2. Aplicar a regra das duas perguntas
3. Consultar: Bible → CORE → Fluxo → Módulo afetado
4. Verificar conflito com gates ou leis do CORE
5. Decidir e registrar (Timeline, ADR ou nota de decisão)
6. Revisar após uso real se decisão foi estrutural
```

### Matriz de autoridade (hoje e futuro)

| Tipo de decisão | Quem decide (hoje) | Quem decide (com equipe) |
|-----------------|-------------------|--------------------------|
| Valores, missão | Fundador | Fundadores |
| Novo módulo | Fundador + Bible | Produto + Fundador |
| Feature dentro de módulo | Fundador + CORE | PM + Tech lead |
| Escopo com cliente | Fundador + contrato | PM + Comercial |
| Arquitetura irreversível | Fundador + ADR | Arquiteto + ADR |
| Visual / Design System | Fundador + princípios I | Design + Fundador |

## Boas práticas

- Decisão documentada em uma frase: *"Decidimos X porque Y, alinhado a princípio Z."*
- Revisitar decisões após 90 dias de uso.

## O que sempre deve ser feito

- Dizer "não" quando viola valores ou leis do CORE.
- Preferir decisão pequena e reversível.

## O que nunca deve ser feito

- Decidir feature por moda ou concorrente sem problema real.
- Implementar antes de documentar quando afeta CORE ou fluxo.

## Exemplos práticos

| Proposta | Processo | Decisão |
|----------|----------|---------|
| Kanban comercial 8 colunas | Viola simplicidade | Não — lista + filtros |
| Aditivo de escopo | Consultar módulo Projetos [futuro] | Sim — documentar evento |
| Pular contrato "só dessa vez" | Gate G-01 | Nunca |

---

# Capítulo 12 — Como criamos novas funcionalidades

## Objetivo

Definir o ciclo de vida de uma funcionalidade — da ideia ao uso real — sem scope creep.

## Princípios

- Funcionalidade nasce de problema, não de solução.
- CORE antes de UI.
- Se não gera evento nem resolve inbox, questionar.

## Ciclo oficial

```
IDEIA
  → Regra das duas perguntas
  → Especificação (módulo ou adendo ao CORE)
  → Evento CORE definido (se aplicável)
  → Critérios de aceite
  → Implementação (Fase 5+)
  → Dogfood
  → Ajuste ou remoção
```

### Checklist obrigatório (12 perguntas)

1. Qual problema real resolve hoje?  
2. Qual evento CORE dispara?  
3. Gera Timeline?  
4. Gera Ação?  
5. Qual módulo é dono do dado?  
6. Duplica informação de outro módulo?  
7. Respeita gates?  
8. Funciona para 1 usuário?  
9. Funciona para 10 usuários sem reescrever?  
10. Passa no teste anti-CRM?  
11. Está no MVP ou [FUTURO]?  
12. Documento oficial atualizado?

## Boas práticas

- Matar features que ninguém usa após 60 dias.
- Preferir melhorar fluxo existente a criar módulo novo.

## O que sempre deve ser feito

- Atualizar CORE antes de codificar mudança de comportamento.
- Definir critério "pronto" mensurável.

## O que nunca deve ser feito

- Feature solicitada por um cliente que só ele precisa — vira aditivo custom, não produto.
- "Enquanto estamos aqui" sem checklist.

## Exemplos práticos

| Ideia | Checklist | Veredito |
|-------|-----------|----------|
| Inbox universal | 12/12 sim | MVP crítico |
| Automação email marketing | Falha anti-CRM | Fora |
| Bloqueio visível no projeto | Evento E-56 | MVP Projetos |

---

# Capítulo 13 — Como tratamos nossos clientes

## Objetivo

Definir a experiência e os limites do relacionamento com clientes da Norax.

## Princípios

- Profissionalismo premium, não subserviência.
- Clareza supera simpatia vazia.
- Cliente nunca vê caos interno.

## Princípios oficiais

| # | Princípio |
|---|-----------|
| C1 | **Resposta em até 24h** no primeiro contato (ideal: mesmo dia) |
| C2 | **Proposta com escopo e exclusões** — nunca orçamento vago |
| C3 | **Prazo condicionado a materiais** — registrado no contrato |
| C4 | **Atualização proativa** a cada 7–10 dias em projeto ativo |
| C5 | **Revisões limitadas** no contrato — gentil e firme |
| C6 | **Aprovação por escrito** antes de entrega final |
| C7 | **Garantia 30 dias para bugs**, não para features novas |
| C8 | **Hospedagem 1 ano inclusa** com aviso 30 dias antes |
| C9 | **Transferência limpa** — nunca reter domínio ou arquivos |
| C10 | **Portal no futuro** — mesma clareza do atendimento humano |

## Boas práticas

- Registrar toda decisão importante após conversa no WhatsApp.
- Usar templates de mensagem (kickoff, entrega, encerramento).

## O que sempre deve ser feito

- Tratar cliente com respeito mesmo em negociação difícil.
- Entregar pacote de entrega completo, não só URL.

## O que nunca deve ser feito

- Prometer sem registrar.
- Aceitar revisão infinita por medo de conflito.
- Desligar site sem avisos documentados.

## Exemplos práticos

| Pedido do cliente | Resposta Norax |
|-------------------|-----------------|
| "Mais uma revisão" (3ª) | Educar sobre contrato; oferecer aditivo |
| "Pode começar sem pagar?" | Não — Gate G-02 |
| "Quero o domínio de volta" | Transferência em 7 dias úteis |

---

# Capítulo 14 — Como organizamos projetos

## Objetivo

Codificar na constituição como projetos são executados — do handoff ao encerramento.

## Princípios

- Comercial vendeu; Projetos entrega.
- Escopo vendido é sagrado; mudança = aditivo.
- Projeto nunca parado sem bloqueio identificado.

## Fluxo constitucional (resumo)

```
Handoff (E-24)
  → Kickoff (E-25)
  → Materiais (E-26/27) [G-03]
  → Desenvolvimento (checklist)
  → Revisão interna (E-30)
  → Apresentação (E-31)
  → Ajustes (E-32/33) — máx. 2 rodadas
  → Aprovação (E-34) [G-04]
  → Pagamento final se aplicável [G-05]
  → Entrega (E-35) [G-06]
  → Garantia 30 dias (E-36)
  → Encerramento (E-46)
```

## Gates invioláveis

| Gate | Regra |
|------|-------|
| G-01 | Sem contrato assinado, sem projeto |
| G-02 | Sem pagamento inicial, sem kickoff |
| G-03 | Sem materiais, sem contagem de prazo |
| G-04 | Sem aprovação escrita, sem entrega |
| G-05 | Sem pagamento final (se 50/50), sem entrega |
| G-06 | Registrar hospedagem no dia da entrega |

## Boas práticas

- Workspace legível em 3 minutos por novo colaborador.
- Checklist por tipo: site, landing, sistema (gerado do escopo).

## O que sempre deve ser feito

- Classificar feedback: bug, ajuste no escopo, fora do escopo.
- Upload de materiais do cliente no sistema.

## O que nunca deve ser feito

- Implementar fora do escopo sem aditivo.
- Entregar sem pacote (URL, acessos, documentação básica).

## Exemplos práticos

| Situação | Ação |
|----------|------|
| Cliente atrasa materiais 10 dias | Bloqueio cliente; prazo suspenso |
| Bug em formulário na garantia | Corrigir sem cobrar |
| "Quero uma loja online" no meio do site institucional | Aditivo |

---

# Capítulo 15 — Como documentamos tudo

## Objetivo

Garantir que conhecimento da Norax sobreviva a pessoas, pressa e crescimento.

## Princípios

- Se não está documentado, não é oficial.
- Documentos têm dono e versão.
- Hierarquia clara evita contradição.

## Hierarquia documental oficial

```
NORAX BIBLE ..................... Constituição (este documento)
    │
    ├── NORAX ROADMAP ........... Evolução da empresa
    ├── NORAX-FLUXO-OPERACIONAL . Processos humanos
    ├── NORAX-CORE .............. Comportamento do sistema
    └── NORAX-MODULO-*.md ....... Especificações de domínio
```

## Tipos de documento

| Tipo | Quando criar | Exemplo |
|------|--------------|---------|
| Constitucional | Princípio permanente | Bible |
| Processual | Fluxo humano | P-01 a P-22 |
| Comportamental | Automação | CORE eventos |
| Especificação | Módulo ou feature | Módulo Comercial |
| Decisão (ADR) | Escolha irreversível | Monólito modular |
| Operacional | Template de mensagem | Kickoff cliente |

## Boas práticas

- Atualizar versão e data em mudanças estruturais.
- Índice mestre ligando todos os documentos [pendente].
- Novo colaborador lê: Bible → Roadmap → CORE → módulo do seu domínio.

## O que sempre deve ser feito

- Documentar antes de implementar domínio novo.
- Registrar motivo em decisões de perda de negócio e mudança de escopo.

## O que nunca deve ser feito

- Conhecimento só na cabeça do fundador.
- Documento contradizendo Bible sem emendar a Bible primeiro.
- Wiki livre sem estrutura.

## Exemplos práticos

| Situação | Documento |
|----------|-----------|
| Nova regra de pagamento | CORE + Módulo Financeiro |
| Novo tipo de serviço | Módulo Projetos checklist + Roadmap |
| "Sempre fizemos assim" informal | Fluxo Operacional ou não é oficial |

---

# Capítulo 16 — Como a Norax deve evoluir

## Objetivo

Amarrar a constituição ao Roadmap — crescimento ordenado, sem pular degraus.

## Princípios

- Visão longa, passos curtos.
- Dogfood antes de escala.
- Interno antes de externo (SaaS).

## Fases oficiais (resumo)

| Fase | Foco | Status |
|------|------|--------|
| 0 Visão | Por quê | Concluída |
| 1 Fundação | Processo + CORE | ~95% |
| 2 Operação | Módulos especificados | Em andamento |
| 3 Experiência | UX + Design System | Parcial |
| 4 Engenharia | Arquitetura | Parcial |
| 5 MVP | Sistema em uso real | Próximo marco crítico |
| 6 Escala | Equipe, portal, internacional | Após 3–6 meses de MVP |

## Regras de evolução

1. **Não pular fases** — especialmente MVP antes de escala.  
2. **Revisão trimestral** do Roadmap e desta Bible.  
3. **Emendar Bible** apenas com consenso de fundadores e documentação de mudança.  
4. **CORE versionado** — v1.0, v1.1; nunca mudança silenciosa.  
5. **Métricas de saúde** antes de contratar: adoção do sistema, projetos no sistema, zero gates violados.

## Boas práticas

- Celebrar marcos: primeiro projeto end-to-end no sistema, primeiro cliente no portal.
- Matar iniciativas que não serviram após honest review.

## O que sempre deve ser feito

- Crescer receita e organização juntas.
- Adicionar pessoa quando processo suporta, não antes.

## O que nunca deve ser feito

- Lançar SaaS internacional antes de PMF interno.
- Contratar para compensar falta de processo.

## Exemplos práticos

| Impulso | Resposta constitucional |
|---------|-------------------------|
| "Vamos fazer app mobile" | Roadmap Fase 6+; Portal PWA antes |
| "Precisamos de 5 devs agora" | Processo primeiro; MVP em uso |
| "Cliente grande quer customização total" | Aditivo; não mudar produto core |

---

# Manifesto da Norax

*Nós somos a Norax.*

*Construímos sites, landing pages e sistemas web. Mas sabemos que entregar código excelente não basta — uma agência desorganizada trai o trabalho que promete.*

*Acreditamos que organização não é burocracia. É respeito. Respeito pelo tempo do cliente, pelo tempo de quem trabalha conosco e pelo tempo de quem vem depois.*

*O WhatsApp é para conversar. A memória é para viver. **O sistema é para trabalhar.***

*Não construímos um CRM. Construímos o sistema operacional da nossa agência — e talvez, um dia, da sua.*

*Cada informação tem um lugar. Cada ação gera histórico. Cada projeto tem um próximo passo claro.*

*Quando um cliente nos procura, respondemos. Quando qualificamos, registramos. Quando propomos, documentamos o que está — e o que não está — incluído. Quando assinamos, cumprimos. Quando entregamos, não sumimos. Quando a hospedagem vence, avisamos com antecedência.*

*Não prometemos perfeição no primeiro dia. Prometemos **clareza**, **honestidade** e **melhoria contínua**.*

*Somos minimalistas na interface e rigorosos no processo. Usamos cor quando há significado. Silêncio visual quando há foco.*

*Medimos sucesso não por quantas funcionalidades temos, mas por quantas vezes ninguém precisou perguntar: **"O que eu faço agora?"***

*Começamos pequenos — um fundador, um sistema, um cliente de cada vez. Pensamos grande — uma referência em como agências digitais devem operar.*

*Esta Bible é nossa constituição. O CORE é nosso cérebro. O fluxo é nosso caminho. O resto é execução.*

*Organização acima de tudo.*

*— Norax*

---

## Apêndice — Referência rápida

### Leis do CORE (resumo)

1. Cliente é âncora  
2. Evento antes de estado  
3. Timeline sagrada  
4. Ação só quando necessário  
5. Gate bloqueia  
6. Uma fonte de verdade  
7. Idempotência  
8. Simplicidade MVP  
9. WhatsApp não é histórico  
10. Extensibilidade sem ruptura  

### Gates

G-01 Contrato · G-02 Pagamento inicial · G-03 Materiais · G-04 Aprovação · G-05 Pagamento final · G-06 Hospedagem  

### Regra das duas perguntas

1. Resolve problema real hoje?  
2. Útil quando crescer?  

### Documentos oficiais

`NORAX-BIBLE.md` · `NORAX-ROADMAP.md` · `NORAX-FLUXO-OPERACIONAL.md` · `NORAX-CORE.md` · `NORAX-MODULO-*.md`

---

*Constituição Oficial da Norax · Bible v1.0 · Julho 2026*  
*Em caso de emenda: incrementar versão e registrar mudança neste apêndice.*

