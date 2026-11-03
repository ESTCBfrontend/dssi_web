# DataTable

Listagem baseada em [MDS/DataTable](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=110-1698), composta por [TableRow](TableRow.md), [SortableHeader](SortableHeader.md), [Pagination](Pagination.md), [Alert](Alert.md) e [LoadingIndicator](LoadingIndicator.md).

```tsx
import { DataTable } from '../../shared/ui/DataTable'
import type { DataColumn } from '../../shared/ui/DataTable'

const columns: DataColumn<Ordem>[] = [
  { id: 'ref', label: 'Referência', sortable: true, rowHeader: true, render: ordem => ordem.referencia },
  { id: 'cliente', label: 'Cliente', render: ordem => ordem.cliente },
]
<DataTable title="Ordens" rows={ordens} columns={columns} getRowId={ordem => ordem.id}
  sorting={ordenacao} onSort={setOrdenacao} pagination={paginacao} />
```

## API e comportamento

- `rows`, `columns` e `getRowId(row)` descrevem os dados fornecidos. Cada coluna tem `id`, `label`, `render(row, index)` e, opcionalmente, `sortable` e `rowHeader`. IDs de colunas e registos têm de ser únicos e não vazios; a tabela não cria dados nem opções fictícias.
- `sorting` é `null` ou `{ columnId, direction: 'ascending' | 'descending' }`. `onSort` recebe a ordenação pedida ou `null` para limpar; a aplicação ordena localmente ou no servidor e volta a fornecer os registos. Sem callback os botões de ordenação ficam desativados. `isRowSelected(row)` permite apresentar seleção controlada.
- `pagination` recebe as props de Pagination; `total` é opcional, não inferior aos registos recebidos e, se coexistir com paginação, deve coincidir com o total desta. A aplicação mantém página, tamanho e resultados coerentes. A tabela não fatia nem filtra a lista automaticamente.
- `filters` é um slot para controlos como [FilterBar](FilterBar.md). `isLoading` mostra progresso, mantém registos existentes e bloqueia ordenação, paginação e repetição; o consumidor gere o estado de controlos fornecidos no slot.
- `error` apresenta um alerta e `onRetry` opcional pede repetição. Um erro ou carregamento sem dados não é mostrado como estado vazio. `labels` personaliza `count`, `emptyTitle`, `emptyDescription`, `loading`, `errorTitle` e `retry`.
- `layout="table"` usa `<table>`, legenda acessível e scroll horizontal quando necessário. `layout="cards"` exige `renderCard(row, index)` e apresenta uma lista; a aplicação escolhe quando mudar de layout e assegura acessibilidade dos cartões. Mudar de layout desmonta a apresentação anterior, pelo que o estado persistente deve ficar na aplicação.
- `title` é obrigatório, `description` opcional; `headingLevel` configura o título. `className`, `style`, `ref` e atributos nativos aplicam-se à secção. O componente não virtualiza os registos.

## Tema e validação

Usa tokens semânticos de superfície, borda e texto, `--mds-data-table-padding`, `--mds-radius-lg` e `--mds-font-family`; os componentes compostos têm tokens próprios. A web usa tabela semântica ou cartões explícitos; mobile utiliza lista virtualizada. Validar teclado, cabeçalhos, scroll horizontal, seleção, zoom e leitores de ecrã em navegador real.
