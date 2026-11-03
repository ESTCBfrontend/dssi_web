# SortableHeader

Cabeçalho ordenável baseado em [MDS/SortableHeader](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=121-1697). É utilizado dentro de uma linha de cabeçalho de tabela; [DataTable](DataTable.md) compõe-o automaticamente.

```tsx
<SortableHeader label="Data" direction={direcao} onSort={setDirecao} />
```

## API e comportamento

- `label`, `direction` e `onSort` são obrigatórios. `direction` é `none`, `ascending` ou `descending`; o botão pede o próximo estado nessa ordem e o consumidor atualiza a ordenação e os dados.
- O componente cria `<th scope="col">` com botão nativo. `aria-sort` aparece apenas quando a coluna está ordenada; o nome do botão comunica direção atual e próxima ação. `disabled` impede pedidos e mantém o estado visível.
- `labels` personaliza `none`, `ascending`, `descending`, `sortAscending`, `sortDescending` e `clear`. `className`, `style`, `ref` e atributos nativos aplicam-se ao cabeçalho.

## Tema e validação

Usa tokens de texto secundário, marca, superfície informativa, desativação e foco `--mds-color-*`; setas são caracteres de texto decorativos. O alvo tem altura mínima de 44 px. Validar teclado, leitura da ordenação e contraste em navegadores reais.
