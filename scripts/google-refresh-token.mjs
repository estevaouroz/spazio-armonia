/* Gera o GOOGLE_REFRESH_TOKEN da conta Google que é dona da agenda.
   Roda uma vez, na sua máquina:

     GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-refresh-token.mjs

   Abre um link de login do Google; depois de autorizar, o token aparece no
   terminal. Cole ele nas variáveis de ambiente do Netlify. No Google Cloud, a
   credencial OAuth (tipo "Web application") precisa ter este endereço em
   "Authorized redirect URIs": http://localhost:5555/callback */
import http from 'node:http';

const { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret } = process.env;
const PORT = 5555;
const REDIRECT = `http://localhost:${PORT}/callback`;
const SCOPE = 'https://www.googleapis.com/auth/calendar.events';

if (!clientId || !clientSecret){
  console.error('Defina GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET antes de rodar.');
  process.exit(1);
}

const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
  client_id: clientId,
  redirect_uri: REDIRECT,
  response_type: 'code',
  scope: SCOPE,
  access_type: 'offline',
  prompt: 'consent'
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== '/callback') return res.end();

  const code = url.searchParams.get('code');
  if (!code){
    res.end('Autorização cancelada.');
    return server.close();
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT,
      grant_type: 'authorization_code'
    })
  });
  const data = await tokenRes.json();

  if (data.refresh_token){
    console.log('\nGOOGLE_REFRESH_TOKEN=' + data.refresh_token + '\n');
    res.end('Pronto! Pode fechar esta aba e voltar pro terminal.');
  } else {
    console.error('\nNão veio refresh token:', data);
    res.end('Algo deu errado, veja o terminal.');
  }
  server.close();
});

server.listen(PORT, () => {
  console.log('Abra este link no navegador e entre com a conta dona da agenda:\n');
  console.log(authUrl + '\n');
});
