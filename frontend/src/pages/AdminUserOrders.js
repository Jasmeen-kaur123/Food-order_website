import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminUserOrders(){
  const { user } = useContext(AuthContext);
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(!user || !(user.roles||[]).includes('ROLE_ADMIN')){
      nav('/');
      return;
    }
    (async ()=>{
      try{
        // Fetch all non-admin users' orders
        const [userOrdersRes, myOrdersRes] = await Promise.all([
          axios.get('/api/admin/user-orders'),
          axios.get('/api/users/me/orders')
        ]);
        const listA = Array.isArray(userOrdersRes.data) ? userOrdersRes.data : [];
        const listB = Array.isArray(myOrdersRes.data) ? myOrdersRes.data : [];
        // Merge, avoiding duplicates by id
        const seen = new Set();
        const merged = [];
        for(const o of [...listA, ...listB]){
          if(o && o.id && !seen.has(o.id)){
            seen.add(o.id);
            merged.push(o);
          }
        }
        setOrders(merged);
      }catch(err){
        setError(err.response?.data?.message || err.message || 'Failed to load user orders');
      }finally{
        setLoading(false);
      }
    })();
  },[user, nav]);

  if(!user || !(user.roles||[]).includes('ROLE_ADMIN')) return null;

  async function accept(id){
    try{
      await axios.put(`/api/admin/orders/${id}/accept`);
      // Refresh merged orders after update
      const [userOrdersRes, myOrdersRes] = await Promise.all([
        axios.get('/api/admin/user-orders'),
        axios.get('/api/users/me/orders')
      ]);
      const listA = Array.isArray(userOrdersRes.data) ? userOrdersRes.data : [];
      const listB = Array.isArray(myOrdersRes.data) ? myOrdersRes.data : [];
      const seen = new Set();
      const merged = [];
      for(const o of [...listA, ...listB]){
        if(o && o.id && !seen.has(o.id)){
          seen.add(o.id);
          merged.push(o);
        }
      }
      setOrders(merged);
    }catch(err){ setError(err.response?.data?.message || err.message); }
  }

  async function reject(id){
    try{
      await axios.put(`/api/admin/orders/${id}/reject`);
      // Refresh merged orders after update
      const [userOrdersRes, myOrdersRes] = await Promise.all([
        axios.get('/api/admin/user-orders'),
        axios.get('/api/users/me/orders')
      ]);
      const listA = Array.isArray(userOrdersRes.data) ? userOrdersRes.data : [];
      const listB = Array.isArray(myOrdersRes.data) ? myOrdersRes.data : [];
      const seen = new Set();
      const merged = [];
      for(const o of [...listA, ...listB]){
        if(o && o.id && !seen.has(o.id)){
          seen.add(o.id);
          merged.push(o);
        }
      }
      setOrders(merged);
    }catch(err){ setError(err.response?.data?.message || err.message); }
  }

  const filtered = orders.filter(o => statusFilter==='ALL' ? true : (o.status||'').toUpperCase()===statusFilter);

  const counts = {
    PENDING: orders.filter(o => (o.status||'').toUpperCase()==='PENDING').length,
    ACCEPTED: orders.filter(o => (o.status||'').toUpperCase()==='ACCEPTED').length,
    REJECTED: orders.filter(o => (o.status||'').toUpperCase()==='REJECTED').length,
    ALL: orders.length
  };

  function statusBadge(status){
    const s = (status||'').toUpperCase();
    let bg = '#ddd';
    let color = '#000';
    if(s==='PENDING'){ bg = '#fff4e6'; color = '#8a4b00'; }
    if(s==='ACCEPTED'){ bg = '#e6ffed'; color = '#065f46'; }
    if(s==='REJECTED'){ bg = '#ffe8e8'; color = '#b00000'; }
    return (
      <span style={{background:bg,color, padding:'2px 8px', borderRadius:12, fontSize:12}}>{s || 'UNKNOWN'}</span>
    );
  }

  return (
    <div className="container" style={{maxWidth:1000}}>
      <h2>User Orders</h2>
      <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',margin:'8px 0'}}>
        <span className="muted">Counts:</span>
        <span style={{background:'#e6e6e6',borderRadius:12,padding:'2px 8px',fontSize:12}}>All: {counts.ALL}</span>
        <span style={{background:'#fff4e6',borderRadius:12,padding:'2px 8px',fontSize:12}}>Pending: {counts.PENDING}</span>
        <span style={{background:'#e6ffed',borderRadius:12,padding:'2px 8px',fontSize:12}}>Accepted: {counts.ACCEPTED}</span>
        <span style={{background:'#ffe8e8',borderRadius:12,padding:'2px 8px',fontSize:12}}>Rejected: {counts.REJECTED}</span>
      </div>
      <div style={{margin:"8px 0", display:'flex', alignItems:'center', gap:8}}>
        <label className="muted">Filter:</label>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{padding:'6px 10px', borderRadius:6}}>
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      {error && <div style={{color:'red',marginBottom:8}}>{error}</div>}
      {loading && <div>Loading...</div>}
      {!loading && filtered.length === 0 && <div className="muted">No user orders yet.</div>}
      {!loading && filtered.map(o => (
        <div key={o.id} className="card" style={{marginBottom:12}}>
          <div className="card-body">
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <strong>Order #{o.id}</strong>
              <span className="muted">{new Date(o.createdAt).toLocaleString()}</span>
            </div>
            <div className="muted" style={{marginTop:4}}>Customer: {o.customerName}</div>
            <div className="muted" style={{marginTop:4}}>Phone: {o.phone}</div>
            <div className="muted" style={{marginTop:4}}>Address: {o.address}</div>
            <div style={{marginTop:8}}>
              {(o.items||[]).map(it => (
                <div key={it.name} style={{display:'flex',justifyContent:'space-between'}}>
                  <div>{it.name} x {it.quantity}</div>
                  <div>${(it.price * it.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:8,display:'flex',justifyContent:'space-between',fontWeight:600}}>
              <div>Total</div>
              <div>${(o.total||0).toFixed(2)}</div>
            </div>
            <div style={{marginTop:4, display:'flex', alignItems:'center', gap:8}}>
              <span className="muted">Status:</span>
              {statusBadge(o.status)}
            </div>
            {(o.status||'').toUpperCase()==='PENDING' && (
              <div style={{marginTop:8, display:'flex', gap:8}}>
                <button
                  onClick={()=>accept(o.id)}
                  style={{
                    border: 'none',
                    background: 'var(--brand-orange)',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: 6
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={()=>reject(o.id)}
                  style={{
                    border: '1px solid #e0e0e0',
                    background: '#fff',
                    color: '#b00000',
                    padding: '6px 10px',
                    borderRadius: 6
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
