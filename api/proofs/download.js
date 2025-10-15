const { createClient } = require('@supabase/supabase-js');
function required(n){ const v=process.env[n]; if(!v) throw new Error(`Missing env: ${n}`); return v; }
const SUPABASE_URL = required('SUPABASE_URL');
const SERVICE_ROLE = required('SUPABASE_SERVICE_ROLE_KEY');
function sb(){ return require('@supabase/supabase-js').createClient(SUPABASE_URL, SERVICE_ROLE); }
function bad(res,msg,code=400){ return res.status(code).json({ error: msg }); }

module.exports = async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  if(req.method==='OPTIONS') return res.status(204).end();
  if(req.method!=='POST'){ res.setHeader('Allow','POST'); return bad(res,'Method Not Allowed',405); }

  try{
    const body = typeof req.body==='string' ? JSON.parse(req.body) : req.body;
    const { path, expires_in = 60 * 10 } = body || {}; // 10 minutes
    if(!path) return bad(res,'path is required');

    const s = sb();
    const { data, error } = await s.storage.from('proofs').createSignedUrl(path, expires_in);
    if(error) return bad(res, error.message, 500);

    return res.status(200).json({ url: data?.signedUrl, expires_in });
  }catch(e){
    return bad(res, e.message||'Internal error', 500);
  }
};
