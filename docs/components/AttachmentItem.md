# AttachmentItem

Apresenta um anexo e as ações fornecidas pelo consumidor, com base em [MDS/AttachmentItem](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=155-2495). Compõe [StatusBadge](StatusBadge.md), [ProgressBar](ProgressBar.md) e [Button](Button.md). Pode ser usado isoladamente ou em [FileUpload](FileUpload.md).

```tsx
import { AttachmentItem } from '../../shared/ui/AttachmentItem'

<AttachmentItem file={{ id: '1', name: 'relatorio.pdf', details: 'PDF · 1 MB', kind: 'document' }}
  state="uploading" progress={42} onOpen={abrir} />
```

## API e comportamento

- `file` recebe `id`, `name` e `details` não vazios; `kind` é `document` ou `photo` e `uri` é opcional. `details` é texto formatado pela aplicação. O nome completo mantém-se no DOM e quebra linha quando necessário.
- `state` é controlado: `ready`, `uploading` ou `error`. Em envio, `progress` é obrigatório e finito entre 0 e 100; a barra e o texto mostram o mesmo valor arredondado. Dados inválidos produzem erro explícito.
- `onOpen(file)` torna a área principal num botão. `onRemove(file)` aparece em `ready` e `error`; `onRetry(file)` apenas em `error`. Nenhuma ação altera ficheiros ou inicia operações por si.
- `labels` personaliza `ready`, `uploading`, `error`, `errorDetails`, `progress`, `retry`, `open` e `remove`; `uploadingDetails(progress)` personaliza o texto do envio. `className`, `style`, `ref` e atributos nativos aplicam-se ao artigo.
- `preview` substitui a miniatura decorativa. Para fotografias usa-se `uri` quando fornecida; na falta ou falha da imagem usa-se o recurso do Figma ou `photoFallbackSrc`. A mesma URI marcada como falhada só volta a ser tentada quando o componente é remontado ou outra URI falha. O conteúdo de `preview` é decorativo, oculto às tecnologias de apoio e não deve conter controlos.
- `closeIconSrc` e `statusDotSrc` substituem os SVG de remoção e estado, respetivamente. A aplicação é responsável por verificar a origem e autorização das URIs e pela gestão de ficheiros e transferências.

## Tema, acessibilidade e validação

Usa cores semânticas do Figma para superfície, fundo subtil, bordas, texto, marca e erro, além de `--mds-radius-lg` e `--mds-font-family`; os componentes compostos têm os seus próprios tokens. Os SVG de fotografia, fecho e ponto têm cores fixas e podem ser substituídos. As ações têm nomes acessíveis com o nome do ficheiro, o botão de remoção tem alvo de 44 px e a barra expõe progresso. A disposição quebra linha; testar em navegador real foco, zoom, largura, contraste e tecnologias de apoio.
