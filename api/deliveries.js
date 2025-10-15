import { createClient } from '@supabase/supabase-js';

function required(name) {
  const v = process.env[name];
  if (!v || v === 'YOUR_VALUE_HERE') {
    throw new Error(`Missing required env: ${name}`);
  }
  return v;
}

export default async function handler(req, res) {
  // Basic CORS (optional)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const SUPABASE_URL = required('SUPABASE_URL');
    const SERVICE_ROLE = required('SUPABASE_SERVICE_ROLE_KEY');

    // Minimal log to confirm which project we’re hitting (safe)
    console.log('[deliveries] Using SUPABASE_URL:', SUPABASE_URL);

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Light-weight query first to prove connectivity
    const { data: pingData, error: pingError } = await supabase
      .from('bookings')
      .select('id')
      .limit(1);

    if (pingError) {
      console.error('[deliveries] pingError:', pingError);
      return res.status(500).json({ error: `Supabase ping failed: ${pingError.message}` });
    }

    // Real query (adjust columns to your schema)
    const { data, error } = await supabase
      .from('bookings')
      .select('id, reference, customer, pickup, dropoff, window_from, window_to, status')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('[deliveries] query error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data ?? []);
  } catch (e) {
    // This will catch missing envs or unexpected exceptions
    console.error('[deliveries] fatal:', e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
