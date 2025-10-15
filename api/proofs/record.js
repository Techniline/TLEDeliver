const { createClient } = require('@supabase/supabase-js');
function required(n){ const v=process.env[n]; if(!v) throw new Error(`Missing env: ${n}`); return v; }
const SUPABASE_URL = required('SUPABASE_URL');
const SERVICE_ROLE = required('SUPABASE_SERVICE_ROLE_KEY');
function sb(){ return require('@supabase/supabase-js').createClient(SUPABASE_URL, SERVICE_ROLE); }
function bad(res,msg,code=400){ return res.status(code).json({ error: msg }); }

async function getUserFromAuthHeader(req){
  const auth = req.headers.authorization||''; const m = auth.match(/^Bearer\s+(.+)$/i);
  if(!m) return { error:'Missing Bearer token' };
  const token = m[1];
  const resp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers:{ apikey:SERVICE_ROLE, Authorization:`Bearer ${token}` }
  });
  if(!resp.ok) return { error:`Auth failed (${resp.status})` };
  return { user: await resp.json() };
}

module.exports = async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  if(req.method==='OPTIONS') return res.status(204).end();
  if(req.method!=='POST'){ res.setHeader('Allow','POST'); return bad(res,'Method Not Allowed',405); }

  try{
    const { user, error:authErr } = await getUserFromAuthHeader(req);
    if(authErr || !user?.id) return bad(res, authErr||'Unauthorized', 401);

    const body = typeof req.body==='string' ? JSON.parse(req.body) : req.body;
    const { booking_id, assignment_id=null, path, mime_type='application/octet-stream', notes=null } = body||{};
    if(!booking_id || !path) return bad(res,'booking_id and path are required');

    const s = sb();
    const { data: b, error: be } = await s.from('bookings').select('id').eq('id', booking_id).single();
    if(be || !b) return bad(res,'Invalid booking_id',400);

    const { data, error } = await s.from('delivery_proofs').insert({
      booking_id, assignment_id, path, mime_type, notes, uploaded_by: user.id
    }).select('id, created_at').single();

    if(error) return bad(res, error.message, 500);
    return res.status(201).json(data);
  }catch(e){
    return bad(res, e.message||'Internal error', 500);
  }
};
