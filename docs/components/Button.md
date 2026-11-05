# Button

Botão reutilizável para ações e submissão de formulários. Implementa a família [MDS/Button no Figma](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=29-2). Não incorpora regras de negócio nem navegação.

```tsx
import { Button } from '../../shared/ui/Button'

<Button onClick={guardar}>Guardar</Button>
<Button type="submit" variant="primary" loading={aGuardar}>Submeter</Button>
```

## API

- `children`: conteúdo e nome acessível; para um botão apenas com ícone, fornece `aria-label`.
- `variant`: `primary` (padrão), `secondary`, `outline` ou `danger`.
- `size`: `small`, `medium` (padrão) ou `large`; a dimensão pequena destina-se a interfaces densas.
- `disabled`: desativa o botão nativo. `loading` também o desativa, marca-o com `aria-busy` e apresenta um indicador decorativo. O texto continua visível.
- `loadingLabel`: texto opcional e não vazio que substitui o conteúdo visível enquanto `loading` está ativo.
- `iconStart` e `iconEnd`: elementos decorativos opcionais. Usa `aria-label` quando necessário; não coloques controlos interativos nos ícones.
- `fullWidth`: ocupa a largura disponível. `className`, `style`, `ref` e demais atributos nativos podem ser usados; `type` é `button` por omissão, pelo que a submissão exige `type="submit"`.

O conteúdo pode quebrar linha e o botão cresce em altura. Botões ativos apresentam feedback discreto no hover em dispositivos que o suportam. O foco de teclado é visível; as transições e o indicador respeitam a preferência de movimento reduzido. A aplicação é responsável por comunicar o início e o resultado de operações assíncronas de forma apropriada. Os tokens de movimento e a validação estão em [animations.md](../animations.md).

## Tema e validação

As propriedades CSS `--mds-*` usadas pelo componente correspondem aos nomes e valores consultados no Figma e podem ser substituídas num elemento antepassado. Os valores de reserva permitem utilização independente; cabe ao consumidor assegurar contraste adequado ao personalizar cores. O Figma usa Inter; se a fonte não estiver disponível é usada a fonte do sistema.

Validar ação, teclado, estados desativado e loading, foco, texto longo, zoom e tamanhos de ecrã no browser. Os exemplos acima ilustram integração; as funções e o estado pertencem ao consumidor.
