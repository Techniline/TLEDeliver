const { createClient } = require('@supabase/supabase-js');

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

const sb = () => require('@supabase/supabase-js')
  .createClient(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'));

function bad(res, msg, code = 400) { return res.status(code).json({ error: msg }); }

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    try {
      const s = sb();
      const { data, error } = await s
        .from('assignments')
        .select(`
          id,
          status,
          assigned_at,
          booking:bookings (
            id, reference, customer, pickup, dropoff, window_from, window_to, status
          ),
          driver:drivers ( id, full_name, phone ),
          vehicle:vehicles ( id, plate, type )
        `)
        .order('assigned_at', { ascending: false })
        .limit(200);
      if (error) return bad(res, error.message, 500);
      return res.status(200).json(data ?? []);
    } catch (e) {
      return bad(res, e.message || 'Internal error', 500);
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { booking_id, driver_id, vehicle_id, status = 'Assigned' } = body || {};
      if (!booking_id || !driver_id) return bad(res, 'booking_id and driver_id are required');

      const s = sb();

      // Check referenced rows exist (quick sanity)
      const [{ data: b, error: be }, { data: d, error: de }] = await Promise.all([
        s.from('bookings').select('id,status').eq('id', booking_id).single(),
        s.from('drivers').select('id').eq('id', driver_id).single()
      ]);
      if (be || !b) return bad(res, 'Invalid booking_id');
      if (de || !d) return bad(res, 'Invalid driver_id');

      if (vehicle_id) {
        const { data: v, error: ve } = await s.from('vehicles').select('id').eq('id', vehicle_id).single();
        if (ve || !v) return bad(res, 'Invalid vehicle_id');
      }

      // Create assignment
      const { data: created, error: aerr } = await s.from('assignments').insert({
        booking_id, driver_id, vehicle_id: vehicle_id || null, status
      }).select('id, assigned_at').single();
      if (aerr) return bad(res, aerr.message, 500);

      // Update booking status -> Assigned (only if currently Pending)
      if (b.status !== 'Assigned') {
        await s.from('bookings').update({ status: 'Assigned' }).eq('id', booking_id);
      }

      return res.status(201).json({ id: created.id, assigned_at: created.assigned_at });
    } catch (e) {
      return bad(res, e.message || 'Internal error', 500);
    }
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return bad(res, 'Method Not Allowed', 405);
};
