# Dialog

Diálogo modal controlado, baseado em [MDS/Dialog](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=139-2039). A aplicação decide quando abrir, fechar e executar ações.

```tsx
import { useRef, useState } from 'react'
import { Dialog } from '../../shared/ui/Dialog'

function Confirmacao() {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  return <><button ref={trigger} onClick={() => setOpen(true)}>Remover</button>
    <Dialog open={open} title="Remover item" message="Confirma a remoção?" intent="danger"
      returnFocusRef={trigger} onCloseRequest={() => setOpen(false)}
      actions={<button type="button" onClick={() => setOpen(false)}>Cancelar</button>} />
  </>
}
```

## API e composição

- `open`, `title` e `onCloseRequest` são obrigatórios. A função recebe `closeButton`, `escape`, `backdrop` ou `native`; o consumidor atualiza `open`. O título deve ser não vazio.
- `description` é associada ao diálogo; `message`, `children` e `actions` compõem o conteúdo. Os textos fornecidos devem ser não vazios. A aplicação fornece os botões e as suas ações.
- `size` escolhe `compact` (padrão) ou `wide`; `intent` escolhe `neutral` (padrão) ou `danger`. `dismissible` e `showClose` são verdadeiros por omissão; `dismissOnBackdrop` é falso. Se o fecho estiver desativado, inclui uma saída acessível nas ações.
- `closeLabel` e `closeIconSrc` substituem a etiqueta e o ícone; `initialFocusRef` indica um elemento dentro do diálogo e, na sua ausência, o título recebe foco. `returnFocusRef` indica o destino ao fechar; usa referências estáveis e elementos montados.
- Aceita `className`, `style`, `ref` e atributos nativos de `dialog`. Os filhos mantêm-se montados enquanto fechado. Para ações, prefere botões `type="button"` e alteração controlada de `open`.

## Tema e validação

Usa o elemento modal nativo `dialog` e tokens `--mds-color-*`, `--mds-font-family`, `--mds-radius-xl` e `--mds-overlay-backdrop`; o ícone pode ser substituído para acompanhar o tema. A apresentação adapta-se ao espaço e o conteúdo extenso pode fazer scroll. Testar em navegadores reais o foco inicial e de retorno, Escape, navegação por teclado, leitores de ecrã, zoom e modais sobrepostos; os testes em jsdom simulam a API nativa.
