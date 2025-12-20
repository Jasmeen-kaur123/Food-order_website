import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const res = await axios.post('/api/auth/login', { username, password });
      login(res.data.token, res.data.username, res.data.roles);
      nav('/');
    }catch(err){
      setError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="container" style={{maxWidth:600}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label className="muted">Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
        <label className="muted">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
        <button type="submit" style={{background:'var(--brand-orange)',color:'white',padding:10,border:'none',borderRadius:6}}>Login</button>
      </form>
      {error && <div style={{color:'red',marginTop:8}}>Error: {error}</div>}
    </div>
  );
}
