# 🌏 Lang Thread – Ứng dụng học ngôn ngữ/ Language Study App

Lang Thread là ứng dụng học ngôn ngữ trực tuyến, nơi người học có thể đăng bài học, chia sẻ kiến thức và thảo luận cùng cộng đồng.  
Xây dựng với **Next.js 15**, **NextAuth**, **Prisma**, và **shadcn/ui**.

## 🚀 Tính năng chính
- **Đăng nhập Google** (NextAuth)
- **Bài học / Chủ đề**: người dùng có thể tạo bài học, chia sẻ kiến thức
- **Bình luận & Thảo luận**: đặt câu hỏi, phản hồi trong từng bài học
- **Hồ sơ cá nhân**: hiển thị thông tin người dùng và hoạt động học tập
- **Giao diện hiện đại**: shadcn/ui + Tailwind CSS

## 🛠️ Công nghệ sử dụng
- [Next.js 15](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/) với PrismaAdapter
- [Prisma ORM](https://www.prisma.io/) + PostgreSQL
- [shadcn/ui](https://ui.shadcn.com/) + Tailwind CSS

## 📦 Cài đặt
1. **Clone repo**
   ```bash
   git clone https://github.com/username/lang-thread.git
   cd lang-thread
   ```

2. **Cài dependencies**
   ```bash
   npm install
   ```

3. **Cấu hình môi trường**
   Tạo file `.env`:
   ```env
   DATABASE_URL=""
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   NEXTAUTH_SECRET="..."
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Migrate database**
   ```bash
   npx prisma migrate dev
   ```

5. **Chạy ứng dụng**
   ```bash
   npm run dev
   ```

## 📂 Cấu trúc thư mục
```
src/
 ├── app/                # Routes + Pages
 │   ├── api/            # API routes
 │   ├── lessons/        # Trang danh sách & chi tiết bài học
 │   └── auth/           # Trang đăng nhập
 ├── components/         # Navbar, LessonCard, CommentForm, ...
 ├── lib/                # auth config, prisma db
 └── styles/             # CSS & Tailwind config
```

## 🔑 Quy trình học
1. Người dùng đăng nhập bằng Google
2. Vào mục **Bài học** để xem các nội dung đã đăng
3. Tạo **bài học mới** nếu muốn chia sẻ kiến thức
4. Bình luận để trao đổi và đặt câu hỏi

## 🖼️ Screenshot


## 📜 License
MIT License


EN : 
# Language Learning App

A modern language learning application built with **Next.js**, **TypeScript**, **NextAuth**, and **Prisma**.  
The app allows users to learn new languages through posts, comments, and interactive activities.

## 🚀 Features

- **Authentication** with Google using NextAuth
- **Post creation**: Share knowledge, exercises, or questions
- **Comment system**: Discuss and interact under each post
- **Responsive UI** built with **shadcn/ui**
- **Database integration** using **Prisma** with MongoDB
- **Real-time experience** for seamless learning

## 📦 Tech Stack

- **Frontend**: Next.js 14, TypeScript, shadcn/ui
- **Backend**: Next.js API Routes, NextAuth
- **Database**: Prisma ORM with MongoDB
- **Auth**: Google OAuth 2.0 via NextAuth

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/language-learning-app.git
   cd language-learning-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   DATABASE_URL="mongodb+srv://..."
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   NEXTAUTH_SECRET="your_nextauth_secret"
   ```

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠 Usage

- Log in with your Google account.
- Create posts to share lessons, vocabulary, or tips.
- Comment on others' posts to exchange ideas.

## 📄 License

This project is licensed under the MIT License.
