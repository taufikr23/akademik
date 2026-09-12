# 🏫 SIASEK - Sistem Informasi Akademik Sekolah

**Platform terpadu untuk mengelola data akademik, jadwal, kehadiran, tugas, dan nilai siswa berbasis microservices.**

---

## 👤 Nama Peserta
**Taufik** — Proyek Individu
**Link Video Persentase** : https://drive.google.com/file/d/10p7iuJojGlUx3IC_3Xw-svPVineLbWq1/view?usp=sharing
---

## 📋 Deskripsi Aplikasi

SIASEK (Sistem Informasi Akademik Sekolah) adalah aplikasi web full-stack yang dirancang untuk mengelola seluruh aktivitas akademik sekolah. Sistem ini memiliki tiga role pengguna (Admin, Guru, Siswa) dengan fitur yang disesuaikan berdasarkan masing-masing role.

**Alur utama:**
1. Siswa/Guru mendaftar akun melalui halaman registrasi
2. Admin meninjau dan menyetujui/menolak pendaftaran
3. Setelah disetujui, user mengaktifkan akun melalui link email
4. User login dan mengakses fitur sesuai role

---

## ⚙️ Teknologi yang Digunakan

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React JS | 18.3 | Library UI |
| Vite | 6.0 | Build tool |
| TypeScript | 5.7 | Type safety |
| Tailwind CSS | 3.4 | Utility-first CSS |
| React Router | 7.1 | Client-side routing |
| Axios | 1.7 | HTTP client |
| Lucide React | 0.468 | Icon library |

### Backend (Microservices)
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Java | 17+ | Bahasa pemrograman |
| Spring Boot | 3.x | Framework backend |
| Spring Web | - | REST API |
| Spring Data JPA | - | ORM / Database access |
| Spring Security | - | Autentikasi & autorisasi |
| Maven | - | Build tool |
| JWT | - | Token autentikasi |

### Database & Infrastruktur
| Teknologi | Fungsi |
|-----------|--------|
| MySQL 8.0 | Database relasional |
| Docker & Docker Compose | Containerization |
| Nginx | Reverse proxy (frontend) |
| API Gateway (Spring Cloud) | Routing microservices |

---

## 📁 Struktur Folder

```
siasek/
├── .env.example                    # Template environment variables
├── docker-compose.yml              # Docker orchestration
├── .gitignore                      # Git ignore rules
│
├── frontend/                       # React Frontend
│   ├── src/
│   │   ├── api/                    # Axios client configuration
│   │   ├── assets/                 # Gambar & static files
│   │   ├── components/             # Reusable components
│   │   │   ├── ConfirmDelete.tsx   # Konfirmasi hapus
│   │   │   ├── DataTable.tsx       # Tabel data generik
│   │   │   ├── Layout.tsx          # Layout utama
│   │   │   ├── Modal.tsx           # Modal popup
│   │   │   ├── PageHeader.tsx      # Header halaman
│   │   │   ├── RoleRoute.tsx       # Role-based routing
│   │   │   └── Sidebar.tsx         # Sidebar navigasi
│   │   ├── config/                 # Konfigurasi menu
│   │   │   └── menu.tsx            # Menu per role
│   │   ├── context/                # React Context
│   │   │   └── AuthContext.tsx     # Auth state management
│   │   ├── pages/                  # Halaman aplikasi
│   │   │   ├── Login.tsx           # Halaman masuk
│   │   │   ├── Register.tsx        # Halaman registrasi
│   │   │   ├── Activate.tsx        # Aktivasi akun
│   │   │   ├── Profile.tsx         # Profil pengguna
│   │   │   ├── PendingRegistrations.tsx  # Persetujuan admin
│   │   │   ├── admin/              # Dashboard admin
│   │   │   ├── teacher/            # Dashboard guru
│   │   │   ├── student/            # Dashboard siswa
│   │   │   ├── master/             # Master data (CRUD)
│   │   │   ├── users/              # Data guru & siswa
│   │   │   ├── assignments/        # Penugasan guru
│   │   │   ├── operational/        # Operasional sekolah
│   │   │   └── reports/            # Laporan
│   │   ├── services/               # API service layer
│   │   └── types/                  # TypeScript types
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/                        # Java Spring Boot Microservices
│   ├── api-gateway/                # API Gateway (port 8080)
│   │   └── src/main/java/com/taufik/gateway/
│   ├── auth-service/               # Autentikasi & Otorisasi (port 8082)
│   │   └── src/main/java/com/taufik/auth/
│   │       ├── config/             # Security, JWT, Password config
│   │       ├── controller/         # Auth, Admin, Approval controllers
│   │       ├── dto/                # Request & Response DTOs
│   │       ├── exception/          # Exception handling
│   │       ├── model/              # User, Role, AccountStatus
│   │       ├── repository/         # JPA Repositories
│   │       └── service/            # Business logic
│   ├── academic-service/           # Data Akademik (port 8081)
│   │   └── src/main/java/com/taufik/akademik/
│   │       ├── controller/         # Teacher, Subject, Class, Dept controllers
│   │       ├── model/              # BaseEntity, Teacher, Subject, Class, etc.
│   │       ├── repository/         # JPA Repositories
│   │       ├── service/            # TeacherServiceInterface + impl
│   │       └── exception/          # ResourceNotFoundException
│   ├── student-service/            # Data Siswa (port 8083)
│   │   └── src/main/java/com/taufik/student/
│   ├── schedule-service/           # Jadwal Pelajaran (port 8084)
│   │   └── src/main/java/com/taufik/schedule/
│   ├── attendance-service/         # Presensi/Kehadiran (port 8085)
│   │   └── src/main/java/com/taufik/attendance/
│   ├── assignment-service/         # Tugas & Pengumpulan (port 8086)
│   │   └── src/main/java/com/taufik/assignment/
│   └── grade-service/              # Nilai (port 8087)
│       └── src/main/java/com/taufik/grade/
```

---

## 🎯 Daftar Fitur

### 🔑 Autentikasi & Otorisasi
- Registrasi mandiri siswa/guru dengan persetujuan admin
- Aktivasi akun melalui email (link token)
- Login dengan JWT token
- Role-based access control (Admin, Guru, Siswa)
- Logout otomatis saat token expired

### 👨‍💼 Admin
- Dashboard statistik (total siswa, guru, kelasm jadwal, tugas, nilai real dari database)
- Master Data: Tahun Ajaran, Semester, Jurusan, Kelas, Mata Pelajaran (CRUD)
- Data Guru & Siswa (CRUD + foto profil)
- Penugasan guru ke mata pelajaran & kelas
- Persetujuan pendaftaran (ACC/Tolak)
- Kelola jadwal pelajaran (hari, jam, kelas, guru, ruang)
- Presensi & Tugas & Nilai (overview)

### 👨‍🏫 Guru
- Dashboard jadwal mengajar hari ini
- Profil Saya (lihat data + upload foto)
- Daftar siswa (read-only)
- Jadwal mengajar (lihat)
- Input presensi siswa sesuai jadwal mengajar
- Buat tugas (upload file materi) untuk kelas yang diampu
- Input & menilai tugas siswa
- Input nilai

### 🎓 Siswa
- Dashboard jadwal pelajaran hari ini (berdasarkan kelas)
- Profil Saya (lihat data + upload foto)
- Lihat jadwal pelajaran
- Lihat & mengumpulkan tugas (upload file jawaban)
- Lihat nilai
- Lihat riwayat presensi

---

## 🚀 Cara menjalankan

### Prasyarat
- Docker & Docker Compose terinstall
- Node.js 18+ dan pnpm (untuk development lokal)

### 1. Setup Environment
```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env sesuai kebutuhan
# (isi JWT_SECRET, MAIL_USERNAME, MAIL_PASSWORD untuk email notifikasi)
```

### 2. Jalankan dengan Docker (Recommended)
```bash
# Build & jalankan semua service
docker-compose up -d --build

# Cek status
docker-compose ps

# Lihat logs
docker-compose logs -f
```

Aplikasi akan berjalan di:
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080

### 3. Jalankan secara Manual (Development)

#### Backend
```bash
# Jalankan MySQL terlebih dahulu
docker-compose up -d mysql

# Jalankan setiap service (buka terminal terpisah)
cd backend/academic-service && mvn spring-boot:run
cd backend/auth-service && mvn spring-boot:run
cd backend/student-service && mvn spring-boot:run
cd backend/schedule-service && mvn spring-boot:run
cd backend/attendance-service && mvn spring-boot:run
cd backend/assignment-service && mvn spring-boot:run
cd backend/grade-service && mvn spring-boot:run
cd backend/api-gateway && mvn spring-boot:run
```

#### Frontend
```bash
cd frontend
pnpm install
pnpm run dev
```
Aplikasi frontend development: http://localhost:5173

### 4. Akun Default
```
Username : admin
Password : admin123
Role     : ADMIN
```

---

## 🔌 Daftar Endpoint REST API

### Auth Service (port 8082)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrasi mandiri siswa/guru |
| POST | `/api/auth/activate` | Aktivasi akun via token email |
| POST | `/api/auth/login` | Login mendapatkan JWT |
| GET | `/api/auth/me` | Dapatkan data user login |
| GET | `/api/auth/admin/approvals/pending` | Lihat pendaftaran menunggu ACC |
| POST | `/api/auth/admin/approvals/{userId}/approve` | Setujui pendaftaran |
| POST | `/api/auth/admin/approvals/{userId}/reject` | Tolak pendaftaran |

### Academic Service (port 8081)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/teachers?search=&sort=&order=` | Semua guru (search + sort) |
| GET | `/api/teachers/{id}` | Detail guru |
| POST | `/api/teachers` | Tambah guru |
| PUT | `/api/teachers/{id}` | Update guru |
| DELETE | `/api/teachers/{id}` | Hapus guru |
| GET | `/api/departments` | Semua jurusan |
| POST | `/api/departments` | Tambah jurusan |
| PUT | `/api/departments/{id}` | Update jurusan |
| DELETE | `/api/departments/{id}` | Hapus jurusan |
| GET | `/api/classes` | Semua kelas |
| GET | `/api/classes/department/{id}` | Kelas per jurusan |
| POST | `/api/classes` | Tambah kelas |
| PUT | `/api/classes/{id}` | Update kelas |
| DELETE | `/api/classes/{id}` | Hapus kelas |
| GET | `/api/subjects` | Semua mata pelajaran |
| POST | `/api/subjects` | Tambah mata pelajaran |
| PUT | `/api/subjects/{id}` | Update mata pelajaran |
| DELETE | `/api/subjects/{id}` | Hapus mata pelajaran |
| GET | `/api/academic-years` | Semua tahun ajaran |
| POST | `/api/academic-years` | Tambah tahun ajaran |
| PUT | `/api/academic-years/{id}` | Update tahun ajaran |
| DELETE | `/api/academic-years/{id}` | Hapus tahun ajaran |
| GET | `/api/semesters` | Semua semester |
| POST | `/api/semesters` | Tambah semester |
| PUT | `/api/semesters/{id}` | Update semester |
| DELETE | `/api/semesters/{id}` | Hapus semester |
| GET | `/api/teacher-subjects` | Penugasan guru |
| POST | `/api/teacher-subjects` | Tambah penugasan |
| DELETE | `/api/teacher-subjects/{id}` | Hapus penugasan |
| GET | `/api/homeroom-teachers` | Wali kelas |
| POST | `/api/homeroom-teachers` | Tambah wali kelas |
| DELETE | `/api/homeroom-teachers/{id}` | Hapus wali kelas |

### Student Service (port 8083)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/students?search=&sort=&order=` | Semua siswa (search + sort) |
| GET | `/api/students/{id}` | Detail siswa |
| POST | `/api/students` | Tambah siswa |
| PUT | `/api/students/{id}` | Update siswa |
| DELETE | `/api/students/{id}` | Hapus siswa |
| GET | `/api/enrollments` | Pendaftaran siswa |
| POST | `/api/enrollments` | Tambah pendaftaran |
| PUT | `/api/enrollments/{id}/status` | Update status |

### Schedule Service (port 8084)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/schedules` | Semua jadwal |
| GET | `/api/schedules/class/{id}` | Jadwal per kelas |
| GET | `/api/schedules/teacher/{id}` | Jadwal per guru |
| POST | `/api/schedules` | Tambah jadwal |
| PUT | `/api/schedules/{id}` | Update jadwal |
| DELETE | `/api/schedules/{id}` | Hapus jadwal |

### Attendance Service (port 8085)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/attendance` | Semua presensi |
| POST | `/api/attendance` | Input presensi |
| GET | `/api/attendance/student/{id}` | Presensi siswa |
| PUT | `/api/attendance/{id}` | Update presensi |
| DELETE | `/api/attendance/{id}` | Hapus presensi |

### Assignment Service (port 8086)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/assignment` | Semua tugas |
| GET | `/api/assignment/{id}` | Detail tugas |
| POST | `/api/assignment` | Buat tugas |
| PUT | `/api/assignment/{id}` | Update tugas |
| DELETE | `/api/assignment/{id}` | Hapus tugas |
| POST | `/api/assignment/{id}/submit` | Kumpulkan tugas |
| GET | `/api/assignment/{id}/submissions` | Lihat pengumpulan |
| PUT | `/api/assignment/submissions/{id}/grade` | Nilai tugas |

### Grade Service (port 8087)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/grades` | Semua nilai |
| GET | `/api/grades/{id}` | Detail nilai |
| POST | `/api/grades` | Input nilai |
| PUT | `/api/grades/{id}` | Update nilai |
| DELETE | `/api/grades/{id}` | Hapus nilai |
| GET | `/api/grades/student/{id}` | Nilai per siswa |

---

## �️ Screenshot Aplikasi

### Login
![Login](screenshots/login.png)

### Dashboard Admin
![Dashboard Admin](screenshots/admin-dashboard.png)

### Data Siswa
![Data Siswa](screenshots/data-siswa.png)

### Jadwal Pelajaran
![Jadwal](screenshots/jadwal.png)

### Registrasi
![Register](screenshots/register.png)

---

## �📐 Arsitektur Microservices

```
                    ┌─────────────┐
                    │   Browser   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Frontend  │ :3000 (Docker) / :5173 (Dev)
                    │  React+Vite │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ API Gateway │ :8080
                    │   Routing   │
                    └──────┬──────┘
                           │
        ┌──────────┬───────┼───────┬──────────┬──────────┐
        │          │       │       │          │          │
   ┌────▼────┐ ┌──▼───┐ ┌─▼──┐ ┌──▼───┐ ┌───▼──┐ ┌───▼───┐
   │  Auth   │ │Academ│ │Stud│ │Sched │ │Atten │ │Assign │
   │ Service │ │  ic  │ │ ent│ │  ul  │ │ ance │ │  ment │
   │  :8082  │ │:8081 │ │:803│ │:8084 │ │:8085 │ │ :8086 │
   └────┬────┘ └──┬───┘ └─┬──┘ └──┬───┘ └───┬──┘ └───┬───┘
        │         │       │       │          │         │
        └─────────┴───────┴───┬───┴──────────┴─────────┘
                              │
                     ┌────────▼────────┐
                     │    MySQL 8.0    │
                     │  akademik_db    │
                     └─────────────────┘
```

---

## 📝 License

Proyek ini dibuat untuk keperluan tugas kuliah.
