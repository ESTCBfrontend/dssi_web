# PageButton

Botão numérico controlado para compor paginação, baseado em [MDS/PageButton](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=123-1726). Reutiliza [Button](Button.md) e não gere a página ou os dados da aplicação.

```tsx
import { PageButton } from '../../shared/ui/PageButton'

<PageButton page={2} current={pagina === 2} onSelect={setPagina} />
```

## API e comportamento

- `page`: inteiro seguro positivo apresentado no botão. `onSelect` recebe esse número quando é ativado.
- `current` marca a página atual visualmente e com `aria-current="page"`; continua a poder ser ativada. `disabled` impede interação e tem prioridade visual sobre a página atual.
- `size`: `compact` (mínimo visual de 40 px) ou `comfortable` (padrão, mínimo de 44 px). O botão pode crescer com números maiores.
- Por omissão o nome acessível é «Página» seguido do número; `aria-label` pode substituí-lo e não pode ser vazio. Aceita `className`, `style`, `ref` e outros atributos nativos do botão; `type` é `button` por omissão.

## Tema e validação

Usa tokens CSS `--mds-*` de fundo, borda, texto e foco, com reservas consultadas no Figma. Inter usa uma alternativa do sistema se não estiver disponível. Validar nome, foco, página atual, desativação, números longos, zoom e contraste em navegador real.
