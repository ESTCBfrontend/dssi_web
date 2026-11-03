# TextField

Campo de texto nativo reutilizável, baseado em [MDS/TextField](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=35-19). A etiqueta e as mensagens são responsabilidades do [FormField](FormField.md) ou do consumidor.

```tsx
import { FormField } from '../../shared/ui/FormField'
import { TextField } from '../../shared/ui/TextField'

<FormField label="Número da ordem" required>
  {(field) => <TextField {...field} name="numero" placeholder="Ex.: 123" />}
</FormField>
```

## API e comportamento

- `size`: `small`, `medium` (padrão) ou `large`. Ocupa a largura disponível.
- `iconStart`: ícone decorativo opcional antes do texto; não deve conter controlos interativos nem ser a única forma de comunicar informação.
- Aceita propriedades nativas de `input`, incluindo `value`/`onChange` para uso controlado, `defaultValue` para uso não controlado, `name`, `type`, `disabled`, `required`, `ref` e atributos ARIA. O tipo por omissão é `text`.
- O foco é visível; `aria-invalid="true"` apresenta o estado de erro. Usa uma mensagem associada via `aria-describedby`, e não apenas a cor. `disabled` usa o comportamento nativo.
- Deve ter sempre nome acessível por `label` associado ou outra técnica apropriada; o placeholder não substitui a etiqueta.

## Tema e validação

Usa propriedades CSS `--mds-*` com valores consultados no Figma, substituíveis por um antepassado, e Inter se disponível, com alternativa do sistema. O consumidor deve verificar contraste ao substituir tokens. Validar edição, foco, erro, desativação, teclado, zoom e larguras reduzidas no navegador.
