# DrawerSheet

Painel modal controlado, baseado em [MDS/DrawerSheet](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=141-2063). Partilha a infraestrutura acessível de [Dialog](Dialog.md).

```tsx
import { DrawerSheet } from '../../shared/ui/DrawerSheet'

<DrawerSheet open={aberto} title="Filtros" placement="bottom"
  onCloseRequest={() => setAberto(false)}
  actions={<button type="button" onClick={() => setAberto(false)}>Aplicar</button>}>
  {campos}
</DrawerSheet>
```

## API e composição

- `placement` é `right` (padrão), `bottom` ou `fullscreen`. `showHandle` apresenta uma pega decorativa na posição inferior; não implementa gestos de arrastar.
- `open`, `title`, `onCloseRequest`, `description`, `message`, `children`, `actions`, `dismissible`, `dismissOnBackdrop`, `showClose`, `closeLabel`, `closeIconSrc`, `initialFocusRef` e `returnFocusRef` seguem o contrato de [Dialog](Dialog.md), incluindo motivos de fecho e valores por omissão. A aplicação controla estado e ações.
- Aceita `className`, `style`, `ref` e atributos nativos de `dialog`. Os filhos permanecem montados quando fechado. Em painéis não dispensáveis, a composição deve fornecer uma saída acessível.

## Tema e validação

Usa os tokens do Dialog e `--mds-sheet-bottom-width` para a largura máxima inferior. O fundo modal usa `--mds-overlay-backdrop`. Verificar em navegadores reais o foco, teclado, leitores de ecrã, scroll de conteúdo longo, zoom e dimensões estreitas. A pega não é um controlo interativo.
