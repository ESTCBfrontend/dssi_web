# Switch

Controlo binário baseado em [MDS/Switch](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=82-955). Usa um checkbox nativo com papel acessível `switch`, apropriado para opções de ligar/desligar.

```tsx
import { Switch } from '../../shared/ui/Switch'

<Switch label="Receber notificações" checked={ativo} onChange={event => atualizar(event.target.checked)} />
```

## API e comportamento

- `label` obrigatório, `description` opcional e `size` igual a `compact` ou `comfortable` (padrão). A descrição é associada ao controlo e preserva `aria-describedby` fornecido.
- Aceita `checked`/`onChange` ou `defaultChecked`, além de `name`, `value`, `disabled`, `required`, `ref` e outros atributos nativos. A aplicação decide quando guardar ou aplicar a alteração.
- O nome deve permanecer estável ao alternar o estado. Foco, espaço, desativação, reset e submissão seguem o input nativo; em cores forçadas usa a apresentação nativa.
- O texto adapta-se ao espaço disponível e pode quebrar linha.

## Tema e validação

Os SVGs de fundo e marcador são os originais do Figma e têm cores fixas; alterações de tema exigem verificar a sua legibilidade. As cores de texto e foco usam propriedades CSS `--mds-*`. Inter recorre à fonte do sistema quando indisponível. Validar alternância, estado anunciado, teclado, desativação, reset, contraste e zoom.
