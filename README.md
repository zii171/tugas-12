# Tugas 12 — Full-Stack CRUD dengan JWT Authentication

## Struktur Folder
```
tugas12/
├── backend-auth/                  # NestJS: Auth (JWT) + Products CRUD
│   └── src/
│       ├── main.ts                # CORS + prefix /api/v1
│       ├── app.module.ts
│       ├── auth/
│       │   ├── auth.module.ts     # daftar JwtModule (secret + expiresIn)
│       │   ├── auth.controller.ts # /auth/register, /auth/login
│       │   ├── auth.service.ts    # logic register & login, generate JWT
│       │   ├── dto/
│       │   │   ├── register.dto.ts
│       │   │   └── login.dto.ts
│       │   ├── strategies/
│       │   │   └── jwt.strategy.ts # verifikasi signature & expiry token
│       │   └── guards/
│       │       └── jwt-auth.guard.ts
│       ├── users/
│       │   ├── users.module.ts
│       │   ├── users.service.ts   # simpan user, hash password (bcrypt)
│       │   └── entities/user.entity.ts
│       └── products/
│           ├── products.module.ts
│           ├── products.controller.ts # semua route @UseGuards(JwtAuthGuard)
│           ├── products.service.ts
│           ├── dto/
│           └── entities/product.entity.ts
│
└── frontend-auth/                 # React (Vite) + React Router
    └── src/
        ├── api/axiosInstance.js   # interceptor: sisipkan token, handle 401
        ├── context/AuthContext.jsx # state login/logout/token (localStorage)
        ├── components/
        │   ├── ProtectedRoute.jsx # redirect ke /login jika belum login
        │   ├── Modal.jsx
        │   ├── ToastContainer.jsx
        │   ├── ProductForm.jsx
        │   └── ProductItem.jsx
        ├── hooks/useToast.js
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   └── ProductList.jsx    # halaman utama (protected)
        └── App.jsx                # routing: /login, /register, / (protected)
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

## Endpoint API
| Method | Endpoint                  | Auth? | Deskripsi                              |
|--------|----------------------------|-------|------------------------------------------|
| POST   | /api/v1/auth/register      | ❌    | Daftar user baru (409 jika email duplikat) |
| POST   | /api/v1/auth/login         | ❌    | Login, mengembalikan `accessToken` + `user` |
| GET    | /api/v1/products            | ✅    | Semua produk                             |
| GET    | /api/v1/products/:id        | ✅    | Detail produk                            |
| POST   | /api/v1/products            | ✅    | Tambah produk                            |
| PUT    | /api/v1/products/:id        | ✅    | Update produk                            |
| DELETE | /api/v1/products/:id         | ✅    | Hapus produk                             |

`✅` = wajib header `Authorization: Bearer <token>`, kalau tidak ada/invalid/expired → **401 Unauthorized**.

---

## B. Penjelasan Kode (untuk laporan)

### 1. Flow Autentikasi JWT (Backend)
1. **Register** (`POST /auth/register`): `AuthService.register()` cek dulu apakah email sudah ada di `UsersService` — kalau ada, lempar `ConflictException` (**409**). Kalau belum, password di-hash pakai **bcrypt** (`SALT_ROUNDS = 10`) sebelum disimpan — password asli tidak pernah disimpan.
2. **Login** (`POST /auth/login`): cari user by email, lalu `bcrypt.compare()` password yang dikirim dengan hash tersimpan. Kalau salah satu gagal (email tidak ada / password salah), lempar `UnauthorizedException` (**401**). Kalau berhasil, buat payload `{ sub: userId, email, role }` dan tanda-tangani jadi JWT via `jwtService.signAsync()`, dengan masa berlaku **1 jam** (`expiresIn: '1h'`).
3. Token ini (`accessToken`) dikirim balik ke frontend bersama data user (tanpa password), lalu frontend menyimpannya di `localStorage`.

### 2. Cara Kerja JWT Guard
- `JwtStrategy` (extends `PassportStrategy(Strategy)`) mengambil token dari header `Authorization: Bearer <token>` (`ExtractJwt.fromAuthHeaderAsBearerToken()`), lalu **Passport otomatis** memverifikasi **signature** (pakai `JWT_SECRET`) dan **masa berlaku** (`ignoreExpiration: false`).
- Kalau verifikasi gagal (signature tidak cocok / token expired / format salah), Passport otomatis melempar **401** *sebelum* method `validate()` dipanggil.
- Kalau valid, method `validate(payload)` dipanggil — di sini kita cari user berdasarkan `payload.sub`, dan hasilnya diletakkan di `request.user` supaya bisa diakses controller.
- `JwtAuthGuard` (`extends AuthGuard('jwt')`) adalah "pembungkus" dari strategy di atas. Dengan `@UseGuards(JwtAuthGuard)` di level `ProductsController`, **semua** route CRUD produk otomatis terlindungi tanpa perlu ditulis ulang di tiap endpoint.

### 3. Cara Kerja Axios Interceptor (Frontend)
- **Request interceptor**: sebelum setiap request dikirim, ambil `accessToken` dari `localStorage`, lalu tempelkan sebagai header `Authorization: Bearer <token>` — jadi kita tidak perlu menulis header ini manual di setiap pemanggilan API.
- **Response interceptor**: kalau response error dengan status **401** (token invalid/expired), otomatis:
  1. Hapus token & data user dari `localStorage`.
  2. Redirect browser ke `/login` (`window.location.href`).
  - Ini artinya kalau token kadaluarsa saat user sedang pakai aplikasi, mereka otomatis "dilempar" ke halaman login tanpa perlu logic tambahan di tiap halaman.

### 4. Cara Kerja ProtectedRoute (Frontend)
- `ProtectedRoute` membungkus halaman yang butuh login (di sini: `ProductList` di path `/`).
- Saat render, ia membaca `isAuthenticated` dari `AuthContext` (yaitu: apakah ada `token` di state, yang di-*restore* dari `localStorage` saat aplikasi pertama dibuka).
- Kalau `isAuthenticated === false`, komponen `<Navigate to="/login" replace />` dari `react-router-dom` langsung mengarahkan user ke halaman login — halaman utama tidak pernah ter-render.
- Kalau `true`, `children` (yaitu `<ProductList />`) dirender seperti biasa.

---

## Yang Perlu Di-screenshot untuk Laporan
1. **Register** di Postman/Thunder Client — berhasil (201) dan gagal karena email duplikat (409).
2. **Login** — berhasil (200, dapat `accessToken`) dan gagal (401, email/password salah).
3. Response body login yang menampilkan `accessToken` (JWT).
4. `GET /api/v1/products` **dengan** header Authorization → berhasil (200).
5. `GET /api/v1/products` **tanpa** header Authorization → 401 Unauthorized.
6. Halaman Login & Register di browser.
7. Halaman utama (Product List) — hanya bisa diakses setelah login; coba akses `/` langsung di tab baru tanpa login → otomatis redirect ke `/login`.
8. Console DevTools menampilkan log `📤 Request` yang membawa token (bisa expand object `withToken: true`).
9. Simulasikan token expired/dihapus manual dari localStorage lalu coba fetch produk → lihat redirect otomatis ke `/login`.
10. Tabel `users` di database — pastikan kolom `password` berupa hash bcrypt (`$2b$10$...`), bukan plain text.

> **Catatan penting soal database:** kode ini memakai penyimpanan in-memory
> (array di `UsersService`/`ProductsService`) supaya bisa langsung dijalankan
> tanpa setup database. Untuk poin laporan "Screenshot tabel User di
> database", Anda perlu mengganti implementasi service dengan
> `Repository<User>`/`Repository<Product>` dari TypeORM + koneksi MySQL
> (pola yang sama seperti Tugas 9 Anda), supaya data benar-benar tersimpan
> di tabel MySQL dan bisa di-screenshot lewat phpMyAdmin/MySQL Workbench.
> Kalau mau, saya bisa bantu buatkan versi TypeORM-nya juga.
