import { Redis } from '@upstash/redis';

const CATEGORIES = ['amici', 'cugini', 'fratelli', 'genitori'];
const TTL = 40 * 86400;

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function json(res, data, status = 200, headers = {}) {
  res.status(status).setHeader('Content-Type', 'application/json');
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  const method = req.method;

  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  let redis;
  try {
    if (!url || !token) throw new Error('missing env');
    redis = new Redis({ url, token });
  } catch {
    if (method === 'GET') return json(res, { available: false });
    return res.status(204).end();
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
        categories[cat] = { avg: cnt > 0 ? Math.round((sum / cnt) / 10) * 10 : null };
      });

      return json(res, { available: true, month, total, categories }, 200, {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      });
    } catch {
      return json(res, { available: false });
    }
  }

  // ------------------------------------------------------------------
  // POST /api/stats — incremento anonimo
  // ------------------------------------------------------------------
  if (method === 'POST') {
    try {
      let body = {};
      try {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        body = JSON.parse(Buffer.concat(chunks).toString());
      } catch {
        return res.status(400).end('Bad Request');
      }

      const { category, amount } = body;

      if (!CATEGORIES.includes(category)) return res.status(400).end('Invalid category');

      const amt = Number(amount);
      if (!Number.isInteger(amt) || amt < 30 || amt > 2000) return res.status(400).end('Invalid amount');

      const month = currentMonth();
      const pipe = redis.pipeline();
      pipe.incr(`stats:count:${month}`);
      pipe.expire(`stats:count:${month}`, TTL);
      pipe.incrby(`stats:sum:${category}:${month}`, amt);
      pipe.expire(`stats:sum:${category}:${month}`, TTL);
      pipe.incr(`stats:cnt:${category}:${month}`);
      pipe.expire(`stats:cnt:${category}:${month}`, TTL);
      await pipe.exec();

      return res.status(204).end();
    } catch {
      return res.status(204).end();
    }
  }

  res.status(405).end('Method Not Allowed');
}
