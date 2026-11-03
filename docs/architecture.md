# Arquitetura e qualidade

Este documento contém princípios aprovados para orientar o crescimento do projeto web. Deve ser lido em conjunto com [AGENTS.md](../AGENTS.md) e [CONTRIBUTING.md](../CONTRIBUTING.md).

## Estado atual e evolução

A aplicação ainda é uma base React com Vite, com o ponto de entrada em `src/main.tsx` e o componente inicial em `src/App.tsx`. Ainda não existem funcionalidades de negócio organizadas em `src/features`.

A direção acordada é organizar o código por funcionalidade e separar responsabilidades conforme a complexidade real. A estrutura abaixo é uma referência para as próximas funcionalidades; não representa pastas já existentes nem exige criar todas as camadas de uma vez.

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

## Componentes visuais implementados

Os componentes visuais partilhados usam tokens semânticos CSS configuráveis; a composição da aplicação pode fornecer temas e mudar entre eles, sem persistência implícita. Os tokens são acrescentados conforme as necessidades dos componentes e documentados com a correspondência ao Figma. Os recursos visuais usados pelos componentes também devem permitir personalização quando o tema o exigir.

Os componentes existentes estão em `src/shared/ui`. A implementação atual usa CSS Modules e propriedades `--mds-*` com valores de reserva consultados no Figma, substituíveis por um antepassado. Não existe ainda um provider de tema global; os recursos SVG originais têm cores fixas e as opções de substituição são descritas nas fichas individuais. A fonte Inter é usada quando disponível, com alternativa do sistema.

Contratos, exemplos, tokens e limitações: [Button](components/Button.md), [StatusBadge](components/StatusBadge.md), [TextField](components/TextField.md), [Textarea](components/Textarea.md), [FormField](components/FormField.md), [Checkbox](components/Checkbox.md), [Radio](components/Radio.md), [Switch](components/Switch.md), [CheckboxGroup](components/CheckboxGroup.md), [RadioGroup](components/RadioGroup.md), [ProgressBar](components/ProgressBar.md), [LoadingIndicator](components/LoadingIndicator.md), [AlertIcon](components/AlertIcon.md) e [Alert](components/Alert.md). Os componentes de seleção e os grupos reutilizam estruturas internas em `selection`; alguns SVGs têm cores fixas do Figma e exigem atenção na personalização visual.

A [comparação com os componentes mobile](components/comparacao-mobile-web.md) regista capacidades, diferenças de plataforma e limitações conhecidas.

Os contentores [Card](components/Card.md), [ContentPanel](components/ContentPanel.md) e [FormGroup](components/FormGroup.md) recebem conteúdo e ações da aplicação; os layouts responsivos dos dois últimos usam container queries.

[Tab](components/Tab.md), [Tabs](components/Tabs.md) e [TabPanel](components/TabPanel.md) compõem separadores e painéis controlados, com navegação e associações acessíveis próprias da web.

[PageButton](components/PageButton.md) e [Pagination](components/Pagination.md) compõem navegação por páginas controlada pela aplicação, sem carregar dados; o seletor de tamanho web é nativo.

[ActivityItem](components/ActivityItem.md) e [Timeline](components/Timeline.md) apresentam acontecimentos e histórico fornecidos pela aplicação; a ordenação é visual e a carga incremental continua sob controlo do consumidor.

[ChecklistItem](components/ChecklistItem.md), [TaskProgress](components/TaskProgress.md) e [Checklist](components/Checklist.md) compõem verificações e progresso; a aplicação fornece a regra de conclusão, gere evidências e controla os dados e ações.

[AttachmentItem](components/AttachmentItem.md) e [FileUpload](components/FileUpload.md) apresentam e selecionam ficheiros controlados; a aplicação gere envio e persistência e o servidor valida os ficheiros recebidos.

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

Não há nesta fase escolha aprovada de biblioteca de routing, gestão global de estado, cliente HTTP ou armazenamento de sessão. A escolha concreta deve partir de uma necessidade real e do respetivo impacto.
