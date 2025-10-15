import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const css = `
.wrap{min-height:100vh;display:grid;place-items:center;background:#0b1220;color:#e8f0ff;font-family:system-ui,Segoe UI,Roboto}
.card{background:#131a2a;border:1px solid #1f2a44;border-radius:14px;padding:22px;min-width:320px}
h2{margin:0 0 12px 0}
label{display:block;margin-top:10px;font-size:12px;color:#9ab1d8}
input{width:100%;padding:10px;border-radius:8px;border:1px solid #26385e;background:#0e1627;color:#e8f0ff;margin-top:6px}
button{width:100%;margin-top:16px;padding:10px;border-radius:10px;border:1px solid #2a3d66;background:#0e2033;color:#e8f0ff;cursor:pointer}
.small{margin-top:10px;color:#9ab1d8;font-size:12px}
.err{color:#ff6b6b;margin-top:8px;font-size:13px}
`;

export default function Login(){
  const nav = useNavigate();
  const [email, setEmail] = useState('vihan@techniline.org');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string>('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    setErr(''); setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    if (data.session?.access_token) {
      // Go to dashboard
      nav('/dashboard');
    } else {
      setErr('Login failed: no session returned');
    }
  }

  return (
    <div className="wrap">
      <style>{css}</style>
      <form className="card" onSubmit={onSubmit}>
        <h2>Admin Login</h2>
        <label>Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        <button disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        {err && <div className="err">{err}</div>}
        <div className="small">Uses Supabase Auth (email/password).</div>
      </form>
    </div>
  );
}
