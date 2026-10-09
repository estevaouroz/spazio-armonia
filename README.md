# Spazio Armonia

Landing page da escola Spazio Armonia (Italiano · Yoga · Música) — Florianópolis, SC.
HTML, CSS e JavaScript puro, mobile-first, sem frameworks.

## Como rodar localmente

```
node scripts/dev.mjs
```

E acessar `http://localhost:8888`. Serve a pasta `public/`, responde a agenda (`/api/...`) e
manda os mesmos cabeçalhos de segurança do site publicado.

## Estrutura

```
public/               # SÓ o que vai pro ar
  index.html          # todas as seções da página
  privacidade.html    # política de privacidade
  css/                # estilos (ver PADRAO-CSS.md)
  js/translations.js  # dicionário de traduções PT/EN/IT
  js/main.js          # i18n, menu mobile, carrossel, agenda, galeria, FAQ
  assets/             # imagens, ícones, adesivos
netlify/              # funções da agenda (rodam no servidor, nunca vão pro navegador)
scripts/              # dev.mjs, google-refresh-token.mjs, csp-hash.py
netlify.toml          # pasta publicada + cabeçalhos de segurança
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

## Segurança

- Só `public/` é publicado. Documentação, scripts e código das funções ficam fora do ar.
- Credenciais do Google só no `.env` (fora do git) e nas variáveis de ambiente da hospedagem.
- `netlify.toml` define os cabeçalhos de segurança, incluindo a Content-Security-Policy, que diz
  de onde o navegador pode carregar scripts, fontes, iframes etc. **Ao adicionar um serviço
  externo novo** (ex.: um widget, outro CDN, outro mapa), inclua a origem dele lá, senão ele é
  bloqueado. Rode `node scripts/dev.mjs` e olhe o console do navegador: bloqueios aparecem como
  "Refused to load...".
- O `<script>` inline no `<head>` do `index.html` é liberado pelo hash. Se mudar, rode
  `python3 scripts/csp-hash.py`.
- Fancybox está com versão fixa e `integrity` (SRI): se o arquivo do CDN for alterado, o
  navegador recusa. Para atualizar a versão, troque o número e recalcule os hashes `sha384`.
- `/api/agendar` aceita só pedidos do próprio site (Origin) e no máximo 5 por IP a cada 3 min;
  `/api/aulas`, 60 por minuto.

## Traduções (i18n)

O sistema de idiomas fica em `js/translations.js` (objeto `translations.pt/en/it`) e é aplicado
via atributos `data-i18n="chave.subchave"` no HTML. As versões EN e IT são traduções aproximadas
feitas automaticamente — recomenda-se revisão por um tradutor ou falante nativo antes de publicar.

## Lista de conteúdo ainda placeholder (a confirmar com a cliente)

- Lista de sub-serviços no carrossel (Italiano: Iniciante/Intermediário-Avançado/Conversação;
  Yoga: Hatha/Vinyasa/Restaurativo; Música: Piano/Violão/Teoria Musical) e seus badges
  Individual/Grupo.
- Perguntas e respostas do FAQ.
