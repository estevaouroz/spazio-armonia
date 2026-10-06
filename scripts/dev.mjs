/* Servidor local pra testar o site + as Netlify Functions sem instalar nada:

     node scripts/dev.mjs            → http://localhost:8888

   Serve os arquivos estáticos e responde /api/aulas e /api/agendar com as
   mesmas funções de netlify/functions. Lê as variáveis do arquivo .env na
   raiz (se existir); sem ele, a agenda roda em modo demonstração.
   Alternativa "oficial": npm i -g netlify-cli && netlify dev */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = parseInt(process.env.PORT || '8888', 10);

// .env simples: CHAVE=valor por linha, # comenta
const envFile = path.join(ROOT, '.env');
if (fs.existsSync(envFile)){
  fs.readFileSync(envFile, 'utf8').split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !line.trim().startsWith('#')) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  });
}

const fnDir = path.join(ROOT, 'netlify/functions');
const routes = {};
for (const file of fs.readdirSync(fnDir).filter(f => f.endsWith('.mjs'))){
  const mod = await import(pathToFileURL(path.join(fnDir, file)));
  routes[mod.config?.path || '/.netlify/functions/' + file.replace('.mjs', '')] = mod.default;
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon'
};

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  const fn = routes[url.pathname];
  if (fn){
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const response = await fn(new Request(url, {
        method: req.method,
        headers: req.headers,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : body
      }));
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(await response.text());
    } catch (err){
      console.error(err);
      res.writeHead(500);
      res.end('erro na função');
    }
    console.log(req.method, url.pathname, '→', res.statusCode);
    return;
  }

  let file = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!file.startsWith(ROOT)){ res.writeHead(403); return res.end(); }
  if (file.endsWith(path.sep)) file = path.join(file, 'index.html');

  fs.readFile(file, (err, data) => {
    if (err){ res.writeHead(404); return res.end('não encontrado'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  const mode = process.env.GOOGLE_REFRESH_TOKEN ? 'Google Calendar real' : 'modo demonstração (sem .env)';
  console.log(`Spazio Armonia em http://localhost:${PORT} — agenda: ${mode}`);
});
