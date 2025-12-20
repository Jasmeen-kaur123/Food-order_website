import React, { useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CartContext } from '../CartContext';
import { AuthContext } from '../AuthContext';

export default function Navbar(){
  const { itemCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  function onLogout(){
    logout();
    nav('/');
  }

  function handleCountryChange(e) {
    const country = e.target.value;
    if (country) {
      nav(`/?country=${country}`);
    } else {
      nav('/');
    }
  }

  return (
    <nav className="app-header">
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
        <Link to="/" style={{color:'white',textDecoration:'none',fontWeight:600,fontSize:'20px'}}>FoodOrder</Link>
        <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap',flex:1,justifyContent:'flex-end'}}>
          <select 
            onChange={handleCountryChange} 
            defaultValue={searchParams.get('country') || ''}
            style={{
              padding:'6px 12px',
              borderRadius:6,
              border:'1px solid rgba(255,255,255,0.3)',
              background:'white',
              color:'black',
              cursor:'pointer',
              fontSize:'14px'
            }}
          >
            <option value="" style={{color:'black'}}>All Countries</option>
            <option value="USA" style={{color:'black'}}>USA</option>
            <option value="India" style={{color:'black'}}>India</option>
            <option value="Japan" style={{color:'black'}}>Japan</option>
            <option value="Italy" style={{color:'black'}}>Italy</option>
          </select>
          <Link to="/cart" style={{color:'white',textDecoration:'none',fontSize:'14px',whiteSpace:'nowrap'}}>Cart ({itemCount()})</Link>
          {user && (user.roles||[]).includes('ROLE_ADMIN') && (
            <div style={{display:'flex',gap:'12px',alignItems:'center',borderLeft:'1px solid rgba(255,255,255,0.3)',paddingLeft:'12px'}}>
              <Link to="/admin" style={{color:'white',textDecoration:'none',fontSize:'14px',whiteSpace:'nowrap'}}>Admin</Link>
              <Link to="/admin/user-orders" style={{color:'white',textDecoration:'none',fontSize:'14px',whiteSpace:'nowrap'}}>User Orders</Link>
              <Link to="/login-history" style={{color:'white',textDecoration:'none',fontSize:'14px',whiteSpace:'nowrap'}}>Users Login</Link>
            </div>
          )}
          {user ? (
            <div style={{display:'flex',gap:'12px',alignItems:'center',borderLeft:'1px solid rgba(255,255,255,0.3)',paddingLeft:'12px'}}>
              <Link to="/profile" style={{color:'white',textDecoration:'none',fontSize:'14px',whiteSpace:'nowrap'}}>Profile</Link>
              {(user.roles||[]).includes('ROLE_ADMIN') ? (
                <Link to="/orders" style={{color:'white',textDecoration:'none',fontSize:'14px',whiteSpace:'nowrap'}}>My Orders</Link>
              ) : (
                <Link to="/orders" style={{color:'white',textDecoration:'none',fontSize:'14px',whiteSpace:'nowrap'}}>Orders</Link>
              )}
              <span style={{color:'white',fontSize:'14px',whiteSpace:'nowrap'}}>Hi, {user.username}</span>
              <button onClick={onLogout} style={{background:'transparent',border:'1px solid rgba(255,255,255,0.5)',color:'white',padding:'6px 12px',borderRadius:6,cursor:'pointer',fontSize:'14px'}}>Logout</button>
            </div>
          ) : (
            <div style={{display:'flex',gap:'12px',alignItems:'center',borderLeft:'1px solid rgba(255,255,255,0.3)',paddingLeft:'12px'}}>
              <Link to="/login" style={{color:'white',textDecoration:'none',fontSize:'14px',whiteSpace:'nowrap'}}>Login</Link>
              <Link to="/register" style={{color:'white',textDecoration:'none',fontSize:'14px',whiteSpace:'nowrap',background:'rgba(255,255,255,0.2)',padding:'6px 12px',borderRadius:6}}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
