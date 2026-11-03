# TaskProgress

Resumo de progresso das verificações baseado em [MDS/TaskProgress](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=169-2837). Compõe [ProgressBar](ProgressBar.md) e [StatusBadge](StatusBadge.md) e pode ser usado isoladamente ou na [Checklist](Checklist.md).

```tsx
import { TaskProgress } from '../../shared/ui/TaskProgress'

<TaskProgress completed={8} total={13} description="Verificações técnicas" />
```

## API e comportamento

- `completed` e `total` são inteiros seguros não negativos, com `completed <= total`; valores inválidos produzem erro. A aplicação define o que conta como concluído.
- `title` é opcional e não vazio; `description` é opcional. `headingLevel` escolhe o nível de título de 2 a 6, por omissão 3. O contentor é uma secção com nome acessível e aceita atributos nativos, `ref`, `className` e `style`.
- Para zero pontos, apresenta zero e «Sem verificações». Só indica conclusão quando `total > 0` e ambos os valores coincidem. Nos restantes casos, a percentagem arredondada é limitada a 99%, para não anunciar conclusão antecipada.
- `labels` substitui parcialmente `inProgress`, `complete`, `empty`, `progress`, `count(completed, total)` e `summary(completed, total, percent)`. O texto `complete` também identifica o estado acessível da barra.
- `statusDotSrc` permite substituir o SVG do ponto do estado. A origem deve ser apropriada ao tema.

## Tema e validação

O Figma usa superfície, borda e texto em `--mds-color-bg-surface`, `--mds-color-border-default`, `--mds-color-text-primary`, `--mds-color-text-secondary` e `--mds-color-text-success`. `--mds-task-progress-padding`, `--mds-radius-lg` e `--mds-font-family` ajustam apresentação. Consultar também os tokens da barra e do badge; os SVG de ponto originais têm cores fixas. O indicador adapta-se ao espaço através de flex-wrap. Validar contraste, zoom, tamanhos e tecnologias de apoio num navegador real.
