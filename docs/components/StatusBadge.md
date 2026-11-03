# StatusBadge

Etiqueta informativa para indicar um estado ou prioridade. Implementa [MDS/StatusBadge no Figma](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=86-958); não é um controlo interativo.

```tsx
import { StatusBadge } from '../../shared/ui/StatusBadge'

<StatusBadge label="Concluído" tone="success" showDot />
<StatusBadge label="Aguarda revisão" tone="warning" variant="solid" size="medium" />
```

## API

- `label`: texto obrigatório com significado; a cor e o ponto não devem ser a única forma de identificar o estado.
- `tone`: `neutral` (padrão), `info`, `success`, `warning` ou `danger`.
- `variant`: `soft` (padrão) ou `solid`; `size`: `small` (padrão) ou `medium`.
- `showDot`: mostra o indicador decorativo do Figma. `icon` aceita um ícone decorativo facultativo.
- `className`, `style`, `ref` e outros atributos de `span` são encaminhados para o elemento. Para comunicar mudanças dinâmicas, a aplicação pode usar uma região viva apropriada ao contexto.

## Tema e validação

As cores usam propriedades CSS semânticas `--mds-*` consultadas no Figma, com valores de reserva. O consumidor pode substituir os tokens num antepassado e deve verificar o contraste; os pontos são SVGs originais com cor fixa, pelo que devem ser revistos ao personalizar o tema. A fonte é Inter quando disponível, com alternativa do sistema. Textos longos podem quebrar linha e aumentar a altura da etiqueta.

Validar texto, tons, indicador, contraste e conteúdo em ecrãs estreitos e com zoom. O componente não atribui significado de negócio ao tom escolhido.
