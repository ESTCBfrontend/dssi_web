# EquipmentCard

Resumo de equipamento baseado em [MDS/EquipmentCard](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=184-3816), composto por [Card](Card.md), [StatusBadge](StatusBadge.md) e [Button](Button.md).

```tsx
import { EquipmentCard } from '../../shared/ui/EquipmentCard'

<EquipmentCard equipment={{ id: '1', reference: 'EQ-42', identifier: 'AVAC-42' }}
  state="operational" onOpen={abrirEquipamento} />
```

## API e comportamento

- `equipment.id`, `reference` e `identifier` são obrigatórios e não vazios. `subtitle`, `location`, `lastInspection`, `nextService` e `issue` são textos opcionais já preparados pela aplicação; datas devem ser fornecidas com formato e fuso adequados.
- `state` é `operational` ou `needsService`; determina a apresentação padrão, sem calcular o estado real. Os campos fornecidos são preservados em ambas as variantes. `status` permite substituir `label`, `tone`, `variant`, `icon` e `dotSrc` do badge.
- `onOpen(equipment)` apresenta a ação e recebe o objeto completo. `actions` permite acrescentar controlos; `labels` personaliza estados, nomes dos campos e ações. Sem callback não surge botão de abertura.
- `extraFields` acrescenta pares `{ label, value }`; valores ausentes ou vazios são omitidos, e cada linha apresentada exige etiqueta não vazia. `density`, `variant`, `headingLevel`, `className`, `style`, `ref` e atributos nativos são encaminhados para o Card; a densidade padrão é `comfortable`.

## Tema e acessibilidade

Os detalhes usam lista de descrições HTML e adaptam-se à largura. `--mds-summary-label-width`, `--mds-color-text-primary` e `--mds-color-text-secondary` configuram as linhas; Card, StatusBadge e Button têm os seus tokens. O ponto SVG tem cor fixa e pode ser substituído com `status.dotSrc`. O componente não obtém dados, interpreta datas, navega nem verifica permissões; uma ação de QR exige autorização na funcionalidade consumidora. Validar teclado, zoom, contraste, ecrãs estreitos e leitores de ecrã em navegador real.
