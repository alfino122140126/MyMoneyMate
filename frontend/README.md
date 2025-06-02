## Frontend (ReactJS)

- Framework: ReactJS (Vite + TypeScript)  
- Functional components dengan React Hooks  
- Routing: React Router DOM  
- State management: Redux Toolkit  
- UI responsif menggunakan Tailwind CSS  
- Integrasi ke backend via Axios:
  - Base URL: `http://localhost:6543`
  - Interceptor untuk menyertakan header `Authorization: Bearer <token>`
- Struktur folder:
  - `src/components/` (Layout, Navbar, Sidebar, ProtectedRoute, PublicRoute)
  - `src/hooks/` (useMediaQuery, useLocalStorage, redux hook)
  - `src/pages/` (DashboardPage, LoginPage, TransactionsPage)
  - `src/services/` (api.ts, authService.ts, transactionService.ts, budgetService.ts, categoryService.ts)
  - `src/store/` (Redux slices: authSlice, transactionSlice, budgetSlice, categorySlice, uiSlice)
  - `src/utils/formatters.ts`  
