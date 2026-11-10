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

### Contas de teste no Debug Menu

Em desenvolvimento, com a origem API selecionada, «Contas de teste» permite iniciar sessão com um clique; o menu também permite terminar a sessão ativa. Para configurar as contas nesta máquina, cria `src/app/debug/accounts/backend.local.json` com este formato e preenche os valores localmente:

```json
{
  "apiUrl": "https://endereco-do-ambiente-de-testes/api/v1",
  "accounts": [
    { "label": "Gestão", "email": "EMAIL_DE_TESTE", "password": "PALAVRA_PASSE_DE_TESTE" }
  ]
}
```

O endereço tem de coincidir com a API configurada; reinicia o servidor de desenvolvimento depois de criar ou alterar o ficheiro. Podes acrescentar várias contas ao array. O ficheiro é ignorado pelo Git e a funcionalidade é excluída da build de produção. As credenciais ficam em texto simples na máquina e são disponibilizadas ao browser pelo servidor de desenvolvimento: usa apenas contas de teste e não exponhas esse servidor a redes não confiáveis. As contas documentadas pelo Backend estão na [página da API de testes](https://est2026.atlassian.net/wiki/spaces/SD/pages/4587521/AlarmeON+API+do+Backend+Sprint+1); os perfis têm permissões distintas.

Para experimentar a análise de intervenções, adiciona os exemplos de ordens e depois os de intervenções no menu de mocks. Abre a OS-EXEMPLO-004 e seleciona «Analisar intervenção». Podes validar ou pedir uma correção, indicando o motivo. A decisão é local e perde-se ao recarregar. Para esta simulação provisória, intervenções concluídas ou pendentes podem ser analisadas uma vez; as canceladas não podem. Estas regras e o modelo de análise ainda carecem de alinhamento com o PO e o Backend. A análise não modifica os dados originais nem o estado da ordem; não existe integração ou histórico real.

O detalhe apresenta um histórico fictício das ações bem-sucedidas nesta sessão: criação e edição da ordem, atribuição e análise de intervenções. Para experimentar, cria ou edita uma ordem ou analisa uma intervenção e consulta «Histórico de atividade» no detalhe. Os exemplos existentes começam sem acontecimentos e não se inventam autores. Limpar ou repor as ordens elimina o histórico; limpar intervenções elimina os respetivos eventos. Mudar de cenário ou recarregar também descarta estes dados. É uma simulação em memória, não uma auditoria, e o contrato real carece de alinhamento com a equipa.

## Verificações

Os eventos técnicos aparecem na consola das ferramentas de desenvolvimento do navegador. Os pedidos HTTP instrumentados apresentam, em desenvolvimento, método, rota, endereço, estado, duração e identificador comum, bem como corpos JSON até 16 KiB e o cabeçalho de autorização, quando disponíveis. Os tokens podem aparecer nos cabeçalhos e respostas; palavras-passe em campos JSON são ocultadas. Usa apenas contas e dados de teste e não partilhes estes logs. Os corpos não JSON são omitidos e a leitura de respostas é limitada. Em produção, os eventos informativos e os corpos não são apresentados. Os logs são independentes do Debug Menu e não são enviados para um serviço externo. Esta instrumentação de desenvolvimento é uma exceção à orientação de logging atualmente registada na [arquitetura](docs/architecture.md#origem-de-dados-e-ferramentas-de-desenvolvimento).

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
