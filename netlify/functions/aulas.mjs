/* GET /api/aulas?from=ISO&to=ISO
   Lista as aulas do calendário da escola no período (máx. 62 dias), já com as
   vagas restantes. Lê o Google Calendar a cada chamada — o que a Marina muda
   lá aparece no site na próxima atualização. */
import { googleConfig, gcal, eventsPath, publicEvent, demoEvents, json } from '../lib/google.mjs';

const MAX_RANGE = 62 * 86400000;

export default async (req) => {
  const url = new URL(req.url);
  const now = new Date();
  const from = new Date(url.searchParams.get('from') || now);
  const to = new Date(url.searchParams.get('to') || from.getTime() + 7 * 86400000);

  if (isNaN(from) || isNaN(to) || to <= from || to - from > MAX_RANGE){
    return json({ error: 'periodo_invalido' }, 400);
  }

  const cfg = googleConfig();
  if (!cfg) return json({ demo: true, aulas: demoEvents(from, to) });

  try {
    const data = await gcal(cfg, eventsPath(cfg), {
      query: {
        // aulas que já começaram não aparecem
        timeMin: (from > now ? from : now).toISOString(),
        timeMax: to.toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '250'
      }
    });

    const aulas = (data.items || [])
      .filter(e => e.status !== 'cancelled' && e.start && e.start.dateTime)
      .map(publicEvent);

    return json({ aulas });
  } catch (err){
    console.error('aulas:', err.message, err.detail || '');
    return json({ error: 'agenda_indisponivel' }, 502);
  }
};

export const config = { path: '/api/aulas' };
