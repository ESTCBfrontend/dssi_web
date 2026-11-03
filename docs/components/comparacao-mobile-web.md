# Comparação dos componentes mobile e web

Esta comparação descreve as APIs existentes após a revisão dos componentes partilhados nas duas plataformas. Os contratos nativos de React e React Native são diferentes; comportamento equivalente não implica copiar propriedades específicas da outra plataforma.

| Componentes | Comportamentos e diferenças relevantes |
| --- | --- |
| Button | Ambos oferecem variantes, ícones, loading, texto de loading, desativação e largura configurável. A web usa `children`, atributos e eventos nativos; mobile usa `label`, `onPress` e APIs de acessibilidade nativas. |
| StatusBadge | Ambos oferecem tons, variantes, tamanhos, ponto e ícone alternativo. A web pode substituir o recurso do ponto; mobile fornece recursos através do tema. |
| TextField | Ambos aceitam tamanho, ícone e conteúdo dinâmico. Web aceita valores controlados ou não controlados e usa `label`/ARIA; mobile usa valor controlado e nome acessível explícito. A web mantém o campo montado quando o ícone muda. |
| Textarea | Ambos oferecem variantes, limite e contador. Na web `autoGrow` é opcional; sem esta opção usa-se o redimensionamento nativo. O contador web também acompanha reset de formulários não controlados. |
| FormField | Ambos compõem etiqueta, ajuda e erro com um controlo fornecido pelo consumidor. A web usa `id`, `label` e `aria-describedby`; mobile usa propriedades de acessibilidade da plataforma. |
| Checkbox, Radio, Switch | Ambos suportam valores dinâmicos, variantes, descrição e desativação. Web usa inputs nativos e também suporta uso não controlado, formulários e navegação nativa; Checkbox suporta estado intermédio. |
| CheckboxGroup, RadioGroup | Ambos recebem opções dinâmicas e estado controlado, validam valores únicos e suportam disposição adaptável, descrição e erro. Web usa `fieldset`/`legend`, nomes de formulário e associações ARIA. |
| ProgressBar | Ambos limitam valores ao intervalo, rejeitam intervalos inválidos e estados de conclusão incompletos, e sincronizam texto, preenchimento e valor acessível. O texto do estado pode ser personalizado ou ocultado visualmente. |
| LoadingIndicator | Ambos oferecem spinner, inline, skeleton, número de linhas configurável, ativação, movimento reduzido e texto acessível. Web utiliza `role="status"`; a composição decide anúncios e `aria-busy` na região afetada. |

## Tema e validação

O mobile tem `ThemeProvider`, tokens por componente e fonte Inter local. Na web existem propriedades CSS semânticas e formas de substituir recursos visuais, mas não existe ainda um provider global nem fonte Inter local; quando indisponível é usada a fonte do sistema. A solução de composição de temas web deve cumprir a orientação aprovada em [architecture.md](../architecture.md).

Os testes específicos web são executados localmente por preferência do utilizador e não seguem para o Git ou CI. A validação visual, responsividade, movimento e tecnologias de apoio em navegadores reais não é substituída por testes JavaScript ou build. Os exemplos executáveis também permanecem locais.

Na revisão foram exercitados localmente estados controlados e não controlados, foco e composição de campos, estado intermédio, submissão nativa, grupos independentes, validação de progresso, recursos substituíveis e mensagens acessíveis. Estas verificações cobrem os contratos exercitados, não todas as combinações de propriedades ou navegadores. Foram corrigidos o estado intermédio após interação, a reposição da altura da Textarea ao desativar `autoGrow` e a aplicação indevida do tamanho do ponto a imagens fornecidas como ícones do StatusBadge.
