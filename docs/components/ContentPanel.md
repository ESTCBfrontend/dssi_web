# ContentPanel

Contentor de secção baseado em [MDS/ContentPanel](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=94-1081), para conteúdo e ações fornecidos pela aplicação.

```tsx
import { ContentPanel } from '../../shared/ui/ContentPanel'

<ContentPanel title="Equipamentos" description="Lista atual" layout="wide" actions={<button type="button">Adicionar</button>}>
  {listaDeEquipamentos}
</ContentPanel>
```

## API e composição

- `title` e `description` são textos opcionais, não vazios quando fornecidos. `headingLevel` escolhe o nível 2–6 do título, com 2 por omissão.
- `children` contém o conteúdo; `actions` recebe controlos no cabeçalho e `footer` conteúdo opcional após um separador. Separadores surgem apenas entre regiões presentes.
- `layout`: `stacked` (padrão) ou `wide`. Em `wide`, o cabeçalho coloca as ações ao lado apenas quando o painel dispõe de pelo menos 480 px; em menor largura empilha-as.
- `surface`: `surface` (padrão, com borda) ou `muted` (fundo subtil). A altura cresce com o conteúdo e a largura acompanha o contentor.
- A secção recebe o nome acessível do título quando existe; `aria-label` ou `aria-labelledby` explícito prevalece. Aceita `className`, `style`, `ref` e atributos nativos de `section`. Os controlos internos mantêm a própria semântica.

## Tema e validação

Usa tokens CSS `--mds-*` com valores de reserva do Figma e Inter se disponível. Testar conteúdo, cabeçalho e rodapé opcionais, controlos, zoom e larguras de painel; a apresentação responsiva usa container queries e deve ser validada nos navegadores suportados. Não adiciona conteúdo demonstrativo nem controla o estado de visibilidade.
