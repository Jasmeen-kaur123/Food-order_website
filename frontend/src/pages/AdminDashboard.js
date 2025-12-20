import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard(){
  const { user } = useContext(AuthContext);
  const nav = useNavigate();
  const currencyOptions = [
    { label: 'United States $ (USD)', value: '$' },
    { label: 'Eurozone € (EUR)', value: '€' },
    { label: 'United Kingdom £ (GBP)', value: '£' },
    { label: 'India ₹ (INR)', value: '₹' },
    { label: 'Japan ¥ (JPY)', value: '¥' },
    { label: 'Australia $ (AUD)', value: 'A$' },
    { label: 'Canada $ (CAD)', value: 'C$' },
  ];
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({ name:'', cuisine:'', country:'', currency:'$', rating:4.5, imageUrl:'' });
  const [itemForm, setItemForm] = useState({ name:'', description:'', price:0 });
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchRestaurants = useCallback(async ()=>{
    try{
      const res = await axios.get('/api/restaurants');
      setRestaurants(res.data);
    }catch(err){ setError(err.message); }
  },[]);

  useEffect(()=>{
    if(!user || !(user.roles||[]).includes('ROLE_ADMIN')){
      nav('/');
      return;
    }
    fetchRestaurants();
  },[user, nav, fetchRestaurants]);

  async function createRestaurant(e){
    e.preventDefault();
    setError(''); setMessage('');
    try{
      await axios.post('/api/admin/restaurants', { ...form, menu: [] });
      setForm({ name:'', cuisine:'', country:'', currency:'$', rating:4.5, imageUrl:'' });
      setMessage('Restaurant created');
      fetchRestaurants();
    }catch(err){ setError(err.response?.data?.message || err.message); }
  }

  async function addMenuItem(e){
    e.preventDefault();
    if(!selectedId){ setError('Select a restaurant first'); return; }
    setError(''); setMessage('');
    try{
      await axios.post(`/api/admin/restaurants/${selectedId}/menu`, { ...itemForm, price: Number(itemForm.price) });
      setItemForm({ name:'', description:'', price:0 });
      setMessage('Item added');
      fetchRestaurants();
    }catch(err){ setError(err.response?.data?.message || err.message); }
  }

  async function removeMenuItem(restId, name){
    setError(''); setMessage('');
    try{
      await axios.delete(`/api/admin/restaurants/${restId}/menu`, { params:{ name } });
      setMessage('Item removed');
      fetchRestaurants();
    }catch(err){ setError(err.response?.data?.message || err.message); }
  }

  async function deleteRestaurant(restId){
    setError(''); setMessage('');
    if(!window.confirm('Are you sure you want to delete this restaurant?')) return;
    try{
      await axios.delete(`/api/admin/restaurants/${restId}`);
      setMessage('Restaurant deleted');
      fetchRestaurants();
    }catch(err){ setError(err.response?.data?.message || err.message); }
  }

  if(!user || !(user.roles||[]).includes('ROLE_ADMIN')){
    return null;
  }

  return (
    <div className="container" style={{maxWidth:1000}}>
      <h2>Admin Dashboard</h2>
      {error && <div style={{color:'red',marginBottom:8}}>{error}</div>}
      {message && <div style={{color:'green',marginBottom:8}}>{message}</div>}

      <section style={{marginBottom:24}}>
        <h3>Create Restaurant</h3>
        <form onSubmit={createRestaurant} style={{display:'grid',gap:8,gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
          <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input required placeholder="Cuisine" value={form.cuisine} onChange={e=>setForm({...form,cuisine:e.target.value})}/>
          <input required placeholder="Country" value={form.country} onChange={e=>setForm({...form,country:e.target.value})}/>
          <select required value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}>
            {currencyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input required type="number" step="0.1" min="1" max="5" placeholder="Rating" value={form.rating} onChange={e=>setForm({...form,rating:parseFloat(e.target.value)})}/>
          <input placeholder="Image URL" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})}/>
          <button type="submit" className="btn" style={{gridColumn:'1 / -1',background:'var(--brand-orange)',color:'white',border:'none',padding:'10px',borderRadius:6}}>Create</button>
        </form>
      </section>

      <section style={{marginBottom:24}}>
        <h3>Add Menu Item</h3>
        <div style={{marginBottom:8}}>
          <select value={selectedId} onChange={e=>setSelectedId(e.target.value)} style={{padding:8,minWidth:200}}>
            <option value="">Select restaurant</option>
            {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <form onSubmit={addMenuItem} style={{display:'grid',gap:8,gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
          <input required placeholder="Item name" value={itemForm.name} onChange={e=>setItemForm({...itemForm,name:e.target.value})}/>
          <input placeholder="Description" value={itemForm.description} onChange={e=>setItemForm({...itemForm,description:e.target.value})}/>
          <input required type="number" step="0.01" min="0" placeholder="Price" value={itemForm.price} onChange={e=>setItemForm({...itemForm,price:e.target.value})}/>
          <button type="submit" className="btn" style={{gridColumn:'1 / -1',background:'var(--brand-orange)',color:'white',border:'none',padding:'10px',borderRadius:6}}>Add Item</button>
        </form>
      </section>


      <section>
        <h3>Current Restaurants</h3>
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))'}}>
          {restaurants.map(r => (
            <div key={r.id} className="card" style={{padding:12}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <h4 style={{margin:0}}>{r.name}</h4>
                <button onClick={()=>deleteRestaurant(r.id)} style={{border:'1px solid #f3b3b3',background:'#ffe8e8',padding:'6px 10px',borderRadius:6,color:'#b00000',cursor:'pointer'}}>Delete</button>
              </div>
              <p className="muted">{r.cuisine} · {r.country} · {r.currency}</p>
              <strong>Menu</strong>
              <ul style={{listStyle:'none',padding:0}}>
                {(r.menu||[]).map(m => (
                  <li key={m.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #f0f0f0',gap:'12px'}}>
                    <span style={{flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{m.name} - {r.currency}{m.price.toFixed(2)}</span>
                    <button onClick={()=>removeMenuItem(r.id, m.name)} style={{border:'1px solid #ddd',background:'transparent',padding:'4px 8px',borderRadius:6,cursor:'pointer',flexShrink:0}}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
