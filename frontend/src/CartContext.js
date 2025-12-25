import React, { createContext, useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export function CartProvider({ children }){
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  // Initialize and reload cart when user changes or role changes
  useEffect(() => {
    try{
      const cartKey = user && (user.roles||[]).includes('ROLE_ADMIN') ? 'admin_cart' : 'user_cart';
      const raw = localStorage.getItem(cartKey);
      setItems(raw ? JSON.parse(raw) : []);
    }catch(e){
      setItems([]);
    }
  }, [user]);

  useEffect(()=>{
    const cartKey = user && (user.roles||[]).includes('ROLE_ADMIN') ? 'admin_cart' : 'user_cart';
    localStorage.setItem(cartKey, JSON.stringify(items));
  },[items, user]);

  function addItem(item){
    setItems(prev => {
      const found = prev.find(i => i.name === item.name);
      if(found){
        return prev.map(i => i.name === item.name ? {...i, quantity: i.quantity + item.quantity} : i);
      }
      return [...prev, item];
    });
  }

  function removeItem(name){
    setItems(prev => prev.filter(i => i.name !== name));
  }

  function clearCart(){ setItems([]); }

  function updateQuantity(name, qty){
    setItems(prev => prev.map(i => i.name === name ? {...i, quantity: qty} : i));
  }

  function itemCount(){
    return items.reduce((s,i)=>s+i.quantity,0);
  }

  function total(){
    return items.reduce((s,i)=>s + i.price * i.quantity, 0);
  }

  return (
    <CartContext.Provider value={{items, addItem, removeItem, clearCart, updateQuantity, itemCount, total}}>
      {children}
    </CartContext.Provider>
  );
}
