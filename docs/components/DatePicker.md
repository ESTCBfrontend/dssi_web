# DatePicker

Campo de data civil controlado baseado em [MDS/DatePicker](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=176-3427). Compõe [FormField](FormField.md), [TextField](TextField.md) e [Button](Button.md) e usa o seletor `input type="date"` do navegador.

```tsx
import { DatePicker } from '../../shared/ui/DatePicker'

<DatePicker label="Data" value={data} onChange={setData}
  minDate="2026-01-01" disabledDates={datasIndisponiveis} clearable />
```

## API e comportamento

- `label`, `value` e `onChange` são obrigatórios. O valor é `YYYY-MM-DD` ou `null`: uma data civil, sem hora nem fuso. O callback comunica a data ou `null`; o consumidor deve atualizar o valor.
- `minDate` e `maxDate` são limites inclusivos; `disabledDates` indica datas específicas indisponíveis. Datas impossíveis, formatos incorretos e limites invertidos são rejeitados como configuração inválida. As datas são comparadas sem conversão para UTC.
- As datas bloqueadas não são desativadas visualmente no seletor nativo. Se escolhidas, ou se estiverem fora dos limites, a escolha é rejeitada, é apresentada uma mensagem e o valor anterior mantém-se. A aplicação e o servidor devem confirmar disponibilidade e regras de negócio.
- `required`, `disabled`, `helperText` e `error` configuram o campo; `error` externo tem prioridade sobre o aviso de escolha. `clearable`, `clearLabel` e `unavailableLabel` configuram limpeza e mensagem. `id`, `name`, `className` e `inputRef` permitem integração em formulários e acesso ao input.

## Tema e validação

O campo reutiliza os tokens do TextField e FormField. O calendário e o ícone são nativos: podem diferir do Figma e a ordem visual da data depende do navegador e da sua localidade, apesar de `lang="pt-PT"`. O input expõe validação HTML de `required`, `min` e `max`; a aplicação deve validar também datas bloqueadas e valores recebidos externamente. Confirmar seletor, teclado, datas parciais, fuso, zoom, contraste e leitores de ecrã em navegadores reais.
