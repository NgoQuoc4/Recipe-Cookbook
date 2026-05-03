# Recipe Cookbook - Premium AI Cooking Assistant 🍳

Chào mừng bạn đến với **Recipe Cookbook**, một ứng dụng quản lý và khám phá ẩm thực hiện đại, kết hợp sức mạnh của trí tuệ nhân tạo (Gemini AI) và giao diện **Soft Lavender** tinh tế.

## ✨ Tính năng nổi bật

- **Trải nghiệm UI Cao cấp**: Giao diện mang phong cách Soft Lavender với Glassmorphism, Typography tinh chỉnh và hiệu ứng mượt mà.
- **Sáng tạo cùng AI**: Tích hợp Google Gemini AI để gợi ý các món ăn thông minh dựa trên sở thích hoặc nguyên liệu có sẵn.
- **Sổ tay cá nhân**: 
  - Tạo món ăn thủ công với đầy đủ các bước và nguyên liệu.
  - Quản lý trạng thái Công khai/Riêng tư cho từng món ăn.
  - Lưu các món ăn yêu thích từ cộng đồng vào sổ tay riêng.
- **Khám phá cộng đồng**: Bảng tin nấu ăn nơi người dùng chia sẻ những công thức tâm đắc nhất.
- **An toàn & Bảo mật**: Hệ thống xác thực bằng JWT (JSON Web Token) để bảo vệ dữ liệu cá nhân.

## 🛠 Công nghệ sử dụng

### Frontend
- **React (Vite)** + TypeScript
- **Tailwind CSS v4** (Modern logic & layout)
- **Lucide Icons** (Vibrant & consistent iconography)
- **Axios** (API communication)

### Backend
- **Node.js & Express** + TypeScript
- **Prisma ORM** (Database management)
- **PostgreSQL** (Relational database)
- **JWT & Bcryptjs** (Authentication & Security)

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Node.js (v18 trở lên)
- PostgreSQL

### Các bước thực hiện

1. **Cài đặt dependencies**:
   ```bash
   # Tại thư mục gốc
   npm install
   
   # Cài đặt cho Server
   cd server && npm install
   
   # Cài đặt cho Client
   cd ../client && npm install
   ```

2. **Cấu hình biến môi trường**:
   - Tạo file `.env` trong thư mục `server/`:
     ```env
     DATABASE_URL="postgresql://user:password@localhost:5432/food_db"
     JWT_SECRET="your_secret_key"
     GEMINI_API_KEY="your_gemini_api_key"
     ```

3. **Khởi tạo Database**:
   ```bash
   cd server
   npx prisma migrate dev
   ```

4. **Xem và quản lý dữ liệu (Database GUI)**:
   Ứng dụng sử dụng Prisma Studio để cung cấp giao diện trực quan để xem và chỉnh sửa dữ liệu.
   ```bash
   cd server
   npm run db:studio
   ```
   Sau đó, mở trình duyệt tại: `http://localhost:5555` (hoặc cổng được hiển thị trong terminal).

5. **Chạy ứng dụng**:
   - Mở hai terminal riêng biệt:
   ```bash
   # Terminal 1: Server
   cd server
   npm run dev
   
   # Terminal 2: Client
   cd client
   npm run dev
   ```

## 📂 Cấu trúc dự án

- `/client`: Chứa mã nguồn React, components và giao diện người dùng.
- `/server`: Chứa mã nguồn Node.js, API routes, controllers và logic backend.
- `/server/prisma`: Chứa schema database và các file migrations.

---
Được xây dựng với 💜 bởi đội ngũ Recipe Cookbook.
