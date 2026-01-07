# Todo Application - Next.js

A full-stack todo application built with Next.js, featuring complete CRUD (Create, Read, Update, Delete) operations.

## Features

- ✅ Create new todos
- ✅ View all todos
- ✅ Update todo text
- ✅ Toggle todo completion status
- ✅ Delete todos
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16.1.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Next.js API Routes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone git@github.com:erluxman/tt.git
cd newnextjs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

The application includes the following API routes:

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos` - Update a todo (text or completion status)
- `DELETE /api/todos?id={id}` - Delete a todo

## Deployment

### Option 1: Deploy to Vercel (Recommended - Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New Project"
3. Import the repository: `erluxman/tt`
4. Vercel will automatically detect Next.js and configure the project
5. Click "Deploy"
6. Your app will be live in minutes!

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI (if not already installed):
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

## Project Structure

```
newnextjs/
├── app/
│   ├── api/
│   │   └── todos/
│   │       └── route.ts      # API routes for todos
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main todo application page
│   └── globals.css           # Global styles
├── public/                   # Static assets
└── package.json             # Dependencies

```

## Notes

- The current implementation uses in-memory storage for todos (data resets on server restart)
- For production use, consider integrating a database (PostgreSQL, MongoDB, etc.)

## License

MIT
