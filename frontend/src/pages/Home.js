import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function Home(){
  const [restaurants, setRestaurants] = useState([]);
  const [searchParams] = useSearchParams();
  const country = searchParams.get('country');

  useEffect(()=>{
    const url = country ? `/api/restaurants?country=${country}` : '/api/restaurants';
    axios.get(url)
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err));
  },[country]);

  return (
    <div className="container">
      <h2>{country ? `Restaurants in ${country}` : 'Popular Restaurants'}</h2>
      <div className="grid">
        {restaurants.map(r => (
          <Link to={`/restaurant/${r.id}`} key={r.id} style={{textDecoration:'none',color:'inherit'}}>
            <div className="card">
              <img src={r.imageUrl} alt={r.name} />
              <div className="card-body">
                <h3>{r.name}</h3>
                <p className="muted">{r.cuisine} · {r.country} · ⭐ {r.rating}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
