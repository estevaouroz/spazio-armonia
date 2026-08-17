# Padrão de CSS a seguir (adaptado de projeto SCSS para HTML/CSS puro)

Este documento descreve a organização de CSS que deve ser seguida neste projeto.
O projeto de referência usava SCSS + WordPress, mas aqui é **apenas HTML e CSS puro**
(sem pré-processador, sem build step). As regras abaixo foram adaptadas para isso.

## Estrutura de pastas e arquivos

```
css/
├── reset.css            → reset CSS (zera margin/padding/border, list-style, etc)
├── base.css              → regras globais de html/body (font-size base, scroll-behavior, box-sizing)
├── fonts.css             → só @font-face
├── colors.css            → poucas classes utilitárias de cor (.color-grey-0, .color-grey-900 etc), sem variáveis
├── typography.css        → classes utilitárias de texto (.titulo-um, .corpo-grande, .bold-500 etc)
├── grid.css               → .wrapper, .row, .col-1 até .col-12 (escritos um a um, sem loop)
├── spacings.css           → classes utilitárias .m-8, .p-16, .mx-24 etc (escritas uma a uma, em px)
├── alignments.css         → .justify-center, .items-center, .content-space-between etc
├── display.css            → .d-flex, .d-block, .d-none, .flex-row, .flex-column etc
├── header.css             → estilos do cabeçalho
├── footer.css             → estilos do rodapé
└── pages/
    ├── home.css            → estilos exclusivos da página inicial
    └── contato.css         → estilos exclusivos de outras páginas
```

Cada arquivo é ligado no `<head>` do HTML via `<link rel="stylesheet" href="...">`,
na seguinte ordem (igual à ordem de import do projeto original):

```html
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/fonts.css">
<link rel="stylesheet" href="css/colors.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/grid.css">
<link rel="stylesheet" href="css/typography.css">
<link rel="stylesheet" href="css/alignments.css">
<link rel="stylesheet" href="css/display.css">
<link rel="stylesheet" href="css/spacings.css">
<link rel="stylesheet" href="css/header.css">
<link rel="stylesheet" href="css/footer.css">
<!-- CSS específico da página atual, só nela -->
<link rel="stylesheet" href="css/pages/home.css">
```

Ou seja: **CSS de página não entra em todas as páginas** — cada página HTML só
carrega o CSS global comum + o seu próprio arquivo de página.

## Regra de ouro: sem variáveis, valores diretos

- Como é CSS puro (sem Sass), **não existem `$variaveis`** de forma alguma —
  isso já elimina o problema do projeto anterior, que tinha CSS "complexo demais".
- **Não usar `var(--custom-property)` para design tokens** (cor, espaçamento, fonte).
  Cores em hexadecimal e tamanhos em `px` escritos direto em cada regra:
  ```css
  .botao {
    background: #1e5456;
    padding: 32px 64px;
    font-size: 14px;
  }
  ```
- Utilitários de espaçamento e cor (spacings.css, colors.css) não usam loop/geração
  automática (isso só é possível em Sass) — são escritos manualmente, classe por classe,
  cobrindo os valores realmente usados no projeto (ex: 0, 4, 8, 12, 16, 20, 24, 32, 40...).

## Breakpoints — media query fixa, sem mixin

Sem Sass não há mixins, então os breakpoints usados no projeto original viram
media queries escritas por extenso, sempre com os mesmos valores fixos:

```css
/* mobile-first: regra base = mobile */

@media (min-width: 768px) {  /* sm */
  ...
}

@media (min-width: 1024px) { /* md */
  ...
}

@media (min-width: 1200px) { /* lg */
  ...
}

@media (min-width: 1440px) { /* desk */
  ...
}

@media (min-width: 1600px) { /* xxl */
  ...
}

@media (max-width: 1024px) { /* down(md) */
  ...
}
```

Use sempre esses mesmos valores de breakpoint (768, 1024, 1200, 1440, 1600) para manter
consistência — não inventar novos pontos de quebra a cada componente.

## Estilo de escrita de cada seção/componente

- Uma seção de página = um bloco de regras agrupado por comentário, ex:
  ```css
  /* ===== Hero ===== */
  .hero { ... }
  .hero .hero-text { ... }
  .hero .hero-text h1 { ... }

  @media (max-width: 1024px) {
    .hero { ... }
    .hero .hero-text h1 { ... }
  }
  ```
- Como CSS puro não tem nesting nativo (a menos que se use CSS moderno com `&`, o que
  deve ser **evitado** para manter compatibilidade e simplicidade), escreva os seletores
  completos por extenso: `.hero .hero-text h1` em vez de aninhar.
- Nomes de classe em kebab-case, descritivos por seção: `.footer-description-small`,
  `.box-svg`, `.hero-form-inner`.
- Media queries ficam logo depois do bloco da seção a que pertencem (não jogadas todas
  no fim do arquivo), repetindo a mesma media query quantas vezes for necessário perto
  de cada seletor relevante.
- Ordem de propriedades dentro de uma regra: posicionamento/layout (`position`, `display`,
  `width`/`height`) → box model (`padding`, `margin`, `gap`) → visual (`background`, `border`,
  `color`) → tipografia (`font-family`, `font-size`, `line-height`, `letter-spacing`) →
  `transition`/estados de hover por último.
- `:hover`, `::after`, `::before` escritos logo abaixo do seletor principal correspondente.
- Comentário só quando ajuda a conferir um cálculo, ex: `line-height: 140%; /* 19.6px */`.
  Sem comentários explicando o óbvio.

## O que evitar
- Custom properties (`--variavel`) para tokens de design.
- Frameworks utilitários (Tailwind etc) ou geração de classes via script/build.
- CSS Modules, BEM estrito, ou qualquer convenção que exija ferramenta de build.
- Um único arquivo CSS gigante com tudo misturado — manter a separação por arquivo
  (reset, base, grid, typography, spacings, header, footer, pages/*).
- Nesting de CSS nativo (`&`) — escrever seletores completos, já que o projeto é CSS puro.
