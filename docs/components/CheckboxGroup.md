# CheckboxGroup

Grupo de escolhas múltiplas baseado em [MDS/CheckboxGroup](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=69-667), composto por [Checkbox](Checkbox.md) e um `fieldset` nativo. O estado e a validação pertencem à aplicação.

```tsx
import { CheckboxGroup } from '../../shared/ui/CheckboxGroup'

<CheckboxGroup label="Verificações" options={opcoes} values={valores} onChange={setValores} name="verificacao" layout="twoColumns" />
```

## API

- `label`: legenda obrigatória e não vazia; `description`, `helperText` e `error` são textos opcionais. O erro não pode ser vazio, substitui a ajuda, altera a borda e é associado ao grupo e opções.
- `options`: lista de `{ value: string, label: string, description?: string, disabled?: boolean }`; cada `value` deve ser único e estável.
- `values` é a lista controlada de valores selecionados; `onChange` recebe uma nova lista. Valores selecionados que não constem das opções são preservados ao alterar outra opção; valores duplicados em `options` ou `values` geram erro. O consumidor decide como validar e limpar dados.
- `name` define o nome nativo de submissão para cada checkbox; `disabled` desativa o grupo inteiro; cada opção também pode ser desativada. `size` define a dimensão dos controlos.
- `layout` aceita `stacked` ou `twoColumns`; no segundo caso a grelha só usa duas colunas quando o contentor tem espaço suficiente. `className` personaliza o contentor.

## Acessibilidade e tema

`fieldset`/`legend` dão nome ao grupo. O consumidor controla quando apresentar ou anunciar erros; não é criada uma região viva automaticamente. Os campos usam as propriedades CSS `--mds-*` e os SVGs do Checkbox, conforme [a ficha individual](Checkbox.md). Validar teclado, escolha múltipla, erro, conteúdo longo, zoom e largura reduzida; os exemplos pressupõem estado e opções definidos pelo consumidor.
