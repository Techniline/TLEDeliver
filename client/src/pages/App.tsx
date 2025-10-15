import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";

function Home(){
  return (
    <div style={{padding:20}}>
      <h2>Welcome</h2>
      <p><Link to="/dashboard">Open Dashboard</Link></p>
    </div>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}
