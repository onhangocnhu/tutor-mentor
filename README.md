# HCMUT Tutor–Mentor System (MVP)

Hệ thống demo hỗ trợ đăng nhập theo vai trò (Student, Tutor, CTSV, PDT, Khoa (Faculty)).
Frontend sử dụng **React + Vite**, backend sử dụng **Node.js + Express**, dữ liệu lưu trong **JSON**.

---

## Yêu cầu hệ thống

### Phần mềm cần cài đặt trước

| Phần mềm        | Phiên bản khuyến nghị         | Link tải                        |
| ----------------- | --------------------------------- | -------------------------------- |
| **Node.js** | v18.x hoặc v20.x LTS             | [nodejs.org](https://nodejs.org/)   |
| **npm**     | v9.x trở lên (đi kèm Node.js) | -                                |
| **Git**     | Phiên bản mới nhất            | [git-scm.com](https://git-scm.com/) |

### Kiểm tra cài đặt

```bash
node --version    # Kết quả: v18.x.x hoặc v20.x.x
npm --version     # Kết quả: 9.x.x trở lên
git --version     # Kết quả: git version x.x.x
```

---

## Hướng dẫn cài đặt

### Bước 1: Clone repository

```bash
git clone https://github.com/onhangocnhu/tutor-mentor.git
cd tutor-mentor
```

### Bước 2: Cài đặt Backend

```bash
cd hcmut-tutor-backend
npm install
```

**Các package sẽ được cài đặt:**

| Package         | Phiên bản | Mô tả                               |
| --------------- | ----------- | ------------------------------------- |
| `express`     | ^5.1.0      | Web framework cho Node.js             |
| `cors`        | ^2.8.5      | Xử lý Cross-Origin Resource Sharing |
| `dotenv`      | ^17.2.3     | Quản lý biến môi trường         |
| `multer`      | ^2.0.2      | Xử lý upload file                   |
| `nodemailer`  | ^7.0.10     | Gửi email (OTP, thông báo)         |
| `sharp`       | ^0.34.5     | Xử lý và tối ưu hình ảnh       |
| `canvas`      | ^3.2.0      | Vẽ và xử lý đồ họa             |
| `pdf-poppler` | ^0.2.3      | Chuyển đổi PDF sang ảnh           |
| `pdf2pic`     | ^3.2.0      | Tạo thumbnail từ PDF                |
| `pdfjs-dist`  | ^3.11.174   | Đọc và parse file PDF              |

**Lưu ý quan trọng cho Windows:**

- Package `canvas` và `sharp` cần **Visual C++ Build Tools**
- Nếu gặp lỗi khi cài đặt, chạy lệnh sau với quyền Administrator:

```bash
npm install --global windows-build-tools
```

- Hoặc cài đặt [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) với workload "Desktop development with C++"

**Khởi chạy Backend:**

```bash
npm start
# hoặc
node server.js
```

Backend chạy tại: http://localhost:3001

---

### Bước 3: Cài đặt Frontend

```bash
cd ../hcmut-tutor-frontend
npm install
```

**Các package sẽ được cài đặt:**

| Package              | Phiên bản | Mô tả              |
| -------------------- | ----------- | -------------------- |
| `react`            | ^19.2.0     | Thư viện UI chính |
| `react-dom`        | ^19.2.0     | React DOM renderer   |
| `react-router-dom` | ^7.9.6      | Routing cho React    |
| `tailwindcss`      | ^4.1.17     | CSS framework        |
| `lucide-react`     | ^0.554.0    | Bộ icon Lucide      |
| `react-icons`      | ^5.5.0      | Bộ icon đa dạng   |

**Dev Dependencies:**

| Package                      | Phiên bản | Mô tả                        |
| ---------------------------- | ----------- | ------------------------------ |
| `vite`                     | ^7.2.2      | Build tool và dev server      |
| `typescript`               | ~5.9.3      | TypeScript compiler            |
| `@vitejs/plugin-react-swc` | ^4.2.1      | Vite plugin cho React          |
| `@tailwindcss/vite`        | ^4.1.17     | Tailwind CSS plugin cho Vite   |
| `eslint`                   | ^9.39.1     | Code linting                   |
| `@types/react`             | ^19.2.2     | TypeScript types cho React     |
| `@types/react-dom`         | ^19.2.2     | TypeScript types cho React DOM |

**Khởi chạy Frontend:**

```bash
npm run dev
```

Frontend chạy tại: http://localhost:5173 hoặc http://localhost:5174

---

## Chạy đồng thời Backend và Frontend

### Cách 1: Mở 2 terminal riêng biệt

**Terminal 1 - Backend:**

```bash
cd hcmut-tutor-backend
npm start
```

**Terminal 2 - Frontend:**

```bash
cd hcmut-tutor-frontend
npm run dev
```

### Cách 2: Sử dụng npm từ thư mục gốc

```bash
# Tại thư mục tutor-mentor (gốc)
npm install

# Cài đặt cả backend và frontend
cd hcmut-tutor-backend && npm install && cd ..
cd hcmut-tutor-frontend && npm install && cd ..
```

---

## Xử lý lỗi thường gặp

### 1. Lỗi cài đặt `canvas` hoặc `sharp` trên Windows

```bash
# Cài đặt windows-build-tools
npm install --global windows-build-tools

# Hoặc cài lại với flag
npm install --build-from-source
```

### 2. Lỗi EACCES permission denied

```bash
# Chạy terminal với quyền Administrator
# Hoặc sử dụng:
npm config set prefix ~/.npm-global
```

### 3. Lỗi port đang được sử dụng

```bash
# Windows - Tìm process đang dùng port 3001
netstat -ano | findstr :3001

# Kill process (thay <PID> bằng số process ID)
taskkill /PID <PID> /F
```

### 4. Lỗi module not found

```bash
# Xóa node_modules và cài lại
rm -rf node_modules
rm package-lock.json
npm install
```

---

## Cấu hình môi trường (Environment Variables)

Tạo file `.env` trong thư mục `hcmut-tutor-backend`:

```env
# Email configuration (cho chức năng gửi OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server port (mặc định: 3001)
PORT=3001
```

**Lưu ý:** Để gửi email qua Gmail, cần tạo [App Password](https://myaccount.google.com/apppasswords)

---

## Cấu trúc dự án

### Frontend (`hcmut-tutor-frontend/`)

```
hcmut-tutor-frontend/
├── public/                    # Static assets
├── src/
│   ├── pages/                 # Các trang giao diện
│   │   ├── LoginPage.tsx
│   │   ├── Dashboard/         # Trang dashboard theo vai trò
│   │   ├── Library/           # Hệ thống thư viện
│   │   ├── Profile/           # Trang hồ sơ
│   │   ├── ForgotPassword/    # Quên mật khẩu
│   │   └── ...
│   ├── components/            # Component tái sử dụng
│   ├── images/                # Hình ảnh
│   ├── styles/                # File CSS
│   ├── App.tsx                # Khai báo routes
│   └── main.tsx               # Entry point
├── vite.config.ts             # Cấu hình Vite
├── tailwind.config.js         # Cấu hình Tailwind CSS
├── tsconfig.json              # Cấu hình TypeScript
└── package.json
```

### Backend (`hcmut-tutor-backend/`)

```
hcmut-tutor-backend/
├── server.js                  # Server chính, xử lý API routes
├── data/                      # Database JSON
│   ├── users.json             # Thông tin người dùng
│   ├── students.json          # Thông tin sinh viên
│   ├── tutors.json            # Thông tin tutor
│   ├── subjects.json          # Môn học
│   ├── sessions.json          # Phiên học
│   ├── documents.json         # Tài liệu thư viện
│   ├── borrowHistory.json     # Lịch sử mượn sách
│   └── ...
├── uploads/                   # Thư mục lưu file upload
│   ├── documents/             # File tài liệu PDF
│   └── thumbnails/            # Ảnh thumbnail
├── templates/                 # Email templates
│   └── forgotPasswordEmail.html
├── .env                       # Biến môi trường (tự tạo)
└── package.json
```

---

## Tài khoản demo

| Vai trò | Email                | Mật khẩu |
| -------- | -------------------- | ---------- |
| Student  | student@hcmut.edu.vn | 123456     |
| Tutor    | tutor@hcmut.edu.vn   | 123456     |
| PDT      | pdt@hcmut.edu.vn     | 123456     |
| Faculty  | faculty@hcmut.edu.vn | 123456     |

---

## API Endpoints chính

### Authentication

- `POST /auth/login` - Đăng nhập
- `POST /auth/forgot-password` - Gửi OTP
- `POST /auth/verify-otp` - Xác thực OTP
- `POST /auth/reset-password` - Đặt lại mật khẩu

### Library

- `GET /library/documents` - Lấy danh sách tài liệu
- `GET /library/recommended` - Tài liệu gợi ý
- `GET /library/most-viewed` - Tài liệu xem nhiều
- `GET /library/newest` - Tài liệu mới nhất
- `POST /library/borrow` - Mượn tài liệu
- `POST /library/return` - Trả tài liệu
- `GET /library/borrow-history/:userId` - Lịch sử mượn

---

## Liên hệ

Nếu gặp vấn đề trong quá trình cài đặt, vui lòng tạo issue trên GitHub repository.
