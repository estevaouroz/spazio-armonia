# Agenda viva — configuração do Google Calendar

A seção "Individual ou em Grupo?" mostra as aulas de um calendário do Google e
deixa a pessoa se inscrever numa aula experimental. Tudo roda no Netlify
(funções em `netlify/functions`), sem custo.

Enquanto as variáveis abaixo não estiverem configuradas, o site funciona em
**modo demonstração** (aulas de exemplo, nenhuma inscrição é gravada).

## Como a escola usa no dia a dia

1. No Google Calendar, a escola tem um calendário só para as aulas, por exemplo
   **"Spazio Armonia · Aulas"**. Compromissos pessoais ficam nos outros
   calendários e nunca aparecem no site.
2. Cada aula é um evento comum nesse calendário (pode ser recorrente):
   - **Título** com a matéria: "Yoga — turma iniciante", "Italiano individual",
     "Piano individual"... O site reconhece *italiano*, *yoga* e
     *música / piano / canto / teclado* no título pra pôr a cor e o filtro.
   - **Descrição** com uma linha `Vagas: 8`. Com `Vagas: 1` a aula aparece
     como **individual**; com mais, como **turma**. Sem essa linha, vale o
     padrão (`DEFAULT_CAPACITY`, 6).
   - **Local** ou link do Meet, se quiser (o site mostra a etiqueta "Online").
3. Quando alguém se inscreve pelo site, a pessoa entra como **convidada** do
   evento, com o nome "Experimental · Nome · WhatsApp", e recebe o convite do
   Google por e-mail. Os alunos não veem os outros convidados.
4. Pra cancelar ou mudar uma aula, é só editar/apagar o evento no Google
   Calendar — o site acompanha (atualiza a cada minuto).

## Configuração (uma vez só)

### 1. Calendário
No Google Calendar da conta da escola: **Outros calendários → + → Criar novo
calendário** → "Spazio Armonia · Aulas". Depois, em **Configurações do
calendário → Integrar agenda**, copie o **ID da agenda** (algo como
`abc123@group.calendar.google.com`).

### 2. Google Cloud (credencial OAuth)
1. Acesse https://console.cloud.google.com e crie um projeto ("Spazio Armonia").
2. **APIs e serviços → Biblioteca** → ative a **Google Calendar API**.
3. **APIs e serviços → Tela de permissão OAuth**: tipo **Externo**, preencha
   nome e e-mail. Em escopos, adicione `.../auth/calendar.events`.
   Depois clique em **Publicar app** (status "Em produção"). Se ficar em
   "Teste", o token para de funcionar depois de 7 dias. Não precisa enviar
   para verificação do Google: só a própria conta da escola vai autorizar
   (na hora vai aparecer um aviso de "app não verificado" — é só avançar).
4. **Credenciais → Criar credenciais → ID do cliente OAuth** → tipo
   **Aplicativo da Web**. Em "URIs de redirecionamento autorizados" adicione
   `http://localhost:5555/callback`. Guarde o **Client ID** e o **Client secret**.

### 3. Refresh token
Na pasta do projeto, rode (com Node 18+):

```bash
GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-refresh-token.mjs
```

Abra o link que aparece, entre com a **conta dona do calendário** e autorize.
O terminal mostra o `GOOGLE_REFRESH_TOKEN`.

### 4. Netlify
**Site configuration → Environment variables**, adicione:

| Variável | Valor |
|---|---|
| `GOOGLE_CLIENT_ID` | do passo 2 |
| `GOOGLE_CLIENT_SECRET` | do passo 2 |
| `GOOGLE_REFRESH_TOKEN` | do passo 3 |
| `GOOGLE_CALENDAR_ID` | do passo 1 |
| `DEFAULT_CAPACITY` | opcional, padrão `6` |
| `MIN_NOTICE_HOURS` | opcional, antecedência mínima pra inscrição, padrão `2` |

Faça um novo deploy. O aviso "Modo demonstração" some da agenda.

## Testar localmente

```bash
node scripts/dev.mjs   # site + funções em http://localhost:8888, sem instalar nada
```

Pra usar a agenda real local, copie `.env.example` para `.env` e preencha as
mesmas variáveis (o `.env` não vai pro git). Sem ele, roda em modo
demonstração. Também funciona com o CLI oficial: `npm i -g netlify-cli && netlify dev`.

## Trocar de conta (ex.: da conta de teste pra conta da Marina)
Repita os passos 1 e 3 com a conta nova e atualize `GOOGLE_REFRESH_TOKEN` e
`GOOGLE_CALENDAR_ID` no Netlify. O Client ID/secret podem continuar os mesmos
(se a conta nova não for a dona do projeto no Google Cloud, adicione ela como
usuária de teste ou mantenha o app publicado).
