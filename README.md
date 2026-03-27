# Blog Management System

This is a full-stack blog management project built with React, Node.js, Express, and MongoDB. The idea behind it is simple: readers can browse published posts, while logged-in users can create and manage content through a dashboard. Admins get a wider view of the system, including user and post management.

I kept this project split into two parts:

- `frontend` for the React app
- `backend` for the Express API

## What this project can do

- User registration and login with JWT authentication
- Role-based access for `admin` and `author`
- Create, edit, delete, and publish blog posts
- Save posts as drafts
- Search and paginate published posts
- Add and remove comments
- Admin dashboard for managing users and content
- Author dashboard for managing personal posts

## Tech stack

### Frontend

- React
- Vite
- React Router
- Axios
- React Hot Toast
- React Quill

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT
- bcryptjs
- express-validator

## Project structure

```text
blog-management/
|- backend/
|  |- config/
|  |- controllers/
|  |- middleware/
|  |- models/
|  |- routes/
|  |- seeds/
|  |- utils/
|  |- package.json
|  |- server.js
|- frontend/
|  |- public/
|  |- src/
|  |- package.json
|- README.md
```

## Getting started

### 1. Clone the project

```bash
git clone https://github.com/your-username/blog-management.git
cd blog-management
```

### 2. Install dependencies

Install backend packages:

```bash
cd backend
npm install
```

Install frontend packages:

```bash
cd ../frontend
npm install
```

## Environment variables

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

## Run the project

### Start the backend

From the `backend` folder:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start the frontend

From the `frontend` folder:

```bash
npm run dev
```

The frontend will usually run on:

```text
http://localhost:5173
```

## Seed demo data

If you want some sample users and posts, run this inside `backend`:

```bash
npm run seed
```

Demo accounts created by the seed script:

- Admin: `admin@blog.com` / `admin123`
- Author: `author@blog.com` / `author123`

## Main API routes

These are the core API groups:

- `/api/auth` for register, login, and profile
- `/api/posts` for public posts and post management
- `/api/comments` for comment deletion
- `/api/users` for admin-only user management
- `/api/health` for checking if the API is running

## Notes

- Published posts are visible publicly
- Draft posts are meant for logged-in users with permission
- Some routes are protected and require a valid token
- Admin-only routes are restricted by role middleware

## Why I built it this way

I wanted this project to feel like a practical blog platform instead of just a CRUD demo. It includes authentication, roles, dashboards, drafts, comments, and public browsing, which makes it closer to a real application and a better learning project.

## Future improvements

- Add image upload support
- Add rich profile settings
- Add likes or bookmarks
- Add better analytics in the admin dashboard
- Add tests for frontend and backend

## Author

Built as a blog management practice project using the MERN stack.
