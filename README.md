# DSSI Web

Aplicação web do projeto DSSI, construída com React, TypeScript e Vite.

## Começar

É necessário Node.js 24 e npm. Depois de clonar o repositório:

```bash
npm ci
npm run dev
```

Abre no navegador o endereço indicado pelo Vite. No PowerShell, se a política de execução impedir o comando `npm`, usa `npm.cmd` nos mesmos comandos.

## Origem de dados em preparação

A configuração `VITE_DATA_SOURCE` aceita `api` ou `mock` e usa `api` por defeito. Valores inválidos são rejeitados ao iniciar a aplicação. A origem configurada é independente das ferramentas de desenvolvimento.

A composição da aplicação disponibiliza a origem aos componentes React. A flag `ENABLE_DEBUG_LAYER` em [debugConfig.ts](src/app/debug/debugConfig.ts) controla o menu: altera-a para `true` para o apresentar ou `false` para o ocultar durante o desenvolvimento. Está atualmente ativa. Inicia a aplicação com `npm run dev` (ou `npm.cmd run dev` no PowerShell) e atualiza a página depois de mudar a flag.

A flag existe para permitir que colaboradores testem diferentes origens e cenários fictícios. Uma build de produção exclui o menu mesmo quando a flag está ativa; assim, estas ferramentas ficam limitadas ao desenvolvimento. A visibilidade do menu não determina a origem inicial dos dados. O suporte a builds internas preparadas para debug ainda não está implementado.

O botão no topo abre o menu; «Origem de dados» permite alterar a origem temporariamente. Com Mock selecionado, «Mocks» abre um diálogo para escolher um cenário, adicionar um ou todos os exemplos de ordens de serviço, remover todas ou repor os dados iniciais do cenário. Os exemplos já presentes, identificados pelo ID do JSON, não são adicionados novamente. As ações relevantes apresentam notificações temporárias de sucesso ou erro; estas são feedback de interface, não substituem o sistema de logs. Um clique fora do diálogo regressa ao nível anterior. Mudar de cenário também repõe os dados fictícios. A seleção regressa à configuração inicial ao recarregar. O serviço mock provisório está ligado à composição, mas ainda não existem ecrãs de ordens de serviço. O serviço API ainda não foi implementado e a sua seleção não recorre a dados mock. A [arquitetura](docs/architecture.md#origem-de-dados-e-ferramentas-de-desenvolvimento) explica a organização dos mocks e as limitações atuais. Não coloques credenciais em variáveis `VITE_*`: os seus valores são disponibilizados ao código do navegador.

## Verificações

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

As 53 famílias implementadas em `src/shared/ui` estão organizadas por grupo no [índice do catálogo](docs/COMPONENTS_WEB_REACT.md#9-catálogo-de-implementação--53-famílias-do-figma), com ligações para as fichas individuais. A aplicação ainda não inclui funcionalidades de negócio.
