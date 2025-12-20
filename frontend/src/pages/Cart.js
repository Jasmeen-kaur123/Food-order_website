import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../CartContext';

export default function Cart(){
  const { items, removeItem, updateQuantity, total } = useContext(CartContext);

  if(items.length === 0) return (
    <div className="container">
      <h2>Your cart is empty</h2>
      <Link to="/">Back to home</Link>
    </div>
  );

  return (
    <div className="container">
      <h2>Your Cart</h2>
      <div>
        {items.map(it => (
          <div key={it.name} className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',marginBottom:8}}>
            <div>
              <strong>{it.name}</strong>
              <div className="muted">{it.currency}{it.price.toFixed(2)}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="number" min="1" value={it.quantity} onChange={e=>updateQuantity(it.name, Math.max(1, parseInt(e.target.value || 1)))} style={{width:60}} />
              <div style={{width:120,textAlign:'right'}}>{it.currency}{(it.price*it.quantity).toFixed(2)}</div>
              <button onClick={()=>removeItem(it.name)} style={{background:'transparent',border:'1px solid #ddd',padding:'6px',borderRadius:6}}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3>Total: {items.length > 0 ? items[0].currency : '$'}{total().toFixed(2)}</h3>
        <Link to="/checkout"><button style={{background:'var(--brand-orange)',color:'white',border:'none',padding:'10px 14px',borderRadius:6}}>Checkout</button></Link>
      </div>
    </div>
  );
}
