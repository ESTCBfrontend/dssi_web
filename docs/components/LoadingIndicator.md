# LoadingIndicator

Indicador de espera indeterminada baseado em [MDS/LoadingIndicator](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=149-2367). Para progresso mensurável, usa [ProgressBar](ProgressBar.md).

```tsx
import { LoadingIndicator } from '../../shared/ui/LoadingIndicator'

<LoadingIndicator type="inline" label="A carregar serviços..." active={aCarregar} />
<LoadingIndicator type="skeleton" label="A carregar detalhes..." />
```

## API e comportamento

- `type`: `spinner` (padrão), `inline` ou `skeleton`; `size`: `compact` (padrão) ou `comfortable`.
- `label` descreve a espera, com valor inicial «A processar...». Em `inline` é visível; nas outras variantes está disponível a leitores de ecrã. O indicador usa `role="status"`; não coloca `aria-busy` automaticamente no conteúdo que está a ser atualizado: o consumidor deve gerir esse atributo na região relevante.
- `active={false}` não apresenta o indicador. `reducedMotion` desativa a rotação; a preferência de movimento reduzido do sistema também a desativa. O skeleton é estático.
- `className` personaliza o contentor. O skeleton adapta a largura ao espaço disponível.

## Tema e validação

Usa tokens CSS `--mds-*` com valores de reserva do Figma e Inter quando disponível. Os SVGs originais do spinner têm cores fixas, pelo que é necessário verificar a sua legibilidade em temas personalizados. Validar nome acessível, ativação/desativação, movimento reduzido, contraste e conteúdo estreito no navegador.
