# TableRow

Linha HTML baseada em [MDS/TableRow](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=108-1383), utilizada por [DataTable](DataTable.md). Destina-se a um `<tbody>`; a apresentação em cartões é definida pelo consumidor.

```tsx
<TableRow cells={[
  { id: 'referencia', content: 'OS-42', rowHeader: true },
  { id: 'cliente', content: nomeCliente },
]} selected={selecionada} />
```

## API e comportamento

- `cells` contém `{ id, content, rowHeader? }`; os IDs devem ser únicos e não vazios. `content` pode compor texto, [StatusBadge](StatusBadge.md), [Button](Button.md) ou outros elementos fornecidos pela aplicação.
- Cada célula é um `<td>`; `rowHeader` usa `<th scope="row">` quando identifica o registo. `selected` controla o fundo e `aria-selected`; não transforma a linha num botão nem altera seleção por si.
- `className`, `style`, `ref` e atributos nativos aplicam-se ao `<tr>`. As ações inseridas pelo consumidor são responsáveis pelos respetivos nomes acessíveis e callbacks.

## Tema e validação

Usa tokens de superfície, borda, texto, fundo subtil, informação e foco `--mds-color-*`. O texto pode quebrar linha e a seleção não depende apenas da cor. Validar tabelas largas, leitura de cabeçalhos, estados e ações em navegadores reais.
