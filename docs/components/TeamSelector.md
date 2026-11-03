# TeamSelector

Seletor controlado de equipa baseado em [MDS/TeamSelector](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=181-3436), composto por [FormField](FormField.md) e [Select](Select.md).

```tsx
import { TeamSelector } from '../../shared/ui/TeamSelector'

<TeamSelector teams={equipas} value={equipaId} onChange={setEquipaId}
  loading={aCarregar} clearable />
```

## API e comportamento

- `teams` contém opções com `id` e `name` não vazios e IDs únicos, mais `description`, `statusLabel`, `initials` e `disabled` opcionais. A descrição e o estado são texto informativo fornecido pela aplicação; só `disabled` impede a escolha. A web usa opções nativas e não apresenta o avatar de `initials` do Figma.
- `value` é um ID controlado ou `null`; `onChange` recebe o ID ou `null`. `selectedLabel` substitui a apresentação quando a opção selecionada ainda não está na lista; por omissão aparece o ID.
- `label`, `placeholder`, `searchLabel`, `emptyLabel`, `loadingLabel` e `retryLabel` configuram textos. `searchable` é verdadeiro por omissão e apresenta pesquisa local separada por nome, descrição e estado; `clearable` permite regressar ao valor vazio.
- `required`, `disabled`, `error` e `helperText` configuram o campo. `loading`, `loadError` e `onRetry` representam a operação externa; o componente não consulta dados por si. `id` e `name` identificam o controlo; `className`, `style`, `ref` e atributos nativos aplicam-se ao contentor.

## Tema, acessibilidade e validação

Usa os tokens e a semântica de Select e FormField. O controlo nativo suporta teclado e a pesquisa tem etiqueta própria. A lista aberta pode diferir do Figma e do painel mobile. `statusLabel` não é uma regra de disponibilidade: a funcionalidade e o servidor devem verificar disponibilidade, permissões e conflitos. Validar teclado, carregamento, zoom e leitores de ecrã em navegadores reais.
