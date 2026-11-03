# ChecklistItem

Ponto de verificação controlado baseado em [MDS/ChecklistItem](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=168-2895), utilizável isoladamente ou em [Checklist](Checklist.md). Compõe [StatusBadge](StatusBadge.md), [Button](Button.md) e [RadioGroup](RadioGroup.md).

```tsx
import { ChecklistItem } from '../../shared/ui/ChecklistItem'
import type { ChecklistEntry } from '../../shared/ui/ChecklistItem'

const ponto: ChecklistEntry = { id: 'sensor', title: 'Testar sensor', result: 'pending' }
<ChecklistItem item={ponto} step="01" onChange={atualizarResultado} />
```

## API e comportamento

- `item` contém `id` e `title` não vazios, `result` (`pending`, `pass`, `fail` ou `notTested`) e, opcionalmente, `description` e `note`. `step` é uma identificação textual obrigatória e não vazia. Dados inválidos produzem erro.
- `onChange(result)` disponibiliza a edição através de opções exclusivas nativas. A aplicação mantém o valor e volta a fornecer o ponto atualizado; sem callback o estado é informativo. Depois da escolha, ou ao premir Escape, as opções fecham e o foco regressa ao botão.
- `evidence` recebe conteúdo React livre; `onAddEvidence` disponibiliza uma ação. `note`, conteúdo ou ação são apresentados na área de evidências. Esta área é igualmente visível para `fail` e `notTested`, mesmo quando ainda não há conteúdo. A aplicação define e valida os requisitos de observação e evidência, incluindo ficheiros.
- `disabled` desativa os controlos criados pelo componente, mas não os controlos introduzidos no slot `evidence`.
- `labels` personaliza os quatro resultados, `register`, `edit`, `result`, `evidence` e `addEvidence`. `statusDotSrc` substitui o recurso do ponto; `className`, `style`, `ref` e atributos nativos aplicam-se ao artigo.

## Tema, acessibilidade e validação

O resultado tem texto e cor distintos, e a escolha usa `fieldset` e opções radio associadas ao título. O botão comunica se as opções estão expandidas. O conteúdo da evidência é responsável pela sua própria acessibilidade.

Os tokens incluem `--mds-color-bg-surface`, `--mds-color-bg-subtle`, `--mds-color-border-default`, `--mds-color-border-error`, `--mds-color-text-primary`, `--mds-color-text-secondary`, `--mds-color-text-brand`, `--mds-radius-lg`, `--mds-checklist-item-padding` e `--mds-font-family`. O ponto do badge usa SVG de cor fixa por omissão; pode ser substituído. Os controlos quebram linha em contentores estreitos; validar foco, teclado, contraste e zoom em navegador real.
