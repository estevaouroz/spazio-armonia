/* Acesso ao Google Calendar da escola, usado pelas Netlify Functions.
   Sem dependências: fala direto com a API REST do Google via fetch.

   Variáveis de ambiente (Netlify → Site configuration → Environment variables):
     GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET  — credencial OAuth do Google Cloud
     GOOGLE_REFRESH_TOKEN                    — gerado uma vez com scripts/google-refresh-token.mjs
     GOOGLE_CALENDAR_ID                      — ID do calendário "Spazio Armonia · Aulas"
     DEFAULT_CAPACITY (opcional, padrão 6)   — vagas quando a aula não tem "Vagas: N" na descrição
     MIN_NOTICE_HOURS (opcional, padrão 2)   — antecedência mínima pra se inscrever
   Sem as 4 primeiras, as funções rodam em modo demonstração (aulas de exemplo). */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://www.googleapis.com/calendar/v3';

export const TZ = 'America/Sao_Paulo';

export function googleConfig(){
  const {
    GOOGLE_CLIENT_ID: clientId,
    GOOGLE_CLIENT_SECRET: clientSecret,
    GOOGLE_REFRESH_TOKEN: refreshToken,
    GOOGLE_CALENDAR_ID: calendarId
  } = process.env;
  if (!clientId || !clientSecret || !refreshToken || !calendarId) return null;
  return { clientId, clientSecret, refreshToken, calendarId };
}

export const defaultCapacity = () => parseInt(process.env.DEFAULT_CAPACITY || '6', 10);
export const minNoticeMs = () => parseFloat(process.env.MIN_NOTICE_HOURS || '2') * 3600 * 1000;

/* o access token dura ~1h; guarda enquanto a função estiver "quente" */
let cachedToken = { value: null, expiresAt: 0 };

async function accessToken(cfg){
  if (cachedToken.value && Date.now() < cachedToken.expiresAt - 60000) return cachedToken.value;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      refresh_token: cfg.refreshToken,
      grant_type: 'refresh_token'
    })
  });
  if (!res.ok) throw new Error(`Google token ${res.status}: ${await res.text()}`);

  const data = await res.json();
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

/* chamada genérica à Calendar API; lança erro com .status em respostas não-2xx */
export async function gcal(cfg, path, { method = 'GET', query, body, headers = {} } = {}){
  const url = new URL(API + path);
  if (query){
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url, {
    method,
    headers: {
      authorization: 'Bearer ' + await accessToken(cfg),
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok){
    const err = new Error(`Google Calendar ${res.status}`);
    err.status = res.status;
    err.detail = await res.text();
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

export const eventsPath = (cfg, eventId) =>
  `/calendars/${encodeURIComponent(cfg.calendarId)}/events` + (eventId ? '/' + encodeURIComponent(eventId) : '');

/* "Vagas: 8" em qualquer linha da descrição do evento define a capacidade */
export function capacityOf(event){
  const match = (event.description || '').match(/vagas\s*:\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : defaultCapacity();
}

/* conta os inscritos: convidados que não são a própria agenda e não recusaram */
export function takenOf(event){
  return (event.attendees || []).filter(a =>
    !a.organizer && !a.self && !a.resource && a.responseStatus !== 'declined'
  ).length;
}

/* a matéria sai do título do evento ("Yoga — turma iniciante", "Piano individual"...) */
export function modalidadeOf(title){
  const t = (title || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (/italian/.test(t)) return 'italiano';
  if (/music|piano|canto|teclado/.test(t)) return 'musica';
  if (/yoga/.test(t)) return 'yoga';
  return 'outro';
}

/* só o que é seguro mostrar no site: nada de convidados nem descrição */
export function publicEvent(event){
  const vagas = capacityOf(event);
  return {
    id: event.id,
    title: event.summary || 'Aula',
    start: event.start.dateTime,
    end: event.end.dateTime,
    modalidade: modalidadeOf(event.summary),
    formato: vagas <= 1 ? 'individual' : 'grupo',
    vagas,
    restantes: Math.max(0, vagas - takenOf(event)),
    local: event.location || null,
    online: Boolean(event.hangoutLink)
  };
}

export function json(data, status = 200){
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

/* ---------- modo demonstração (sem credenciais do Google) ---------- */
/* grade semanal fictícia, só pra ver o calendário funcionando no protótipo */
const DEMO_WEEK = [
  { dia: 1, hora: '19:00', min: 60, title: 'Italiano — conversação', vagas: 8 },
  { dia: 2, hora: '10:00', min: 60, title: 'Italiano individual', vagas: 1 },
  { dia: 2, hora: '18:30', min: 60, title: 'Yoga — turma iniciante', vagas: 10 },
  { dia: 3, hora: '17:00', min: 45, title: 'Piano individual', vagas: 1 },
  { dia: 4, hora: '19:30', min: 75, title: 'Yoga — respiração e relaxamento', vagas: 10 },
  { dia: 4, hora: '15:00', min: 60, title: 'Italiano individual', vagas: 1 },
  { dia: 5, hora: '18:00', min: 60, title: 'Música — teoria e percepção', vagas: 6 },
  { dia: 6, hora: '10:00', min: 90, title: 'Italiano — cultura e culinária', vagas: 8 }
];

export function demoEvents(from, to){
  const out = [];
  const now = Date.now();
  // percorre os dias pelo calendário de São Paulo (UTC-3, sem horário de verão)
  for (let t = from.getTime(); t < to.getTime(); t += 86400000){
    const key = new Date(t - 3 * 3600000).toISOString().slice(0, 10);
    const weekday = new Date(key + 'T12:00:00Z').getUTCDay();
    DEMO_WEEK.filter(a => a.dia === weekday).forEach((a, i) => {
      const start = new Date(`${key}T${a.hora}:00-03:00`);
      if (start.getTime() < now || start >= to || start < from) return;
      const end = new Date(start.getTime() + a.min * 60000);
      // ocupação "aleatória" mas estável pra cada aula
      const seed = (start.getUTCDate() * 7 + i * 3 + weekday) % 5;
      const restantes = a.vagas === 1 ? (seed === 0 ? 0 : 1) : Math.max(0, a.vagas - seed * 2);
      out.push({
        id: `demo-${key}-${a.hora.replace(':', '')}`,
        title: a.title,
        start: start.toISOString(),
        end: end.toISOString(),
        modalidade: modalidadeOf(a.title),
        formato: a.vagas <= 1 ? 'individual' : 'grupo',
        vagas: a.vagas,
        restantes,
        local: 'Spazio Armonia',
        online: false
      });
    });
  }
  return out.sort((a, b) => a.start.localeCompare(b.start));
}
