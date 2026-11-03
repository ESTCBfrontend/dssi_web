# AppShell

Estrutura responsiva baseada em [MDS/AppShell](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=102-1281). Compõe conteúdo fornecido pela aplicação sem escolher uma biblioteca de rotas.

```tsx
import { AppShell } from '../../shared/ui/AppShell'

<AppShell header={cabecalho} navigation={navegacao}>
  {pagina}
</AppShell>
```

## API e comportamento

- `header`, `navigation`, `children` e `footer` recebem elementos reais; por exemplo, [AppHeader](AppHeader.md), vários [NavItem](NavItem.md) e [PageLayout](PageLayout.md). O conteúdo e a navegação não são duplicados ao mudar de largura.
- A estrutura cria `<nav>` com `navigationLabel` configurável e um único `<main>`. O `header` deve fornecer o seu próprio elemento semântico; o slot de navegação deve conter itens e não outro `<nav>`. O `footer` é colocado no fim do conteúdo principal.
- `skipLabel` configura a ligação de salto para o conteúdo, visível ao receber foco. `mainId` permite identificar o destino; quando omitido é gerado um ID. A aplicação gere foco entre rotas e navegação efetiva.
- Em contentores com pelo menos 768 px a navegação aparece na lateral; abaixo passa para baixo do conteúdo e permite deslocação horizontal. O layout mantém os mesmos nós montados. A ordem do DOM coloca a navegação antes do conteúdo para navegação por teclado.
- `sidebarCollapsed` reduz a largura lateral em ecrãs largos, sem ocultar ou alterar os elementos fornecidos; a aplicação deve adequar o conteúdo ao espaço. `className`, `style`, `ref` e atributos nativos aplicam-se ao contentor. Não fixa cabeçalho ou navegação nem impõe altura ou gestão de scroll.

## Tema e validação

Usa `--mds-color-bg-page`, `--mds-color-bg-surface`, `--mds-color-border-default`, `--mds-color-text-brand`, `--mds-sidebar-width` e `--mds-sidebar-collapsed-width`. As larguras padrão são 220 px e 72 px. Os itens `place="auto"` acompanham a largura do AppShell; o conteúdo pode usar os seus próprios tokens. Validar redimensionamento, scroll, atalho, foco, zoom, navegação real e leitores de ecrã em navegadores reais.
