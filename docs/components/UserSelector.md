# UserSelector

Seletor controlado de pessoa baseado em [MDS/UserSelector](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=181-3364), composto por [FormField](FormField.md) e [Select](Select.md).

```tsx
import { UserSelector } from '../../shared/ui/UserSelector'

<UserSelector users={tecnicos} teamId={equipaId}
  value={tecnicoId} onChange={setTecnicoId} clearable />
```

## API e comportamento

- `users` recebe opções com `id` e `name` não vazios e IDs únicos; `description`, `statusLabel`, `initials`, `disabled` e `teamIds` são opcionais. Descrição e estado são informativos; `disabled` impede escolha. `initials` não é apresentado no select nativo web.
- `value` é um ID controlado ou `null`; `onChange` comunica a escolha ou limpeza. Com `teamId` fornecido, apenas pessoas que incluam esse ID em `teamIds` fazem parte das opções filtradas. `null` ou omissão mostra a lista completa.
- A alteração de equipa não elimina a seleção anterior. Se estiver fora do filtro, o controlo mantém o nome encontrado na lista completa, `selectedLabel` quando fornecido, ou o ID. A aplicação decide se deve limpar ou assinalar erro; o estado mantido não comprova compatibilidade.
- `label`, `placeholder`, `searchLabel`, `emptyLabel`, `loadingLabel` e `retryLabel` são configuráveis. `searchable` ativa pesquisa local por nome, descrição e estado e é verdadeiro por omissão; `clearable` permite limpar.
- `required`, `disabled`, `error`, `helperText`, `loading`, `loadError` e `onRetry` controlam estados e mensagens. `id` e `name` identificam o select; `className`, `style`, `ref` e atributos nativos aplicam-se ao contentor. Nenhum pedido remoto é iniciado automaticamente.

## Tema, acessibilidade e validação

Reutiliza tokens de Select e FormField. O select nativo, a pesquisa separada e os textos de opção são diferentes da lista rica apresentada no Figma e no mobile. A funcionalidade e o servidor devem verificar associação à equipa, permissões, disponibilidade e conflitos. Validar teclado, filtros, zoom e leitores de ecrã em navegador real.
