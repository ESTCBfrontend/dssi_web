# Tab

Separador individual baseado em [MDS/Tab](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=130-1883). É um botão controlado; a seleção e a relação com o painel pertencem à composição. Para um conjunto completo, usa [Tabs](Tabs.md).

```tsx
import { Tab } from '../../shared/ui/Tab'

<Tab id="aba-detalhes" label="Detalhes" selected={ativo} onSelect={selecionar} aria-controls="painel-detalhes" />
```

## API e comportamento

- `id` e `label` são obrigatórios e não vazios. `selected` é controlado; `onSelect` recebe o `id` sem alterar o estado por si próprio.
- `count` é opcional, inteiro seguro não negativo, mostrado e incluído no nome acessível. `size` é `compact` ou `comfortable` (padrão); `disabled` impede a interação.
- O botão usa `role="tab"`, `aria-selected` e `tabIndex` derivado da seleção, salvo se a composição fornecer `tabIndex`. A composição deve ligá-lo ao painel usando `aria-controls` e gerir o foco do grupo.
- Aceita `aria-label` alternativo não vazio, `className`, `style`, `ref` e atributos nativos do botão. `onClick` é chamado antes de `onSelect`; pode impedir a seleção com `preventDefault()`.

## Tema e validação

Texto, indicador, estados e foco usam propriedades CSS `--mds-*` com valores de reserva do Figma; Inter usa alternativa do sistema quando indisponível. Validar teclado, foco, seleção, contadores, contraste, conteúdo longo e zoom no navegador. `Tab` isolado não cria um painel nem um `tablist`.
