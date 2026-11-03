# Pagination

Navegação por páginas baseada em [MDS/Pagination](https://www.figma.com/design/PddPTg5sgihzoU1WOdn8JZ/MDS?node-id=124-1857), composta por [PageButton](PageButton.md) e [Button](Button.md). Não carrega dados nem altera o estado da aplicação.

```tsx
import { Pagination } from '../../shared/ui/Pagination'

<Pagination page={pagina} pageSize={tamanho} total={total} onPageChange={setPagina}
  pageSizeOptions={[10, 25, 50]} onPageSizeChange={alterarTamanho} />
```

## API e comportamento

- `page`, `pageSize` e `total` são controlados: página e tamanho são inteiros seguros positivos; total é inteiro seguro não negativo. A página começa em 1 e deve pertencer ao intervalo; com zero registos deve ser 1. Uma combinação inválida produz erro explícito.
- `onPageChange` recebe a página pedida. A aplicação atualiza `page` e carrega ou filtra dados. Anterior e seguinte são desativados nos limites; `disabled` desativa todos os controlos.
- `onPageSizeChange` ativa o seletor de tamanho opcional e recebe o tamanho escolhido. `pageSizeOptions` contém inteiros seguros positivos e únicos; por omissão `[10, 25, 50]`. Se o tamanho atual não estiver na lista, é acrescentado. O consumidor deve atualizar o tamanho e garantir uma página válida, por exemplo voltando à página 1.
- `labels` permite localizar `navigation`, `previous`, `next`, `empty`, `pageSize` e as funções `total`, `range`, `page`, `pageNumber` e `sizeOption`. As etiquetas fixas e os nomes das páginas não podem ser vazios.
- A lista numérica inclui extremos, página atual e vizinhos, com reticências para intervalos maiores; o número de botões é limitado mesmo para totais elevados. Em contentores estreitos é apresentada a indicação da página em vez dos números, mantendo anterior/seguinte e o seletor disponível.
- Com zero registos, apresenta `0–0 de 0`, `Sem páginas` e impede navegação. A mudança de página ou tamanho não é anunciada automaticamente; a aplicação decide como comunicar a atualização de resultados.
- O contentor é um `nav` com nome acessível configurável; aceita `className`, `style`, `ref` e atributos nativos. O seletor tem uma etiqueta acessível e comportamento nativo.

## Tema e validação

Usa tokens CSS `--mds-*` com valores de reserva do Figma; `--mds-pagination-radius` e `--mds-pagination-chevron` permitem personalizar raio e recurso do seletor. O SVG original do chevron tem cor fixa, pelo que deve ser substituído ou revisto em temas diferentes. A adaptação à largura usa container queries. Validar limites, totais grandes, seletor, teclado, zoom, contraste e larguras em navegador real; as funções e estado dos exemplos pertencem ao consumidor.
