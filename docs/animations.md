# Animações Web

As animações fornecem feedback e ajudam a reconhecer ações equivalentes. Mantém a interface utilizável sem animação e não dependas do hover para indicar que um elemento é interativo. A orientação arquitetural está em [architecture.md](architecture.md#animações-web).

## Valores partilhados

Os tokens estão em `src/index.css` e podem ser substituídos num antepassado. Os estilos partilhados fornecem valores de reserva para componentes usados fora da composição principal.

| Token | Valor inicial | Utilização |
| --- | --- | --- |
| `--mds-motion-feedback-duration` | `160ms` | Transições breves de feedback. |
| `--mds-motion-feedback-easing` | `ease` | Curva das transições de feedback. |
| `--mds-motion-arrow-distance` | `4px` | Deslocação da seta de uma ligação direcional. |

Os indicadores de carregamento têm duração e propósito próprios; não usam a duração de feedback.

## Padrões disponíveis

- **Botões:** `Button` aplica uma transição discreta no hover quando está ativo e o dispositivo suporta hover. Botões desativados ou em carregamento não recebem esse feedback. O foco de teclado mantém-se visível.
- **Ligações direcionais:** `src/shared/ui/motion/DirectionalLink.module.css` fornece `directional` e `arrow`. Aplica `directional` à ligação, `arrow` à seta decorativa e `data-motion-direction="forward"` ou `"back"` à ligação. A seta move-se no sentido indicado em dispositivos com hover; a funcionalidade define cores, texto, sublinhado e foco adequados ao contexto. Os exemplos estão na listagem e no detalhe de ordens.

Em `prefers-reduced-motion: reduce`, as transições e a deslocação da seta ficam desativadas; as indicações de cor, texto e foco mantêm-se. Os indicadores de carregamento existentes também respeitam essa preferência.

## Evoluir e validar

Para uma interação nova, começa junto da funcionalidade. Quando existir uma necessidade comum, extrai o comportamento para um componente ou estilo partilhado e documenta aqui os seus tokens, variantes e utilização. Não alteres todos os componentes por antecipação.

Valida em browser real com rato, teclado, dispositivo tátil ou emulação e movimento reduzido; confirma contraste, foco e que o texto e a ação continuam claros sem hover. Os testes em jsdom não comprovam a animação nem a aparência.
