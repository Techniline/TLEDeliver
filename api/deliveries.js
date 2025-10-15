import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  // IMPORTANT: service_role key is server-only
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('id, reference, customer, pickup, dropoff, window_from, window_to, status')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data ?? []);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
