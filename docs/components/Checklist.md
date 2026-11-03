# Checklist

Lista dinâmica de verificações baseada em [MDS/Checklist](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=170-3207), composta por [ChecklistItem](ChecklistItem.md), [TaskProgress](TaskProgress.md) e [Button](Button.md).

```tsx
import { Checklist } from '../../shared/ui/Checklist'

<Checklist title="Verificações" items={pontos}
  isCompleted={ponto => ponto.result === 'pass' || ponto.result === 'fail'}
  onItemChange={atualizarResultado} onSave={guardar} onSubmit={submeter} />
```

## API e comportamento

- `title` é obrigatório e não vazio; `description` é opcional. `headingLevel` define o título de 2 a 5 e os títulos internos usam o nível seguinte. A secção tem nome acessível e aceita atributos nativos, `ref`, `className` e `style`.
- `items` é uma lista de `ChecklistEntry` com identificadores únicos; cada ponto é validado conforme [ChecklistItem](ChecklistItem.md) e numerado pela ordem recebida. A lista é controlada pela aplicação; `onItemChange(id, result)` comunica a intenção de mudança.
- `isCompleted(item)` é obrigatório e define a regra de conclusão na funcionalidade consumidora. Total e concluídos são calculados a partir da mesma lista. Uma lista vazia mostra a mensagem configurável e não é considerada concluída.
- `renderEvidence(item)` fornece conteúdo para cada ponto; `onAddEvidence(item)` comunica a solicitação de adicionar evidência. A aplicação gere ficheiros, observações, validações e persistência.
- `onSave` e `onSubmit` são opcionais e apresentam os respetivos botões. `actions` permite compor outras ações e `actionsDescription` acrescenta texto. Não existe submissão, pedido de rede ou persistência implícitos.
- `disabled` desativa os controlos fornecidos pela checklist; conteúdo em `actions` e `renderEvidence` é da responsabilidade do consumidor.
- `labels` personaliza `items`, `empty`, `save`, `submit` e `count(total)`; `itemLabels` e `progressLabels` personalizam os componentes compostos. `progressDescription` é texto opcional do resumo. `itemStatusDotSrc(item)` e `progressStatusDotSrc` substituem os recursos dos pontos dos badges.

## Tema, acessibilidade e validação

O contentor usa `--mds-color-bg-surface`, `--mds-color-border-default`, `--mds-color-text-primary`, `--mds-color-text-secondary`, `--mds-checklist-padding`, `--mds-checklist-radius` e `--mds-font-family`; os componentes compostos usam os respetivos tokens. Os pontos dos badges são SVG de cor fixa, substituíveis por props. A lista usa `ol`, títulos associados e controlos nativos; os slots são responsabilidade do consumidor. O conteúdo adapta-se por quebra de linha, mas a lista web não é virtualizada. Validar interações, responsividade, contraste, zoom e leitor de ecrã em browser real.
