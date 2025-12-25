import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const tokenRaw = localStorage.getItem('auth');
if(tokenRaw){
	try{
		const parsed = JSON.parse(tokenRaw);
		if(parsed && parsed.token) axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
	}catch(e){ /* ignore */ }
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
