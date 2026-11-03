# ToastSnackbar

Notificação baseada em [MDS/ToastSnackbar](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=147-2287). Pode ser apresentada isoladamente ou através de uma fila local à árvore React.

```tsx
import { ToastProvider, useToast } from '../../shared/ui/ToastSnackbar'

function Guardar() {
  const { show } = useToast()
  return <button type="button" onClick={() => show({ id: 'guardado', message: 'Alterações guardadas', tone: 'success' })}>Guardar</button>
}

<ToastProvider><Guardar /></ToastProvider>
```

## API e composição

- `ToastProvider` recebe `children`, `closeLabel` e `closeIconSrc`. `useToast()` devolve `show(toast)`, `dismiss(id)` e `clear()`. A fila mostra uma mensagem de cada vez e ignora identificadores já presentes.
- `ToastMessage` requer `id` e `message` não vazios; aceita `title`, `tone` (`info`, `success`, `warning`, `danger`), `durationMs`, `dismissible` e `action: { label, onPress }`. Textos fornecidos não podem ser vazios e uma duração numérica deve ser positiva e finita.
- Por omissão, uma mensagem sem ação e sem tom `danger` dura cinco segundos; erros e mensagens com ação persistem. `durationMs: null` mantém a mensagem e um número define a duração. O temporizador pausa ao passar o rato ou focar a notificação e recomeça ao sair. A ação remove a mensagem após a sua execução.
- `ToastSnackbar` isolado recebe `toast`, `onDismiss`, `closeLabel`, `closeIconSrc` e `announce` (verdadeiro por omissão), além dos atributos de `div`, `className`, `style` e `ref`. Sem `onDismiss`, não apresenta fecho; não gere fila nem duração.
- Mensagens normais são anunciadas como `status` e erros como `alert`; o provider usa regiões de anúncio próprias. A aplicação é responsável por fornecer mensagens e ações adequadas e gerir o resultado das ações.

## Tema e validação

Usa tokens `--mds-color-*`, `--mds-font-family`, `--mds-radius-lg`, `--mds-toast-shadow`, `--mds-toast-z-index`, `--mds-toast-offset-right` e `--mds-toast-offset-bottom`; o ícone de fecho é substituível. O provider não usa portal, para herdar o tema: uma notificação fora de um diálogo modal nativo pode ficar atrás deste ou inacessível; coloca o provider dentro do diálogo quando a mensagem lhe pertence. Validar anúncios, foco, ações, posicionamento e responsividade em navegadores e leitores de ecrã reais.
