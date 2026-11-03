# Tabs

Conjunto de separadores e painéis baseado em [MDS/Tabs](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=131-1955). Compõe [Tab](Tab.md) e [TabPanel](TabPanel.md), sem gerir navegação ou dados de negócio.

```tsx
import { Tabs } from '../../shared/ui/Tabs'

<Tabs items={separadores} value={ativo} onChange={setAtivo} keepMounted />
```

## API e comportamento

- `items`: lista não vazia de `{ id, label, content }`; cada `id` deve ser único e não vazio. Pode incluir `disabled`, `count`, `accessibilityLabel`, `panelTitle`, `panelDescription`, `panelActions` e `panelSurface`.
- `value` e `onChange` são controlados pelo consumidor. `value` deve identificar uma opção existente e não desativada; a aplicação deve atualizá-lo quando as opções mudam.
- `size` é `compact` (padrão) ou `comfortable`. `accessibilityLabel` nomeia a lista e por omissão é «Separadores».
- `activation` é `automatic` (padrão): setas mudam foco e pedem seleção. Em `manual`, setas apenas movem o foco e Enter/Espaço ativam o separador pelo comportamento nativo do botão. `Home` e `End` movem para o primeiro e último disponíveis; opções desativadas são ignoradas. O foco circula no fim da lista.
- `keepMounted={false}` desmonta conteúdo de painéis inativos; `true` preserva estado, mas mantém efeitos e memória. As estruturas exteriores mantêm-se ocultas para conservar os alvos de `aria-controls`.
- `className`, `style`, `ref` e atributos do `div` permitem integração. IDs distintos por instância ligam separadores e painéis; a lista permite deslocação horizontal quando não cabe.

## Tema e validação

Os tokens CSS dos [Tab](Tab.md), [TabPanel](TabPanel.md) e [ContentPanel](ContentPanel.md) permitem personalização. Testar mudança de opções, foco com teclado, ativação, acessibilidade das relações, conteúdo preservado ou desmontado, zoom e ecrãs estreitos em navegadores reais. O consumidor deve considerar latência antes de escolher ativação automática.
