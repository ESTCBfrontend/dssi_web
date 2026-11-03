# Radio

Opção individual de escolha exclusiva baseada em [MDS/Radio](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=76-767). Usa um `input type="radio"` nativo.

```tsx
import { Radio } from '../../shared/ui/Radio'

<fieldset><legend>Prioridade</legend>
  <Radio label="Normal" name="prioridade" value="normal" defaultChecked />
  <Radio label="Alta" name="prioridade" value="alta" />
</fieldset>
```

## API e comportamento

- `label` obrigatório, `description` opcional e `size` igual a `compact` ou `comfortable` (padrão).
- Aceita atributos nativos como `name`, `value`, `checked`, `defaultChecked`, `onChange`, `disabled`, `required` e `ref`. A descrição é associada por `aria-describedby`, preservando referências existentes.
- Opções da mesma escolha devem partilhar `name` e ter uma legenda de grupo apropriada, por exemplo `fieldset`/`legend`. A exclusividade e navegação por teclado seguem o navegador. O componente não implementa um RadioGroup.
- Em cores forçadas usa o controlo nativo. A largura adapta-se ao conteúdo e o texto pode quebrar linha.

## Tema e validação

Os SVGs dos estados são os originais do Figma, com cores fixas. Podem ser substituídos pelas propriedades CSS `--mds-radio-{compact|comfortable}-{default|focus|disabled}-{checked|unchecked}`, com valores `url(...)` e recursos de 28 × 28 px. Inter recorre à fonte do sistema se indisponível. Validar seleção exclusiva, teclado, desativação, contraste, reset e zoom no contexto de utilização.
