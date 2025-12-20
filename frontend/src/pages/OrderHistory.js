import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

export default function OrderHistory(){
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=>{
    if(!user) return;
    axios.get('/api/users/me/orders')
      .then(res => setOrders(res.data))
      .catch(err => setError('Failed to load orders'));
  },[user]);

  if(!user) return (
    <div className="container">
      <h2>Please log in</h2>
      <p>You must be logged in to view your orders.</p>
    </div>
  );

  return (
    <div className="container">
      <h2>My Orders</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      {!orders && <div>Loading...</div>}
      {orders && orders.length === 0 && <div>No orders yet.</div>}
      {orders && orders.map(o => (
        <div key={o.id} className="card" style={{marginBottom:12}}>
          <div className="card-body">
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div><strong>Order #{o.id}</strong></div>
              <div className="muted">{new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <div style={{marginTop:8}}>
              {o.items.map(it => (
                <div key={it.name} style={{display:'flex',justifyContent:'space-between'}}>
                  <div>{it.name} x {it.quantity}</div>
                  <div>${(it.price * it.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:8,display:'flex',justifyContent:'space-between',fontWeight:600}}>
              <div>Total</div>
              <div>${o.total.toFixed(2)}</div>
            </div>
            <div style={{marginTop:8}} className="muted">Status: {o.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
