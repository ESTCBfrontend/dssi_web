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

## Entregas

Quando o estado de `develop` estiver pronto para entrega, abre um PR de `develop` para `main`, com CI e revisão. O merge para `main` representa uma versão estável. Não se assume qualquer publicação automática.

## Proteções a configurar no GitHub

Um administrador deve proteger `develop` e `main`: exigir PR e o check `web-ci`, exigir que as branches estejam atualizadas, bloquear force pushes e eliminações e aplicar as regras também a administradores. Depois de existir pelo menos um segundo membro com permissões de escrita, exigir uma aprovação e descartar aprovações antigas quando surgirem alterações. Não ignorar as regras para contornar testes falhados.

O CI corre antes do merge e novamente após o merge. Um resultado verde não prova que toda a funcionalidade esteja testada; a revisão deve verificar se os testes cobrem os comportamentos importantes. Se o CI falhar, consulta os logs do PR, corrige na mesma branch e envia novos commits.
