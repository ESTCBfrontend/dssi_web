# MDS — Especificação de Componentes para Agentes de Código

> **Plataforma:** React Web\
> **Linguagem:** TypeScript / TSX\
> **Papel:** contrato de implementação e validação destinado a um agente de programação (Codex, Claude Code, Cursor, Cline ou equivalente).\
> **Projeto:** Mestrado em Engenharia Informática — Metodologias de Desenvolvimento de Software, 2026/2027.\
> **Última revisão documental:** 31/10/2026.\
> **Figma de referência:** [MDS — Wireframes da Aplicação](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS-%E2%80%94-Wireframes-da-Aplica%C3%A7%C3%A3o), página `00 — Design System`.

## 0. Como usar este guia no projeto

Este documento foi incorporado a partir de `COMPONENTS_WEB_REACT.md`, fornecido pelo utilizador. É uma referência partilhada para colaboradores e agentes ao criar, alterar ou reutilizar componentes React Web. A sua inclusão não implementa componentes nem aprova automaticamente todas as propostas técnicas que contém.

- **Ler em conjunto:** [AGENTS.md](../AGENTS.md), [README.md](../README.md), [CONTRIBUTING.md](../CONTRIBUTING.md) e [architecture.md](architecture.md). As instruções explícitas do utilizador e as decisões aprovadas do projeto prevalecem sobre exemplos ou sugestões deste guia. Novas decisões transversais seguem o processo de proposta e aprovação do projeto.
- **Estado atual:** nesta inclusão, a aplicação é uma base React, TypeScript e Vite; o catálogo não é um inventário de componentes já disponíveis em código. Inspeciona sempre a implementação existente antes de reutilizar ou criar uma API.
- **Âmbito:** consulta a ficha `MDS/<Nome>` da secção 9, os componentes de que depende e as secções transversais aplicáveis. Implementa apenas o âmbito da tarefa. Este guia não autoriza alterações ao repositório Mobile.
- **Propostas:** props, tipos de domínio, organização de pastas, CSS Modules, `ThemeProvider`, modos de tema e dependências são referências a avaliar no contexto da tarefa, não escolhas globais aprovadas pela importação. Os caminhos dos exemplos devem ser adaptados à arquitetura aprovada; não criam uma estrutura paralela.
- **Fontes:** as afirmações de consulta ao Figma e aos PDFs pertencem ao documento fornecido. Não foram revalidadas nesta inclusão. Os PDFs não estão incluídos no repositório; os seus nomes e códigos de backlog servem como referências de origem, não como requisitos de negócio já aprovados.
- **Validação proporcional:** aplica os critérios de comportamento, acessibilidade e testes relevantes para o componente e para o risco da alteração. Os snippets são ilustrativos, não implementações prontas a copiar.

Percurso de leitura: contexto e responsabilidades (secções 1–3), tema e contratos (4–7), execução e catálogo (8–9), integração e conclusão (10–13), fontes (14).

## 1. Missão e instruções para tarefas de componentes

**Constrói uma biblioteca de componentes realmente utilizáveis, tipados, compostos e personalizáveis.** Não transformes as imagens do Figma em componentes de tamanho fixo; o Figma é a **referência visual e estrutural**, enquanto este documento descreve o **comportamento a implementar em código**.

**Antes de escrever código:**

1. Inspeciona o projeto (`package.json`, estrutura, roteamento, tema, testes, lint, versão do React e dependências instaladas). **Não substituas** uma infraestrutura existente sem razão validada.
2. Identifica o componente solicitado pelo nome exato `MDS/<Nome>` da secção 9, consulta a finalidade, propriedades, variantes, composição e critérios de teste.
3. Examina as variantes relevantes na página Figma, quando tiveres acesso. Se não tiveres, utiliza os contratos deste ficheiro e assinala o que requer comparação visual posterior; **não inventes** coordenadas ou valores de tokens.
4. Reutiliza átomos e componentes existentes. Evita duplicar `Button`, `Card`, `StatusBadge`, `FormField`, `ProgressBar`, etc.
5. Implementa os estados reais (valor, alteração, loading, erro, vazio, disabled), não apenas o aspeto. Usa dados de exemplo **somente** em stories, fixtures e testes.
6. Cria ou atualiza documentação de utilização, testes e exemplos de composição. Confirma alinhamento, responsividade e acessibilidade antes de marcar a tarefa como concluída.
7. Se um requisito de negócio não estiver validado, deixa-o configurável; identifica a hipótese em vez de inventares uma regra ou um endpoint.

**Regras que não podem ser quebradas:**

- Um componente base **não** conhece um cliente, técnico, ordem ou equipamento específico. Recebe os dados por propriedades tipadas.
- **Não** impor larguras/alturas rígidas em contentores de conteúdo: estes crescem e aceitam filhos; exceções só para controlos e elementos gráficos de dimensões deliberadas.
- **Não** usar cores HEX fixas dentro dos componentes. Usa tokens semânticos e disponibiliza overrides controlados.
- **Não** misturar responsabilidades visuais com API, armazenamento, permissões e regras de negócio; usa callbacks, modelos e adaptadores.
- **Não** assumir APIs PHC, permissões, preços, dados reais, conectividade ou funcionalidades não aprovadas.
- **Não** substituir elementos interativos por `div`/`View` passivos sem comportamento acessível.
- **Não** criar dependências externas apenas para reproduzir uma ilustração Figma; primeiro reutiliza o que está instalado.
- **Não** refazer as 53 famílias de uma vez se a tarefa pedir apenas uma; trabalha por etapas, sempre compiláveis e testáveis.

## 2. Origem e âmbito: o que é requisito vs. proposta

**Enunciado:** `MDS_Projeto_Pratico_2026-2027_REV06.pdf`. Pede uma solução empresarial integrada, desenvolvida por duas equipas coordenadas através de Scrum, considerando cenários móveis, qualidade gráfica, integração e testes. A escolha de tecnologias deve ser proposta e fundamentada.

**Necessidades iniciais do PO:** `MDS_Draft_Product_Backlog_ENTREGA_01_CONCRETA_V03.pdf`, 80 necessidades em 16 áreas. **É um draft de necessidades, não um conjunto de requisitos técnicos aprovados.** O PO/docente decide prioridades e o âmbito com as equipas. Protótipos devem usar dados fictícios; ligação ao ERP PHC é exploratória e não deve ser simulada como integração real.

**Fluxo de referência:** proposta aceite → preparação/agendamento → logística → execução no terreno e registo → revisão pelo escritório → tratamento administrativo. Esta biblioteca tem de servir **um único produto integrado**, com modelos coerentes entre Web e Mobile, mas implementações e UX próprias de cada plataforma.

**Fonte Figma:** inventário verificado da página de design: **53 famílias** de `MDS/*`, listadas integralmente na secção 9. A correspondência de nomes/variantes foi consultada no Figma; **as props TypeScript propostas neste guia são contratos de implementação sugeridos, não propriedades já existentes em código**.

## 3. Arquitetura mínima e reutilização

As responsabilidades abaixo seguem [architecture.md](architecture.md). Cria apenas as pastas necessárias à tarefa:

- `shared/ui`: elementos visuais realmente partilhados, primitivos ou compostos (`Button`, `TextField`, `Card`, `DataTable`, etc.). Tokens e tema partilhados podem ficar junto desta apresentação; a solução concreta depende da tarefa.
- `features/<funcionalidade>/presentation`: especializações (`ServiceOrderCard`, `Checklist`, `AssignmentPanel`, etc.), sem copiar a implementação visual do `Card`.
- `features/<funcionalidade>/domain` e `application`: regras de negócio e coordenação dos casos de uso, quando necessárias, independentes dos componentes React.
- `features/<funcionalidade>/infrastructure`: integrações concretas; `app` faz a composição e ligação das dependências. Não criar estas camadas quando não houver responsabilidades que as justifiquem.

Modelo de propriedade: **dados → visualização → eventos → camada de aplicação**. Os componentes não importam clientes HTTP nem fazem chamadas à rede diretamente, salvo adaptadores especializados explicitamente documentados.

**Controlled por omissão quando há dados externos:** `value`/`onChange`, `open`/`onOpenChange`, `selectedId`/`onSelect`, `items`/`onItemChange`. Suporta `defaultValue` e estado interno apenas quando necessário e quando o contrato distingue claramente os dois modos. Nunca alternes silenciosamente entre controlado e não controlado durante a vida da instância.

### 3.1 Contratos de domínio partilháveis

```ts
export type ID = string;
export type ISODate = string; // yyyy-MM-dd (não data formatada)
export type HHmm = string; // HH:mm, formato de 24 horas
export type FeedbackTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
export type ChecklistResult = 'pending' | 'pass' | 'fail' | 'notTested';
export type ServiceOrderStatus = 'planned' | 'active' | 'pending' | 'completed' | 'cancelled';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface FileAttachment {
  id: ID;
  name: string;
  mimeType: string;
  sizeBytes: number;
  uri?: string; // URI local ou remota; não é um identificador de autorização
  status: 'ready' | 'uploading' | 'error';
  progress?: number; // 0..100
}

export interface ChecklistEntry {
  id: ID;
  title: string;
  description?: string;
  required?: boolean;
  result: ChecklistResult;
  note?: string;
  attachments?: FileAttachment[];
}

export interface ActivityEvent {
  id: ID;
  serviceOrderId: ID;
  authorId?: ID;
  authorLabel: string;
  occurredAt: string; // timestamp ISO-8601 com timezone
  type: 'status' | 'assignment' | 'comment' | 'completion';
  title: string;
  description?: string;
}

export interface ServiceOrderSummary {
  id: ID;
  reference: string;
  clientId: ID;
  siteId: ID;
  status: ServiceOrderStatus;
  scheduledAt?: string; // instante ISO-8601 com timezone
  assignedTeamId?: ID;
  assignedTechnicianId?: ID;
}
```

Estes são tipos **propostos para integração**, não um modelo de base de dados imposto pelo enunciado. Mantém as versões partilhadas entre os dois projetos e estabelece uma estratégia de evolução coordenada; evita dois enums diferentes para o mesmo estado.

## 4. Tokens, tema e personalização

### 4.1 Hierarquia de precedência

1. **Tokens semânticos do tema ativo** (padrão).
2. **`variant`/`tone`/`size`/`density`** para o aspeto pretendido.
3. **Overrides explícitos e tipados** para um caso local (`backgroundColor`, `textColor`, `borderRadius`, `style`/`className` conforme a plataforma).
4. **Slots/filhos** para alterar a composição sem criar uma nova versão rígida do componente.

Cria aliases semânticos em vez de valores por componente:

| Categoria | Exemplos de tokens lógicos |
|---|---|
| Fundo | `bg.page`, `bg.surface`, `bg.subtle`, `bg.brand`, `bg.inputDisabled` |
| Texto | `text.primary`, `text.secondary`, `text.disabled`, `text.onBrand`, `text.danger` |
| Bordas | `border.default`, `border.strong`, `border.focus`, `border.error` |
| Estados | `status.info`, `status.success`, `status.warning`, `status.danger` |
| Geometria | `space.1..8`, `radius.sm/md/lg/xl`, `controlHeight.sm/md/lg` |
| Tipografia | `font.body`, `font.label`, `font.title`, `font.caption`, `font.weight.*` |
| Elevação | `shadow.surface`, `shadow.overlay` |

A correspondência com variáveis de cor do Figma deve ser feita **por mapeamento explícito** (e não por copiar valores HEX a partir de screenshots). Caso o projeto já tenha nomes/tokens, mantém-nos; documenta equivalências em vez de criar coleções paralelas.

### 4.2 Requisitos de tema

- Suportar `light`, `dark` e um modo `system`, se aplicável à plataforma.
- Variantes de cor, fontes, raios, densidade e espaçamento alteram a apresentação sem alterar a lógica.
- Estados com cor semântica têm também texto/ícone; respeitar contraste.
- O componente deve aceitar tema **do contexto** e overrides locais, sem precisar de um novo ficheiro CSS/StyleSheet por caso.
- Um `children`/slot personalizado não perde o espaçamento do contentor nem fica cortado por alterações de conteúdo.

### 4.3 Variáveis do Figma confirmadas (nomes reais)

O inventário da página `00 — Design System` contém variáveis com estes nomes; **não** confundir estes nomes reais com os tokens lógicos exemplificativos apresentados na tabela anterior:

- **Fundo e ações:** `color/bg/page`, `color/bg/surface`, `color/bg/subtle`, `color/bg/brand`, `color/bg/brand-hover`, `color/bg/input-disabled`, `color/bg/action-secondary`, `color/bg/action-danger`.
- **Texto:** `color/text/primary`, `color/text/secondary`, `color/text/on-brand`, `color/text/brand`, `color/text/placeholder`, `color/text/disabled`, `color/text/danger`, `color/text/success`, `color/text/warning`.
- **Bordas e ícones:** `color/border/default`, `color/border/strong`, `color/border/focus`, `color/border/error`, `color/icon/default`, `color/icon/brand`.
- **Estados sólidos:** `color/bg/status-neutral-solid`, `color/bg/status-info-solid`, `color/bg/status-success-solid`, `color/bg/status-warning-solid`, `color/bg/status-danger-solid`.
- **Espaçamento e raios:** `spacing/0`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/5`, `spacing/6`, `spacing/8`, `spacing/10`, `spacing/12`; `radius/none`, `radius/sm`, `radius/md`, `radius/lg`, `radius/xl`, `radius/full`.

O agente deve **consultar os valores atuais no Figma**, respeitando os modos da coleção e aliases, antes de converter tokens para CSS ou TypeScript; as cores demonstrativas dos exemplos de código não prevalecem sobre esses valores.

## 5. Contrato mínimo para QUALQUER componente

Regista e implementa, no mínimo:

1. **Finalidade** e casos de utilização; nível (`primitivo`, `composto`, `domínio`).
2. **Props** tipadas, defaults seguros, valores opcionais e event handlers.
3. **Variantes** visuais coerentes com o Figma, estados reais e comportamento em erro/sem dados.
4. **Composição** (`children`, `header`, `footer`, `actions`, `leading`, `trailing`, `renderItem` ou slots equivalentes), apenas quando aplicável.
5. **Personalização** por tema + `size`, `variant`, `tone` e override de estilos.
6. **Layout** fluido e teste com textos longos, 0/1/N elementos, visualização pequena/grande e conteúdo de terceiros.
7. **Acessibilidade** e operações de teclado/toque para a plataforma.
8. **Testes** e exemplo de utilização; documentação do contrato, estados e dependências.

Um componente não é considerado pronto porque corresponde visualmente a uma única variante no Figma. Tem de funcionar com **valores novos e conteúdo novo**.

## 6. Regras específicas — React para Web

### 6.1 Tecnologias e decisões de implementação

- **React + TypeScript** com componentes funcionais. Primeiro detetar o ambiente existente (Vite, Next.js, router, biblioteca de formulários, CSS framework e UI kit); seguir as convenções do repositório.
- Sugestão para **projeto sem UI framework existente**: CSS Modules + variáveis CSS semânticas e uma camada pequena de utilitários de variantes. CSS-in-JS/Tailwind só se já estiver aprovado/instalado ou houver justificação.
- Preferir **HTML semântico e APIs do browser** a reinventar input, botão, tabela, diálogo e acessibilidade.
- O uso de um design system existente ou Radix/React Aria **não é obrigatório**; só introduzir dependência com aprovação e motivo objetivo.
- `className` e `style` devem combinar com os tokens: **não** espalhar styles inline arbitrários como comportamento padrão.

Exemplo de localização dos componentes segundo [architecture.md](architecture.md); os nomes de funcionalidades são ilustrativos e não representam pastas existentes. As restantes camadas seguem a arquitetura geral e só são criadas quando necessárias:

```text
src/
  app/                    # Composição da aplicação
  features/
    service-orders/presentation/components/ServiceOrderCard/
    equipment/presentation/components/EquipmentCard/
    clients/presentation/components/ClientSummary/
    field-service/presentation/components/{Checklist,ChecklistItem,TaskProgress}/
    planning/presentation/components/{UserSelector,TeamSelector,AssignmentPanel}/
  shared/
    ui/
      theme/              # Tokens/tema, se necessários e partilhados
      Button/
      Card/
      FormField/
      # Outros componentes com utilização transversal demonstrada
```

### 6.2 Tokens CSS e tema

```css
/* src/shared/ui/theme/tokens.css — exemplo de localização e valores; ajustar ao projeto e ao Figma */
:root, [data-theme='light'] {
  --mds-bg-page: #f7f9fc;
  --mds-bg-surface: #ffffff;
  --mds-bg-subtle: #eef2f7;
  --mds-text-primary: #172337;
  --mds-text-secondary: #576577;
  --mds-text-on-brand: #ffffff;
  --mds-brand: #2463ae;
  --mds-border-default: #d9e1ea;
  --mds-border-focus: #2463ae;
  --mds-status-danger: #b42318;
  --mds-radius-md: 10px;
  --mds-radius-lg: 14px;
  --mds-space-2: 8px;
  --mds-space-3: 12px;
  --mds-space-4: 16px;
  --mds-space-6: 24px;
}
[data-theme='dark'] {
  --mds-bg-page: #111722;
  --mds-bg-surface: #1b2635;
  --mds-bg-subtle: #263346;
  --mds-text-primary: #f4f7fc;
  --mds-text-secondary: #c4d0df;
  --mds-text-on-brand: #ffffff;
  --mds-brand: #77aef2;
  --mds-border-default: #45566b;
  --mds-border-focus: #a3c9fa;
  --mds-status-danger: #ff9991;
}
```

**Atenção:** os valores acima servem só para mostrar **a arquitetura** e **não** são declarados como a paleta oficial do Figma. Importar os valores reais quando disponíveis; manter as chaves/semântica.

Exemplo mínimo de overrides:

```tsx
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
  variant?: ButtonVariant;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  fullWidth?: boolean;
  /** Override visual local; defaults continuam a vir dos tokens */
  accentColor?: string;
};

export function Button({
  variant = 'primary', size = 'medium', loading = false,
  disabled, iconStart, iconEnd, fullWidth = false,
  accentColor, children, className, style, type = 'button', ...rest
}: ButtonProps) {
  const locked = disabled || loading;
  return (
    <button
      {...rest}
      type={type}
      disabled={locked}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-size={size}
      className={['mds-button', fullWidth && 'mds-button--full', className]
        .filter(Boolean).join(' ')}
      style={{
        ...(accentColor ? { ['--mds-button-accent' as string]: accentColor } : {}),
        ...style,
      }}
    >
      {iconStart}{loading ? 'A processar…' : children}{iconEnd}
    </button>
  );
}
```

O CSS de `.mds-button` e das variantes deve usar `var(--mds-...)`, controlar `min-height`, `:focus-visible`, `:disabled`, hover, estado de loading e contraste. **Não usar este snippet como implementação final sem o CSS e os testes.**

### 6.3 Composição e slots

```tsx
interface CardProps extends React.HTMLAttributes<HTMLElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  status?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  density?: 'compact' | 'comfortable';
  surface?: 'outlined' | 'elevated';
}

export function Card({
  title, subtitle, status, actions, footer, children,
  density = 'comfortable', surface = 'outlined', className, ...rest
}: CardProps) {
  return (
    <article {...rest} data-density={density} data-surface={surface}
             className={['mds-card', className].filter(Boolean).join(' ')}>
      {(title || subtitle || status) && <header className="mds-card__header">
        <div>{title && <h3>{title}</h3>}{subtitle && <p>{subtitle}</p>}</div>
        {status}
      </header>}
      <div className="mds-card__content">{children}</div>
      {(actions || footer) && <footer className="mds-card__footer">{actions}{footer}</footer>}
    </article>
  );
}
```

**Regra:** não colocar atributos HTML específicos de `button` em `Card`; a tipagem é do elemento que renderiza. `Card` não deve introduzir altura fixa por omissão. Variantes visuais usam CSS; slots recebem ReactNodes arbitrários.

### 6.4 Estado, dados e acessibilidade

- `TextField`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`: **controlados**, com `onChange` do tipo de valor certo. Associa `label`, helper e erro por IDs estáveis.
- `Dialog`: preferir `<dialog>` com `showModal()` quando apropriado, ou uma biblioteca já existente que resolva foco, ESC e portal.
- `DatePicker`: preferir solução semântica e acessível; se for calendário personalizado, exigir navegação por teclado e testes reais. `type=date` usa valor ISO, não `DD/MM/AAAA` no estado.
- `DataTable`: `<table>` com colunas acessíveis e `aria-sort` no `th` ativo; filtros e paginação calculam dados reais.
- `Tabs`: `role=tablist`, `role=tab`, `role=tabpanel`, IDs ligados, foco por setas e seleção coerente.
- `ToastSnackbar`: host único e fila; avisos não urgentes em região `role=status`; erros críticos persistentes através de `Alert`/`Dialog`.
- `FileUpload`: `<input type="file">` acessível; drag-and-drop opcional, nunca exclusivo; drag/drop não substitui seleção pelo teclado.
- `ProgressBar`: usar `<progress value={value} max={max}>` quando adequado; o preenchimento e o texto refletem o mesmo número.
- `PageLayout`: CSS Grid/Flex com `min-width:0`, `max-width` configurável e media queries; nunca construir página posicionando cartões em coordenadas absolutas.

### 6.5 Exemplo de uso — a mesma base em dois contextos

```tsx
function ServiceOrderOverview({ order }: { order: ServiceOrderSummary }) {
  return (
    <Card title={`Ordem ${order.reference}`}
          status={<StatusBadge tone="info" label={order.status} />}
          actions={<Button onClick={() => openOrder(order.id)}>Abrir</Button>}>
      <div className="mds-grid">
        <span>Cliente: {order.clientId}</span>
        <span>Local: {order.siteId}</span>
      </div>
    </Card>
  );
}

function EquipmentOverview({ equipment }: { equipment: { id: string; name: string } }) {
  return (
    <Card title={equipment.name}
          actions={<Button variant="outline" onClick={() => openEquipment(equipment.id)}>
            Ver equipamento
          </Button>}>
      <p>Referência: {equipment.id}</p>
    </Card>
  );
}
```

**Nota:** `openOrder`, `openEquipment`, `StatusBadge` e `Button` são dependências/handlers do projeto a importar ou injetar — não funções globais fornecidas por este documento. O exemplo ilustra **composição**, não é um ficheiro isolado pronto a compilar.

### 6.6 Testes Web obrigatórios

- Unit/interação: React Testing Library ou ferramentas já instaladas; usar queries por role/label em vez de classes CSS.
- Acessibilidade: teclado (Tab, setas, Enter, Space, Escape), foco visível, labels, contraste, leitura de erros; integrar `axe` se disponível/aprovado.
- Visual: variação de largura (ex.: 360, 768 e 1280 px), zoom 200%, textos longos, tema escuro, erros e 0/1/N filhos.
- `DataTable`, `Pagination`, `Tabs`, `Dialog`, `Combobox/DatePicker`: testar interações e estados reais em vez de comparar apenas snapshots.
- Não esconder alterações de estado em CSS; `aria-expanded`, `aria-selected`, `aria-invalid` e disabled têm de refletir as props.

## 7. Convenções de API, layout e gestão de estado

### 7.1 Props transversais propostas

```ts
export interface VisualProps {
  size?: 'small' | 'medium' | 'large';
  tone?: FeedbackTone;
  density?: 'compact' | 'comfortable';
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

export interface AsyncActionState {
  pending?: boolean;
  error?: string | null;
  successMessage?: string;
}

export interface DateRangeValue {
  start: ISODate | null;
  end: ISODate | null;
}
```

A interface acima é **um padrão útil** e não uma obrigação para todos os átomos: `tone` não faz sentido numa data e `size` pode não ser relevante num `AppShell`. Preferir contratos **mínimos por componente** em vez de herdar um objeto gigante com dezenas de propriedades que não usa.

### 7.2 Preferências de implementação

- `style`/`className` complementam tokens; `variant` define o contrato estável do componente.
- `onChange` devolve o **valor**, não um `ChangeEvent`, nos componentes de domínio (`DateRangePicker`, `ChecklistItem`, `TeamSelector`). Um input simples pode expor eventos DOM se documentado.
- `children` é o slot principal; slots nomeados são `header`, `actions`, `footer`, `emptyState`, `renderItem`, etc.
- Usar `forwardRef`/refs apenas quando precisas de foco, integração com formulário ou API imperativa.
- Dados repetitivos são `items[]` e `key` por ID estável; não usar índices da lista como identidade.
- Evitar que `isOpen`, `selected` e `activeTab` sejam duplicados no pai e no filho sem fonte única de verdade.

## 8. Guia de execução por tarefa para o agente

```text
INPUT: componente MDS/NOME + User Story/AC (quando disponível) + contexto de página.

1. Ler este ficheiro, secção MDS/NOME e componentes dependentes.
2. Inspecionar componentes existentes e o Figma.
3. Identificar variantes + props de dados + props de visual + eventos + slots.
4. Criar/atualizar componente TypeScript isolado, estilos por tokens.
5. Criar story/exemplo com duas configurações diferentes.
6. Implementar estados e interações reais, não apenas desenhos.
7. Testar teclado, leitor de ecrã, tamanhos, tema, loading/erro e composição.
8. Executar ferramentas reais do projeto (lint, typecheck, test).
9. Reportar ficheiros, comandos, limitações e decisões.

OUTPUT: PR pequena, reusável e verificável. Não criar 53 ficheiros se foi pedido apenas um.
```

## 9. Catálogo de implementação — 53 famílias do Figma

Os nomes `MDS/*` e as famílias abaixo foram confirmados no Figma. As variantes descritas são as **combinações visuais relevantes**; o agente deve expor props adequadas ao runtime e **não** criar uma cópia de código por variante.

Cada ficha indica: (i) variantes de referência, (ii) contrato runtime sugerido, (iii) composição, (iv) regras da plataforma, (v) teste específico e (vi) necessidades do PO que justificam o caso de uso, ainda sujeitas a refinamento.

### 9.1 — Átomos (3 famílias)

#### `MDS/AlertIcon`
- **Figma / variantes:** tone: info|success|warning|danger.
- **API dinâmica a definir em TypeScript:** `tone, size?, colorOverride?, decorative?`.
- **Composição e reutilização:** Tokens de cor e ícones.
- **Específico Web:** SVG/ícone marcado aria-hidden se decorativo.
- **Teste de aceitação mínimo:** Significado não depende apenas da cor.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/Button`
- **Figma / variantes:** size: small|medium|large; style: primary|secondary|outline|danger; state: default|disabled.
- **API dinâmica a definir em TypeScript:** `children/label, iconStart?, iconEnd?, disabled?, loading?, onClick, fullWidth?`.
- **Composição e reutilização:** Tokens + LoadingIndicator.
- **Específico Web:** button semântico, type="button" por omissão, foco visível, type="submit" explícito.
- **Teste de aceitação mínimo:** Nenhum clique quando disabled/loading; teclado/leitor de ecrã.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/StatusBadge`
- **Figma / variantes:** tone: neutral|info|success|warning|danger; style: soft|solid; size: small|medium.
- **API dinâmica a definir em TypeScript:** `label, tone?, variant?, showDot?, icon?`.
- **Composição e reutilização:** Tokens.
- **Específico Web:** span ou texto curto, sem depender de cor isoladamente.
- **Teste de aceitação mínimo:** Categorias semânticas e contraste para claro/escuro.
- **Referências ao draft do PO:** OS-05; RST-05.

### 9.2 — Formulários (14 famílias)

#### `MDS/Checkbox`
- **Figma / variantes:** size: compact|comfortable; state: default|focused|disabled; selection: unchecked|checked|mixed.
- **API dinâmica a definir em TypeScript:** `checked, indeterminate?, onChange, label, description?, disabled?`.
- **Composição e reutilização:** FormField.
- **Específico Web:** input type=checkbox com indeterminate via ref quando aplicável.
- **Teste de aceitação mínimo:** Não confundir com ChecklistItem, que tem quatro resultados.
- **Referências ao draft do PO:** RST-02; CORE-05.

#### `MDS/CheckboxGroup`
- **Figma / variantes:** layout: stacked|twoColumns; state: default|error.
- **API dinâmica a definir em TypeScript:** `options[], values[], onChange, label?, error?, disabled?`.
- **Composição e reutilização:** Checkbox + FormField.
- **Específico Web:** fieldset/legend e grupos responsivos.
- **Teste de aceitação mínimo:** Múltiplas escolhas funcionais e validadas.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/DatePicker`
- **Figma / variantes:** viewport: web|mobile; state: closed|open|error.
- **API dinâmica a definir em TypeScript:** `label, value:ISODate|null, onChange, minDate?, maxDate?, disabledDates?, error?`.
- **Composição e reutilização:** FormField + calendário/seletor.
- **Específico Web:** Input date nativo quando adequado ou calendário acessível; locale pt-PT.
- **Teste de aceitação mínimo:** Bloqueio de datas e valor normalizado YYYY-MM-DD.
- **Referências ao draft do PO:** PLN-01; OS-06; MT-02.

#### `MDS/DateRangePicker`
- **Figma / variantes:** viewport: web|mobile; state: empty|selected|error.
- **API dinâmica a definir em TypeScript:** `value:{start:ISODate|null,end:ISODate|null}, onChange, minDate?, maxDate?, error?`.
- **Composição e reutilização:** DatePicker × 2.
- **Específico Web:** Duas datas lado a lado em larguras suficientes.
- **Teste de aceitação mínimo:** end >= start; limites; limpar intervalo.
- **Referências ao draft do PO:** OS-06; MT-02; PLN-01.

#### `MDS/Form`
- **Figma / variantes:** layout: stacked|wide.
- **API dinâmica a definir em TypeScript:** `initialValues?/values, onSubmit, onReset?, children, pending?, error?`.
- **Composição e reutilização:** FormGroup + Button + slots.
- **Específico Web:** form real; submit por Enter quando pertinente; separar validação de UI.
- **Teste de aceitação mínimo:** Erros de campo e servidor; sem perder inputs no loading.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/FormField`
- **Figma / variantes:** size: small|medium|large; state: default|focused|error|disabled.
- **API dinâmica a definir em TypeScript:** `label, required?, helperText?, error?, children, htmlFor/nativeId?`.
- **Composição e reutilização:** TextField / Select / Textarea / Switch.
- **Específico Web:** label/htmlFor/aria-describedby/aria-invalid coerentes.
- **Teste de aceitação mínimo:** Erro não depende só da cor.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/FormGroup`
- **Figma / variantes:** layout: stacked|twoColumns.
- **API dinâmica a definir em TypeScript:** `title?, description?, children, columns?, actions?`.
- **Composição e reutilização:** FormField + ContentPanel.
- **Específico Web:** CSS Grid com colunas responsivas; grupos com headings.
- **Teste de aceitação mínimo:** Conteúdo cresce sem overflow.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/Radio`
- **Figma / variantes:** size: compact|comfortable; state: default|focused|disabled; selection: selected|unselected.
- **API dinâmica a definir em TypeScript:** `value, selected?, onChange, label, disabled?`.
- **Composição e reutilização:** FormField.
- **Específico Web:** input type=radio com name de grupo.
- **Teste de aceitação mínimo:** Escolha exclusiva e tecla de navegação apropriada.
- **Referências ao draft do PO:** RST-03.

#### `MDS/RadioGroup`
- **Figma / variantes:** layout: stacked|twoColumns; state: default|error.
- **API dinâmica a definir em TypeScript:** `options, value, onChange, label?, error?`.
- **Composição e reutilização:** Radio + FormField.
- **Específico Web:** fieldset/legend e teclas previstas para radio nativo.
- **Teste de aceitação mínimo:** Valor ausente e mensagens de erro suportados.
- **Referências ao draft do PO:** RST-03.

#### `MDS/Select`
- **Figma / variantes:** size: small|medium|large; state: default|focused|error|disabled.
- **API dinâmica a definir em TypeScript:** `options, value, onChange, placeholder?, isLoading?, disabled?, searchable?`.
- **Composição e reutilização:** FormField.
- **Específico Web:** select nativo ou combobox acessível quando pesquisa necessária.
- **Teste de aceitação mínimo:** Não inventar opções; opções remotas indicam loading/empty/error.
- **Referências ao draft do PO:** PLN-01; CORE-05.

#### `MDS/Switch`
- **Figma / variantes:** size: compact|comfortable; state: default|focused|disabled; value: on|off.
- **API dinâmica a definir em TypeScript:** `value:boolean, onValueChange, label?, disabled?`.
- **Composição e reutilização:** FormField.
- **Específico Web:** button role=switch ou input checkbox com papel coerente.
- **Teste de aceitação mínimo:** A alteração aplica-se imediatamente ou inclui botão explícito se requisito exigir.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/TextField`
- **Figma / variantes:** size: small|medium|large; state: default|focused|error|disabled.
- **API dinâmica a definir em TypeScript:** `value, onChange, placeholder?, type?, iconStart?, disabled?`.
- **Composição e reutilização:** FormField.
- **Específico Web:** input typed; onChange fornece valor, sem misturar evento DOM no contrato de domínio.
- **Teste de aceitação mínimo:** Não perde foco ao atualizar valor.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/Textarea`
- **Figma / variantes:** height: compact|comfortable; content: placeholder|value; state: default|focused|error|disabled.
- **API dinâmica a definir em TypeScript:** `value, onChange, placeholder?, maxLength?, showCounter?, rows?/minHeight?`.
- **Composição e reutilização:** FormField.
- **Específico Web:** textarea, contador e resize vertical controlado.
- **Teste de aceitação mínimo:** Texto longo cresce ou desloca sem ser cortado.
- **Referências ao draft do PO:** MOB-04; RST-04.

#### `MDS/TimePicker`
- **Figma / variantes:** viewport: web|mobile; state: closed|open|error.
- **API dinâmica a definir em TypeScript:** `label, value:HHmm|null, onChange, minTime?, maxTime?, availableSlots?, error?`.
- **Composição e reutilização:** FormField.
- **Específico Web:** input time ou seleção acessível em 24h.
- **Teste de aceitação mínimo:** Validação de conflito de equipa/recurso ocorre no backend.
- **Referências ao draft do PO:** PLN-01; PLN-02.

### 9.3 — Composição (2 famílias)

#### `MDS/Card`
- **Figma / variantes:** density: compact|comfortable; style: outlined|elevated.
- **API dinâmica a definir em TypeScript:** `title?, subtitle?, status?, children, actions?, footer?, styleOverride?`.
- **Composição e reutilização:** StatusBadge + ContentPanel + slots.
- **Específico Web:** Container com header/content/actions flexíveis, sem largura fixa.
- **Teste de aceitação mínimo:** Cresce com três linhas extras; botão não sai da borda.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/ContentPanel`
- **Figma / variantes:** layout: stacked|wide; surface: surface|muted.
- **API dinâmica a definir em TypeScript:** `title?, description?, children, actions?, footer?, collapsed?`.
- **Composição e reutilização:** Card + slots.
- **Específico Web:** Região semântica e largura flexível com grid de conteúdo.
- **Teste de aceitação mínimo:** Slots são conteúdos reais, não placeholders de Figma.
- **Referências ao draft do PO:** CORE-05.

### 9.4 — Navegação/layout (7 famílias)

#### `MDS/AppHeader`
- **Figma / variantes:** viewport: web|mobile.
- **API dinâmica a definir em TypeScript:** `title, subtitle?, avatar?, leading?, trailing?, onProfilePress?`.
- **Composição e reutilização:** NavItem + Button + slots.
- **Específico Web:** Cabeçalho compacto/fixo conforme layout; ações como botões reais.
- **Teste de aceitação mínimo:** Não sobrepõe navegação/conteúdo.
- **Referências ao draft do PO:** CORE-02; MOB-01.

#### `MDS/AppShell`
- **Figma / variantes:** viewport: web|mobile.
- **API dinâmica a definir em TypeScript:** `navigation, header?, children, footer?, sidebarCollapsed?`.
- **Composição e reutilização:** AppHeader + NavItem + PageLayout.
- **Específico Web:** Sidebar e conteúdo em grid responsivo; landmarks header/nav/main.
- **Teste de aceitação mínimo:** Navegação e conteúdo sem duplicar estado ou perder scroll.
- **Referências ao draft do PO:** CORE-01; CORE-05.

#### `MDS/NavItem`
- **Figma / variantes:** place: sidebar|bottom; state: default|active|disabled.
- **API dinâmica a definir em TypeScript:** `label, icon?, href?/screen?, active?, disabled?, badge?`.
- **Composição e reutilização:** Button + ícones.
- **Específico Web:** Link/router, aria-current=page; sidebar.
- **Teste de aceitação mínimo:** Ativo identificado visualmente e pelo leitor de ecrã.
- **Referências ao draft do PO:** CORE-05; MOB-01.

#### `MDS/PageLayout`
- **Figma / variantes:** layout: stacked|wide.
- **API dinâmica a definir em TypeScript:** `title, description?, breadcrumbs?, actions?, children, footer?`.
- **Composição e reutilização:** AppShell + PageHeader/ContentPanel.
- **Específico Web:** Max width, grid/gaps, breadcrumbs navegáveis.
- **Teste de aceitação mínimo:** Sem CSS específico acoplado a página concreta.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/Tab`
- **Figma / variantes:** size: compact|comfortable; state: default|active|focused|disabled.
- **API dinâmica a definir em TypeScript:** `id, label, selected, disabled?, onSelect, badge?`.
- **Composição e reutilização:** Tabs.
- **Específico Web:** role=tab, aria-selected, aria-controls, tabIndex roving.
- **Teste de aceitação mínimo:** Foco, estados e relação painel-tab coerentes.
- **Referências ao draft do PO:** OS-03.

#### `MDS/TabPanel`
- **Figma / variantes:** surface: surface|muted.
- **API dinâmica a definir em TypeScript:** `id, labelledBy?, title?, children, actions?`.
- **Composição e reutilização:** Tab + ContentPanel.
- **Específico Web:** role=tabpanel, aria-labelledby, ocultar painéis não selecionados.
- **Teste de aceitação mínimo:** O conteúdo pode conter outros componentes sem largura fixa.
- **Referências ao draft do PO:** OS-03.

#### `MDS/Tabs`
- **Figma / variantes:** viewport: web|mobile; active: configurable.
- **API dinâmica a definir em TypeScript:** `items[], value, onChange, renderTab?, children?`.
- **Composição e reutilização:** Tab + TabPanel.
- **Específico Web:** tablist roving focus com ArrowLeft/Right, Home/End.
- **Teste de aceitação mínimo:** Uma aba ativa e painel correspondente.
- **Referências ao draft do PO:** OS-03; EQP-04.

### 9.5 — Dados/listagens (6 famílias)

#### `MDS/DataTable`
- **Figma / variantes:** layout: table|cards; state: populated|empty.
- **API dinâmica a definir em TypeScript:** `rows[], columns[], keyExtractor, sorting?, onSort?, pagination?, loading?, renderCard?`.
- **Composição e reutilização:** TableRow + SortableHeader + FilterBar + Pagination.
- **Específico Web:** table com thead/tbody/aria-sort ou grid semântica; overflow horizontal só se necessário.
- **Teste de aceitação mínimo:** Ordenação e paginação reais; estado vazio e carregamento.
- **Referências ao draft do PO:** OS-06; PRO-01; CLI-05.

#### `MDS/FilterBar`
- **Figma / variantes:** layout: horizontal|stacked.
- **API dinâmica a definir em TypeScript:** `filters, onChange, onReset?, search?, actions?, extraFilters?`.
- **Composição e reutilização:** TextField + Select + DateRangePicker + slots.
- **Específico Web:** Barra horizontal que quebra de forma previsível; filtros debounced quando útil.
- **Teste de aceitação mínimo:** Combina critérios e expõe seleção ativa; não oculta filtros aplicados.
- **Referências ao draft do PO:** OS-06; CLI-05; PRO-01.

#### `MDS/PageButton`
- **Figma / variantes:** size: compact|comfortable; state: default|current|disabled.
- **API dinâmica a definir em TypeScript:** `page, current?, disabled?, onSelect`.
- **Composição e reutilização:** Button.
- **Específico Web:** button com aria-current=page; nome acessível número de página.
- **Teste de aceitação mínimo:** Indicadores numéricos não alteram página sem callback.
- **Referências ao draft do PO:** OS-06.

#### `MDS/Pagination`
- **Figma / variantes:** viewport: web|mobile; position: first|middle|last.
- **API dinâmica a definir em TypeScript:** `page, pageSize, total, onPageChange, onPageSizeChange?`.
- **Composição e reutilização:** PageButton + Button + Select.
- **Específico Web:** Páginas numeradas e escolha de tamanho quando pertinente.
- **Teste de aceitação mínimo:** Desativar limites, atualização da lista e estado acessível.
- **Referências ao draft do PO:** OS-06.

#### `MDS/SortableHeader`
- **Figma / variantes:** state: none|ascending|descending|focused|disabled.
- **API dinâmica a definir em TypeScript:** `label, direction, onSort, disabled?`.
- **Composição e reutilização:** TableRow.
- **Específico Web:** th e button, aria-sort apenas na coluna ordenada.
- **Teste de aceitação mínimo:** Uma direção efetiva por coluna e ordenação previsível.
- **Referências ao draft do PO:** OS-06.

#### `MDS/TableRow`
- **Figma / variantes:** layout: table|card; state: header|default|hover|selected.
- **API dinâmica a definir em TypeScript:** `row, columns?, selected?, onOpen?, actions?`.
- **Composição e reutilização:** SortableHeader + StatusBadge + Button.
- **Específico Web:** tr/td ou componente de linha de tabela; hover não substitui foco.
- **Teste de aceitação mínimo:** Chaves estáveis e campos opcionais sem deslocação.
- **Referências ao draft do PO:** OS-06.

### 9.6 — Overlays (2 famílias)

#### `MDS/Dialog`
- **Figma / variantes:** size: compact|wide; intent: neutral|danger.
- **API dinâmica a definir em TypeScript:** `open, onOpenChange, title, description?, children, actions?, initialFocus?`.
- **Composição e reutilização:** Button + slots.
- **Específico Web:** dialog nativo ou biblioteca existente; focus trap, Escape, restore focus, aria-labelledby.
- **Teste de aceitação mínimo:** Ações irreversíveis exigem confirmação clara; corpo faz scroll.
- **Referências ao draft do PO:** OS-05; RST-05.

#### `MDS/DrawerSheet`
- **Figma / variantes:** placement: right|bottom|fullscreen.
- **API dinâmica a definir em TypeScript:** `open, onClose, title, children, actions?, showHandle?`.
- **Composição e reutilização:** ContentPanel + Button + slots.
- **Específico Web:** Painel lateral ou inferior; scroll interno; overlay opcional.
- **Teste de aceitação mínimo:** Close não perde dados sem confirmar; formulário não fica tapado pelo teclado.
- **Referências ao draft do PO:** OS-03; MOB-02.

### 9.7 — Feedback (4 famílias)

#### `MDS/Alert`
- **Figma / variantes:** tone: info|success|warning|danger; layout: compact|detailed.
- **API dinâmica a definir em TypeScript:** `title?, message, action?, onDismiss?, dismissible`.
- **Composição e reutilização:** AlertIcon + Button.
- **Específico Web:** Persistente no fluxo; role=alert para erro urgente, não para toda a informação.
- **Teste de aceitação mínimo:** Erro e ação acessíveis; sem corte de texto.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/LoadingIndicator`
- **Figma / variantes:** type: spinner|inline|skeleton; size: compact|comfortable.
- **API dinâmica a definir em TypeScript:** `type, label?, active?, reducedMotion?`.
- **Composição e reutilização:** Tokens + ProgressBar.
- **Específico Web:** aria-busy no contentor, shimmer respeitando prefers-reduced-motion.
- **Teste de aceitação mínimo:** Não anunciar estado a cada frame.
- **Referências ao draft do PO:** CORE-05.

#### `MDS/ProgressBar`
- **Figma / variantes:** size: compact|regular; state: active|complete|error.
- **API dinâmica a definir em TypeScript:** `value, min?, max?, label?, status?, showValue?`.
- **Composição e reutilização:** Tokens.
- **Específico Web:** progress nativo ou role=progressbar com valor atual.
- **Teste de aceitação mínimo:** Texto e percentagem visual têm sempre a mesma origem numérica.
- **Referências ao draft do PO:** RST-02; MOB-07.

#### `MDS/ToastSnackbar`
- **Figma / variantes:** tone: info|success|warning|danger; layout: compact|detailed.
- **API dinâmica a definir em TypeScript:** `id, tone, title?, message, action?, durationMs?, dismissible?`.
- **Composição e reutilização:** AlertIcon + Button + ToastHost.
- **Específico Web:** Portal e live-region; não rouba foco por omissão.
- **Teste de aceitação mínimo:** Fila, limpeza e deduplicação; erros persistentes noutro componente.
- **Referências ao draft do PO:** MOB-07; CORE-05.

### 9.8 — Media/ficheiros (4 famílias)

#### `MDS/AttachmentItem`
- **Figma / variantes:** layout: row|stacked; kind: document|photo; state: ready|uploading|error.
- **API dinâmica a definir em TypeScript:** `file:{id,name,mime,size,uri?}, progress?, onRemove?, onRetry?, onOpen?`.
- **Composição e reutilização:** StatusBadge + ProgressBar + Button.
- **Específico Web:** Ficheiro em linha; nome extenso com quebra/elipse e título completo acessível.
- **Teste de aceitação mínimo:** Erro e progresso coerentes; nenhuma ação muda estado sem callback.
- **Referências ao draft do PO:** OS-04; MOB-06; RST-03.

#### `MDS/FileUpload`
- **Figma / variantes:** viewport: web|mobile; state: empty|selected|uploading|error.
- **API dinâmica a definir em TypeScript:** `files[], accept?, maxFiles?, maxSizeBytes?, onAdd, onRemove, onRetry?, disabled?`.
- **Composição e reutilização:** AttachmentItem + Button.
- **Específico Web:** input type=file; drag/drop progressivo; aceitar teclado.
- **Teste de aceitação mínimo:** Validar MIME/extensão/tamanho no cliente e servidor.
- **Referências ao draft do PO:** OS-04; MOB-06; FIN-04.

#### `MDS/ImagePicker`
- **Figma / variantes:** viewport: web|mobile; state: empty|selected.
- **API dinâmica a definir em TypeScript:** `photos[], onAdd?, onCapture?, onRemove?, renderPreview?, maxFiles?`.
- **Composição e reutilização:** PhotoTile + FileUpload + Button.
- **Específico Web:** input image/* + pré-visualização em galeria, seleção múltipla quando aplicável.
- **Teste de aceitação mínimo:** Nova imagem quebra linha sem sobreposições.
- **Referências ao draft do PO:** MOB-06; RST-03.

#### `MDS/PhotoTile`
- **Figma / variantes:** state: ready|uploading|error.
- **API dinâmica a definir em TypeScript:** `photo:{id,uri,name,alt?,state}, progress?, onOpen?, onRemove?, onRetry?`.
- **Composição e reutilização:** StatusBadge + Button + preview slot.
- **Específico Web:** img com alt; layout de miniatura.
- **Teste de aceitação mínimo:** Thumbnail vazia, erro, seleção, carga e remoção.
- **Referências ao draft do PO:** MOB-06; RST-03.

### 9.9 — Negócio (11 famílias)

#### `MDS/ActivityItem`
- **Figma / variantes:** viewport: web|mobile; event: status|assignment|comment|completion.
- **API dinâmica a definir em TypeScript:** `event:ActivityEvent, onOpenRelated?, leading?, trailing?`.
- **Composição e reutilização:** StatusBadge + Tokens de estado.
- **Específico Web:** Evento com autor, timestamp e referência navegável; adequado a auditoria.
- **Teste de aceitação mínimo:** Cada registo identifica ator, acontecimento, data/hora e ordem relacionada.
- **Referências ao draft do PO:** OS-02; CORE-03; PRO-02.

#### `MDS/AssignmentPanel`
- **Figma / variantes:** viewport: web|mobile; state: draft|assigned.
- **API dinâmica a definir em TypeScript:** `value:{teamId,technicianId?}, onChange, onSubmit, note?, pending?, error?`.
- **Composição e reutilização:** TeamSelector + UserSelector + StatusBadge + Button.
- **Específico Web:** Selectores lado a lado quando há espaço; estado ao topo.
- **Teste de aceitação mínimo:** Não permite atribuição incompatível sem validação do servidor.
- **Referências ao draft do PO:** OS-01; PLN-01; PLN-02; PLN-03.

#### `MDS/Checklist`
- **Figma / variantes:** viewport: web|mobile; state: inProgress|complete.
- **API dinâmica a definir em TypeScript:** `items:ChecklistEntry[], value:Record<id,result>, onItemChange, onSave?, onSubmit?, actions?`.
- **Composição e reutilização:** ChecklistItem + TaskProgress + PhotoTile.
- **Específico Web:** Painel de verificação com lista dinâmica e ações no rodapé.
- **Teste de aceitação mínimo:** Resultado e progresso calculados da mesma lista; N itens e evidências.
- **Referências ao draft do PO:** RST-01; RST-02; RST-03; RST-05; MOB-07.

#### `MDS/ChecklistItem`
- **Figma / variantes:** viewport: web|mobile; result: pending|pass|fail|notTested.
- **API dinâmica a definir em TypeScript:** `item:{id,title,description?,required?}, result, note?, attachments?, onChange, onAddEvidence?`.
- **Composição e reutilização:** StatusBadge + Button + PhotoTile/AttachmentItem.
- **Específico Web:** Controlos de escolha exclusiva; motivo/evidência visíveis para fail/notTested.
- **Teste de aceitação mínimo:** fail e notTested não podem ser indistinguíveis de pending.
- **Referências ao draft do PO:** RST-02; RST-03.

#### `MDS/ClientSummary`
- **Figma / variantes:** viewport: web|mobile; state: active|review.
- **API dinâmica a definir em TypeScript:** `client:{id,name,contacts?,sites?,status}, onOpen, actions?, fields?`.
- **Composição e reutilização:** Card + StatusBadge + Button.
- **Específico Web:** Resumo para listas, propostas e ordens.
- **Teste de aceitação mínimo:** Render sem dados opcionais e sem inventar contactos.
- **Referências ao draft do PO:** CLI-01; CLI-02; CLI-03; CLI-05.

#### `MDS/EquipmentCard`
- **Figma / variantes:** viewport: web|mobile; state: operational|needsService.
- **API dinâmica a definir em TypeScript:** `equipment:{id,identifier,model?,site?,status}, onOpen, actions?`.
- **Composição e reutilização:** Card + StatusBadge + Button.
- **Específico Web:** Resumo com identificação e acesso a histórico/documentos.
- **Teste de aceitação mínimo:** Nunca usar QR como substituto da verificação de permissões.
- **Referências ao draft do PO:** EQP-01; EQP-02; EQP-03; EQP-04.

#### `MDS/ServiceOrderCard`
- **Figma / variantes:** viewport: web|mobile; state: planned|active.
- **API dinâmica a definir em TypeScript:** `order:{id,reference,clientId,siteId,status,scheduledAt?}, onOpen, actions?`.
- **Composição e reutilização:** Card + StatusBadge + Button.
- **Específico Web:** Listagem e overview operacional com prioridade/estado.
- **Teste de aceitação mínimo:** Sem duplicar dados da ordem; datas e permissões respeitadas.
- **Referências ao draft do PO:** OS-01; OS-03; MOB-01.

#### `MDS/TaskProgress`
- **Figma / variantes:** viewport: web|mobile; state: inProgress|complete.
- **API dinâmica a definir em TypeScript:** `completed, total, pending?, failed?, label?`.
- **Composição e reutilização:** ProgressBar + StatusBadge.
- **Específico Web:** Resumo de verificações com leitura numérica.
- **Teste de aceitação mínimo:** O que conta como concluído deve ser regra de negócio explícita.
- **Referências ao draft do PO:** RST-02; RST-05.

#### `MDS/TeamSelector`
- **Figma / variantes:** viewport: web|mobile; state: closed|open.
- **API dinâmica a definir em TypeScript:** `teams[], value, onChange, query?, onQueryChange?, loading?`.
- **Composição e reutilização:** Select + StatusBadge + UserSelector.
- **Específico Web:** Combobox com opções e disponibilidade contextual.
- **Teste de aceitação mínimo:** Disponibilidade validada na atribuição pelo backend.
- **Referências ao draft do PO:** PLN-01; PLN-02.

#### `MDS/Timeline`
- **Figma / variantes:** viewport: web|mobile; state: populated|empty.
- **API dinâmica a definir em TypeScript:** `events:ActivityEvent[], onLoadMore?, hasMore?, isLoading?`.
- **Composição e reutilização:** ActivityItem + Pagination.
- **Específico Web:** Lista cronológica com agrupamento por dia quando útil.
- **Teste de aceitação mínimo:** Autor/hora/referência presentes; histórico não sobrescrito.
- **Referências ao draft do PO:** OS-02; CORE-03; PRO-02.

#### `MDS/UserSelector`
- **Figma / variantes:** viewport: web|mobile; state: closed|open.
- **API dinâmica a definir em TypeScript:** `users[], value, onChange, query?, onQueryChange?, loading?, teamId?`.
- **Composição e reutilização:** Select + StatusBadge.
- **Específico Web:** Combobox por nome/função e disponibilidade.
- **Teste de aceitação mínimo:** Filtrar por equipa opcional; confirmar disponibilidade no servidor.
- **Referências ao draft do PO:** PLN-01; OS-01.

## 10. Contratos funcionais e casos de integração

**Ordens de serviço:** `ServiceOrderCard` e `ClientSummary` usam identificadores estáveis; `Tabs`/`TabPanel` separam geral, materiais, equipa, relatórios e histórico; `Timeline` mantém `ActivityEvent[]`; `AttachmentItem` referencia a ordem a que pertence. Referências: OS-01..06, CLI-01..05, CORE-01..03.

**Planeamento:** `DatePicker` + `TimePicker` + `DateRangePicker` + `TeamSelector` + `UserSelector` + `AssignmentPanel`. O UI pode mostrar uma disponibilidade, mas a confirmação deve rever conflitos no backend (PLN-01..04).

**Terreno e relatórios:** `Checklist` composta de `ChecklistItem[]`, `TaskProgress`, `ImagePicker`, `FileUpload`, `PhotoTile`. Resultados: `pass`, `fail`, `notTested`, `pending`. `fail`/`notTested` não podem perder observações/evidências (MOB-01..08, RST-01..06).

**Equipamentos:** `EquipmentCard` identifica um registo de equipamento independente da ordem de serviço; leitura de QR não concede permissões por si só (EQP-01..04).

**Mobile offline e plataforma comum:** guardar rascunhos e eventos com IDs estáveis; indicar `pendingSync`, `syncing`, `conflict`, `synced` em componentes apropriados, mas só implementar persistência/reconciliação se aprovado. Fase de desenho não equivale a sincronização funcional (MOB-07; CORE-01; PHC-04).

**ERP PHC e IA:** não adicionar integrações reais nem decisões automáticas irreversíveis a componentes. Necessidades PHC-01..06 e IA-01..05 estão por analisar e validar; interfaces devem aceitar estados/proveniência se este âmbito for aprovado.

### Regras de consistência entre Web e Mobile

- Mesmos **IDs, estados de domínio, formatos de data e eventos**; aparência e padrão de navegação podem diferir.
- Um erro de backend tem a mesma interpretação funcional; a apresentação pode ser `Alert` Web e `Toast`/`Dialog` Mobile conforme gravidade.
- `ServiceOrderStatus` não se confunde com `ChecklistResult`, `UploadStatus` ou estados de faturação.
- Ficheiros e fotografias têm identidade própria e associação clara à ordem/intervenção, não apenas à mensagem onde apareceram.
- Formulários críticos não perdem dados ao trocar de separador, fechar sobreposições por acidente ou passar temporariamente a offline.

## 11. Ordem recomendada para o agente implementar

1. **Tokens, ThemeProvider e infraestrutura de testes**.
2. **Átomos** (`Button`, `StatusBadge`, `AlertIcon`, `TextField`, `Checkbox`, `Radio`, `Switch`, `PageButton`).
3. **Formulários e composição** (`FormField`, `Select`, `Textarea`, `FormGroup`, `Form`, `Card`, `ContentPanel`).
4. **Layout, feedback, navegação, listagens** (`AppShell`, `PageLayout`, `Tabs`, `Dialog`, `DataTable`, `FilterBar`, `ToastSnackbar`, `ProgressBar`, etc.).
5. **Áreas de negócio** por story realmente priorizada: ordens de serviço, agenda/atribuição, equipamento, checklist/evidências, histórico.
6. **Ensaios integrados**, com dados fictícios consistentes, testes de UI e verificações de acessibilidade.

Não implementes todas as 53 famílias se o sprint pedir menos. Usa este catálogo como **contrato de execução incremental**, não como requisito para uma entrega monolítica.

## 12. Definition of Done (DoD) para um componente

- [ ] API pública tipada; sem `any` nas interfaces de uso normal; estados e callback sem ambiguidade.
- [ ] Tema global + pelo menos uma personalização local e uma variante sem alterar a implementação.
- [ ] Componentes aninhados/slots funcionam com zero, um e vários elementos.
- [ ] Estados default, disabled, loading, error, empty, selected/focused testados quando relevantes.
- [ ] Texto longo, fonte ampliada, largura reduzida e conteúdo variável não causam sobreposições/corte.
- [ ] Ação recebe callback e não executa chamadas escondidas à rede; não há botões inertes.
- [ ] Contraste, navegação por teclado/leitor de ecrã, labels e estados adequados à plataforma.
- [ ] Testes de lógica, renderização e interações, incluindo um caso de erro e um caso com dados diferentes do Figma.
- [ ] Exemplos demonstram reutilização em duas páginas/ecrãs e composição com pelo menos outro componente, quando adequado.
- [ ] `npm run typecheck`, lint e testes do projeto executados (ou equivalentes reais identificados). Indicar resultados reais, nunca inventados.
- [ ] Registo da correspondência com Figma e referência da User Story/AC, se existir; alterações de scope autorizadas.

## 13. Formato sugerido de relato para tarefas de componentes

Usa este modelo quando ajudar a explicar a implementação; adapta-o ao pedido e às orientações do projeto. Não se aplica como formato obrigatório a todas as tarefas do repositório.

```md
### Implementado
- Nome e responsabilidade do(s) componente(s)
- Ficheiros adicionados/alterados
- Props públicas, variantes, slots e tokens usados

### Exemplos
- Caso A e caso B (com dados distintos)

### Verificação
- Comandos executados e resultado real
- Estados e acessibilidade verificados
- Comparação com Figma (ou limitação de acesso)

### Pendências / decisões
- Requisitos não validados, dependências ou integrações por decidir
```

## 14. Referências

- **Enunciado local:** `MDS_Projeto_Pratico_2026-2027_REV06.pdf`.
- **Draft do PO:** `MDS_Draft_Product_Backlog_ENTREGA_01_CONCRETA_V03.pdf`.
- **Figma:** [MDS — Wireframes da Aplicação](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS-%E2%80%94-Wireframes-da-Aplica%C3%A7%C3%A3o), página `00 — Design System`.
- **React — composição e propriedades:** https://react.dev/learn/passing-props-to-a-component
- **React Native — documentação base:** https://reactnative.dev/docs/getting-started
- **Acessibilidade e padrões:** https://www.w3.org/WAI/ARIA/apg/patterns/

> **Nota sobre o Figma:** nomes, famílias e variantes foram consultados; os layouts no Figma são referências visuais e não especificações de API, persistência ou lógica de negócios. Quando houver divergência entre um exemplo Figma e a acessibilidade/funcionamento da aplicação, preservar a identidade visual e implementar o comportamento correto, documentando a decisão.
