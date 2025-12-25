import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Register(){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const res = await axios.post('/api/auth/register', { username, email, password });
      login(res.data.token, res.data.username);
      nav('/');
    }catch(err){
      setError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="container" style={{maxWidth:600}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <label className="muted">Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%',padding:8,marginBottom:8,boxSizing:'border-box',border:'1px solid #ccc'}} />
        <label className="muted">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,marginBottom:8,boxSizing:'border-box',border:'1px solid #ccc'}} />
        <label className="muted">Password</label>
        <div style={{position:'relative',marginBottom:8}}>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,boxSizing:'border-box',border:'1px solid #ccc'}} />
          <button type="button" onClick={()=>setShowPassword(!showPassword)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:18,padding:0}}>👁</button>
        </div>
        <button type="submit" style={{background:'var(--brand-orange)',color:'white',padding:10,border:'none',borderRadius:6}}>Register</button>
      </form>
      {error && <div style={{color:'red',marginTop:8}}>Error: {error}</div>}
    </div>
  );
}
