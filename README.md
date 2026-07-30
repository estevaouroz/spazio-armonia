# Spazio Armonia

Landing page da escola Spazio Armonia (Italiano · Yoga · Música) — Florianópolis, SC.
HTML, CSS e JavaScript puro, mobile-first, sem frameworks.

## Como rodar localmente

Basta abrir `index.html` diretamente no navegador, ou servir a pasta com um servidor simples:

```
python3 -m http.server 8000
```

E acessar `http://localhost:8000`.

## Estrutura

```
index.html          # todas as seções da página
css/style.css        # estilos (mobile-first, breakpoints em 768px e 1024px)
js/translations.js    # dicionário de traduções PT/EN/IT
js/main.js            # i18n, menu mobile, carrossel, toggle, accordion FAQ
assets/images/        # pasta reservada para imagens reais (atualmente usa picsum.photos)
```

## Placeholders a substituir

- **Logo colorido e preto** — atualmente `.logo-placeholder` é só texto estilizado no header e
  footer (`index.html`). Trocar pela imagem real do logotipo quando os arquivos de marca chegarem.
- **Ícone/monograma "J" (S+A)** — usado como sticker no hero (`svg.sticker-icon` em `index.html`).
  Substituir o `<svg>` inline pelo ícone oficial.
- **Imagens (hero, sobre, galeria)** — todas usam `picsum.photos/seed/...` como placeholder.
  Buscar por `picsum.photos` em `index.html` e trocar pelas fotos reais.
- **Embed do Cal.com** — seção `#agendamento`, procurar o comentário
  `<!-- AQUI VAI O EMBED DO CAL.COM -->` e a div `.calcom-placeholder`. Substituir pelo `<iframe>`
  ou script oficial do Cal.com.
- **Endereço e mapa** — seção `#localizacao`. Trocar o texto `Rua Exemplo, 123 - Florianópolis, SC`
  e o `src` do iframe do Google Maps pelas coordenadas/endereço reais.
- **WhatsApp, e-mail e Instagram** — seção `#contato`. Trocar os `href="#"` e os textos
  `[SEU WHATSAPP]`, `[SEU EMAIL]`, `[@SEU INSTAGRAM]` pelos links reais (ex:
  `https://wa.me/55XXXXXXXXXXX`).

## Traduções (i18n)

O sistema de idiomas fica em `js/translations.js` (objeto `translations.pt/en/it`) e é aplicado
via atributos `data-i18n="chave.subchave"` no HTML. As versões EN e IT são traduções aproximadas
feitas automaticamente — recomenda-se revisão por um tradutor ou falante nativo antes de publicar.

## Lista de conteúdo ainda placeholder (a confirmar com a cliente)

- Lista de sub-serviços no carrossel (Italiano: Iniciante/Intermediário-Avançado/Conversação;
  Yoga: Hatha/Vinyasa/Restaurativo; Música: Piano/Violão/Teoria Musical) e seus badges
  Individual/Grupo.
- Perguntas e respostas do FAQ.
