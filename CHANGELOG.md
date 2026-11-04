# Registo de alterações

Este ficheiro resume alterações relevantes para utilizadores e colaboradores. As entradas em «Por lançar» descrevem trabalho ainda não incluído numa versão publicada; as secções de versões registam entregas publicadas. Consulta [CONTRIBUTING.md](CONTRIBUTING.md#registo-de-alterações) para o processo de atualização.

## Por lançar

### Corrigido

- O aviso de intervenção sem OS associada identifica o motivo e a OS fictícia necessária durante o desenvolvimento.
- O exemplo de OS cancelada identifica o cancelamento da ordem, sem o confundir com o de uma intervenção.

### Adicionado

- Exemplos JSON provisórios de intervenções associadas a ordens de serviço, incluindo várias intervenções, cancelamento e pendência de material.
- Carregamento e gestão de intervenções fictícias no Debug Menu, com validação da OS associada e prevenção de duplicados.
- Secções separadas para OS e intervenções no Debug Menu e logs para as operações mock de intervenções.
- Logs formatados dos exemplos fictícios adicionados em desenvolvimento e dos campos permitidos nos corpos HTTP.
- Logs técnicos legíveis na consola para a seleção de origem e as operações mock de ordens de serviço, com instrumentação preparada para futuros pedidos HTTP.

- Configuração reativa da origem de dados e menu de desenvolvimento para a selecionar temporariamente, com flag independente.
- Os exemplos mock de OS já presentes deixam de ser adicionados novamente e as notificações do menu substituem a anterior e desaparecem automaticamente.
- Serviço mock provisório em memória para ordens de serviço, com exemplos JSON por funcionalidade e controlos no Debug Menu para cenários, adição, limpeza e reposição de dados fictícios.
- Notificações para os resultados relevantes dos controlos mock e correção do fecho em cascata de diálogos sobrepostos.
- Orientações comuns para organizar e validar mocks e dados fictícios, com referências para colaboradores e agentes.
- Registo de alterações e orientações para o manter durante as tarefas e a preparação de versões.

## 0.1.0 — 2026-11-03

Primeira entrega da base de componentes web. A aplicação ainda não inclui funcionalidades de negócio completas.

### Adicionado

- Biblioteca com 53 famílias de componentes React para formulários, navegação, dados, ficheiros, diálogos e notificações, com opções de composição e personalização por tokens CSS.
- Guia do catálogo, fichas individuais de utilização e comparação com os componentes mobile.
- Documentação de arquitetura, qualidade e colaboração, incluindo orientações para agentes de IA.

### Limitações conhecidas

- A validação em navegadores reais, incluindo acessibilidade, foco e responsividade, não está completa.
- Não existe ainda um provider global de tema; alguns recursos SVG têm cores fixas e podem exigir substituição para outros temas.

Consulta a [release v0.1.0](https://github.com/ESTCBfrontend/dssi_web/releases/tag/v0.1.0) para os detalhes da entrega.
