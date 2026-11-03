# TabPanel

Painel de conteúdo baseado em [MDS/TabPanel](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=132-1939). Compõe [ContentPanel](ContentPanel.md); [Tabs](Tabs.md) cria os painéis e associações automaticamente.

```tsx
import { TabPanel } from '../../shared/ui/TabPanel'

<TabPanel id="painel-detalhes" labelledBy="aba-detalhes" active={ativo}>
  {conteudo}
</TabPanel>
```

## API e comportamento

- `id` e `labelledBy` são obrigatórios e não vazios; o último identifica o elemento `tab`. O contentor usa `role="tabpanel"` e `aria-labelledby`.
- `title`, `description` e `actions` são opcionais; textos fornecidos não podem ser vazios. `children` recebe conteúdo real da aplicação; `surface` é `surface` (padrão) ou `muted`.
- `active` é `true` por omissão. Inativo fica oculto e não interativo. Com `keepMounted={false}` (padrão), desmonta o conteúdo inativo, perdendo o seu estado interno; com `true`, mantém-no montado, incluindo efeitos e custo de memória.
- Na web, a estrutura exterior inativa mantém-se oculta para que `aria-controls` continue a referenciar um ID existente, mesmo quando o conteúdo é desmontado. O painel ativo recebe `tabIndex=0` para ser alcançável por teclado.
- Aceita `className`, `style`, `ref` e atributos nativos de `div`. As ações e os controlos do conteúdo mantêm a própria semântica.

## Tema e validação

Reutiliza tokens do ContentPanel e expõe `--mds-tab-panel-gap`, `--mds-tab-panel-description-size`, `--mds-tab-panel-surface-padding` e `--mds-tab-panel-muted-padding`, com reservas do Figma. Confirmar relação com separador, ocultação, foco, largura, zoom e tecnologias de apoio em navegador real.
