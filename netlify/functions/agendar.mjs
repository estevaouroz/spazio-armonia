/* POST /api/agendar  { aulaId, nome, email, telefone, website }
   Inscreve a pessoa numa aula experimental: adiciona como convidada do evento
   no Google Calendar da escola (o Google manda o convite por e-mail). Confere
   antecedência mínima, vagas e inscrição repetida. "website" é um campo-isca
   escondido no formulário: se vier preenchido, é robô. Só aceita pedidos
   feitos pelo próprio site (cabeçalho Origin) e no máximo 5 por IP a cada
   3 minutos (rateLimit no config, aplicado pela plataforma antes da função). */
import { googleConfig, gcal, eventsPath, capacityOf, takenOf, minNoticeMs, json } from '../lib/google.mjs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value, max){
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function sameOrigin(req){
  try { return new URL(req.headers.get('origin')).host === new URL(req.url).host; }
  catch { return false; }  // sem Origin ou com "null"
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'metodo' }, 405);

  // o navegador sempre manda Origin num POST; outro site ou script sem ele fica de fora
  if (!sameOrigin(req)) return json({ error: 'origem' }, 403);

  let body;
  try { body = await req.json(); } catch { return json({ error: 'dados_invalidos' }, 400); }

  // robô preencheu o campo-isca: finge sucesso e não faz nada
  if (body.website) return json({ ok: true });

  const aulaId = clean(body.aulaId, 200);
  const nome = clean(body.nome, 80);
  const email = clean(body.email, 120).toLowerCase();
  const telefone = clean(body.telefone, 30);

  if (!aulaId || nome.length < 2 || !EMAIL_RE.test(email)){
    return json({ error: 'dados_invalidos' }, 400);
  }

  const cfg = googleConfig();
  if (!cfg) return json({ ok: true, demo: true });

  // até 2 tentativas: se outra inscrição mexer no evento entre ler e gravar,
  // o Google recusa (If-Match com o etag) e a gente relê e confere de novo
  for (let attempt = 0; attempt < 2; attempt++){
    let event;
    try {
      event = await gcal(cfg, eventsPath(cfg, aulaId));
    } catch (err){
      if (err.status === 404) return json({ error: 'aula_nao_encontrada' }, 404);
      console.error('agendar/get:', err.message, err.detail || '');
      return json({ error: 'agenda_indisponivel' }, 502);
    }

    if (event.status === 'cancelled' || !event.start || !event.start.dateTime){
      return json({ error: 'aula_nao_encontrada' }, 404);
    }
    if (new Date(event.start.dateTime).getTime() - Date.now() < minNoticeMs()){
      return json({ error: 'prazo_encerrado' }, 409);
    }

    const attendees = event.attendees || [];
    if (attendees.some(a => (a.email || '').toLowerCase() === email && a.responseStatus !== 'declined')){
      return json({ error: 'ja_inscrito' }, 409);
    }
    if (takenOf(event) >= capacityOf(event)){
      return json({ error: 'lotada' }, 409);
    }

    // quem recusou antes e volta a se inscrever sai da lista antiga
    const others = attendees.filter(a => (a.email || '').toLowerCase() !== email);
    const label = ['Experimental', nome, telefone].filter(Boolean).join(' · ');

    try {
      await gcal(cfg, eventsPath(cfg, aulaId), {
        method: 'PATCH',
        query: { sendUpdates: 'all' },
        headers: { 'If-Match': event.etag },
        body: {
          attendees: [...others, { email, displayName: label }],
          // um aluno não vê nome/telefone dos outros
          guestsCanSeeOtherGuests: false,
          guestsCanInviteOthers: false
        }
      });
      return json({ ok: true });
    } catch (err){
      if (err.status === 412 && attempt === 0) continue;
      console.error('agendar/patch:', err.message, err.detail || '');
      return json({ error: 'agenda_indisponivel' }, 502);
    }
  }

  return json({ error: 'agenda_indisponivel' }, 502);
};

export const config = {
  path: '/api/agendar',
  // janela máxima permitida é 180s; quem passar recebe 429 sem chegar na função
  rateLimit: { windowLimit: 5, windowSize: 180, aggregateBy: ['ip', 'domain'] }
};
