const { createClient } = require('@supabase/supabase-js');

function required(n){const v=process.env[n]; if(!v) throw new Error(`Missing env: ${n}`); return v;}
const SUPABASE_URL = required('SUPABASE_URL');
const SERVICE_ROLE  = required('SUPABASE_SERVICE_ROLE_KEY');

function sb(){ return createClient(SUPABASE_URL, SERVICE_ROLE); }
function bad(res,msg,code=400){ return res.status(code).json({error:msg}); }

async function getUserFromAuthHeader(req){
  const auth = req.headers.authorization||'';
  const m = auth.match(/^Bearer\s+(.+)$/i);
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

    const s = sb();
    // only admin / warehouse-manager can change status
    const { data: prof, error: pErr } = await s.from('profiles').select('role').eq('id', user.id).single();
    if(pErr) return bad(res,'Profile not found',403);
    if(!['admin','warehouse-manager'].includes(prof.role)) return bad(res,'Forbidden: insufficient role',403);

    const body = typeof req.body==='string' ? JSON.parse(req.body) : req.body;
    const { assignment_id, status } = body || {};
    const allowed = ['Assigned','Picked-Up','Delivered','Declined'];
    if(!assignment_id || !status || !allowed.includes(status)) return bad(res,'assignment_id and valid status are required');

    // get booking_id so we can cascade when Delivered
    const { data: a, error: aErr } = await s.from('assignments').select('booking_id').eq('id', assignment_id).single();
    if(aErr || !a) return bad(res,'Assignment not found',404);

    const { error: uErr } = await s.from('assignments').update({ status }).eq('id', assignment_id);
    if(uErr) return bad(res, uErr.message, 500);

    if(status === 'Delivered'){
      await s.from('bookings').update({ status: 'Delivered' }).eq('id', a.booking_id);
    }

    return res.status(200).json({ ok:true });
  }catch(e){
    return bad(res, e.message||'Internal error', 500);
  }
};
