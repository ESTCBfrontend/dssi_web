# Textarea

Campo multilinha nativo baseado em [MDS/Textarea](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=59-519), para texto editável e conteúdo variável.

```tsx
import { FormField } from '../../shared/ui/FormField'
import { Textarea } from '../../shared/ui/Textarea'

<FormField label="Observações" helperText="Descreve os trabalhos realizados.">
  {(field) => <Textarea {...field} name="observacoes" maxLength={500} showCounter />}
</FormField>
```

## API e comportamento

- `height`: `compact` (padrão) ou `comfortable`; a largura acompanha o contentor e a altura pode ser redimensionada verticalmente.
- `showCounter` apresenta a contagem atual e, se existir, `maxLength`. A contagem segue o comprimento de strings JavaScript e o limite nativo do browser. O contador visual não é uma região viva; quando o limite for relevante, comunica-o também na ajuda associada ao campo.
- Aceita `value`/`onChange` ou `defaultValue`, `disabled`, `required`, `ref`, `aria-invalid` e restantes propriedades nativas de `textarea`. Um reset nativo do formulário atualiza o contador não controlado.
- O foco é visível; usa `aria-invalid` e uma mensagem associada para erros. Garante sempre uma etiqueta acessível.

## Tema e validação

As propriedades CSS `--mds-*` têm valores de reserva consultados no Figma e podem ser substituídas num antepassado. Inter é usada quando disponível, com alternativa do sistema. Confirma contraste após personalização. Validar edição, contador, limite, reset, desativação, erro, teclado e zoom; o redimensionamento é nativo do navegador.
