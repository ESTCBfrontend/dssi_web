# ProgressBar

Progresso determinado baseado em [MDS/ProgressBar](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=148-2379). Para duração ou progresso desconhecidos, usa [LoadingIndicator](LoadingIndicator.md).

```tsx
import { ProgressBar } from '../../shared/ui/ProgressBar'

<ProgressBar label="Ficheiros processados" value={processados} max={total} />
<ProgressBar label="Exportação" value={35} status="error" />
```

## API e comportamento

- `label` é o nome acessível e texto visível do progresso; `value` é numérico. `min` e `max` são opcionais e têm valores iniciais 0 e 100.
- O valor é limitado ao intervalo. Valores não finitos ou intervalos inválidos produzem um erro explícito. Preenchimento e texto usam a mesma percentagem arredondada ao inteiro mais próximo.
- `size` é `compact` ou `regular` (padrão). `status` é `active` (padrão), `complete` ou `error`; `complete` exige que o valor limitado corresponda ao máximo. O consumidor escolhe o estado de acordo com a operação.
- `statusText` permite substituir o texto predefinido de conclusão ou erro e não pode ser vazio. `showStatusText={false}` oculta-o visualmente, mantendo-o no nome acessível; por omissão é visível, para o estado não depender da cor.
- `showValue={false}` oculta a percentagem visual, mantendo os valores acessíveis. `className`, `style` e atributos HTML do contentor permitem integração e personalização.
- Os atributos `aria-valuemin`, `aria-valuemax`, `aria-valuenow` e a largura são derivados do mesmo valor limitado. O componente não anuncia automaticamente todas as alterações; a aplicação gere mensagens de conclusão ou erro adequadas ao contexto.

## Tema e validação

Usa os tokens CSS `--mds-*` e valores de reserva consultados no Figma. Inter é usada quando disponível, com alternativa do sistema. Confirma contraste após personalização e valida os limites, textos longos, zoom e significado do estado com tecnologias de apoio. O estado de erro não deve ser transmitido apenas pela cor na aplicação.
