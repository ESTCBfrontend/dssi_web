# PageLayout

Estrutura de conteúdo baseada em [MDS/PageLayout](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=99-1185), independente de rotas e navegadores. Pode ser usada no conteúdo de [AppShell](AppShell.md).

```tsx
import { PageLayout } from '../../shared/ui/PageLayout'

<PageLayout title="Ordens" description="Acompanha as intervenções."
  breadcrumbs={caminho} actions={acoes} layout="wide">
  {conteudo}
</PageLayout>
```

## API e comportamento

- `title` é obrigatório e não vazio; `description` é opcional e não vazia. `headingLevel` escolhe o nível do título, por omissão 1.
- `breadcrumbs`, `actions`, `children` e `footer` recebem conteúdo real fornecido pela aplicação. A composição é responsável por acessibilidade e interação dos elementos inseridos.
- `layout="wide"` (padrão) coloca as ações junto do título quando o contentor tem largura suficiente; em espaço reduzido empilha-as. `stacked` mantém disposição vertical. A mudança de largura não desmonta os filhos.
- `scrollable` ativa `overflow: auto` sem mudar a árvore de filhos; por omissão a página usa o scroll exterior. Para scroll interno, o consumidor deve fornecer uma altura disponível. `className`, `style`, `ref` e atributos nativos aplicam-se ao contentor.

## Tema e validação

Usa `--mds-color-bg-page`, `--mds-color-text-primary`, `--mds-color-text-secondary`, `--mds-font-family`, `--mds-page-padding` e `--mds-page-radius`. A disposição larga usa container query a partir de 640 px. O componente não cria `main`: o AppShell ou a composição exterior fornece esse marco. Validar scroll, conteúdo longo, foco, zoom e dimensões em navegador real.
