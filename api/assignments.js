const { createClient } = require('@supabase/supabase-js');

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method Not Allowed' }); }

  try {
    const sb = createClient(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'));

    // Joined select using FK relationships
    const { data, error } = await sb
      .from('assignments')
      .select(`
        id,
        status,
        assigned_at,
        booking:bookings (
          id,
          reference,
          customer,
          pickup,
          dropoff,
          window_from,
          window_to,
          status
        ),
        driver:drivers (
          id,
          full_name,
          phone
        ),
        vehicle:vehicles (
          id,
          plate,
          type
        )
      `)
      .order('assigned_at', { ascending: false })
      .limit(200);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data ?? []);
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
};
