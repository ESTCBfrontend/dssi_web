# Select

Escolha individual controlada baseada em [MDS/Select](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=52-595). Usa um `<select>` nativo para preservar teclado, formulários e acessibilidade do navegador; pode ser composto com [FormField](FormField.md).

```tsx
import { FormField } from '../../shared/ui/FormField'
import { Select } from '../../shared/ui/Select'

<FormField label="Equipa" error={erro} required>
  {campo => <Select {...campo} options={equipas} value={equipa} onChange={setEquipa} searchable clearable />}
</FormField>
```

## API e comportamento

- `options` contém `{ value, label, description?, disabled? }`; valores são únicos e não vazios e etiquetas não vazias. `value` é `string | null`, controlado pelo consumidor; `onChange` comunica a escolha ou `null` ao limpar. O componente não carrega dados nem altera o valor por si.
- `placeholder` identifica o valor vazio; `clearable` permite regressar ao vazio. Com `required`, a validação nativa não considera o valor vazio válido. Se o valor selecionado ainda não estiver nas opções, usa `selectedLabel` ou o próprio valor até chegar a opção correspondente.
- `searchable` apresenta um campo de pesquisa separado, identificado por `searchLabel`; filtra localmente por etiqueta e descrição, sem fazer pedidos. O valor selecionado continua presente se o filtro o excluir. A descrição integra o texto da opção nativa; não são suportados conteúdos React ricos dentro das opções.
- `loading`, `loadingLabel`, `loadError`, `onRetry`, `retryLabel` e `emptyLabel` permitem apresentar estados de opções fornecidos pela aplicação. Durante `loading`, o select e a pesquisa são desativados; como acontece em HTML, um controlo desativado não é incluído na submissão. O consumidor gere o carregamento e repetição.
- `size` é `small`, `medium` ou `large`; `iconStart` é decorativo. `id`, `name`, `required`, `disabled`, `ref`, `aria-invalid`, `aria-describedby` e os restantes atributos nativos são encaminhados para o select; `className` aplica-se ao controlo. Uma etiqueta visível através de `FormField` ou um nome acessível explícito é necessária.

## Tema, diferenças mobile e validação

Usa tokens de superfície, bordas, texto, foco e tamanhos `--mds-*` do Figma. `--mds-select-chevron` permite substituir o SVG original de cor fixa, por exemplo `url('/icone.svg')`. A web usa select nativo e uma pesquisa separada; mobile usa um painel de opções com pesquisa e conteúdo visual personalizável. A lista não é virtualizada. Confirmar seleção por teclado, pesquisa, erros, formulários, zoom, contraste e aparência em navegadores reais.
