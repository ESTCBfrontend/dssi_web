# ActivityItem

Representa um acontecimento rastreável do histórico, com base em [MDS/ActivityItem](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=179-3317). Pode ser usado isoladamente ou em [Timeline](Timeline.md).

```tsx
import { ActivityItem } from '../../shared/ui/ActivityItem'
import type { ActivityEvent } from '../../shared/ui/ActivityItem'

const event: ActivityEvent = {
  id: 'evento-1', type: 'assignment', title: 'Técnico atribuído',
  description: 'A equipa foi atribuída.', author: 'Gestão de operações',
  timestamp: Date.UTC(2026, 10, 11, 16, 20), when: '11/11/2026 · 16:20',
  reference: 'OS-2026-0142', status: { label: 'Atribuição', tone: 'neutral' },
}

<ActivityItem event={event} onOpenRelated={abrirEvento} />
```

## API e comportamento

- `event` recebe `id`, `type` (`status`, `assignment`, `comment`, `completion`), `title`, `author`, `timestamp`, `when`, `reference` e, opcionalmente, `description` e `status`. Os textos obrigatórios, e a descrição quando fornecida, têm de ser não vazios; `timestamp` é um número finito em milissegundos Unix. Valores inválidos produzem um erro explícito.
- `timestamp` permite ordenar eventos; `when` é o texto localizado visível, fornecido pela aplicação. Quando o timestamp está no intervalo de datas JavaScript, é também exposto em `time` no formato ISO. A aplicação fornece autor, referência e data coerentes e efetua qualquer navegação.
- `status` é opcional e usa [StatusBadge](StatusBadge.md): aceita `label`, `tone`, `variant`, `showDot`, `icon` e `dotSrc`. O estado e a sua etiqueta vêm dos dados: o tipo do evento não implica um estado de negócio.
- `onOpenRelated(event)` torna o cartão um botão nativo; sem callback é informativo. `leading` substitui o símbolo decorativo; `trailing` acrescenta conteúdo ao cabeçalho. Quando o cartão é interativo, os conteúdos fornecidos não devem conter controlos interativos aninhados. `leading` é decorativo e fica oculto às tecnologias de apoio.
- `className` e `style` permitem adaptar o contentor. Título, estado e metadados podem quebrar linha conforme o espaço disponível. O símbolo padrão depende do tipo, como no Figma; são caracteres de texto, cuja aparência depende da fonte.

## Tema, acessibilidade e validação

Cores do Figma: `--mds-color-bg-surface`, `--mds-color-border-default`, `--mds-color-bg-info`, `--mds-color-text-brand`, `--mds-color-bg-success`, `--mds-color-text-success`, `--mds-color-text-primary`, `--mds-color-text-secondary` e `--mds-color-border-focus`. `--mds-activity-item-radius` e `--mds-font-family` permitem alterar raio e fonte. O `StatusBadge` tem tokens e recursos próprios. O símbolo pode ser substituído via `leading`.

O botão usa teclado e foco nativos; os textos do evento constituem o nome acessível. Validar contraste, foco, conteúdo longo, zoom e diferentes larguras em navegadores reais; os testes locais não substituem essa validação.
