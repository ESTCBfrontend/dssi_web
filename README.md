# DSSI Web

Aplicação web do projeto DSSI, construída com React, TypeScript e Vite.

## Começar

É necessário Node.js 24 e npm. Depois de clonar o repositório:

```bash
npm ci
npm run dev
```

Abre no navegador o endereço indicado pelo Vite. No PowerShell, se a política de execução impedir o comando `npm`, usa `npm.cmd` nos mesmos comandos.

As rotas Web permitem consultar, criar e acompanhar ordens de serviço. Com a origem API, a criação e a atribuição são enviadas ao backend; a edição, o histórico e as intervenções ainda não estão disponíveis nessa origem. Com Mock, a criação, edição, atribuição, intervenções e histórico funcionam em memória e perdem-se ao recarregar. Para publicação, o servidor terá de encaminhar os endereços da aplicação para `index.html`; o alojamento ainda não foi configurado.

## Origem de dados

A configuração `VITE_DATA_SOURCE` aceita `api` ou `mock` e usa `api` por defeito. Valores inválidos são rejeitados ao iniciar a aplicação. A origem configurada é independente das ferramentas de desenvolvimento.

A composição da aplicação disponibiliza a origem aos componentes React. A flag `ENABLE_DEBUG_LAYER` em [debugConfig.ts](src/app/debug/debugConfig.ts) controla o menu: altera-a para `true` para o apresentar ou `false` para o ocultar durante o desenvolvimento. Está atualmente ativa. Inicia a aplicação com `npm run dev` (ou `npm.cmd run dev` no PowerShell) e atualiza a página depois de mudar a flag.

A flag existe para permitir que colaboradores testem diferentes origens e cenários fictícios. Uma build de produção exclui o menu mesmo quando a flag está ativa; assim, estas ferramentas ficam limitadas ao desenvolvimento. A visibilidade do menu não determina a origem inicial dos dados. O suporte a builds internas preparadas para debug ainda não está implementado.

O botão no topo abre o menu; «Origem de dados» permite alterar a origem temporariamente. Com Mock selecionado, «Mocks» abre um diálogo para escolher um cenário, adicionar um ou todos os exemplos de ordens de serviço, remover todas ou repor os dados iniciais do cenário. Os exemplos já presentes, identificados pelo ID do JSON, não são adicionados novamente. As ações relevantes apresentam notificações temporárias de sucesso ou erro; estas são feedback de interface, não substituem o sistema de logs. Um clique fora do diálogo regressa ao nível anterior. Mudar de cenário também repõe os dados fictícios. A seleção regressa à configuração inicial ao recarregar. A listagem acompanha as alterações ao serviço mock provisório. Com API selecionada, inicia sessão com um utilizador do backend; o token fica apenas em memória e é descartado ao recarregar ou terminar sessão. O endereço predefinido aponta para o ambiente de testes do backend; `VITE_API_URL` permite definir outra base URL terminada em `/api/v1`. A origem da página deve estar autorizada no CORS do backend (o ambiente de testes aceita `http://localhost:5173`). Os dados desse ambiente são fictícios e partilhados pela equipa. A listagem carrega todas as páginas da API e filtra localmente. A [arquitetura](docs/architecture.md#origem-de-dados-e-ferramentas-de-desenvolvimento) explica a organização dos mocks e as limitações atuais. Não coloques credenciais em variáveis `VITE_*`: os seus valores são disponibilizados ao código do navegador.

Em «Mocks», escolhe «Ordens de serviço» ou «Intervenções» para aceder às ações de cada tipo. Nas intervenções, é possível adicionar exemplos individualmente ou todos de uma vez e removê-los. Cada exemplo exige que a OS associada exista e não é adicionado novamente se já estiver presente. O detalhe de uma OS apresenta apenas as intervenções associadas que foram adicionadas. Limpar ou repor as OS, ou mudar o cenário, limpa as intervenções locais.

Para experimentar a análise de intervenções, adiciona os exemplos de ordens e depois os de intervenções no menu de mocks. Abre a OS-EXEMPLO-004 e seleciona «Analisar intervenção». Podes validar ou pedir uma correção, indicando o motivo. A decisão é local e perde-se ao recarregar. Para esta simulação provisória, intervenções concluídas ou pendentes podem ser analisadas uma vez; as canceladas não podem. Estas regras e o modelo de análise ainda carecem de alinhamento com o PO e o Backend. A análise não modifica os dados originais nem o estado da ordem; não existe integração ou histórico real.

O detalhe apresenta um histórico fictício das ações bem-sucedidas nesta sessão: criação e edição da ordem, atribuição e análise de intervenções. Para experimentar, cria ou edita uma ordem ou analisa uma intervenção e consulta «Histórico de atividade» no detalhe. Os exemplos existentes começam sem acontecimentos e não se inventam autores. Limpar ou repor as ordens elimina o histórico; limpar intervenções elimina os respetivos eventos. Mudar de cenário ou recarregar também descarta estes dados. É uma simulação em memória, não uma auditoria, e o contrato real carece de alinhamento com a equipa.

## Verificações

Os eventos técnicos da seleção de origem e dos mocks de OS e intervenções aparecem na consola das ferramentas de desenvolvimento do navegador. Ao adicionar exemplos JSON fictícios, o seu conteúdo formatado aparece em desenvolvimento; dados introduzidos pelo utilizador não são registados. Em desenvolvimento são apresentados eventos informativos, avisos e erros; em produção apenas avisos e erros, sem corpos JSON. Os logs são independentes do Debug Menu e não são enviados para um serviço externo. A instrumentação HTTP acompanha os pedidos à API sem registar credenciais ou tokens; a [arquitetura](docs/architecture.md#origem-de-dados-e-ferramentas-de-desenvolvimento) descreve os dados filtrados e as limitações.

```bash
npm run lint
npm run typecheck
npm run test:ci
npm run build
```

O GitHub Actions executa estas verificações nos Pull Requests para `develop` e `main` e após alterações nessas branches. Os testes interativos podem ser iniciados com `npm test`.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para o processo da equipa e [AGENTS.md](AGENTS.md) para orientações destinadas a agentes de IA.

Os princípios de qualidade e a direção de organização do código estão em [docs/architecture.md](docs/architecture.md). Decisões duradouras novas seguem o processo de proposta e aprovação descrito em AGENTS.md.

As alterações relevantes por entregar e por versão estão em [CHANGELOG.md](CHANGELOG.md).

## Componentes da interface

O [guia de componentes React Web](docs/COMPONENTS_WEB_REACT.md) reúne o catálogo `MDS/*` do Figma, comportamento esperado, propostas de props, variantes, composição, exemplos de utilização e critérios de validação. Consulta-o ao criar, alterar ou reutilizar componentes, com ou sem assistência de IA. As fichas individuais descrevem as APIs implementadas e as respetivas limitações.

Os padrões de movimento e tokens para a interface Web estão em [docs/animations.md](docs/animations.md).

As 53 famílias implementadas em `src/shared/ui` estão organizadas por grupo no [índice do catálogo](docs/COMPONENTS_WEB_REACT.md#9-catálogo-de-implementação--53-famílias-do-figma), com ligações para as fichas individuais. A listagem de ordens pode usar a API ou dados mock.
