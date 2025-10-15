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

    const [{ data: bookings, error: bErr }, { data: drivers, error: dErr }] = await Promise.all([
      sb.from('bookings').select('status'),
      sb.from('drivers').select('active')
    ]);

    if (bErr) return res.status(500).json({ error: bErr.message });
    if (dErr) return res.status(500).json({ error: dErr.message });

    const byStatus = (bookings || []).reduce((m, r) => {
      const k = r.status || 'Unknown';
      m[k] = (m[k] || 0) + 1;
      return m;
    }, {});

    const totalBookings = bookings?.length || 0;
    const activeDrivers = (drivers || []).filter(d => d.active).length;

    return res.status(200).json({ totalBookings, activeDrivers, byStatus });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
};
