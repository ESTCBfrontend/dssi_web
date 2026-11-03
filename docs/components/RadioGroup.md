# RadioGroup

Grupo de escolha exclusiva baseado em [MDS/RadioGroup](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=77-827), composto por [Radio](Radio.md) e um `fieldset` nativo. A aplicação mantém o valor e a validação.

```tsx
import { RadioGroup } from '../../shared/ui/RadioGroup'

<RadioGroup label="Prioridade" options={opcoes} value={prioridade} onChange={setPrioridade} name="prioridade" required />
```

## API

- `label` é a legenda obrigatória e não vazia; `description`, `helperText` e `error` são opcionais. O erro não pode ser vazio, substitui a ajuda e é associado ao grupo e às opções.
- `options`: lista de `{ value: string, label: string, description?: string, disabled?: boolean }`; valores duplicados geram erro e os valores devem ser estáveis.
- `value` é o valor controlado ou `null` para nenhuma seleção; `onChange` recebe o valor escolhido. `required` ativa a validação nativa; `disabled` desativa o grupo e cada opção também pode ser desativada.
- `name` define o nome nativo de submissão; se omitido é gerado um nome distinto por grupo. Para uma chave de submissão previsível fornece `name` explicitamente. `size` define a dimensão dos radios.
- `layout` aceita `stacked` ou `twoColumns`, com adaptação à largura do contentor. `className` personaliza o contentor.

## Acessibilidade e tema

`fieldset`/`legend`, seleção exclusiva e navegação nativa dos radios dão estrutura ao grupo. A aplicação gere a apresentação e o anúncio de erros e alterações de estado. Os tokens e SVGs de Radio estão descritos [na sua ficha](Radio.md). Validar seleção exclusiva, ausência de valor, teclado, erro, conteúdo longo, zoom e largura reduzida.
