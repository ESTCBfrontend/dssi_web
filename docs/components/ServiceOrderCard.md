# ServiceOrderCard

Resumo de uma ordem de serviço baseado em [MDS/ServiceOrderCard](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=184-3586), composto por [Card](Card.md), [StatusBadge](StatusBadge.md) e [Button](Button.md).

```tsx
import { ServiceOrderCard } from '../../shared/ui/ServiceOrderCard'

<ServiceOrderCard order={{ id: '1', reference: 'OS-42', clientName: 'Cliente' }}
  state="planned" onOpen={abrirOrdem} />
```

## API e comportamento

- `order.id` e `order.reference` são obrigatórios e não vazios. `subtitle`, `clientName`, `location`, `scheduledAt`, `team` e `responsible` são textos opcionais. A aplicação fornece datas já formatadas no fuso correto.
- `state` é `planned` ou `active`; escolhe a apresentação e a ação padrão, sem efetuar transições. Campos fornecidos são apresentados em ambas as variantes. `status` substitui `label`, `tone`, `variant`, `icon` e `dotSrc` do badge.
- `onOpen(order)` disponibiliza a ação e recebe o objeto completo. `actions` acrescenta controlos; `labels` personaliza estados, etiquetas dos campos e ações. Sem callback não surge botão de abertura.
- `extraFields` recebe pares `{ label, value }`; omite valores ausentes ou vazios e exige etiqueta não vazia nos restantes. `density`, `variant`, `headingLevel`, `className`, `style`, `ref` e atributos nativos são encaminhados para o Card; a densidade padrão é `comfortable`.

## Tema e acessibilidade

Os pares usam lista de descrições HTML e quebram linha conforme o espaço. `--mds-summary-label-width`, `--mds-color-text-primary` e `--mds-color-text-secondary` configuram as linhas; consultar também Card, StatusBadge e Button. O SVG do ponto tem cor fixa e pode ser substituído em `status.dotSrc`. A aplicação obtém dados, interpreta datas e gere navegação e permissões. Validar texto longo, teclado, zoom, contraste e leitores de ecrã em navegador real.
