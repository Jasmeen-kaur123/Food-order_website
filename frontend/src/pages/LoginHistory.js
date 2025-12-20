import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginHistory(){
  const { user } = useContext(AuthContext);
  const nav = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(()=>{
    if(!user || !(user.roles||[]).includes('ROLE_ADMIN')){
      nav('/');
      return;
    }
    fetchUsers();
  },[user, nav]);

  async function fetchUsers(){
    try{
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    }catch(err){ 
      setError(err.response?.data?.message || err.message); 
    }
  }

  if(!user || !(user.roles||[]).includes('ROLE_ADMIN')){
    return null;
  }

  return (
    <div className="container">
      <h2>Registered Users</h2>
      {error && <div style={{color:'red',marginBottom:8}}>{error}</div>}
      
      <div style={{overflowX:'auto',marginTop:16}}>
        <p style={{marginBottom:12,fontWeight:'bold'}}>Total Registered Users: <span style={{color:'var(--brand-orange)',fontSize:'18px'}}>{users.filter(u => (u.roles||[]).includes('ROLE_USER')).length}</span></p>
        <table style={{width:'100%',borderCollapse:'collapse',background:'white',borderRadius:8,overflow:'hidden'}}>
          <thead>
            <tr style={{borderBottom:'2px solid #ddd',background:'#f5f5f5'}}>
              <th style={{textAlign:'left',padding:'12px'}}>Username</th>
              <th style={{textAlign:'left',padding:'12px'}}>Email</th>
              <th style={{textAlign:'left',padding:'12px'}}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => (u.roles||[]).includes('ROLE_USER')).map((u,idx) => (
              <tr key={u.id || idx} style={{borderBottom:'1px solid #f0f0f0'}}>
                <td style={{padding:'12px'}}>{u.username}</td>
                <td style={{padding:'12px'}}>{u.email}</td>
                <td style={{padding:'12px'}}>User</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.filter(u => (u.roles||[]).includes('ROLE_USER')).length === 0 && <p className="muted" style={{marginTop:16}}>No regular users registered yet.</p>}
      </div>
    </div>
  );
}
