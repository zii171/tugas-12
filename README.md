# Tugas 12 — Full-Stack CRUD dengan JWT Authentication

## Struktur Folder
```
tugas12/
├── backend-auth/                 
│   └── src/
│       ├── main.ts                
│       ├── app.module.ts
│       ├── auth/
│       │   ├── auth.module.ts     
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts    
│       │   ├── dto/
│       │   │   ├── register.dto.ts
│       │   │   └── login.dto.ts
│       │   ├── strategies/
│       │   │   └── jwt.strategy.ts
│       │   └── guards/
│       │       └── jwt-auth.guard.ts
│       ├── users/
│       │   ├── users.module.ts
│       │   ├── users.service.ts   
│       │   └── entities/user.entity.ts
│       └── products/
│           ├── products.module.ts
│           ├── products.controller.ts 
│           ├── products.service.ts
│           ├── dto/
│           └── entities/product.entity.ts
│
└── frontend-auth/                
    └── src/
        ├── api/axiosInstance.js   
        ├── context/AuthContext.jsx 
        ├── components/
        │   ├── ProtectedRoute.jsx 
        │   ├── Modal.jsx
        │   ├── ToastContainer.jsx
        │   ├── ProductForm.jsx
        │   └── ProductItem.jsx
        ├── hooks/useToast.js
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   └── ProductList.jsx    
        └── App.jsx                
```

## Cara Menjalankan

### 1. Backend
```bash
cd backend-auth
npm install
npm run start:dev
```
Berjalan di `http://localhost:3000/api/v1`.

### 2. Frontend
```bash
cd frontend-auth
npm install
npm run dev
```
Buka `http://localhost:5173` → otomatis redirect ke `/login` karena belum ada token.
