# Arquitetura e qualidade

Este documento contém princípios aprovados para orientar o crescimento do projeto web. Deve ser lido em conjunto com [AGENTS.md](../AGENTS.md) e [CONTRIBUTING.md](../CONTRIBUTING.md).

## Estado atual e evolução

A aplicação é uma base React com Vite, com o ponto de entrada em `src/main.tsx` e o componente inicial em `src/App.tsx`. Em `src/features/work-orders` existem a listagem, o detalhe, a criação e a edição de ordens de serviço e um serviço mock provisório ligado à composição. Os ecrãs usam dados mock em memória; o adaptador da API ainda não está implementado.

Na apresentação de ordens de serviço, `pages/list`, `pages/detail`, `pages/create` e `pages/edit` agrupam os ecrãs com os respetivos recursos. O layout e os recursos partilhados ficam em `components` e `assets`; as formatações comuns ficam em `formatters`. Na criação mock, as opções de clientes e locais derivam dos exemplos de ordens, independentemente das ordens presentes no cenário; não representam um catálogo completo nem um contrato de Backend.

A direção acordada é organizar o código por funcionalidade e separar responsabilidades conforme a complexidade real. A estrutura abaixo é uma referência para as próximas funcionalidades; algumas pastas, como `shared/ui`, já existem. Não é necessário criar todas as camadas de uma vez.

```text
src/
  app/                    # Composição, configuração e ligação das dependências
  features/
    <funcionalidade>/
      domain/             # Conceitos e regras de negócio
      application/        # Operações e coordenação dos casos de uso
      infrastructure/     # Implementações de API, armazenamento e serviços externos
      presentation/       # Páginas, componentes e hooks
  shared/
    ui/                   # Elementos visuais realmente partilhados
    infrastructure/       # Mecanismos técnicos transversais
```

Uma funcionalidade pequena pode precisar apenas de parte desta estrutura. Acrescenta separações quando houver responsabilidades que as justifiquem; evita pastas vazias e camadas que apenas encaminham chamadas.

## Responsabilidades e dependências

- `domain` define comportamento e conceitos de negócio sem importar React, DOM, clientes HTTP, APIs do browser ou armazenamento.
- `application` coordena operações usando o domínio e contratos necessários, sem depender de componentes visuais ou detalhes concretos da infraestrutura.
- `infrastructure` implementa os contratos de integração e adapta os formatos externos às necessidades da aplicação.
- `presentation` trata da interface e interação. Encaminha regras de negócio e operações relevantes para módulos próprios, evitando espalhá-las pelas páginas.
- A composição da aplicação liga implementações concretas às operações e à apresentação, usando a solução mais simples que preserve os limites.
- Mantém pontos de entrada explícitos entre funcionalidades e evita dependências cíclicas ou acesso arbitrário a detalhes internos.
- `shared` deve conter responsabilidades identificáveis com utilização transversal demonstrada; não deve tornar-se um depósito genérico de utilitários.

Os contratos devem ficar junto de quem define a necessidade. Não é obrigatório criar uma interface para cada classe nem adicionar uma biblioteca de injeção de dependências.

## Origem de dados e ferramentas de desenvolvimento

O logging técnico é independente dos toasts e do Debug Menu. Os eventos identificam nível, área, operação e resultado; não incluem dados pessoais, credenciais nem erros externos completos. A configuração e o destino dependem do ambiente; a implementação inicial usa a consola local, sem serviço externo. O Mobile define a sua própria implementação.

Em desenvolvimento, o logging HTTP apresenta o método, endpoint, estado, duração, identificador de correlação e corpos de pedido e resposta filtrados; credenciais e dados sensíveis são omitidos. Em produção, regista apenas metadados e erros tratados, sem corpos. O logging é independente da interface e não substitui as ferramentas Network do navegador.

Em desenvolvimento, os serviços mock podem registar o JSON completo dos exemplos fictícios adicionados; os futuros dados reais de pedidos e respostas HTTP só podem mostrar campos explicitamente permitidos e filtrados. Em produção, não se registam corpos JSON. Os logs nunca incluem credenciais nem dados sensíveis.

Na Web, `src/shared/logging/logger.ts` apresenta os eventos atuais em linhas legíveis na consola: `info` é apresentado em desenvolvimento; `warn` e `error`, também em produção. Os pedidos HTTP podem produzir várias linhas com o mesmo identificador. A seleção de origem e as operações dos mocks de ordens de serviço e intervenções usam esta saída; falhas parciais incluem contagens. Ao adicionar exemplos dos ficheiros JSON, os serviços mostram o seu conteúdo formatado em desenvolvimento; exemplos existentes ou rejeitados e dados fornecidos pelo utilizador à criação não são registados. `mockExample` destina-se exclusivamente a exemplos fictícios provenientes dos ficheiros do projeto; futuras funcionalidades devem garantir essa origem, sem lhe passar dados reais ou introduzidos pelo utilizador. No cenário de latência, o início e o fim das operações assíncronas de OS têm um identificador comum e duração. Não existe recolha remota nem persistência. As mensagens de erro originais não são incluídas nos logs, pelo que a causa detalhada pode exigir investigação adicional.

`src/shared/http/loggedFetch.ts` prepara a instrumentação de futuros pedidos HTTP, mas ainda não está ligado a uma API. O consumidor fornece um modelo de rota sem IDs ou query strings; o endereço real e os cabeçalhos não são registados. Falhas HTTP distinguem respostas de erro do pedido e do servidor; exceções identificáveis como cancelamento ou tempo limite são distintas de outras falhas de rede ou pedido. A inspeção de JSON pode assinalar um corpo inválido sem modificar a resposta. Só são apresentados, em desenvolvimento, campos numéricos `total`, `count`, `page` e `pageSize` de corpos JSON; outros campos são omitidos. A resposta só é inspecionada quando declara JSON e tamanho até 16 KiB, com leitura limitada de uma cópia. Corpos desconhecidos, dados aninhados e respostas sem tamanho declarado podem não aparecer. A lista de campos exige revisão quando existirem contratos reais; pedidos que não passem por esta função não são instrumentados.

A origem de dados é configurada independentemente das ferramentas de desenvolvimento. A seleção em execução fica restrita a builds de desenvolvimento ou internas explicitamente preparadas; builds de produção não disponibilizam o Debug Menu. Os serviços de cada funcionalidade expõem o mesmo contrato à apresentação para as implementações mock e API, mantendo os dados fictícios isolados do backend real.

Em `src/app/data-source` está preparada a configuração inicial da origem e a sua disponibilização reativa ao React. O Debug Menu em `src/app/debug` permite selecionar a origem em execução quando a flag `ENABLE_DEBUG_LAYER`, definida em `debugConfig.ts`, está ativa no modo de desenvolvimento do Vite. Esta flag facilita os testes locais; o código do menu é excluído das builds de produção independentemente do seu valor. A composição em `src/app/work-orders` disponibiliza o serviço mock conforme a origem selecionada. O serviço API e o suporte a builds internas continuam por implementar; enquanto a API estiver selecionada, o serviço de ordens de serviço é explicitamente indicado como indisponível. Os contratos de negócio devem ser acordados com o Backend. O [README](../README.md#origem-de-dados-em-preparação) explica como alterar a flag.

Os dados fictícios JSON utilizados pelos mocks ficam em `src/mocks/<funcionalidade>`, com nomes `json_mock_<funcionalidade>_<caso>`. Os serviços, parsers e cenários específicos ficam junto da respetiva funcionalidade; mecanismos comuns só são extraídos quando houver reutilização demonstrada.

Para acrescentar dados fictícios, consulta o modelo e o contrato da funcionalidade, cria o JSON na respetiva pasta e usa apenas dados fictícios. Mantém os dados coerentes com os requisitos conhecidos, com identificadores distintos quando exigidos, e assinala campos ou valores ainda não acordados com o Backend. Confirma que o serviço carrega e valida os novos dados e testa os comportamentos relevantes, incluindo dados inválidos, erros e limites. Acrescentar um ficheiro não cria automaticamente o serviço ou o carregador de uma funcionalidade nova.

Na implementação atual, `src/mocks/work-orders` contém exemplos incluídos automaticamente pelo carregador de `src/features/work-orders/infrastructure/mock/loaders`; o parser correspondente fica em `src/features/work-orders/infrastructure/mock/parsers`. Os ficheiros são lidos como texto e interpretados com `JSON.parse`; cada um pode conter uma ordem ou um array de ordens. O parser rejeita JSON inválido, dados incompatíveis e IDs repetidos no ficheiro; o carregador verifica IDs repetidos entre ficheiros. Outras funcionalidades precisam dos seus próprios serviços e carregadores quando forem implementadas.

O serviço mock de ordens de serviço fica em `src/features/work-orders/infrastructure/mock/services`, mantém dados em memória e disponibiliza `list`, `getById`, `create` e `update`; uma ordem inexistente devolve `null`. A edição permite alterar tipo, descrição, prioridade, data e instruções; os campos e estados em que podem ser alterados carecem de confirmação com o PO e Backend. Não implementa histórico nem permissões. Os cenários `normal`, `empty`, `error` e `slow` criam instâncias independentes, e `slow` simula 1,2 segundos de latência. O Debug Menu permite mudar de cenário quando a origem é Mock. Mudar de cenário cria uma nova instância e repõe os dados; alternar temporariamente para API preserva a instância mock enquanto a página estiver aberta. Ao recarregar, os dados fictícios são perdidos. Os mocks não comunicam com o Backend nem partilham dados com o Mobile.

Os controlos de desenvolvimento das ordens de serviço estão separados do contrato de negócio. Na secção «Mocks» do Debug Menu, permitem adicionar exemplos JSON individuais ou todos os disponíveis, remover todas as ordens fictícias ou repor os dados iniciais do cenário selecionado. Cada exemplo é identificado pelo ID do JSON: um exemplo já presente não é novamente adicionado, mas novos exemplos podem ser acrescentados. As notificações destas ações substituem a anterior e desaparecem após cinco segundos; incluem falhas parciais, são feedback de interface e não constituem logs. Os controlos ficam indisponíveis com a origem API ou as ferramentas de desenvolvimento desativadas; não efetuam pedidos reais. Se uma criação simulada estiver pendente quando os dados são limpos ou repostos, essa criação é rejeitada.

O modelo e os JSON de ordens de serviço são provisórios. A criação mock recebe o número da ordem, mas ainda é necessário acordar com o Backend quem o gera, os formatos de IDs, datas, prioridade, cliente e local, bem como pedidos, respostas, paginação, erros e autenticação. Os endpoints de referência do PO não são uma API confirmada. Uma nova ordem mock começa em `NOVA`, com prioridade `NORMAL` por defeito, e pode não ter data prevista ou técnico. O formulário também permite selecionar `BAIXA` e `ALTA` como opções provisórias, sujeitas a confirmação pelo PO e Backend; `NORMAL` é o valor por defeito indicado pelo PO. Atribuições, intervenções e transições estão por implementar; a conclusão de uma intervenção não determina por si só a conclusão da ordem. Os IDs gerados pelo mock são locais.

O PO indicou `GET /work-orders`, `GET /work-orders/{id}` e `POST /work-orders` como operações ilustrativas de listagem, detalhe e criação. O contrato local `WorkOrderService` disponibiliza `list`, `getById`, `create` e `update`; a operação de edição e os restantes caminhos, respostas, autenticação e tratamento de erros HTTP têm de ser confirmados com o Backend antes de ligar a API. O `loggedFetch` existente está preparado para instrumentar pedidos, mas não os executa para estes ecrãs enquanto não existir integração real.

Uma ordem de serviço pode ter várias intervenções; cada intervenção tem identidade e estado próprios e pertence a uma OS. A conclusão ou o cancelamento de uma intervenção não altera automaticamente o estado da OS. Os estados, transições e o efeito do cancelamento são provisórios até serem acordados com o PO e o Backend.

Em `src/mocks/interventions` existem exemplos JSON provisórios associados por `workOrderId` às OS de `src/mocks/work-orders`: uma intervenção concluída e outra cancelada para a mesma OS em execução, e uma intervenção pendente de material para uma OS pendente. Os nomes dos campos e os estados das intervenções são exemplos ainda não acordados com o Backend. O carregador, o parser e o serviço em `src/features/interventions/infrastructure/mock` interpretam e validam os ficheiros e mantêm os dados adicionados em memória. No Debug Menu, a secção «Mocks» separa as ações de «Ordens de serviço» e «Intervenções». As intervenções podem ser adicionadas individualmente ou em conjunto e removidas; apenas são adicionados exemplos cuja OS esteja presente e não se repetem IDs. Limpar ou repor as OS, ou mudar de cenário, elimina as intervenções desse conjunto mock; não são criadas transições de estado de negócio. O detalhe da OS consulta as intervenções associadas através do contrato local provisório `InterventionService`, separado dos controlos de debug; a consulta é atualizada quando os mocks mudam. As intervenções são locais, não persistem ao recarregar e não estão ligadas a uma API; a operação de consulta e o respetivo formato terão de ser acordados com o Backend.

Quando a equipa de Backend fornecer exemplos JSON, revê os contratos com os consumidores Web e Mobile e implementa as adaptações necessárias. Os modelos internos e o formato de transporte podem ser diferentes; documenta as diferenças e os pontos por confirmar.

## Componentes visuais implementados

Os componentes visuais partilhados usam tokens semânticos CSS configuráveis; a composição da aplicação pode fornecer temas e mudar entre eles, sem persistência implícita. Os tokens são acrescentados conforme as necessidades dos componentes e documentados com a correspondência ao Figma. Os recursos visuais usados pelos componentes também devem permitir personalização quando o tema o exigir.

Os componentes existentes estão em `src/shared/ui`. A implementação atual usa CSS Modules e propriedades `--mds-*` com valores de reserva consultados no Figma, substituíveis por um antepassado. Não existe ainda um provider de tema global; os recursos SVG originais têm cores fixas e as opções de substituição são descritas nas fichas individuais. A fonte Inter é usada quando disponível, com alternativa do sistema.

### Animações Web

Na Web, interações equivalentes reutilizam os mesmos padrões de movimento e tokens CSS partilhados. O comportamento comum pertence aos componentes reutilizáveis; um comportamento novo começa junto da funcionalidade e só é partilhado quando houver necessidade comum. As animações dão feedback sem impedir a utilização, respeitam `prefers-reduced-motion` e não dependem de hover para tornar uma ação identificável. Novos padrões e respetivos tokens são documentados antes de serem adotados noutros componentes. Os padrões implementados e as instruções de utilização estão em [animations.md](animations.md).

O [catálogo por grupo](COMPONENTS_WEB_REACT.md#9-catálogo-de-implementação--53-famílias-do-figma) liga às 53 fichas individuais, que descrevem contratos, exemplos, tokens e limitações. Os componentes de seleção e os grupos reutilizam estruturas internas em `selection`.

A [comparação com os componentes mobile](components/comparacao-mobile-web.md) regista capacidades, diferenças de plataforma e limitações conhecidas.

### Composição e navegação

Os contentores [Card](components/Card.md), [ContentPanel](components/ContentPanel.md) e [FormGroup](components/FormGroup.md) recebem conteúdo e ações da aplicação; os layouts responsivos dos dois últimos usam container queries.

[Tab](components/Tab.md), [Tabs](components/Tabs.md) e [TabPanel](components/TabPanel.md) compõem separadores e painéis controlados, com navegação e associações acessíveis próprias da web.

[PageButton](components/PageButton.md) e [Pagination](components/Pagination.md) compõem navegação por páginas controlada pela aplicação, sem carregar dados; o seletor de tamanho web é nativo.

### Dados e componentes de domínio

[ActivityItem](components/ActivityItem.md) e [Timeline](components/Timeline.md) apresentam acontecimentos e histórico fornecidos pela aplicação; a ordenação é visual e a carga incremental continua sob controlo do consumidor.

[ChecklistItem](components/ChecklistItem.md), [TaskProgress](components/TaskProgress.md) e [Checklist](components/Checklist.md) compõem verificações e progresso; a aplicação fornece a regra de conclusão, gere evidências e controla os dados e ações.

[AttachmentItem](components/AttachmentItem.md) e [FileUpload](components/FileUpload.md) apresentam e selecionam ficheiros controlados; a aplicação gere envio e persistência e o servidor valida os ficheiros recebidos.

[PhotoTile](components/PhotoTile.md) e [ImagePicker](components/ImagePicker.md) apresentam e selecionam imagens controladas; processamento, recursos temporários, câmara e transferência pertencem à aplicação.

[ClientSummary](components/ClientSummary.md), [EquipmentCard](components/EquipmentCard.md) e [ServiceOrderCard](components/ServiceOrderCard.md) compõem Card, StatusBadge e Button para apresentar dados fornecidos pela aplicação; partilham a disposição interna de pares etiqueta/valor em `BusinessCard`.

### Formulários e seletores

[Select](components/Select.md) usa seleção nativa controlada e pesquisa local opcional. [Form](components/Form.md) compõe campos num formulário HTML; a aplicação mantém dados, validações de negócio e operações de submissão.

[DatePicker](components/DatePicker.md), [DateRangePicker](components/DateRangePicker.md) e [TimePicker](components/TimePicker.md) recebem valores civis e limites controlados; os seletores web são nativos e a aplicação valida disponibilidade e regras de negócio.

[TeamSelector](components/TeamSelector.md), [UserSelector](components/UserSelector.md) e [AssignmentPanel](components/AssignmentPanel.md) apresentam opções e pedidos de atribuição controlados; a aplicação e o servidor validam associação, disponibilidade e permissões.

### Estrutura, tabelas e sobreposições

[NavItem](components/NavItem.md), [AppHeader](components/AppHeader.md), [PageLayout](components/PageLayout.md) e [AppShell](components/AppShell.md) compõem navegação e estrutura responsiva com slots; a aplicação continua responsável por rotas, destinos e foco entre páginas.

[SortableHeader](components/SortableHeader.md), [TableRow](components/TableRow.md), [DataTable](components/DataTable.md) e [FilterBar](components/FilterBar.md) compõem listagens com dados e interações controlados; a aplicação efetua a filtragem, ordenação, paginação e obtenção de resultados.

[Dialog](components/Dialog.md) e [DrawerSheet](components/DrawerSheet.md) partilham uma superfície modal nativa controlada; a aplicação decide abertura, fecho e ações. [ToastSnackbar](components/ToastSnackbar.md) permite apresentação isolada ou fila limitada ao `ToastProvider` escolhido pela composição.

## Orientação a objetos e abstração

Usa objetos e classes quando encapsulem comportamento, invariantes ou responsabilidades que beneficiem de um contrato explícito. Prefere composição a herança profunda.

Componentes funcionais e hooks são o padrão da apresentação React. Funções puras são adequadas a transformações simples. A escolha deve preservar clareza e testabilidade.

Extrai código partilhado quando representar a mesma responsabilidade ou regra de negócio. Blocos parecidos podem ter significados diferentes e evoluir separadamente. Evita tanto duplicação de regras de negócio como abstrações prematuras com muitas opções e condições.

## Qualidade e validação

Mantém alterações focadas, nomes claros e tratamento explícito de falhas relevantes. Segue a política de testes proporcionais ao risco em AGENTS.md e executa as verificações do README.

Testa comportamento observável e contratos importantes. As correções devem ter testes de regressão quando viável. Alterações de documentação ou estilos de baixo risco não exigem testes que apenas reproduzam a implementação.

Os testes com Vitest e React Testing Library em jsdom e o build Vite não substituem validação num browser real. Identifica no PR as limitações e, quando relevante, o impacto no comportamento, acessibilidade, diferentes tamanhos de ecrã e compatibilidade entre browsers.

## Decisões que alteram a arquitetura

Antes de transformar uma decisão nova numa regra transversal, segue o processo de proposta e aprovação de AGENTS.md. Inclui a documentação aprovada na branch e no PR da tarefa.

Quando uma decisão precisar de justificar alternativas e consequências, cria um registo em `docs/decisions/` com contexto, decisão, alcance e consequências. Essa pasta não precisa de existir antes de haver uma decisão a registar.

A aplicação Web usa React Router em modo declarativo, com rotas organizadas na composição da aplicação e ecrãs junto das respetivas funcionalidades. Os layouts comuns serão partilhados entre rotas; as permissões são confirmadas pelo Backend. As rotas e destinos só serão acrescentados quando os respetivos fluxos estiverem disponíveis. A configuração em `src/app/routing` disponibiliza a listagem de ordens de serviço em `/` e `/ordens-servico`, a criação mock em `/ordens-servico/nova`, o detalhe em `/ordens-servico/:id`, a edição mock em `/ordens-servico/:id/editar` e uma página para endereços desconhecidos. Os restantes destinos da navegação ainda não estão disponíveis. O servidor de produção terá de encaminhar rotas da aplicação para `index.html` para permitir acesso direto e recarregamento; essa configuração depende do alojamento, ainda não definido.

Na Web, o estado local de interface usa React (`useState`/`useReducer`); o estado partilhado de aplicação usa Context e, quando necessário, `useReducer`. O estado de navegação partilhável usa os parâmetros do URL com React Router. Os dados assíncronos dos serviços mock e API são geridos com TanStack Query, mantendo o acesso aos dados nos serviços das funcionalidades; a cache distingue a origem e é invalidada quando os dados mudam. As dependências e migrações são introduzidas nas tarefas que as utilizam. A listagem e o detalhe de ordens usam TanStack Query: a chave inclui a origem e, para mock, a instância do cenário; o detalhe inclui ainda o ID. As alterações mock invalidam a consulta ativa; a API permanece indisponível até existir um adaptador.

Não há nesta fase escolha aprovada de cliente HTTP ou armazenamento de sessão. A escolha concreta deve partir de uma necessidade real e do respetivo impacto.
