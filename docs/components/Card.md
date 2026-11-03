# Card

Contentor genérico baseado em [MDS/Card](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=92-1026). Não contém regras de negócio nem executa navegação ou ações automaticamente.

```tsx
import { Card } from '../../shared/ui/Card'
import { StatusBadge } from '../../shared/ui/StatusBadge'

<Card title="Equipamento" subtitle="Informação atual" status={<StatusBadge label="Ativo" tone="success" />} actions={<button type="button">Abrir</button>}>
  <p>{descricao}</p>
</Card>
```

## API e composição

- `title` e `subtitle` são textos opcionais; quando fornecidos não podem ser vazios. `headingLevel` escolhe o nível do título de 2 a 6, com 3 por omissão.
- `status` recebe conteúdo opcional, por exemplo um `StatusBadge`; `children` recebe o conteúdo principal. `footer` e `actions` são espaços opcionais após um separador, com ações por último.
- `density`: `compact` (padrão) ou `comfortable`; `variant`: `outlined` (padrão) ou `elevated`.
- Aceita `className`, `style`, `ref` e restantes atributos de `div`. A largura acompanha o contentor e a altura cresce com o conteúdo. Cabeçalho e ações podem quebrar linha.
- O componente não agrupa controlos num único elemento acessível; o consumidor é responsável pela semântica e ações dos elementos fornecidos.

## Tema e validação

Fundo, borda, texto, espaçamentos e raio usam tokens CSS `--mds-*` com valores consultados no Figma; `--mds-shadow-surface` permite substituir a sombra da variante elevada. Inter usa uma fonte de sistema alternativa quando indisponível. Confirmar contraste, texto e ações longas, zoom e ecrãs estreitos no navegador. Não existe conteúdo demonstrativo incorporado.
