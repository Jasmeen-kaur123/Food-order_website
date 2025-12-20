# FoodOrder — Full-stack Food Ordering Prototype

A minimal full-stack food ordering website inspired by Zomato. This prototype demonstrates core concepts: restaurants, menus, orders, an orange-themed React frontend, and a Java Spring Boot backend using MongoDB.

Stack
- Backend: Java + Spring Boot
- Database: MongoDB
- Frontend: React
- Run: `mvn spring-boot:run` (backend) and `npm start` (frontend)

Authentication
- JWT-based authentication available under `/api/auth` with `/register` and `/login` endpoints.
- Frontend includes Login and Register pages and stores the JWT in `localStorage`.

Quick start (Windows PowerShell)
1. Start MongoDB with Docker Compose:

```powershell
cd d:/ai-project
docker-compose up -d
```

2. Start backend
```powershell
cd d:/ai-project/backend
mvn spring-boot:run
```

3. Start frontend
```powershell
cd d:/ai-project/frontend
npm install
npm start
```

Notes
- Backend runs on port `8080` and exposes REST endpoints under `/api`.
- Frontend dev server runs on port `3000` and proxies API requests to the backend (CORS allowed from backend).

Notes about auth
- To register: POST `/api/auth/register` with `{ username, email, password }`.
- To login: POST `/api/auth/login` with `{ username, password }`.
- When authenticated, POST `/api/orders` requires a valid JWT in `Authorization: Bearer <token>` header; the frontend sets this automatically after login.

Next steps
- Add authentication (JWT)
- Add order processing & payment integration
- Add admin dashboard for restaurants
- Add tests and CI

Enjoy! — provide feedback and I can extend features.