import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try{
      const raw = localStorage.getItem('auth');
      return raw ? JSON.parse(raw) : null;
    }catch(e){
      return null;
    }
  });

  useEffect(()=>{
    if(user && user.token){
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      localStorage.setItem('auth', JSON.stringify(user));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('auth');
    }
  },[user]);

  function login(token, username, roles){
    setUser({ token, username, roles: roles || [] });
  }

  function logout(){
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
