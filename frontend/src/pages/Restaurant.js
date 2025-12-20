import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../CartContext';

export default function Restaurant(){
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const { addItem } = useContext(CartContext);
  const hideTimer = useRef(null);

  useEffect(()=>{
    axios.get(`/api/restaurants/${id}`).then(r => setRestaurant(r.data)).catch(console.error);
  },[id]);

  useEffect(()=>{
    return () => {
      if(hideTimer.current){
        clearTimeout(hideTimer.current);
      }
    };
  },[]);

  function showToast(message){
    setToast(message);
    setToastVisible(true);
    if(hideTimer.current){
      clearTimeout(hideTimer.current);
    }
    hideTimer.current = setTimeout(()=>setToastVisible(false),2000);
  }

  function onAdd(menuItem){
    addItem({ name: menuItem.name, price: menuItem.price, quantity: 1, currency: restaurant.currency });
    showToast(`${menuItem.name} added to cart`);
  }

  function getItemImage(itemName, index){
    const images = {
      burger: [
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop'
      ],
      pizza: [
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop'
      ],
      indian: [
        'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop'
      ],
      asian: [
        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=200&fit=crop'
      ],
      pasta: [
        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=200&fit=crop'
      ],
      salad: [
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop'
      ],
      mexican: [
        'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop'
      ],
      meat: [
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&h=200&fit=crop'
      ],
      dessert: [
        'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop'
      ],
      generic: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&h=200&fit=crop'
      ]
    };

    const name = itemName.toLowerCase();
    let category = 'generic';
    
    if(name.includes('burger')) category = 'burger';
    else if(name.includes('pizza')) category = 'pizza';
    else if(name.includes('biryani') || name.includes('curry') || name.includes('naan') || name.includes('masala') || name.includes('kulfi')) category = 'indian';
    else if(name.includes('sushi') || name.includes('ramen') || name.includes('noodle')) category = 'asian';
    else if(name.includes('pasta') || name.includes('spaghetti')) category = 'pasta';
    else if(name.includes('salad')) category = 'salad';
    else if(name.includes('taco') || name.includes('burrito') || name.includes('quesadilla')) category = 'mexican';
    else if(name.includes('steak') || name.includes('chicken') || name.includes('meat')) category = 'meat';
    else if(name.includes('dessert') || name.includes('cake') || name.includes('ice')) category = 'dessert';

    const categoryImages = images[category];
    return categoryImages[index % categoryImages.length];
  }

  if(!restaurant) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <h2>{restaurant.name}</h2>
      <p className="muted">{restaurant.cuisine} · {restaurant.country} · ⭐ {restaurant.rating}</p>

      <div className="grid" style={{marginTop:12}}>
        {restaurant.menu.map((m, index) => (
          <div key={m.name} className="card">
            <img src={getItemImage(m.name, index)} alt={m.name} style={{width:'100%',height:'180px',objectFit:'cover'}} />
            <div className="card-body">
              <h3>{m.name}</h3>
              <p className="muted">{m.description}</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
                <strong>{restaurant.currency}{m.price.toFixed(2)}</strong>
                <button className="btn" onClick={()=>onAdd(m)} style={{background:'var(--brand-orange)',color:'white',border:'none',padding:'8px 10px',borderRadius:6}}>Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {toastVisible && (
        <div className="toast">
          <span role="status" aria-live="polite">{toast}</span>
        </div>
      )}
    </div>
  );
}
