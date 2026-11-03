# Form

Superfície de formulário baseada em [MDS/Form](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=48-320), composta com [FormGroup](FormGroup.md), [FormField](FormField.md) e [Button](Button.md). Não guarda dados nem executa validação de negócio ou pedidos.

```tsx
import { Form } from '../../shared/ui/Form'

<Form title="Dados" submitLabel="Guardar" onSubmit={guardar} onReset={limpar}
  pending={aGuardar} error={erroDoServidor} layout="wide">
  {campos}
</Form>
```

## API e comportamento

- `title` e `submitLabel` são obrigatórios e não vazios; `description`, `error` e `resetLabel`, quando aplicáveis, também não podem ser vazios. `headingLevel` escolhe o nível do título entre 2 e 6.
- `children` recebe os campos do consumidor. O elemento é um `<form>` real: Enter e validação HTML seguem as regras do navegador. `onSubmit(event)` é chamado após validação nativa; o componente impede a navegação padrão e a aplicação pode obter os valores ou ler o seu estado. A validação de negócio e os erros por campo pertencem ao consumidor.
- `onReset(event)` é opcional e apresenta um botão `type="reset"`. Por omissão mantém o reset HTML de campos não controlados; a aplicação pode chamar `event.preventDefault()` e atualizar os valores controlados por si.
- `pending` desativa os botões, indica ocupação e impede submissão ou reset também pelos eventos do formulário. Os campos permanecem montados e não são automaticamente desativados. `loadingLabel` personaliza o texto do botão em processamento.
- `error` apresenta erro geral com `role="alert"`; `footerNote` apresenta texto adicional. `layout="stacked"` empilha ações; `wide` coloca-as lado a lado quando o contentor tem largura suficiente.
- `className`, `style`, `ref` e atributos nativos são aplicados ao formulário; o título fornece o seu nome acessível, salvo se a aplicação fornecer `aria-label`.

## Tema e validação

Usa os tokens semânticos `--mds-color-*`, `--mds-radius-lg`, `--mds-font-family` e `--mds-form-padding`. O layout `wide` usa container query a partir de 640 px; os campos filhos decidem a sua própria disposição. Validar teclado, submissão, reset, zoom, contraste, tamanhos e leitores de ecrã num navegador real.
