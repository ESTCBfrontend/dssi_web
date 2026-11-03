# NavItem

Destino de navegação baseado em [MDS/NavItem](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=100-1147), para barra lateral ou inferior. A aplicação controla o destino e o estado ativo.

```tsx
import { NavItem } from '../../shared/ui/NavItem'

<NavItem label="Ordens" href="/ordens" selected={destino === 'ordens'} />
```

## API e comportamento

- `label` é obrigatório e não vazio. `href` cria um link nativo; em alternativa, `onClick` cria um botão. Quando ativo, o componente exige destino ou ação. O componente não escolhe rotas nem altera `selected`.
- `selected` assinala a página atual com `aria-current="page"`. `disabled` cria um botão desativado, sem destino navegável, e impede a ação. `target` e `rel` aplicam-se a links.
- `place` aceita `sidebar`, `bottom` ou `auto` (padrão). Em `auto`, dentro de [AppShell](AppShell.md) adapta a apresentação à largura do contentor; fora dele usa apresentação lateral. Os elementos não são duplicados nem desmontados durante a mudança.
- `icon` substitui o indicador padrão e é decorativo. `badge` acrescenta texto ao item e ao nome acessível; `aria-label` pode substituir o nome completo. `indicatorSrc` permite substituir os indicadores SVG do tema. `id`, `className` e `style` personalizam o controlo.

## Tema e acessibilidade

Usa tokens de superfície, texto, marca, estado desativado e foco `--mds-color-*`. Os indicadores originais do Figma são SVG com cores fixas; `indicatorSrc` ou `icon` permitem substituí-los. A altura é mínima de 44 px na barra lateral e 58 px na inferior; texto longo pode quebrar linha. O consumidor deve garantir nomes acessíveis para ícones, badges personalizados e destinos. Validar foco, navegação real, zoom, contraste e leitores de ecrã em navegador real.
