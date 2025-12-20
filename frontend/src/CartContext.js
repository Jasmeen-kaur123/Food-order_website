import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }){
  const [items, setItems] = useState(() => {
    try{
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      return [];
    }
  });

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(items));
  },[items]);

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
