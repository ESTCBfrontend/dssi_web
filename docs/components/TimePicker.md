# TimePicker

Campo de hora controlado baseado em [MDS/TimePicker](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=177-3243). Compõe [FormField](FormField.md), [TextField](TextField.md), [Select](Select.md) e [Button](Button.md).

```tsx
import { TimePicker } from '../../shared/ui/TimePicker'

<TimePicker label="Hora" value={hora} onChange={setHora}
  availableSlots={horariosDisponiveis} clearable />
```

## API e comportamento

- `label`, `value` e `onChange` são obrigatórios. `value` é `HH:mm` em formato 24 horas ou `null`: hora local sem data nem fuso. A aplicação combina-a com a data e fuso apropriados. `24:00`, minutos inválidos e limites invertidos são rejeitados.
- `minTime` e `maxTime` são limites inclusivos dentro do mesmo dia; não representam intervalos que atravessam a meia-noite. Uma hora escolhida fora dos limites é rejeitada, preservando o valor anterior e apresentando aviso.
- Sem `availableSlots`, usa `input type="time"` com precisão ao minuto. Com uma lista de horas válidas e únicas, apresenta um select nativo com as opções dentro dos limites; uma lista vazia apresenta a mensagem `emptyLabel`. Um valor externo antigo continua visível mesmo quando já não está disponível; a aplicação deve decidir se pode submetê-lo.
- `required`, `disabled`, `helperText` e `error` configuram o campo; `error` externo prevalece. `clearable`, `clearLabel` e `unavailableLabel` configuram limpeza e aviso. `id`, `name` e `className` são encaminhados; `inputRef` aplica-se ao input nativo quando não há lista de horários.

## Tema e validação

Os campos reutilizam tokens dos componentes compostos. O seletor e o ícone são nativos e podem diferir do Figma; o formato visual depende também do navegador e da localidade. A disponibilidade real deve ser confirmada pela aplicação e servidor. Validar seletores, teclado, hora local, limites, zoom e leitores de ecrã em navegadores reais.
