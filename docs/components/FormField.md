# FormField

Composição de etiqueta, controlo e mensagem de ajuda ou erro inspirada em [MDS/FormField](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=38-144). Não armazena valores nem executa validação de negócio.

```tsx
import { FormField } from '../../shared/ui/FormField'
import { TextField } from '../../shared/ui/TextField'

<FormField label="Email" required error={erroEmail} helperText="Usa o email profissional.">
  {(field) => <TextField {...field} name="email" type="email" value={email} onChange={alterarEmail} />}
</FormField>
```

## API e composição

- `label` é obrigatório; `id` é opcional e, se omitido, é gerado por React. Um `id` fornecido deve ser único na página.
- `children` é uma função que recebe `id`, `aria-describedby`, `aria-invalid`, `required` e `disabled`. Encaminha estas propriedades ao controlo nativo ou ao componente que o envolve; a associação acessível depende desse encaminhamento.
- `helperText` apresenta ajuda; `error`, quando não vazio, substitui-a e marca o controlo como inválido. Mensagens não são anunciadas automaticamente como alertas; a aplicação gere os anúncios adequados ao fluxo de validação.
- `required` apresenta um asterisco decorativo e é passado ao controlo; `disabled` é igualmente passado ao controlo. O formulário e o controlo continuam responsáveis pelas regras nativas.
- `className` personaliza o contentor. `TextField`, `Textarea` e outros controlos compatíveis podem ser compostos desde que recebam as propriedades fornecidas.

## Tema e validação

Usa tokens CSS `--mds-*` e valores consultados no Figma, com alternativa de fonte do sistema. Confirma contraste ao personalizar. Testar associação da etiqueta, ajuda, erro, obrigatório e desativado com teclado e tecnologias de apoio; mensagens longas devem quebrar linha.
