import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

export default function Profile(){
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(()=>{
    if(!user) return;
    axios.get('/api/users/me')
      .then(res => setProfile(res.data))
      .catch(err => setMessage('Failed to load profile'));
  },[user]);

  if(!user) return (
    <div className="container">
      <h2>Please log in</h2>
      <p>You must be logged in to view your profile.</p>
    </div>
  );

  function changeField(k, v){
    setProfile(prev => ({...prev, [k]: v}));
  }

  async function submit(e){
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try{
      const payload = { username: profile.username, email: profile.email };
      if(profile.password) payload.password = profile.password;
      const res = await axios.put('/api/users/me', payload);
      // update local auth username if changed
      login(user.token, res.data.username || profile.username);
      setMessage('Profile updated');
      setProfile(res.data);
    }catch(err){
      setMessage('Failed to update profile');
    }finally{ setSaving(false); }
  }

  return (
    <div className="container" style={{maxWidth:700}}>
      <h2>My Profile</h2>
      {message && <div style={{marginBottom:8}}>{message}</div>}
      {profile ? (
        <form onSubmit={submit}>
          <label className="muted">Username</label>
          <input value={profile.username || ''} onChange={e=>changeField('username', e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />

          <label className="muted">Email</label>
          <input value={profile.email || ''} onChange={e=>changeField('email', e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />

          <label className="muted">New password (leave blank to keep)</label>
          <input type="password" value={profile.password || ''} onChange={e=>changeField('password', e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />

          <button type="submit" disabled={saving} style={{background:'var(--brand-orange)',color:'white',padding:10,border:'none',borderRadius:6}}>{saving ? 'Saving...' : 'Save'}</button>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
