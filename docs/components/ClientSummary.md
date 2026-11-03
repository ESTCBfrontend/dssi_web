# ClientSummary

Resumo de cliente baseado em [MDS/ClientSummary](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=184-4046), composto por [Card](Card.md), [StatusBadge](StatusBadge.md) e [Button](Button.md).

```tsx
import { ClientSummary } from '../../shared/ui/ClientSummary'

<ClientSummary client={{ id: '1', name: 'Cliente', contact: 'geral@exemplo.pt' }}
  state="active" onOpen={abrirCliente} />
```

## API e comportamento

- `client.id` e `client.name` são obrigatórios e não vazios. `subtitle`, `contact`, `responsible`, `sites`, `activeOrders` e `pending` são textos opcionais preparados pela aplicação; valores ausentes ou vazios são omitidos.
- `state` é `active` ou `review`; fornece a apresentação e a ação padrão do Figma, sem alterar o estado de negócio. Os campos fornecidos são apresentados independentemente da variante. `status` substitui o badge através de `label`, `tone`, `variant`, `icon` ou `dotSrc`; o `label` não pode ser vazio.
- `onOpen(client)` apresenta a ação e recebe o objeto completo; sem callback não existe botão de abertura. `actions` permite acrescentar controlos. `labels` personaliza nomes dos estados, campos e ações.
- `extraFields` acrescenta pares `{ label, value }`. Valores ausentes ou vazios são omitidos; uma linha apresentada exige etiqueta não vazia. `density`, `variant`, `headingLevel`, `className`, `style`, `ref` e atributos nativos são encaminhados para o Card. Por omissão usa densidade `comfortable`.

## Tema e acessibilidade

Os dados usam uma lista de descrições HTML. As linhas e o cabeçalho adaptam-se à largura disponível; o nome acessível da ação inclui o cliente. `--mds-summary-label-width`, `--mds-color-text-primary` e `--mds-color-text-secondary` configuram as linhas; consultar também os tokens de Card, StatusBadge e Button. O SVG do ponto tem cor fixa e pode ser substituído em `status.dotSrc`. O componente não obtém dados, navega ou verifica permissões. Validar texto longo, teclado, zoom, contraste e leitores de ecrã em navegador real.
