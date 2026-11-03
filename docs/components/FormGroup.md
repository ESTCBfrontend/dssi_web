# FormGroup

Contentor para organizar campos relacionados, baseado em [MDS/FormGroup](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=42-204). Não gere valores, validação ou submissão; usa-o dentro de um formulário quando necessário.

```tsx
import { FormGroup } from '../../shared/ui/FormGroup'

<FormGroup title="Dados da intervenção" layout="twoColumns" secondary={<FormFieldSecundario />} actions={<button type="submit">Guardar</button>}>
  <FormFieldPrincipal />
</FormGroup>
```

## API e composição

- `title` e `description` são opcionais e não podem ser vazios quando fornecidos. `headingLevel` escolhe o nível 2–6 do título, com 2 por omissão.
- `children` e `secondary` recebem blocos de campos reais; `actions` recebe controlos opcionais após os campos. A aplicação gere valores, erros e ações.
- `layout`: `stacked` (padrão) ou `twoColumns`. Este último apresenta os blocos lado a lado quando o grupo dispõe de pelo menos 640 px, e empilhados quando dispõe de menos espaço. A mudança de layout mantém os mesmos elementos e o estado dos campos.
- A secção recebe o nome acessível do título, salvo `aria-label` ou `aria-labelledby` explícito. Aceita `className`, `style`, `ref` e atributos nativos de `section`; os campos preservam a sua própria semântica e etiquetas.

## Tema e validação

Cores e raio usam tokens CSS `--mds-*` com reservas do Figma; Inter usa uma fonte de sistema alternativa quando indisponível. Confirmar conteúdo longo, teclado, preservação de valores, zoom e larguras do contentor no navegador. A adaptação usa container queries, pelo que a compatibilidade deve ser verificada nos navegadores suportados.
