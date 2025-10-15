const { createClient } = require('@supabase/supabase-js');
function required(n){ const v=process.env[n]; if(!v) throw new Error(`Missing env: ${n}`); return v; }
const SUPABASE_URL = required('SUPABASE_URL');
const SERVICE_ROLE = required('SUPABASE_SERVICE_ROLE_KEY');
function sb(){ return require('@supabase/supabase-js').createClient(SUPABASE_URL, SERVICE_ROLE); }
function bad(res,msg,code=400){ return res.status(code).json({ error: msg }); }

module.exports = async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  if(req.method==='OPTIONS') return res.status(204).end();
  if(req.method!=='GET'){ res.setHeader('Allow','GET'); return bad(res,'Method Not Allowed',405); }

  try{
    const { booking_id } = req.query || {};
    if(!booking_id) return bad(res,'booking_id is required');
    const s = sb();
    const { data, error } = await s
      .from('delivery_proofs')
      .select('id, booking_id, assignment_id, path, mime_type, notes, uploaded_by, created_at')
      .eq('booking_id', booking_id)
      .order('created_at', { ascending:false });
    if(error) return bad(res, error.message, 500);
    return res.status(200).json(data ?? []);
  }catch(e){
    return bad(res, e.message||'Internal error', 500);
  }
};
