# Guia de contribuição

Este repositório é público. Cada pessoa deve usar a sua própria conta GitHub e nunca guardar passwords, tokens, ficheiros `.env` ou dados privados no repositório. As regras de proteção descritas abaixo só ficam ativas depois de configuradas no GitHub.

## Branches

- `develop`: integração das tarefas da equipa.
- `main`: versões estáveis; recebe alterações aprovadas de `develop`.
- `feature/<numero>-<descricao>`: funcionalidade.
- `fix/<numero>-<descricao>`: correção.
- `docs/<numero>-<descricao>`: documentação.

Usa o número da issue quando existir. Cria uma branch por tarefa a partir da versão atual de `develop`:

```bash
git switch develop
git pull origin develop
git switch -c feature/12-login
```

## Desenvolver e propor alterações

1. Faz alterações focadas na tarefa e acrescenta testes relevantes ao comportamento alterado.
2. Executa as verificações locais indicadas no README.
3. Guarda o trabalho e envia a branch:

   ```bash
   git add .
   git commit -m "feat: adicionar formulário de login"
   git push -u origin feature/12-login
   ```

4. Abre no GitHub um Pull Request (PR) da tua branch para `develop`. Descreve a tarefa, as alterações e como foram testadas; associa a issue, se existir.
5. Confirma que o job `web-ci` passou, responde aos comentários e pede revisão a outra pessoa. Se `develop` avançar, atualiza a branch e volta a verificar.
6. Com CI verde e aprovação, faz **Squash and merge** e elimina a branch da tarefa no GitHub. Não faças push direto para `develop` ou `main`.

Uma aprovação deve ser exigida quando houver outra pessoa com permissões para rever. Enquanto só houver uma pessoa, a exigência impede-a de aprovar os seus próprios PRs; um administrador terá de ativá-la quando a equipa estiver disponível.

## Componentes da interface

Ao criar, alterar ou reutilizar componentes, consulta o [guia React Web](docs/COMPONENTS_WEB_REACT.md) e a ficha `MDS/<Nome>` relevante. Confirma o código existente, o contexto da tarefa e as variantes do Figma a implementar. As props e soluções técnicas propostas no guia devem ser ajustadas às decisões aprovadas do projeto; documenta no PR as verificações e eventuais limitações de comparação visual.

## Entregas

Quando o estado de `develop` estiver pronto para entrega, abre um PR de `develop` para `main`, com CI e revisão. O merge para `main` representa uma versão estável. Não se assume qualquer publicação automática.

## Proteções a configurar no GitHub

Um administrador deve proteger `develop` e `main`: exigir PR e o check `web-ci`, exigir que as branches estejam atualizadas, bloquear force pushes e eliminações e aplicar as regras também a administradores. Depois de existir pelo menos um segundo membro com permissões de escrita, exigir uma aprovação e descartar aprovações antigas quando surgirem alterações. Não ignorar as regras para contornar testes falhados.

O CI corre antes do merge e novamente após o merge. Um resultado verde não prova que toda a funcionalidade esteja testada; a revisão deve verificar se os testes cobrem os comportamentos importantes. Se o CI falhar, consulta os logs do PR, corrige na mesma branch e envia novos commits.

## Qualidade e arquitetura

Todos os contribuidores devem seguir os princípios de [docs/architecture.md](docs/architecture.md) e a política de testes proporcionais ao risco de [AGENTS.md](AGENTS.md). Essas orientações aplicam-se ao trabalho da equipa, com ou sem assistência de IA.

## Manter as instruções atualizadas

Durante a tarefa e antes de concluir o PR, considera se foi tomada uma decisão duradoura que poderá afetar funcionalidades ou contribuidores futuros. Exemplos: responsabilidades entre módulos, estrutura de pastas, contratos, autenticação, testes, ambientes, CI e infraestrutura.

Se houver uma regra nova a propor, explica a razão, o alcance e o texto sugerido, seguindo o processo de aprovação de AGENTS.md. Quando um agente de IA fizer a proposta, deve perguntar ao utilizador se quer guardá-la. A revisão geral de um PR não substitui uma aprovação explícita da nova regra.

Após aprovação, inclui a atualização documental na mesma branch e no PR. Verifica se há instruções anteriores a substituir e se os documentos correspondem ao código ou identificam claramente uma direção ainda por implementar. Não registes detalhes locais como convenções globais.

O PR deve indicar se há impacto nas instruções, se a documentação foi atualizada e que decisão foi aprovada. Se não houver impacto, basta indicá-lo. Uma proposta ainda pendente deve ser identificada como tal e não apresentada como regra vigente.

Correções de escrita, ligações e atualizações factuais de comandos já aprovados não exigem nova aprovação da política. Mudanças de significado ou processo devem ser propostas.

No mobile e no web podem existir princípios comuns, mas cada repositório mantém instruções e limitações específicas. A atualização de um deles não autoriza alterações automáticas no outro.
