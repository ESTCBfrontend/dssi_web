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
