# HCMUT Tutor–Mentor System (MVP)

Hệ thống demo hỗ trợ đăng nhập theo vai trò (Student, Tutor, CTSV, PDT, Khoa (Faculty)).  
Frontend sử dụng **React + Vite**, backend sử dụng **Node.js + Express**, dữ liệu lưu trong **JSON**.

---

### Backend
```bash
cd backend
npm install
node server.js
```
Backend chạy tại: http://localhost:3001

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend chạy tại: http://localhost:5173

## Cấu trúc
### Frontend
```arduino
frontend/
  src/
    pages/LoginPage.tsx
    components/
    api/
    styles/
  vite.config.ts
  tsconfig.json
```

### Backend
```arduino
backend/
  server.js
  data/users.json
  package.json
```