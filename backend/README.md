## Backend (Python Pyramid)

- Framework: Python Pyramid  
- RESTful API dengan endpoint CRUD untuk:
  - `/auth/register` (POST)
  - `/auth/login` (POST)
  - `/transactions` (GET, POST)
  - `/transactions/{id}` (GET, PUT, DELETE)
  - `/budgets` (GET, POST)
  - `/budgets/{id}` (GET, PUT, DELETE)
  - `/categories` (GET, POST)
  - `/categories/{id}` (GET, PUT, DELETE)
- Autentikasi JWT untuk proteksi semua endpoint CRUD (header `Authorization: Bearer <token>`)
- SQLAlchemy ORM (models: User, Transaction, Budget, Category)
- CORS diaktifkan agar frontend dapat mengakses API
- Unit testing dengan pytest (target coverage ≥ 60% untuk modul kritis—auth, transactions, budgets, categories)

---
