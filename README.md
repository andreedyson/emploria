# 🚀 Emploria – SAP Employee Management Dashboard

![Emploria - README](https://github.com/user-attachments/assets/1464e3e0-bffc-460a-915b-01343e815660)


SaaS Open Source sistem SAP untuk pengelolaan karyawan. Mendukung multi-tenant, akses berbasis role, pembuatan slip gaji dalam PDF, dan masih banyak lagi. Dibangun dengan Next.js, Prisma, PostgreSQL, Supabase, TailwindCSS.

## 📋 <a name="table">Table of Contents</a>

1. ⚙️ [Teknologi](#tech-stack)
2. 👩‍💻 [Fitur Utama](#features)
3. 💻 [Akses Role](#rbac)
4. 🔧 [Scripts](#scripts)

## <a name="tech-stack">⚙️ Teknologi</a>

Proyek ini menggunakan teknologi terbaru seperti:

- ⚙️ **Next.js** - App Router dengan sistem routing berbasis file, server actions, dan kapabilitas fullstack  
- ✏️ **Typescript** - Typing yang kuat untuk kode yang lebih aman dan scalable
- 🖼️ **TailwindCSS** - Framework CSS utility-first untuk membangun UI dengan cepat  
- ✒️ **shadcn/ui** - Component library yang aksesibel, dibangun di atas Radix dan Tailwind  
- 💻 **PostgreSQL** - Database relasional yang andal dan berperforma tinggi  
- 📐 **Prisma** - ORM yang aman secara tipe untuk PostgreSQL  
- 🔏 **NextAuth** - Autentikasi dengan dukungan kredensial & OAuth (Google, GitHub, dll.)  
- ⚛️ **React Query** - Pengambilan dan penyimpanan data untuk manajemen state yang lebih baik  


## <a name="features">👩‍💻 Fitur Utama</a>

Aplikasi ini dirancang untuk membantu manajemen operasional perusahaan dengan fitur-fitur berikut:

**🧑‍💼 Manajemen Karyawan**
- Tambah, edit, dan hapus data karyawan
- Detail informasi pribadi dan jabatan
- Upload foto dan dokumen karyawan

**📅 Absensi Harian**
- Fitur check-in dan check-out untuk karyawan
- Pencatatan waktu otomatis
- Riwayat absensi per karyawan

**📝 Pengajuan & Persetujuan Cuti**
- Pengajuan cuti oleh karyawan
- Validasi cuti oleh admin perusahaan
- Batasan frekuensi cuti sesuai kebijakan perusahaan

**💰 Manajemen Gaji**
- Input dan update komponen gaji per karyawan
- Slip gaji otomatis dalam format PDF
- Status pembayaran gaji

**📊 Aktivitas & Log Sistem**
- Log setiap aktivitas penting oleh user
- Riwayat login, pengajuan, dan perubahan data
- Fitur filter dan pencarian log

**🔐 Autentikasi & Role Management**
- Login aman dengan NextAuth (credential dan OAuth)
- Sistem role-based access control (SUPERADMIN, SUPER_ADMIN_COMPANY, USER)
- Middleware proteksi untuk halaman dan API
  
## <a name="rbac">💻 Akses Role</a>

Aplikasi ini menggunakan sistem role-based access control (RBAC) untuk membatasi dan mengatur hak akses pengguna berdasarkan peran mereka. Terdapat tiga jenis role utama:

**🛠️ SUPER_ADMIN**:
Role tertinggi yang memiliki kontrol penuh atas seluruh sistem.

**Hak akses:**
- Mengelola semua data perusahaan (buat, edit, hapus)
- Mengelola akun SUPER_ADMIN_COMPANY
- Melihat seluruh aktivitas pengguna di semua perusahaan
- Melihat dan mengatur konfigurasi global sistem

**🧑‍💼 SUPER_ADMIN_COMPANY**:
Role untuk admin perusahaan yang memiliki akses penuh terhadap data perusahaannya sendiri.

**Hak akses:**
- Mengelola data karyawan (tambah, edit, hapus)
- Mengelola data gaji, absensi, dan cuti untuk karyawan di perusahaannya
- Melihat aktivitas karyawan di perusahaannya
- Tidak dapat melihat atau mengelola data perusahaan lain

**👤 USER**:
Role default untuk karyawan.

**Hak akses:**
- Melihat profil pribadi dan informasi kepegawaian
- Mengajukan cuti dan melihat riwayat cuti
- Melihat slip gaji pribadi
- Melakukan absensi (check-in dan check-out)
- Tidak dapat mengakses atau mengubah data karyawan lain

## <a name="scripts">🔧 Scripts</a>

|Script | Description |
| -------- | ------- |
|`npm run dev` | Menjalankan server development |
|`npm run build` | Build aplikasi untuk server production |
|`npm run start` | Menjalankan production server |
|`npx prisma studio` | Membuka database Prisma DB Explorer |
|`npx prisma migrate dev` | Mengaplikasikan migrasi ke database lokal |

## 🙌 Credits

Emploria tidak akan mungkin terwujud tanpa alat-alat luar biasa dan komunitas open-source di balik teknologi-teknologi ini:

- [**Next.js**](https://nextjs.org/) – React framework for fullstack apps with server actions, routing, and edge-ready performance.
- [**shadcn/ui**](https://ui.shadcn.com/) – Accessible, beautifully designed component library built on Tailwind and Radix UI.
- [**Prisma**](https://www.prisma.io/) – Next-generation ORM for TypeScript and PostgreSQL with powerful query and type safety.
- [**NextAuth.js**](https://next-auth.js.org/) – Authentication for Next.js with credentials, OAuth providers, and flexible session management.
- [**Supabase**](https://supabase.com/) – Open-source Firebase alternative providing hosted PostgreSQL and auth services.
- [**Tailwind CSS**](https://tailwindcss.com/) – Utility-first CSS framework for building fast and responsive UIs.
- [**TypeScript**](https://www.typescriptlang.org/) – Strongly typed superset of JavaScript for scalable and safer development.
- [**React Query**](https://tanstack.com/query/latest) – Hooks-based data fetching, caching, and server state management.
- [**Framer Motion**](https://www.framer.com/motion/) – Animation library for React to create smooth, physics-based transitions.

## Support
Tambahkan ⭐ di GitHub Repostiory ini jika aplikasi ini berguna!

## License

[MIT](https://choosealicense.com/licenses/mit/)



Created by [@andreedyson](https://www.github.com/andreedyson)

