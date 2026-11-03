# AssignmentPanel

Painel controlado de atribuição baseado em [MDS/AssignmentPanel](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=182-3418), composto por [TeamSelector](TeamSelector.md), [UserSelector](UserSelector.md), [StatusBadge](StatusBadge.md) e [Button](Button.md).

```tsx
import { AssignmentPanel } from '../../shared/ui/AssignmentPanel'

<AssignmentPanel title="Atribuição" value={atribuicao} onChange={setAtribuicao}
  teams={equipas} users={tecnicos} canSubmit={podeSubmeter} onSubmit={guardar} />
```

## API e comportamento

- `title`, `value`, `onChange`, `teams`, `users`, `canSubmit` e `onSubmit` são obrigatórios. `value` contém `{ teamId: string | null, userId: string | null }`; ao mudar uma seleção, `onChange` recebe o objeto completo. A aplicação mantém o valor.
- `canSubmit` é a decisão explícita do consumidor e controla a ação; `onSubmit(value)` recebe o valor atual. O painel não valida compatibilidade, autorização ou disponibilidade. A funcionalidade deve fazê-lo antes de permitir o pedido e o servidor deve validar e aplicar a atribuição.
- `filterUsersByTeam` filtra as opções pelo `teamId` quando este existe. Mudar a equipa preserva `userId` mesmo quando fica fora da lista; o consumidor decide como tratar o caso e não deve autorizar uma combinação inválida.
- `state` é `draft` ou `assigned` e altera a apresentação padrão; `statusLabel`, `statusTone` e `submitLabel` permitem personalizar estado e ação. `subtitle`, `note` e `noteLabel` são opcionais; o conteúdo React fornecido em `note` é da responsabilidade do consumidor.
- `pending` e `disabled` bloqueiam seletores e ação; durante `pending` o botão indica carregamento. `error`, `teamError` e `userError` apresentam erros gerais ou dos campos. `teamsLoading`, `usersLoading`, `teamsError`, `usersError`, `onRetryTeams` e `onRetryUsers` representam operações externas independentes.
- `labels` permite personalizar `draft`, `assigned`, `confirm`, `change`, `team`, `user`, `note` e `loading`. `headingLevel` escolhe o nível do título; `className`, `style`, `ref` e atributos nativos aplicam-se à secção.

## Tema e validação

Usa tokens de superfície, borda, texto, erro e fundo subtil, `--mds-assignment-padding`, `--mds-assignment-radius` e `--mds-font-family`; os componentes compostos têm tokens próprios. Os seletores quebram linha em espaço reduzido e usam controlos nativos web. A secção tem título acessível e o erro geral usa `role="alert"`. Validar teclado, pesquisa, largura, zoom, contraste e leitores de ecrã em navegador real.
