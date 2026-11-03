# Timeline

Histórico de eventos baseado em [MDS/Timeline](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=180-3374), composto por [ActivityItem](ActivityItem.md), [Button](Button.md) e [LoadingIndicator](LoadingIndicator.md). A aplicação mantém os dados e controla a carga incremental.

```tsx
import { Timeline } from '../../shared/ui/Timeline'

<Timeline title="Histórico da intervenção" subtitle="Últimos acontecimentos"
  events={eventos} total={total} hasMore={temMais} isLoading={aCarregar}
  onLoadMore={carregarMais} onOpenRelated={abrirEvento} />
```

## API e comportamento

- `title` é obrigatório; `subtitle` é opcional. Ambos devem ser não vazios. `headingLevel` escolhe o nível do título entre 2 e 6; o padrão é 2. O contentor é uma secção associada ao título e aceita atributos nativos, `ref`, `className` e `style`.
- `events` é uma lista de `ActivityEvent` com identificadores únicos e dados válidos. Os acontecimentos são apresentados do timestamp mais recente para o mais antigo, mantendo a ordem original nos empates e sem alterar a lista recebida. Consultar [ActivityItem](ActivityItem.md) para os dados e estado opcionais.
- `total` é opcional, inteiro seguro e não inferior ao número de eventos recebidos. Quando fornecido, a contagem indica o total conhecido; caso contrário indica os carregados e, se `hasMore` for verdadeiro, explicita que são carregados.
- `hasMore`, `isLoading` e `onLoadMore` são controlados pelo consumidor. O botão aparece se houver mais dados e callback; durante a carga fica desativado e é apresentada uma indicação de progresso. O consumidor obtém os dados, gere erros e acrescenta os resultados à lista. `onOpenRelated` recebe o evento selecionado; sem callback os cartões são informativos.
- Sem eventos, apresenta o estado vazio; com `hasMore` apresenta antes uma mensagem de eventos ainda não carregados. Enquanto carrega sem eventos mostra o progresso, sem afirmar que o histórico está vazio.
- `labels` substitui parcialmente `count(count, hasMore)`, `emptyTitle`, `emptyDescription`, `unloadedTitle`, `loading` e `loadMore` para localização e adaptação. As etiquetas fixas devem ser não vazias. `renderLeading(event)` e `renderTrailing(event)` personalizam os slots do cartão; observar as restrições de conteúdo interativo da ficha ActivityItem.

## Tema, acessibilidade e validação

Usa tokens de superfície, texto, borda, cor de marca e fundo subtil `--mds-*` do Figma. `--mds-timeline-padding`, `--mds-timeline-radius` e `--mds-font-family` permitem personalização; os componentes compostos têm os seus próprios tokens. O símbolo do estado vazio é texto decorativo e varia com a fonte.

Os eventos são uma lista ordenada e a secção tem nome acessível. A lista recebe `aria-busy` durante o carregamento; a aplicação decide se e como anuncia atualizações ou erros. O layout permite quebra de linha e adapta-se à largura disponível. A lista não é virtualizada: para históricos muito grandes, usar carregamento incremental adequado. Verificar em navegador real teclado, contraste, zoom, larguras e tecnologias de apoio.
