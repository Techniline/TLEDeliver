const { createClient } = require('@supabase/supabase-js');

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

const SUPABASE_URL = required('SUPABASE_URL');
const SERVICE_ROLE = required('SUPABASE_SERVICE_ROLE_KEY');

function sb() {
  return createClient(SUPABASE_URL, SERVICE_ROLE);
}

function bad(res, msg, code = 400) {
  return res.status(code).json({ error: msg });
}

// Verify JWT with Supabase Auth, return user (or 401)
async function getUserFromAuthHeader(req) {
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return { error: 'Missing Bearer token' };
  const token = m[1];

  // Call Supabase Auth REST to get the user from the token
  const resp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      'apikey': SERVICE_ROLE,                  // service role ok (server-side)
      'Authorization': `Bearer ${token}`
    }
  });
  if (!resp.ok) {
    return { error: `Auth failed (${resp.status})` };
  }
  const user = await resp.json();
  return { user };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    try {
      const client = sb();
      const { data, error } = await client
        .from('bookings')
        .select('id, reference, customer, pickup, dropoff, window_from, window_to, status, created_at')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) return bad(res, error.message, 500);
      return res.status(200).json(data ?? []);
    } catch (e) {
      return bad(res, e.message || 'Internal error', 500);
    }
  }

  if (req.method === 'POST') {
    try {
      // 1) Identify user from JWT
      const { user, error: authErr } = await getUserFromAuthHeader(req);
      if (authErr || !user?.id) return bad(res, authErr || 'Unauthorized', 401);

      const client = sb();

      // 2) Check role
      const { data: prof, error: pErr } = await client
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (pErr) return bad(res, `Profile not found for user`, 403);
      const ok = ['admin','warehouse-manager'].includes(prof.role);
      if (!ok) return bad(res, 'Forbidden: insufficient role', 403);

      // 3) Create booking
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const {
        reference,
        customer,
        pickup,
        dropoff,
        window_from,
        window_to,
        status = 'Pending'
      } = body || {};

      if (!reference || !customer) {
        return bad(res, 'reference and customer are required');
      }

      const { data: created, error: bErr } = await client
        .from('bookings')
        .insert({
          reference,
          customer,
          pickup,
          dropoff,
          window_from,
          window_to,
          status,
          created_by: user.id
        })
        .select('id, created_at')
        .single();

      if (bErr) return bad(res, bErr.message, 500);

      return res.status(201).json(created);
    } catch (e) {
      return bad(res, e.message || 'Internal error', 500);
    }
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return bad(res, 'Method Not Allowed', 405);
};
