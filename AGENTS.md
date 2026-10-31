# Instruções para agentes de IA

Lê este ficheiro, o README e o CONTRIBUTING antes de alterar o projeto. Instruções explícitas do utilizador têm prioridade sobre estas orientações.

Para criar, alterar ou reutilizar componentes da interface, consulta também [docs/COMPONENTS_WEB_REACT.md](docs/COMPONENTS_WEB_REACT.md), incluindo a ficha `MDS/<Nome>` e as dependências relevantes. O guia descreve comportamento, composição, utilização e validação; as propostas técnicas e os exemplos não substituem as decisões aprovadas do projeto nem alargam o âmbito da tarefa.

## Projeto

- Aplicação React + TypeScript + Vite, com npm e `package-lock.json`.
- A integração ocorre em `develop`; `main` representa versões estáveis.
- Uma tarefa deve partir de `develop` e ser proposta por PR para `develop`; entregas seguem por PR para `main`.
- O repositório é público: não adicionar credenciais, tokens, ficheiros `.env` ou dados sensíveis. Não introduzir serviços pagos sem pedido explícito.

## Forma de trabalhar

- Inspeciona o contexto e preserva alterações existentes. Mantém cada alteração focada na tarefa.
- Adiciona ou atualiza testes significativos para comportamentos modificados; evita testes que apenas repetem detalhes de implementação.
- Executa as verificações relevantes: `npm run lint`, `npm run typecheck`, `npm run test:ci` e `npm run build`. No PowerShell pode ser necessário usar `npm.cmd`.
- Não contornar a CI, desativar testes nem enfraquecer a proteção das branches para permitir merges. Não fazer push direto para `develop` ou `main`.
- Antes de criar PRs, confirma destino, branch, diferenças e resultados dos testes. Não fazer merge, publicar ou alterar configurações externas sem instrução apropriada.
- Documenta alterações ao processo neste ficheiro e em CONTRIBUTING.md quando necessário. Se não for possível verificar algo, explica a limitação.
