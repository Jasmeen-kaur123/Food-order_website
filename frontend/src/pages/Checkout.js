import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CartContext } from '../CartContext';
import { AuthContext } from '../AuthContext';

export default function Checkout(){
  const { items, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (user && user.username) {
      setName(user.username);
    }
  }, [user]);

  async function placeOrder(){
    if (!name || !address || !phone) {
      setStatus({ ok: false, message: "Please fill all fields" });
      return;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setStatus({ ok: false, message: "Phone number must be exactly 10 digits" });
      return;
    }
    const payload = { items, total: total(), customerName: name, address, phone };
    try{
      const res = await axios.post('/api/orders', payload);
      setStatus({ ok: true, id: res.data.id });
      clearCart();
    }catch(err){
      setStatus({ ok: false, message: err.message });
    }
  }

  if(status && status.ok) return (
    <div className="container">
      <h2>Order placed</h2>
      <p>Your order id: <strong>{status.id}</strong></p>
      <p>Thank you, you will receive updates shortly.</p>
    </div>
  );

  return (
    <div className="container">
      <h2>Checkout</h2>
      <div style={{maxWidth:600}}>
        <label className="muted">Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
        <label className="muted">Address</label>
        <textarea value={address} onChange={e=>setAddress(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
        <label className="muted">Phone</label>
        <input 
          type="tel" 
          value={phone} 
          onChange={e=>setPhone(e.target.value)} 
          placeholder="Enter 10 digit phone number"
          maxLength="10"
          style={{width:'100%',padding:8,marginBottom:8}} 
        />

        <h3>Summary</h3>
        <div className="card" style={{padding:12}}>
          {items.map(it=> (
            <div key={it.name} style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <div>{it.name} x {it.quantity}</div>
              <div>{it.currency}{(it.price*it.quantity).toFixed(2)}</div>
            </div>
          ))}
          <hr />
          <div style={{display:'flex',justifyContent:'space-between',fontWeight:600}}> <div>Total</div> <div>{items.length > 0 ? items[0].currency : '$'}{total().toFixed(2)}</div></div>
        </div>

        <div style={{marginTop:12}}>
          <button onClick={placeOrder} style={{background:'var(--brand-orange)',color:'white',border:'none',padding:'10px 14px',borderRadius:6}}>Place Order</button>
        </div>
        {status && !status.ok && <div style={{color:'red',marginTop:8}}>Error: {status.message}</div>}
      </div>
    </div>
  );
}
