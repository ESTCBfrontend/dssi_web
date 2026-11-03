# AppHeader

Cabeçalho baseado em [MDS/AppHeader](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=101-1141), utilizável isoladamente ou no slot `header` de [AppShell](AppShell.md).

```tsx
import { AppHeader } from '../../shared/ui/AppHeader'

<AppHeader title="Serviços" subtitle="Gestão" avatarText={iniciais}
  onProfilePress={abrirPerfil} />
```

## API e comportamento

- `title` é obrigatório; `subtitle` é opcional. Ambos têm de ser não vazios quando fornecidos. `headingLevel` escolhe o nível do título, por omissão 2.
- `mark`, `leading` e `trailing` recebem elementos React fornecidos pela aplicação. A marca e as ações não são geradas automaticamente; o consumidor fornece a sua acessibilidade.
- `avatarText` apresenta o avatar. Com `onProfilePress`, é um botão com nome acessível `profileLabel` («Perfil» por omissão) e texto visível `profileText` («Conta» por omissão); sem callback, o avatar é decorativo e não cria uma ação fictícia.
- `className`, `style`, `ref` e atributos nativos aplicam-se ao `<header>`. O cabeçalho cresce e quebra linha para acomodar o conteúdo, sem altura fixa.

## Tema e validação

Usa tokens de superfície, borda, texto, marca, fundo subtil e foco, `--mds-header-padding-x` e `--mds-font-family`. A área de perfil interativa tem altura mínima de 44 px. Validar marca e ações fornecidas, teclado, texto longo, zoom, contraste e leitores de ecrã em navegador real.
