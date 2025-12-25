import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Restaurant from './pages/Restaurant';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserOrders from './pages/AdminUserOrders';
import LoginHistory from './pages/LoginHistory';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import { ToastProvider } from './ToastContext';
import Navbar from './components/Navbar';

function App(){
  return (
    <ToastProvider>
    <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <div className="app-root">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/restaurant/:id" element={<Restaurant />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/user-orders" element={<AdminUserOrders />} />
              <Route path="/login-history" element={<LoginHistory />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CartProvider>
    </AuthProvider>
    </ToastProvider>
  );
}

export default App;
