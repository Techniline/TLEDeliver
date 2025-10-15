import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

type KPI = { totalBookings:number; activeDrivers:number; byStatus:Record<string,number>; };
type Driver = { id:string; full_name:string; phone?:string; license_no?:string; };
type Booking = {
  id:string; reference:string; customer:string;
  pickup?:string; dropoff?:string; window_from?:string; window_to?:string;
  status:"Pending"|"Assigned"|"In-Progress"|"Delivered"|"Cancelled";
};
type Proof = {
  id:string; booking_id:string; assignment_id:string|null; path:string;
  mime_type:string|null; notes:string|null; uploaded_by:string|null; created_at:string;
};

const css = `
:root{ --bg:#0b1220; --panel:#131a2a; --muted:#8aa0c6; --text:#e8f0ff; --brand:#5ac8fa; --ok:#32d74b; --warn:#ffd60a; --bad:#ff453a; --border:#1f2a44; }
*{box-sizing:border-box} body{background:linear-gradient(180deg,#0b1220 0%,#0b1220 60%,#0e1627 100%);color:var(--text)}
.wrap{padding:18px;max-width:1200px;margin:0 auto;font-family:system-ui,Segoe UI,Roboto}
.header{display:flex;gap:12px;align-items:center;justify-content:space-between;margin-bottom:16px}
.hint{color:var(--muted);font-size:12px}
.panel{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px}
.kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.kpi{background:#0e1627;border:1px solid var(--border);padding:12px;border-radius:12px}
.kpi h3{margin:0 0 6px 0;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
.kpi .num{font-size:26px;font-weight:700}
.toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
input,select,button{font:inherit}
input,select{background:#0e1627;border:1px solid var(--border);color:var(--text);padding:8px 10px;border-radius:8px;outline:none}
button{cursor:pointer;background:#0e2033;border:1px solid var(--border);color:var(--text);padding:8px 12px;border-radius:10px}
button:hover{border-color:#2a3d66}
table{width:100%;border-collapse:collapse;margin-top:10px}
th,td{padding:10px;border-bottom:1px solid var(--border);vertical-align:top}
th{color:#a8bddf;text-align:left;font-weight:600}
tr:hover td{background:#0f1a30}
.status{display:inline-flex;align-items:center;gap:6px;padding:3px 8px;border-radius:999px;border:1px solid var(--border);font-size:12px}
.Pending{color:#fff;background:#2b2b2b}
.Assigned{color:#111;background:#5ac8fa}
.In-Progress{color:#111;background:#ffd60a}
.Delivered{color:#111;background:#32d74b}
.Cancelled{color:#111;background:#ffaba1}
.pill{display:inline-block;border:1px solid var(--border);border-radius:999px;padding:2px 8px;margin-left:6px;color:var(--muted);font-size:12px}
.list{display:flex;flex-direction:column;gap:10px;margin-top:8px}
.card{border:1px solid var(--border);border-radius:12px;padding:12px;background:#0e1627}
.proofs{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-top:10px}
.thumb{background:#0e2033;border:1px solid var(--border);border-radius:10px;overflow:hidden}
.thumb img{width:100%;display:block}
.thumb .meta{padding:8px;font-size:12px;color:var(--muted)}
.small{font-size:12px}
`;

function useApiBase(){ return useMemo(()=>window.location.origin,[]); }
function fmtTime(s?:string){ if(!s) return "—"; const d=new Date(s); return isNaN(d.getTime())?s:d.toLocaleString(); }

export default function Dashboard(){
  const base = useApiBase();
  const nav = useNavigate();

  const [jwt,setJwt] = useState<string>('');
  const [kpi,setKpi]=useState<KPI|null>(null);
  const [drivers,setDrivers]=useState<Driver[]>([]);
  const [bookings,setBookings]=useState<Booking[]>([]);
  const [uploadBookingId,setUploadBookingId]=useState<string>("");
  const [proofsBookingId,setProofsBookingId]=useState<string>("");
  const [proofs,setProofs]=useState<Proof[]>([]);
  const [file,setFile]=useState<File|null>(null);
  const [msg,setMsg]=useState<string>("");

  useEffect(()=>{
    // On mount, check session; if none, go to /login
    (async ()=>{
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if(!token){ nav('/login'); return; }
      setJwt(token);
      await loadAll();
      // keep token fresh on changes
      supabase.auth.onAuthStateChange((_evt, session) => {
        setJwt(session?.access_token || '');
        if(!session) nav('/login');
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  async function http<T=any>(url:string,opts:RequestInit={}):Promise<T>{
    const r = await fetch(url,opts);
    if(!r.ok) throw new Error(`${r.status} ${r.statusText}: ${await r.text()}`);
    const ct=r.headers.get("content-type")||"";
    return (ct.includes("application/json")?r.json():r.text()) as Promise<T>;
  }

  async function loadAll(){
    const [k,d,b] = await Promise.all([
      http<KPI>(`${base}/api/dashboard/stats`),
      http<Driver[]>(`${base}/api/drivers`),
      http<Booking[]>(`${base}/api/deliveries`),
    ]);
    setKpi(k); setDrivers(d); setBookings(b);
    if(!uploadBookingId && b.length) setUploadBookingId(b[0].id);
    if(!proofsBookingId && b.length){ setProofsBookingId(b[0].id); loadProofs(b[0].id); }
  }

  async function loadProofs(bookingId:string){
    const list = await http<Proof[]>(`${base}/api/proofs?booking_id=${encodeURIComponent(bookingId)}`);
    setProofs(list);
  }

  async function setBookingStatus(booking_id:string,status:Booking["status"]){
    await http(`${base}/api/bookings/status`,{
      method:"POST",
      headers:{ "Content-Type":"application/json", Authorization:`Bearer ${jwt}` },
      body: JSON.stringify({ booking_id, status })
    });
    await loadAll();
  }

  async function uploadProof(){
    if(!uploadBookingId) return alert("Choose a booking.");
    if(!file) return alert("Choose a file.");
    const content_type = file.type || "application/octet-stream";

    const sign = await http<{signedUrl:string; token:string; path:string}>(`${base}/api/proofs/sign`,{
      method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${jwt}` },
      body: JSON.stringify({ booking_id: uploadBookingId, filename: file.name, content_type })
    });

    const putRes = await fetch(sign.signedUrl, {
      method:"PUT",
      headers:{ Authorization:`Bearer ${sign.token}`, "Content-Type":content_type, "x-upsert":"true" },
      body:file
    });
    if(!putRes.ok) throw new Error(`Upload failed: ${putRes.status} ${await putRes.text()}`);

    await http(`${base}/api/proofs/record`,{
      method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${jwt}` },
      body: JSON.stringify({ booking_id: uploadBookingId, assignment_id:null, path:sign.path, mime_type:content_type, notes:"Uploaded from React dashboard" })
    });

    setMsg("✅ Proof uploaded and recorded."); setFile(null);
    if(proofsBookingId===uploadBookingId) loadProofs(proofsBookingId);
    setTimeout(()=>setMsg(""),4000);
  }

  async function signOut(){
    await supabase.auth.signOut();
    setJwt('');
    nav('/login');
  }

  return (
    <div className="wrap">
      <style>{css}</style>
      <div className="header">
        <h2 style={{margin:0}}>DeliveryFlow Dashboard</h2>
        <div className="toolbar">
          <span className="hint">Signed in</span>
          <button onClick={signOut}>Sign out</button>
          <button onClick={loadAll}>Refresh</button>
        </div>
      </div>

      <div className="panel">
        <div className="kpis">
          <div className="kpi"><h3>Total Bookings</h3><div className="num">{kpi?.totalBookings ?? "—"}</div></div>
          <div className="kpi"><h3>Active Drivers</h3><div className="num">{kpi?.activeDrivers ?? "—"}</div></div>
          <div className="kpi"><h3>By Status</h3>
            <div className="num" style={{fontSize:16}}>
              {kpi?.byStatus ? Object.entries(kpi.byStatus).map(([k,v])=>(
                <span key={k} className="pill" style={{marginRight:6}}>{k}: {v}</span>
              )) : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3 style={{marginTop:0}}>Drivers</h3>
        <div className="list">
          {drivers.map(d=>(
            <div key={d.id} className="card">
              <div style={{display:"flex",justifyContent:"space-between",gap:10}}>
                <div><strong>{d.full_name}</strong> <span className="pill">{d.license_no||"—"}</span></div>
                <div className="hint">{d.phone||""}</div>
              </div>
            </div>
          ))}
          {!drivers.length && <div className="hint">No drivers yet.</div>}
        </div>
      </div>

      <div className="panel">
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <h3 style={{margin:0,marginRight:"auto"}}>Deliveries</h3>
          <button onClick={loadAll}>Refresh</button>
        </div>
        <table>
          <thead><tr><th>Ref</th><th>Customer</th><th>Pickup → Dropoff</th><th>Window</th><th>Status</th><th>Admin Actions</th></tr></thead>
          <tbody>
            {bookings.map(b=>(
              <tr key={b.id}>
                <td><strong>{b.reference}</strong></td>
                <td>{b.customer}</td>
                <td>{b.pickup||"—"} <span className="hint">→</span> {b.dropoff||"—"}</td>
                <td className="small">{fmtTime(b.window_from)} – {fmtTime(b.window_to)}</td>
                <td><span className={`status ${b.status}`}>{b.status}</span></td>
                <td className="small">
                  <button onClick={()=>setBookingStatus(b.id,"Assigned")}>Assign</button>{" "}
                  <button onClick={()=>setBookingStatus(b.id,"In-Progress")}>In-Progress</button>{" "}
                  <button onClick={()=>setBookingStatus(b.id,"Delivered")}>Delivered</button>{" "}
                  <button onClick={()=>setBookingStatus(b.id,"Cancelled")}>Cancel</button>
                </td>
              </tr>
            ))}
            {!bookings.length && <tr><td colSpan={6} className="hint">No bookings found.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h3 style={{marginTop:0}}>Upload Proof</h3>
        <div className="toolbar">
          <label>Booking:&nbsp;</label>
          <select value={uploadBookingId} onChange={e=>setUploadBookingId(e.target.value)}>
            {bookings.map(b=><option key={b.id} value={b.id}>{b.reference} ({b.status})</option>)}
          </select>
          <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} accept="image/*,.pdf"/>
          <button onClick={uploadProof}>Upload</button>
          {msg && <span className="hint">{msg}</span>}
        </div>
      </div>

      <div className="panel">
        <div className="toolbar">
          <h3 style={{margin:0,marginRight:"auto"}}>Proofs</h3>
          <label>Booking:&nbsp;</label>
          <select value={proofsBookingId} onChange={e=>{const v=e.target.value; setProofsBookingId(v); loadProofs(v);}}>
            {bookings.map(b=><option key={b.id} value={b.id}>{b.reference} ({b.status})</option>)}
          </select>
          <button onClick={()=>loadProofs(proofsBookingId)}>Load</button>
        </div>
        <div className="proofs">
          {proofs.map(p=><ProofThumb key={p.id} p={p} base={base}/>)}
          {!proofs.length && <div className="hint">No proofs for this booking.</div>}
        </div>
      </div>
    </div>
  );
}

function ProofThumb({ p, base }:{ p:Proof; base:string }){
  const [url,setUrl]=useState<string>("");
  useEffect(()=>{ (async()=>{
    const r = await fetch(`${base}/api/proofs/download`,{
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ path: p.path, expires_in:300 })
    });
    const j = await r.json(); setUrl(j.url);
  })(); },[base,p.path]);
  const isImg=(p.mime_type||"").startsWith("image/");
  return (
    <div className="thumb">
      {isImg && url ? <img src={url} alt="proof"/> :
        <div className="meta"><a href={url} target="_blank" rel="noreferrer">Download {p.mime_type||"file"}</a></div>}
      <div className="meta">
        <div className="small">{p.path}</div>
        <div className="small">{new Date(p.created_at).toLocaleString()}</div>
      </div>
    </div>
  );
}
