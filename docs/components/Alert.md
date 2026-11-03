# Alert

Mensagem de feedback baseada em [MDS/Alert](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=89-1030), composta por [AlertIcon](AlertIcon.md) e, quando necessário, [Button](Button.md). A aplicação decide quando mostrar ou ocultar a mensagem e o que cada ação faz.

```tsx
import { Alert } from '../../shared/ui/Alert'

<Alert tone="success" title="Operação concluída" />
<Alert tone="danger" layout="detailed" title="Não foi possível guardar"
  message="Verifica os dados e tenta novamente."
  action={{ label: 'Tentar novamente', onClick: tentarNovamente }}
  onDismiss={fechar} announcement="assertive" />
```

## API e comportamento

- `tone`: `info` (padrão), `success`, `warning` ou `danger`; `layout`: `compact` (padrão) ou `detailed`.
- `title` é obrigatório e não vazio. `message` é obrigatória e não vazia em `detailed`; `compact` rejeita uma mensagem para evitar que seja ocultada inadvertidamente.
- `action` é opcional e recebe `{ label, onClick }`; a etiqueta não pode ser vazia. `onDismiss` apresenta um botão de fecho que chama o consumidor sem alterar a visibilidade por si próprio. `dismissLabel` permite localizar o nome do botão.
- `toneLabel` substitui o nome acessível do tipo; não pode ser vazio. O ícone é decorativo e a indicação do tipo é disponibilizada no texto acessível, além da distinção visual.
- `announcement`: `none` por omissão, `polite` para atualizações não urgentes ou `assertive` para informação urgente. A região anunciada contém apenas texto: os botões permanecem controlos independentes. Escolher anúncios e momento de montagem adequados ao contexto.
- `closeIconSrc` substitui o SVG de fecho para personalização; `className`, `style` e atributos de `div` personalizam o contentor. Textos longos podem quebrar linha.

## Tema e validação

Usa os tokens CSS semânticos `--mds-*` de fundo, texto, borda e foco consultados no Figma, com valores de reserva. O ícone de fecho original tem cor fixa e pode ser substituído com `closeIconSrc`. Inter é usada quando disponível, com alternativa do sistema. Confirmar contraste para temas personalizados e validar conteúdo, ação, fecho, foco, anúncios, texto longo e ecrãs estreitos no navegador e com tecnologias de apoio.
