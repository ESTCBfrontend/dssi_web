# Checkbox

Controlo de seleção independente baseado em [MDS/Checkbox](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=67-641). Usa um `input type="checkbox"` nativo e aceita os respetivos atributos React.

```tsx
import { Checkbox } from '../../shared/ui/Checkbox'

<Checkbox label="Equipamento verificado" name="verificado" checked={verificado} onChange={event => atualizar(event.target.checked)} />
<Checkbox label="Selecionar todos" indeterminate={algunsSelecionados} checked={todosSelecionados} onChange={alterarTodos} />
```

## API e comportamento

- `label` é obrigatório e associa a etiqueta ao controlo. `description` acrescenta descrição acessível. Texto longo quebra linha.
- `size` aceita `compact` ou `comfortable` (padrão). `checked`/`onChange` permitem uso controlado; `defaultChecked` permite uso não controlado.
- `indeterminate` aplica a propriedade nativa de estado misto ao input. O consumidor mantém a coerência entre estados individuais e misto e atualiza-a após interação; o estado misto não determina por si só o valor submetido.
- Aceita `id`, `name`, `value`, `disabled`, `required`, `ref` e restantes atributos nativos. `aria-describedby` fornecido é combinado com a descrição.
- Foco, ativação por teclado, desativação, reset e submissão seguem o comportamento nativo. Em cores forçadas é apresentado o controlo nativo.

## Tema e validação

As cores usam propriedades CSS `--mds-*` com valores de reserva do Figma. Os ícones do visto são SVGs originais com cores fixas; podem ser substituídos por `--mds-checkbox-check-image` e `--mds-checkbox-disabled-check-image`, com valores CSS `url(...)`. Verifica contraste após personalizar o tema. Inter usa a fonte do sistema quando indisponível. Validar seleção, estado misto, teclado, reset, desativação, contraste e zoom.
