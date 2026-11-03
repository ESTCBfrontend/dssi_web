# DateRangePicker

Intervalo de datas controlado baseado em [MDS/DateRangePicker](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=178-3271), composto por dois [DatePicker](DatePicker.md).

```tsx
import { DateRangePicker } from '../../shared/ui/DateRangePicker'

<DateRangePicker title="Período" value={periodo} onChange={setPeriodo}
  minDate="2026-01-01" maxDate="2026-12-31" />
```

## API e comportamento

- `title`, `value` e `onChange` são obrigatórios. `value` tem `{ start, end }`, cada um `YYYY-MM-DD | null`; períodos parcialmente preenchidos são permitidos. O consumidor decide se ambos são obrigatórios.
- `minDate`, `maxDate` e `disabledDates` são encaminhados aos dois campos. O máximo do início acompanha o fim e o mínimo do fim acompanha o início, respeitando os limites globais. As datas podem ser iguais. Uma data bloqueada dentro do período não invalida automaticamente o intervalo inteiro.
- Um intervalo invertido fornecido pelo consumidor permanece visível e mostra erro; os campos continuam disponíveis para correção. `error` externo prevalece. A limpeza comunica `{ start: null, end: null }`; `disabled` desativa os campos e a limpeza.
- `labels` personaliza `start`, `end`, `empty`, `selected`, `review`, `hint`, `invalid`, `clear` e `unavailable`. `startName` e `endName` identificam os inputs de formulário. O contentor é um `fieldset` com `legend`, aceita `ref`, `className`, `style` e atributos nativos.

## Tema e validação

O contentor usa tokens de superfície, bordas, texto, erro, `--mds-radius-lg` e `--mds-font-family`; os campos usam os seus próprios tokens. A disposição quebra linha em espaços estreitos. Cada seletor é nativo e pode diferir do Figma. Validar seleção, ordem, limites, teclado, zoom e tecnologias de apoio em navegador real.
