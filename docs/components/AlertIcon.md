# AlertIcon

Ícone informativo circular baseado em [MDS/AlertIcon](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=89-901). Não interpreta estados de negócio nem executa ações.

```tsx
import { AlertIcon } from '../../shared/ui/AlertIcon'

<AlertIcon tone="warning" />
<AlertIcon tone="success" size={36} decorative={false} accessibilityLabel="Operação concluída" />
```

## API e comportamento

- `tone`: `info` (padrão), `success`, `warning` ou `danger`. Cada tom tem um símbolo distinto, além da cor.
- `size`: diâmetro em pixels, finito e superior a zero; o padrão é 30 e o símbolo escala proporcionalmente. `colorOverride` substitui o fundo localmente.
- `decorative` é `true` por omissão e oculta o ícone das tecnologias de apoio. Com `decorative={false}`, `accessibilityLabel` é obrigatória e não vazia; o elemento tem papel de imagem.
- Aceita `className`, `style`, `ref` e outros atributos de `span`. O ícone é informativo, não um botão.

## Tema e validação

O fundo utiliza os tokens `--mds-color-bg-status-*-solid` e o símbolo usa `--mds-color-text-on-brand`; os valores de reserva são os consultados no Figma. O símbolo usa Inter quando disponível, com alternativa do sistema, pelo que a aparência pode diferir quando a fonte não estiver instalada. Ao personalizar as cores, confirma o contraste. Testar tons, tamanhos inválidos, modo decorativo, nome acessível e alterações dinâmicas.
