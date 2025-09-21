# HobbySwap

A platform for Cornell University affiliated hobby enthusiasts to connect, share, and trade their hobbies and knowledge. They can create a profile with their NetID, username, and password, list hobbies they want to learn and hobbies they want to teach, and request to match with another user to "trade" their respective hobbies. HobbySwap uses intelligent matching algorithms to connect people based on related hobbies and provide community-building enterntainment to their lives. 

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

## ✨ Features

- **Skill & Hobby Profiles** - List what you know and what you want to learn
- **For You Page** – Personalized recommendations for potential matches based on your profile
- **Manual Search** – Search the entire community for a specific hobby or skill
- **Two-Way Matching** – Users who want to learn a skill are paired with those who can teach it — and vice versa
- **Smart Suggestions** – LLM-powered recommendations link related hobbies and skills
- **Profile Pictures** – Optional image upload support via ImgBB API.

## 🚀 Tech Stack

### Frontend

- **⚛️ Next.js 15** - React framework with App Router
- **🟦 TypeScript** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧹 ESLint** - Code linting and formatting

### Backend

- **🟩 Node.js** - JavaScript runtime
- **🟦 TypeScript** - Type-safe development

### Database

- **🍃 MongoDB**

## 📁 Project Structure

```
HobbySwap/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# React components
│   │   └── lib/       # Utility functions
│   ├── public/        # Static assets
│   └── package.json
├── backend/           # Node.js backend API
│   ├── src/
│   │   └── server.ts  # Main server file
│   ├── dist/          # Compiled TypeScript
│   └── package.json
├── package.json       # Root package.json
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd HobbySwap
   ```

2. **Install all dependencies**

   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env

   # Edit the .env file with your configuration
   ```

### Development

**Start both frontend and backend in development mode:**

```bash
npm run dev
```

This will start:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Start individually:**

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Building for Production

**Build both applications:**

```bash
npm run build
```

**Start production servers:**

```bash
npm run start
```

## 🎯 Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build both applications
- `npm run start` - Start both applications in production
- `npm run install:all` - Install dependencies for all packages
- `npm run clean` - Clean build artifacts

### Frontend

- `npm run dev:frontend` - Start Next.js development server
- `npm run build:frontend` - Build Next.js application
- `npm run start:frontend` - Start Next.js production server

### Backend

- `npm run dev:backend` - Start backend with nodemon
- `npm run build:backend` - Compile TypeScript
- `npm run start:backend` - Start compiled backend server
- `npm run clean:backend` - Remove compiled files

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration

The frontend is configured with:

- TypeScript strict mode
- Tailwind CSS with default configuration
- ESLint with Next.js recommended rules

### ImgBB API Configuration

For profile picture uploads, you'll need to set up an ImgBB API key:

1. **Get your API key** from [https://api.imgbb.com/](https://api.imgbb.com/)
2. **Create a `.env.local` file** in the `frontend` directory:

```env
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
```

3. **Replace `your_imgbb_api_key_here`** with your actual API key

**Note:** ImgBB supports images up to 32MB, but the app limits uploads to 10MB for better user experience.

## 📝 API Endpoints

### Health Check

- `GET /api/health` - Server health status
- `GET /api` - API information

## 🚀 Deployment

### Frontend (Vercel/Netlify)

The frontend can be deployed to Vercel or any static hosting service.

### Backend (Railway/Heroku/DigitalOcean)

The backend can be deployed to any Node.js hosting service.

## 📄 License

Built for the Cornell Big Red Hackathon!
