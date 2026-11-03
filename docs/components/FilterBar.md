# FilterBar

Barra de pesquisa e filtros controlados baseada em [MDS/FilterBar](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=109-1379). Compõe [FormField](FormField.md), [TextField](TextField.md), [Select](Select.md) e [Button](Button.md).

```tsx
<FilterBar title="Filtrar" search={{ label: 'Pesquisar', value: pesquisa, onChange: setPesquisa }}
  filters={criterios} onReset={limpar} />
```

## API e comportamento

- `search` é opcional e recebe `label`, `value`, `onChange`, `placeholder` e `disabled`. Cada entrada de `filters` fornece `id`, `label`, `value`, `options` e `onChange`, além de `placeholder`, `selectedLabel`, `disabled`, `loading`, `loadError` e `onRetry` opcionais. Os IDs são únicos e não vazios. Os valores e resultados são sempre controlados pelo consumidor.
- `onReset` apresenta a ação de limpeza com `resetLabel` configurável; o consumidor decide os valores a repor. `actions` recebe ações adicionais e o consumidor gere o estado desses controlos.
- `extraFilters` recebe conteúdo adicional, apresentado por botão com `extraFiltersTitle`. `activeExtraCount` é um inteiro seguro não negativo e, quando positivo, continua visível no botão mesmo com os filtros fechados. O conteúdo mantém-se montado quando oculto; a aplicação gere a sua acessibilidade e estado.
- `disabled` bloqueia os controlos internos e oculta o painel extra enquanto estiver ativo; ao reativar recupera o estado anterior de abertura. Não desativa automaticamente `actions` nem controlos fornecidos em `extraFilters`.
- `title` e `headingLevel` configuram o título opcional; `searchIconSrc` substitui o SVG do Figma. `className`, `style`, `ref` e atributos nativos aplicam-se à secção.

## Tema e validação

Usa tokens de superfície subtil, borda, texto, `--mds-filter-bar-padding`, `--mds-radius-lg` e `--mds-font-family`; os controlos compostos têm tokens próprios. O ícone de pesquisa é SVG de cor fixa e substituível. Os controlos quebram linha em contentores estreitos; a aplicação escolhe quando efetuar pesquisa, debounce ou pedidos. Validar filtros ativos, teclado, zoom, largura e leitores de ecrã em navegador real.
