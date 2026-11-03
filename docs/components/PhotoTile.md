# PhotoTile

Miniatura de fotografia com estado e ações controlados, baseada em [MDS/PhotoTile](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=159-2617). Compõe [StatusBadge](StatusBadge.md) e [Button](Button.md); pode ser usada isoladamente ou em [ImagePicker](ImagePicker.md).

```tsx
import { PhotoTile } from '../../shared/ui/PhotoTile'

<PhotoTile photo={{ id: '1', name: 'sensor.jpg', uri: imagem, alt: 'Sensor instalado' }}
  state="ready" onOpen={abrirFotografia} onRemove={removerFotografia} />
```

## API e comportamento

- `photo` recebe `id` e `name` não vazios, e `uri` e `alt` opcionais. Quando `alt` falta ou é vazio, o nome identifica a imagem. A aplicação valida a origem da URI.
- `state` é `ready`, `uploading` ou `error`. Durante o envio, `progress` é obrigatório e finito entre 0 e 100; valor visível e acessível são arredondados da mesma forma. Identificador, nome, estado ou progresso inválidos produzem erro.
- `onOpen(photo)` transforma a pré-visualização num botão. `selected` controla o contorno e, quando fornecido com `onOpen`, é exposto através de `aria-pressed`; usa-o quando a ação representa seleção. Sem `onOpen`, uma seleção verdadeira também é comunicada por texto acessível.
- `onRemove(photo)` surge em `ready` e `error`; `onRetry(photo)` surge em `error`. Nenhum callback altera dados ou inicia operações automaticamente.
- `preview` substitui visualmente a miniatura; é conteúdo decorativo e não deve conter controlos interativos. Sem `preview`, uma `uri` válida usa `object-fit: cover`; sem URI ou após erro surge o marcador ilustrativo do Figma. Uma URI marcada como falhada pode ser novamente tentada ao remontar o componente ou quando outra URI falha.
- `labels` personaliza textos de estado, ação, progresso e seleção. `statusDotSrc` substitui o recurso do ponto; `placeholderSources` substitui individualmente `sun`, `landscapeLarge` e `landscapeNear`. `className`, `style`, `ref` e atributos nativos aplicam-se ao artigo.

## Tema e acessibilidade

Usa `--mds-color-bg-surface`, `--mds-color-bg-info`, `--mds-color-border-default`, `--mds-color-border-error`, `--mds-color-border-focus`, `--mds-color-text-primary`, `--mds-color-bg-status-neutral`, `--mds-color-bg-brand`, `--mds-radius-lg`, `--mds-font-family` e `--mds-photo-tile-width`. Os SVG originais têm cores fixas e podem ser substituídos; a largura padrão é 154 px e a miniatura tem 102 px de altura. A ação de abrir tem nome acessível e o progresso usa `role="progressbar"`. Validar foco, contraste, zoom, largura e leitor de ecrã em navegador real.
