# DSSI Web

Aplicação web do projeto DSSI, construída com React, TypeScript e Vite.

## Começar

É necessário Node.js 24 e npm. Depois de clonar o repositório:

```bash
npm ci
npm run dev
```

Abre no navegador o endereço indicado pelo Vite. No PowerShell, se a política de execução impedir o comando `npm`, usa `npm.cmd` nos mesmos comandos.

## Verificações

```bash
npm run lint
npm run typecheck
npm run test:ci
npm run build
```

O GitHub Actions executa estas verificações nos Pull Requests para `develop` e `main` e após alterações nessas branches. Os testes interativos podem ser iniciados com `npm test`.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para o processo da equipa e [AGENTS.md](AGENTS.md) para orientações destinadas a agentes de IA.

Os princípios de qualidade e a direção de organização do código estão em [docs/architecture.md](docs/architecture.md). Decisões duradouras novas seguem o processo de proposta e aprovação descrito em AGENTS.md.

## Componentes da interface

O [guia de componentes React Web](docs/COMPONENTS_WEB_REACT.md) reúne o catálogo `MDS/*` do Figma, comportamento esperado, propostas de props, variantes, composição, exemplos de utilização e critérios de validação. Consulta-o ao criar, alterar ou reutilizar componentes, com ou sem assistência de IA. O catálogo orienta a implementação incremental; não representa uma biblioteca já implementada.

Implementados: [Button](docs/components/Button.md), [StatusBadge](docs/components/StatusBadge.md), [TextField](docs/components/TextField.md), [Textarea](docs/components/Textarea.md), [FormField](docs/components/FormField.md), [Checkbox](docs/components/Checkbox.md), [Radio](docs/components/Radio.md), [Switch](docs/components/Switch.md), [CheckboxGroup](docs/components/CheckboxGroup.md), [RadioGroup](docs/components/RadioGroup.md), [ProgressBar](docs/components/ProgressBar.md), [LoadingIndicator](docs/components/LoadingIndicator.md), [AlertIcon](docs/components/AlertIcon.md) e [Alert](docs/components/Alert.md).

Também implementados: [Card](docs/components/Card.md), [ContentPanel](docs/components/ContentPanel.md) e [FormGroup](docs/components/FormGroup.md).

Também implementados: [Tab](docs/components/Tab.md), [Tabs](docs/components/Tabs.md) e [TabPanel](docs/components/TabPanel.md).

Também implementados: [PageButton](docs/components/PageButton.md) e [Pagination](docs/components/Pagination.md).

Também implementados: [ActivityItem](docs/components/ActivityItem.md) e [Timeline](docs/components/Timeline.md).

Também implementados: [TaskProgress](docs/components/TaskProgress.md), [ChecklistItem](docs/components/ChecklistItem.md) e [Checklist](docs/components/Checklist.md).

Também implementados: [AttachmentItem](docs/components/AttachmentItem.md) e [FileUpload](docs/components/FileUpload.md).

Também implementados: [PhotoTile](docs/components/PhotoTile.md) e [ImagePicker](docs/components/ImagePicker.md).

Também implementados: [ClientSummary](docs/components/ClientSummary.md), [EquipmentCard](docs/components/EquipmentCard.md) e [ServiceOrderCard](docs/components/ServiceOrderCard.md).

Também implementados: [Select](docs/components/Select.md) e [Form](docs/components/Form.md).

Também implementados: [DatePicker](docs/components/DatePicker.md), [DateRangePicker](docs/components/DateRangePicker.md) e [TimePicker](docs/components/TimePicker.md).
