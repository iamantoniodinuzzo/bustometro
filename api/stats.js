import { Redis } from '@upstash/redis';

export const config = { runtime: 'edge' };

const CATEGORIES = ['amici', 'cugini', 'fratelli', 'genitori'];
const TTL = 40 * 86400; // 40 giorni in secondi

function currentMonth() {
  return new Date().toISOString().slice(0, 7); // "YYYY-MM"
}

export default async function handler(req) {
  const method = req.method;

  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  let redis;
  try {
    if (!url || !token) throw new Error('missing env');
    redis = new Redis({ url, token });
  } catch {
    // Env vars assenti: degradation silenziosa
    if (method === 'GET') {
      return Response.json({ available: false }, { status: 200 });
    }
    return new Response(null, { status: 204 });
  }

  // ------------------------------------------------------------------
  // GET /api/stats — aggregati mensili (cache CDN 5 min)
  // ------------------------------------------------------------------
  if (method === 'GET') {
    try {
      const month = currentMonth();

      const pipe = redis.pipeline();
      pipe.get(`stats:count:${month}`);
      for (const cat of CATEGORIES) {
        pipe.get(`stats:sum:${cat}:${month}`);
        pipe.get(`stats:cnt:${cat}:${month}`);
      }
      const results = await pipe.exec();

      const total = Number(results[0] ?? 0);

      const categories = {};
      CATEGORIES.forEach((cat, i) => {
        const sum = Number(results[1 + i * 2] ?? 0);
        const cnt = Number(results[2 + i * 2] ?? 0);
        categories[cat] = {
          avg: cnt > 0 ? Math.round((sum / cnt) / 10) * 10 : null,
        };
      });

      return Response.json(
        { available: true, month, total, categories },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      );
    } catch {
      return Response.json({ available: false }, { status: 200 });
    }
  }

  // ------------------------------------------------------------------
  // POST /api/stats — incremento anonimo
  // ------------------------------------------------------------------
  if (method === 'POST') {
    try {
      let body;
      try {
        body = await req.json();
      } catch {
        return new Response('Bad Request', { status: 400 });
      }

      const { category, amount } = body ?? {};

      if (!CATEGORIES.includes(category)) {
        return new Response('Invalid category', { status: 400 });
      }

      const amt = Number(amount);
      if (!Number.isInteger(amt) || amt < 30 || amt > 2000) {
        return new Response('Invalid amount', { status: 400 });
      }

      const month = currentMonth();
      const countKey = `stats:count:${month}`;
      const sumKey = `stats:sum:${category}:${month}`;
      const cntKey = `stats:cnt:${category}:${month}`;

      const pipe = redis.pipeline();
      pipe.incr(countKey);
      pipe.expire(countKey, TTL);
      pipe.incrby(sumKey, amt);
      pipe.expire(sumKey, TTL);
      pipe.incr(cntKey);
      pipe.expire(cntKey, TTL);
      await pipe.exec();

      return new Response(null, { status: 204 });
    } catch {
      // Errore Redis: 204 silenzioso, mai blocca il client
      return new Response(null, { status: 204 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}
