# ImagePicker

Seleção de fotografias e galeria controlada de [PhotoTile](PhotoTile.md), baseada em [MDS/ImagePicker](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=160-2730). A aplicação mantém os dados e controla todas as ações.

```tsx
import { ImagePicker } from '../../shared/ui/ImagePicker'

<ImagePicker title="Fotografias" photos={fotografias} onAdd={adicionar}
  onRemove={remover} onOpen={abrir} maxFiles={8} />
```

## API e comportamento

- `title` é obrigatório e não vazio; `description` é opcional e não vazia. `headingLevel` escolhe o nível de 2 a 6. A secção aceita atributos nativos, `ref`, `className` e `style`.
- `photos` é uma lista controlada de `ImageEntry`: `photo`, `state`, `progress` obrigatório em envio e `selected` opcional. Os identificadores têm de ser únicos e os dados de cada miniatura são validados por [PhotoTile](PhotoTile.md).
- `onAdd(files: File[])` recebe os objetos originais do navegador após seleção válida em `input type="file"` com `accept="image/*"`. Cancelar ou selecionar zero imagens não chama o callback; o input é limpo após cada escolha para permitir escolher novamente a mesma imagem. A aplicação atribui IDs, gera e liberta eventuais object URLs, e gere persistência, processamento e transferência.
- `maxFiles` e `maxSizeBytes` são inteiros seguros positivos opcionais; a quantidade inclui fotografias já fornecidas. Uma seleção é rejeitada na totalidade quando ultrapassa os limites, tem MIME que não começa por `image/` ou tem mais de um ficheiro com `multiple={false}`. A seleção fica desativada no limite.
- `onOpen`, `onRemove` e `onRetry` são encaminhados para as miniaturas; o envio em curso não apresenta remoção. `disabled` impede seleção e ações internas. `onCapture` é uma ação opcional ligada pela aplicação: não solicita permissões, abre a câmara, cria ficheiros ou atualiza a galeria por si.
- `formatsHint` apresenta ajuda; `error` apresenta erro externo e prevalece sobre erros locais. `labels` personaliza instruções, estados vazios, erros e `count(count, photos)`; `photoLabels` personaliza as miniaturas. `renderPreview(photo)` fornece conteúdo visual decorativo. `plusIconSrc`, `statusDotSrc(entry)` e `placeholderSources` permitem substituir recursos do tema.

## Plataforma e validação

A web usa o seletor do navegador, enquanto o mobile utiliza APIs nativas de galeria e câmara; o callback de câmara na web é uma extensão opcional da aplicação. MIME é apenas metadado e não prova o conteúdo: validar também ficheiros, tamanho e autorização na aplicação e no servidor. A grelha usa flex-wrap, mas não é virtualizada. O botão funciona por teclado e erros usam `role="alert"`. Usa tokens `--mds-*`, incluindo `--mds-image-picker-padding`; os SVG originais têm cores fixas e são substituíveis. Validar seletor, imagens, foco, zoom, contraste e grelha em navegadores reais.
