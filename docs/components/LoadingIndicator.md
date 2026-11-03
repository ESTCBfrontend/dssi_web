# LoadingIndicator

Indicador de espera indeterminada baseado em [MDS/LoadingIndicator](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=149-2367). Para progresso mensurável, usa [ProgressBar](ProgressBar.md).

```tsx
import { LoadingIndicator } from '../../shared/ui/LoadingIndicator'

<LoadingIndicator type="inline" label="A carregar serviços..." active={aCarregar} />
<LoadingIndicator type="skeleton" label="A carregar detalhes..." />
```

## API e comportamento

- `type`: `spinner` (padrão), `inline` ou `skeleton`; `size`: `compact` ou `comfortable` (padrão).
- `label` descreve a espera e não pode ser vazia, com valor inicial «A processar...». Em `inline` é visível; nas outras variantes está disponível a leitores de ecrã. O indicador usa `role="status"` e `aria-live="off"` por omissão; a composição pode optar por anúncios adequados. O consumidor deve gerir `aria-busy` na região relevante.
- `active={false}` não apresenta o indicador. `reducedMotion` desativa a rotação; a preferência de movimento reduzido do sistema também a desativa. O skeleton é estático.
- `skeletonLines` configura entre 1 e 20 linhas inteiras, com três por omissão. `spinnerSrc` permite substituir o SVG para um tema personalizado; o recurso deve corresponder ao tamanho escolhido. `className`, `style` e atributos HTML permitem personalizar o contentor. O skeleton adapta a largura ao espaço disponível.

## Tema e validação

Usa tokens CSS `--mds-*` com valores de reserva do Figma e Inter quando disponível. Os SVGs originais do spinner têm cores fixas e podem ser substituídos por `spinnerSrc`; verifica a sua legibilidade em temas personalizados. Validar nome acessível, ativação/desativação, movimento reduzido, contraste e conteúdo estreito no navegador.
