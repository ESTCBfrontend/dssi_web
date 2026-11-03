# ProgressBar

Progresso determinado baseado em [MDS/ProgressBar](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=148-2379). Para duração ou progresso desconhecidos, usa [LoadingIndicator](LoadingIndicator.md).

```tsx
import { ProgressBar } from '../../shared/ui/ProgressBar'

<ProgressBar label="Ficheiros processados" value={processados} max={total} />
<ProgressBar label="Exportação" value={35} status="error" />
```

## API e comportamento

- `label` é o nome acessível e texto visível do progresso; `value` é numérico. `min` e `max` são opcionais e têm valores iniciais 0 e 100.
- O valor é limitado ao intervalo. Intervalos inválidos ou não finitos usam 0–100; um valor não finito usa o mínimo. O preenchimento usa a percentagem exata e o texto visual é arredondado ao inteiro mais próximo.
- `size` é `compact` (padrão) ou `regular`. `status` é `active` (padrão), `complete` ou `error`; este é independente do valor, pelo que a aplicação deve garantir coerência entre estado e operação. O estado completo ou de erro também é incluído no texto acessível do progresso.
- `showValue={false}` oculta a percentagem visual, mantendo os valores acessíveis. `className` personaliza o contentor.
- Os atributos `aria-valuemin`, `aria-valuemax`, `aria-valuenow` e a largura são derivados do mesmo valor limitado. O componente não anuncia automaticamente todas as alterações; a aplicação gere mensagens de conclusão ou erro adequadas ao contexto.

## Tema e validação

Usa os tokens CSS `--mds-*` e valores de reserva consultados no Figma. Inter é usada quando disponível, com alternativa do sistema. Confirma contraste após personalização e valida os limites, textos longos, zoom e significado do estado com tecnologias de apoio. O estado de erro não deve ser transmitido apenas pela cor na aplicação.
