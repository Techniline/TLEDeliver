const { createClient } = require('@supabase/supabase-js');

function required(n){ const v=process.env[n]; if(!v) throw new Error(`Missing env: ${n}`); return v; }
const SUPABASE_URL = required('SUPABASE_URL');
const SERVICE_ROLE = required('SUPABASE_SERVICE_ROLE_KEY');

function sb(){ return createClient(SUPABASE_URL, SERVICE_ROLE); }
function bad(res,msg,code=400){ return res.status(code).json({ error: msg }); }

async function getUserFromAuthHeader(req){
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return { error: 'Missing Bearer token' };
  const token = m[1];
  const resp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${token}` }
  });
  if (!resp.ok) return { error: `Auth failed (${resp.status})` };
  return { user: await resp.json() };
}

module.exports = async function handler(req, res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST'){ res.setHeader('Allow','POST'); return bad(res,'Method Not Allowed',405); }

  try{
    // 1) auth & role
    const { user, error:authErr } = await getUserFromAuthHeader(req);
    if (authErr || !user?.id) return bad(res, authErr || 'Unauthorized', 401);

    const s = sb();
    const { data: prof, error: pErr } = await s.from('profiles').select('role').eq('id', user.id).single();
    if (pErr) return bad(res,'Profile not found',403);
    if (!['admin','warehouse-manager'].includes(prof.role)) return bad(res,'Forbidden: insufficient role',403);

    // 2) parse input
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { booking_id, filename, content_type } = body || {};
    if (!booking_id || !filename) return bad(res,'booking_id and filename are required');

    // optional sanity: ensure booking exists
    const { data: b, error: bErr } = await s.from('bookings').select('id').eq('id', booking_id).single();
    if (bErr || !b) return bad(res,'Invalid booking_id',400);

    // 3) build path and create signed upload URL
    const ts = Date.now();
    const safeName = String(filename).replace(/[^a-zA-Z0-9._-]/g,'_');
    const path = `${user.id}/${booking_id}/${ts}_${safeName}`;

    const { data: signed, error: upErr } = await s.storage
      .from('proofs')
      .createSignedUploadUrl(path);

    if (upErr) return bad(res, upErr.message, 500);

    // include content_type desired by caller (clients should send the same)
    return res.status(200).json({
      path,
      signedUrl: signed?.signedUrl,
      token: signed?.token,           // can also use PUT to signedUrl
      contentType: content_type || 'application/octet-stream'
    });
  } catch (e){
    return bad(res, e.message || 'Internal error', 500);
  }
};
