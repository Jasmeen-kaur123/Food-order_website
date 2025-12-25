import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, duration = 2000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              background: '#4CAF50',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              animation: 'slideDown 0.3s ease',
              maxWidth: '400px',
              fontSize: '14px'
            }}
          >
            ✓ {toast.message}
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </ToastContext.Provider>
  );
}
