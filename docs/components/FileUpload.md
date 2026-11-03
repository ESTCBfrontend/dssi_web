# FileUpload

Seleciona e apresenta anexos controlados, com base em [MDS/FileUpload](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=157-2722). Reutiliza [AttachmentItem](AttachmentItem.md) e [Button](Button.md); não envia nem armazena ficheiros.

```tsx
import { FileUpload } from '../../shared/ui/FileUpload'

<FileUpload title="Anexos" files={anexos} onAdd={adicionarFicheiros}
  onRemove={remover} onRetry={repetir} accept={['application/pdf']}
  allowedExtensions={['pdf']} maxFiles={5} maxSizeBytes={10_000_000} />
```

## API e comportamento

- `title` é obrigatório e não vazio; `description` é opcional e não vazia. `headingLevel` escolhe o nível do título de 2 a 6. A secção aceita atributos nativos, `ref`, `className` e `style`.
- `files` é uma lista controlada de `UploadEntry`: cada entrada tem `file` ([AttachmentFile](AttachmentItem.md)), `state` e `progress` quando está a enviar. Identificadores devem ser únicos. A aplicação atribui IDs e atualiza a lista após cada ação.
- `onAdd(files: File[])` recebe o lote original do navegador depois da seleção válida por botão ou drag-and-drop; cancelar ou selecionar zero ficheiros não chama o callback. A seleção é rejeitada por completo quando qualquer ficheiro não cumpre os limites. O input é limpo após cada escolha, permitindo escolher novamente o mesmo ficheiro.
- `accept` contém tipos MIME, incluindo `image/*` ou `*/*`; com esta restrição, MIME vazio é rejeitado. `allowedExtensions` contém extensões com ou sem ponto, sem distinção de maiúsculas. Quando ambos estão definidos, cada ficheiro deve satisfazer ambos. O atributo `accept` do seletor é apenas uma ajuda e pode comportar-se de forma diferente entre sistemas; as mesmas verificações correm após seleção e arrastamento.
- `maxFiles` e `maxSizeBytes` são inteiros seguros positivos opcionais. O limite de quantidade inclui os anexos já fornecidos; `multiple` controla a seleção múltipla e também rejeita lotes arrastados com mais de um ficheiro quando falso. Ao atingir o limite, o botão de seleção é desativado.
- `onOpen`, `onRemove` e `onRetry` são encaminhados para cada anexo. `disabled` impede seleção e ações disponibilizadas pelo componente. O anexo em envio não mostra remoção; a aplicação pode implementar cancelamento através de outra composição.
- `formatsHint` apresenta texto de ajuda; `error` apresenta erro externo e prevalece sobre o erro local. `labels` personaliza instruções, botão, erros e `count(count, entries)`; `attachmentLabels` e `uploadingDetails` personalizam os anexos. O componente limpa o erro local ao tentar nova seleção.
- `plusIconSrc`, `closeIconSrc`, `photoFallbackSrc` e `statusDotSrc(entry)` permitem substituir recursos para outros temas. Os recursos padrão são os SVG locais do Figma e do StatusBadge.

## Responsabilidades e validação

MIME e extensão são metadados, não provam o conteúdo. A aplicação e o servidor devem validar conteúdo, dimensão, autorização e origem; o componente não faz upload, persistência ou leitura do conteúdo. O botão permite seleção por teclado e o erro é anunciado com `role="alert"`; o drag-and-drop é complementar. O layout usa flex-wrap e tokens `--mds-*`, incluindo `--mds-file-upload-padding` e `--mds-radius-lg`. SVG originais têm cores fixas e são substituíveis. Validar seletor, arrastamento, erros, foco, zoom, contraste e larguras em navegadores reais.
