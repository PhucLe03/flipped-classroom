# Học Liệu Số — Nền Tảng Lớp Học Đảo Ngược (Flipped Classroom)

Hệ thống quản lý, xuất bản và học tập tài liệu đa phương tiện theo mô hình **Lớp học đảo ngược (Flipped Classroom)**. Nền tảng được thiết kế chuyên biệt cho học sinh và giáo viên Việt Nam, hỗ trợ bài học tích hợp linh hoạt giữa **Video YouTube**, **Văn bản định dạng giàu (Rich Text)** và **Kho học liệu Google Drive**.

---

## 🎨 Bộ Nhận Diện Thương Hiệu (Yellow-Blue Palette)

| Màu sắc | Mã màu Hex | RGB | Ứng dụng chính |
| :--- | :--- | :--- | :--- |
| **Xanh dương (Blue)** | `#006199` | `rgb(0, 97, 153)` | Màu chủ đạo, thanh điều hướng, tiêu đề chính, nút chính |
| **Xanh nhạt (Light Blue)** | `#8ACFF8` | `rgb(138, 207, 248)` | Nền phụ, viền thẻ nổi bật, hiệu ứng di chuột (hover) |
| **Vàng nhạt (Light Yellow)** | `#F4EB6C` | `rgb(244, 235, 108)` | Điểm nhấn phụ, bảng thông báo ghi chú tự học |
| **Vàng (Yellow)** | `#FFD444` | `rgb(255, 212, 68)` | Nút kêu gọi hành động (CTA), huy hiệu nổi bật |

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

* **Frontend**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript, Tailwind CSS, TipTap WYSIWYG Editor với font chữ tối ưu tiếng Việt **Be Vietnam Pro**, Lucide Icons, Axios).
* **Backend**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) (TypeScript, Mongoose ODM, JWT Authentication, Bcrypt, sanitize-html lọc XSS, Helmet bảo mật HTTP header, Morgan logging).
* **Cơ sở dữ liệu**: [MongoDB](https://www.mongodb.com/) (Hỗ trợ MongoDB Atlas hoặc MongoDB local / MongoMemoryServer fallback).
* **Quản lý mã nguồn & CI/CD**: [GitHub](https://github.com/) & GitHub Actions (`.github/workflows/ci.yml`).

---

## 📂 Cấu Trúc Dự Án (Monorepo)

```text
FlippedClassroom/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI tự động kiểm thử & build
├── client/                      # Ứng dụng Next.js Frontend
│   ├── src/
│   │   ├── app/                 # Next.js App Router (Tiếng Việt)
│   │   │   ├── (auth)/          # /dang-nhap, /dang-ky
│   │   │   ├── (protected)/     # Route guard: /tai-lieu, /tai-lieu/[slug]
│   │   │   ├── (public)/        # /, /mon-hoc, /gioi-thieu
│   │   │   └── dashboard/       # /dashboard/giao-vien, /dashboard/quan-tri
│   │   ├── components/
│   │   │   ├── editor/          # TipTapEditor & BlockManager
│   │   │   ├── layout/          # Navbar, Footer, ProtectedRoute
│   │   │   └── materials/       # MaterialCard, BlockRenderer
│   │   ├── context/             # AuthContext (JWT, session)
│   │   └── lib/                 # Axios API client
│   ├── tailwind.config.ts
│   └── package.json
├── server/                      # Dịch vụ Node.js Express Backend
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   ├── controllers/         # Auth, Material, Category, Admin controllers
│   │   ├── middlewares/         # JWT Auth & Role-Based Access Control (RBAC)
│   │   ├── models/              # Mongoose schemas (User, Category, StudyMaterial)
│   │   ├── routes/              # Express REST routes
│   │   ├── utils/               # Sanitizer, YouTube parser, GDrive validator, slugify
│   │   ├── seeder.ts            # Script nạp dữ liệu mẫu
│   │   └── index.ts             # Server entry point (Cổng 5000)
│   └── package.json
├── package.json                 # Monorepo root scripts
└── .gitignore
```

---

## ⚡ Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Khởi tạo Backend (Máy chủ API)

```bash
cd server
npm install
npm run build
npm run dev
```

Máy chủ API chạy tại: `http://localhost:5000`  
Kiểm tra tình trạng API: `http://localhost:5000/api/health`

### 2. Khởi tạo Dữ liệu Mẫu (Seeder)

```bash
cd server
npm run seed
```

Lệnh này sẽ tạo sẵn:
* **7 Môn học**: Toán học, Vật lý, Hóa học, Tiếng Anh, Tin học, Sinh học, Ngữ văn.
* **3 Bài học mẫu** với đầy đủ các khối: Video YouTube nhúng trực tiếp, lý thuyết Rich Text chuẩn sư phạm và liên kết phiếu bài tập Google Drive.

### 3. Khởi tạo Frontend (Giao diện người dùng)

```bash
cd client
npm install
npm run dev
```

Giao diện người dùng chạy tại: `http://localhost:3000`

---

## 🔑 Tài Khoản Mẫu Để Thử Nghiệm

Hệ thống cung cấp sẵn các nút đăng nhập nhanh 1-chạm tại trang **Đăng nhập (`/dang-nhap`)**:

| Vai trò | Địa chỉ Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@flippedclassroom.edu.vn` | `123456` | Toàn quyền quản lý người dùng, danh mục môn học và duyệt học liệu |
| **Giáo viên (Teacher)** | `thaynam.toan@flippedclassroom.edu.vn` | `123456` | Soạn bài học TipTap, thêm YouTube/Drive, đăng bài, quản lý bài học |
| **Học sinh (Student)** | `hocsinh@flippedclassroom.edu.vn` | `123456` | Tra cứu, lọc bài học theo môn/khối, xem video, đọc lý thuyết, mở Drive |

---

## 🛡️ Ma Trận Phân Quyền (RBAC Matrix)

| Chức năng | Khách (Vãng lai) | Học sinh (Student) | Giáo viên (Teacher) | Quản trị (Admin) |
| :--- | :---: | :---: | :---: | :---: |
| Xem trang chủ & giới thiệu | ✓ | ✓ | ✓ | ✓ |
| Tra cứu & xem chi tiết bài học | ✗ | ✓ | ✓ | ✓ |
| Tạo bài học mới | ✗ | ✗ | ✓ | ✓ |
| Chỉnh sửa bài học của mình | ✗ | ✗ | ✓ | ✓ |
| Xóa bài học của mình | ✗ | ✗ | ✓ | ✓ |
| Quản lý toàn bộ bài học | ✗ | ✗ | ✗ | ✓ |
| Quản lý người dùng & phân vai trò | ✗ | ✗ | ✗ | ✓ |
| Quản lý danh mục môn học | ✗ | ✗ | ✗ | ✓ |
