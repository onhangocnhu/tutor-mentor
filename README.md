# HCMUT Tutor-Mentor System

Một hệ thống demo để minh họa quy trình tương tác giữa sinh viên, tutor và các phòng ban hỗ trợ (CTSV, PDT, Khoa). Dự án phục vụ mục đích học tập và thử nghiệm tính năng: quản lý phiên học, thư viện tài liệu PDF, đăng ký môn học, và quy trình quản lý tài khoản (OTP / reset mật khẩu).

**Tính năng chính (MVP):**
- Đăng nhập và luồng người dùng chính:
	- Student: đăng nhập → Dashboard → trang "Đăng ký chương trình" (chọn môn) → hệ thống lưu đăng ký vào cơ sở dữ liệu mẫu (JSON) → tiếp tục đăng ký tutor cho môn học.
	- Tutor: đăng nhập → quản lý buổi gặp → xem danh sách sinh viên tham gia và xem/ghi báo cáo buổi họp.
- Hệ thống thư viện:
	- Tìm kiếm và lọc tài liệu (theo chủ đề, bộ môn, từ khóa).
	- Upload và xem trước PDF (tạo thumbnail / cover).
	- Chia sẻ tài liệu, lưu (save), và chia sẻ tới người dùng khác.
	- Quản lý mượn trả: mượn, trả, gia hạn, và lịch sử mượn.
	- Thống kê: lượt xem, lượt tải, lượt mượn, và đánh giá tài liệu.

---
**Công nghệ chính:** React, TypeScript, Vite, Tailwind CSS (frontend); Node.js, Express, multer, nodemailer (backend); xử lý PDF/ảnh bằng `sharp`, `canvas`, `pdf-poppler`, `pdf2pic`, `pdfjs-dist`.

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

**Khởi chạy Backend:**

```bash
npm run start
```

Backend chạy tại: http://localhost:3001


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

Frontend chạy tại: http://localhost:5173.

## Cấu hình môi trường (Environment Variables)

Tạo file `.env` trong thư mục `hcmut-tutor-backend`:

```arduino
# Email configuration (cho chức năng gửi OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server port (mặc định: 3001)
PORT=3001
```

**Note**: Nhóm chọn một mail giả định HCMUT BKTutor Portal để gửi email đến người dùng. 

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
├── .env                       # Biến môi trường
└── package.json
```

## Tài khoản demo

Các tài khoản nằm ở ``hcmut-tutor-backend/data/users.json``

## API Endpoints chính

Dưới đây là tập hợp các endpoint chính được triển khai trong `hcmut-tutor-backend/server.js`. Các route được nhóm theo chức năng để dễ tham khảo.

### Authentication & Session Init
- `POST /login`: Đăng nhập (username + password). Trả về `success`, `role`, `name`, `id`.
- `POST /forgot-password`: Gửi OTP tới email (yêu cầu `username` + `email`).
- `POST /verify-otp`: Xác thực mã OTP.
- `POST /reset-password`: Đặt lại mật khẩu (sau xác thực OTP).
- `GET /server-start`: Trả về timestamp khởi động server (dùng frontend phát hiện restart).

### Sessions (quản lý buổi gặp)
- `POST /request-session`: Yêu cầu một session tới tutor (studentId, tutorId, message).
- `GET /sessions`: Lấy danh sách tất cả sessions.
- `GET /sessions/:id`: Lấy thông tin chi tiết một session.
- `POST /sessions`: Tạo session mới (thông tin session trong body).
- `PUT /sessions/:id`: Cập nhật thông tin session.
- `DELETE /sessions/:id`: Xóa session.
- `POST /sessions/:id/add-report`: Upload file báo cáo (PDF) cho session (multipart/form-data, field `report`).
- `POST /sessions/:id/add-student`: Thêm sinh viên vào session.
- `POST /sessions/:id/remove-student`: Xóa sinh viên khỏi session.

### Users, Students, Tutors, Subjects
- `GET /students`: Lấy danh sách sinh viên (mảng).
- `GET /student/:username`: Lấy thông tin sinh viên theo `username`.
- `GET /tutors`: Lấy danh sách tutors.
- `GET /tutor/:username`: Lấy thông tin tutor theo `username`.
- `GET /subjects`: Lấy danh sách môn học.
- `GET /current-student`: Lấy thông tin student hiện tại dựa trên cookie (dùng trên frontend để xác định user hiện tại).

### Registrations (đăng ký chương trình/tutor)
- `POST /register-program`: Sinh viên đăng ký tutor/subject cho chương trình (body chứa thông tin đăng ký).
- `GET /registrations`: Lấy danh sách đăng ký; hỗ trợ lọc theo `studentUsername` hoặc `tutorUsername` (query hoặc cookie).
- `GET /students-reg`: Endpoint bổ trợ để truy vấn danh sách sinh viên theo đăng ký (dùng nội bộ frontend).

### Progress (cập nhật tiến độ của sinh viên bởi tutor)
- `POST /student-progress`: Tutor lưu tiến độ/số liệu học tập cho sinh viên.
- `GET /progress`: Lấy dữ liệu tiến độ; hỗ trợ lọc theo các tham số.

### Reports & File uploads
- Static serve: `/uploads` và `/uploads/reports`: phục vụ file đã upload (PDF, cover, thumbnails).
- `POST /sessions/:id/add-report`: (như trên) upload báo cáo session.

### Library
- `POST /library/upload`: Upload file PDF, tạo record tài liệu và thumbnail/cover.
- `GET /library/documents`: Lấy danh sách tài liệu, có hỗ trợ tìm kiếm/lọc/pagination.
- `GET /library/documents/:id`: Lấy chi tiết tài liệu.
- `POST /library/documents/:id/download`: Tăng lượt tải (thống kê) và trả URL/ghi nhận.
- `POST /library/documents/:id/view`: Tăng lượt xem.
- `POST /library/documents/:id/rate`: Đánh giá tài liệu (rating).
- `GET /library/recommended`: Tài liệu gợi ý (sort theo views+downloads+borrows).
- `GET /library/most-viewed`: Danh sách tài liệu xem nhiều nhất.
- `GET /library/newest`: Danh sách tài liệu mới nhất.
- `GET /library/my-stats`: Thống kê tài liệu cá nhân (uploads, lượt xem, v.v.).
- `GET /library/borrow-history`: Lịch sử mượn của user.
- `GET /library/borrowed`: Danh sách hiện đang mượn của user.
- `POST /library/borrow`: Mượn tài liệu (tạo record borrow).
- `POST /library/return`: Trả tài liệu (cập nhật borrowHistory và trạng thái tài liệu).
- `POST /library/renew`: Gia hạn một lần mượn (nếu được cho phép).
- `GET /library/saved`: Lấy danh sách tài liệu đã lưu bởi user.
- `POST /library/save`: Lưu một tài liệu vào danh sách cá nhân.
- `DELETE /library/save`: Gỡ saved document.
- `GET /library/shared`: Lấy tài liệu được chia sẻ tới user.
- `POST /library/share`: Chia sẻ tài liệu cho người dùng khác.
- `GET /library/stats`: Thống kê chung của library cho user.
