# MyMoneyMate(Financial Management Backend API)

A RESTful API built with Python Pyramid for managing personal finances: transactions, budgets, and categories.

---

## Fitur Utama

* Autentikasi pengguna dengan JWT
* CRUD transaksi (create, read, update, delete)
* Pelacakan anggaran (budgets)
* Pengelompokan kategori (categories)
* SQLAlchemy ORM
* Dukungan CORS untuk frontend

---

## Persyaratan

* Python 3.10+
* pip
* virtualenv (direkomendasikan)
* (Opsional) PostgreSQL atau MySQL; default menggunakan SQLite

---

## Instalasi & Setup

1. **Buat Virtual Environment & Aktifkan**

   ```bash
   cd backend
   python -m venv .venv
   # Linux/macOS:
   source .venv/bin/activate
   # Windows (PowerShell):
   .venv\Scripts\Activate.ps1
   ```
2. **Install Dependensi**

   ```bash
   pip install -r requirements.txt
   pip install -e .
   ```
3. **Atur Environment Variables (opsional)**

   * `JWT_SECRET` (jika berbeda dari nilai di `development.ini`)
   * `DATABASE_URL` (meng-override `sqlalchemy.url` di .ini)
   * `PYRAMID_SETTINGS` (jika menggunakan file .ini lain)
4. **Inisialisasi Database**

   ```bash
   initialize_db development.ini --reset-db
   ```

   Script ini akan membuat semua tabel. Jika menggunakan SQLite, file `database.sqlite` akan dibuat otomatis. Pastikan database PostgreSQL/MySQL sudah ada jika menggunakan DB tersebut.
5. **Jalankan Server**

   ```bash
   pserve development.ini --reload
   ```

   Backend berjalan di `http://localhost:6543` (default). Opsi `--reload` memaksa server restart otomatis saat kode berubah.

---

## Environment Variables

* `PYRAMID_SETTINGS`
  Path ke file .ini (default: `development.ini`).
* `JWT_SECRET`
  Kunci rahasia untuk JWT (meng-override nilai di .ini).
* `DATABASE_URL`
  URL koneksi database (meng-override `sqlalchemy.url` di .ini).

---

## Endpoint API

Semua endpoint CRUD memerlukan header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Autentikasi

* **POST /auth/register**

  * Body JSON:

    ```json
    {
      "username": "nama_user",
      "password": "password_rahasia"
    }
    ```
  * Respon (201):

    ```json
    {
      "id": 1,
      "username": "nama_user",
      "token": "<JWT_TOKEN_BARU>"
    }
    ```
* **POST /auth/login**

  * Body JSON: sama dengan register
  * Respon (200):

    ```json
    {
      "id": 1,
      "username": "nama_user",
      "token": "<JWT_TOKEN_BARU>"
    }
    ```

### Transaksi

| Method | URL                  | Body JSON                                                     | Response                                                |
| ------ | -------------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| GET    | `/transactions`      | – (header Bearer)                                             | `[ { id, amount, description, date, category_id }, … ]` |
| POST   | `/transactions`      | `{ "amount", "description", "date": ISO8601, "category_id" }` | `{ "id", "message": "Transaction created" }`            |
| GET    | `/transactions/{id}` | –                                                             | `{ id, amount, description, date, category_id }`        |
| PUT    | `/transactions/{id}` | `{ "amount", "description", "date", "category_id" }`          | `{ id, amount, description, date, category_id }`        |
| DELETE | `/transactions/{id}` | –                                                             | *204 No Content*                                        |

### Budgets

| Method | URL             | Body JSON                                                 | Response                                     |
| ------ | --------------- | --------------------------------------------------------- | -------------------------------------------- |
| GET    | `/budgets`      | –                                                         | `[ { id, total, start_date, end_date }, … ]` |
| POST   | `/budgets`      | `{ "total", "start_date": ISO8601, "end_date": ISO8601 }` | `{ "id", "message": "Budget created" }`      |
| GET    | `/budgets/{id}` | –                                                         | `{ id, total, start_date, end_date }`        |
| PUT    | `/budgets/{id}` | `{ "total", "start_date": ISO8601, "end_date": ISO8601 }` | `{ id, total, start_date, end_date }`        |
| DELETE | `/budgets/{id}` | –                                                         | *204 No Content*                             |

### Categories

| Method | URL                | Body JSON    | Response                                  |
| ------ | ------------------ | ------------ | ----------------------------------------- |
| GET    | `/categories`      | –            | `[ { id, name, user_id }, … ]`            |
| POST   | `/categories`      | `{ "name" }` | `{ "id", "message": "Category created" }` |
| GET    | `/categories/{id}` | –            | `{ id, name, user_id }`                   |
| PUT    | `/categories/{id}` | `{ "name" }` | `{ id, name, user_id }`                   |
| DELETE | `/categories/{id}` | –            | *204 No Content*                          |

---


## Kontribusi

1. Fork repo ini.
2. Buat branch baru:

   ```
   git checkout -b fitur/nama-fitur
   ```
3. Tambahkan fitur/perbaikan, sertakan unit test jika perlu.
4. Commit & push:

   ```
   git add .
   git commit -m "Menambahkan fitur X"
   git push origin fitur/nama-fitur
   ```
5. Buka Pull Request ke `main`.

---

