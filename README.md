# EduBridge

An interactive JavaScript learning platform that transforms beginners into job-ready coders through AI-powered Socratic dialogue.

## Features

- **3-Phase Learning System**: Session (teach outcomes) → Play (try code) → Assignment (tasks + run + test + AI review)
- **AI Mentor**: Interactive Socratic teaching with Pro-Mentor JS
- **Code Playground**: Real-time JavaScript execution and experimentation
- **Assignments**: Practical coding tasks with automated feedback
- **Progress Tracking**: Track learning progress across topics

## Tech Stack

- **Frontend**: React, Vite, CodeMirror
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq (LLaMA 3.1)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Groq API key

### 1. Clone the repository

```bash
git clone <repository-url>
cd EduBridge
```

### 2. Set up the database

1. Create a new project in [Supabase](https://supabase.com)
2. Go to SQL Editor and run the contents of `backend/database/schema.sql`
3. If upgrading an existing database, run `backend/database/migrations.sql` instead

### 3. Configure environment variables

Create a `.env` file in the backend directory with:

```bash
# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:5173

# Database Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# AI Configuration
GROQ_API_KEY=your_groq_api_key

# Authentication
JWT_SECRET=your_jwt_secret_key_here
```

**Optional:** Create `.env` in frontend directory for custom API URL:
```bash
VITE_API_URL=http://localhost:3001
```

### 4. Install dependencies

**Option 1: Install all at once (recommended)**
```bash
npm run install:all
```

**Option 2: Install separately**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 5. Start development servers

**Option 1: Start both servers at once (recommended)**
```bash
npm run dev
```

**Option 2: Start separately**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## Production Deployment

### Build for production
```bash
npm run build
```

### Start production server
```bash
cd backend
npm start
```

### Environment Variables for Production
Set the following environment variables:
- `NODE_ENV=production`
- `FRONTEND_URL=https://your-domain.com`
- All other variables from development setup

## Project Structure

```
EduBridge/
├── backend/
│   ├── config/         # Environment configuration
│   ├── data/           # Curriculum and notes data
│   ├── database/       # SQL schema and migrations
│   ├── middleware/     # Express middleware (logging, etc.)
│   ├── prompts/        # AI system prompts
│   ├── routes/         # API routes
│   ├── services/       # Database services
│   ├── utils/          # Utility functions
│   ├── server.js       # Legacy server
│   └── server-optimized.js  # Optimized server (current)
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── config/     # API configuration
│   │   ├── contexts/   # React contexts
│   │   ├── data/       # Curriculum data
│   │   └── pages/      # Page components
│   └── index.html
└── README.md
```

## API Endpoints

All endpoints are prefixed with `/api/v1/`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/verify` - Verify token

### Learning
- `GET /learn/state/:topicId/:subtopicId` - Get session state
- `POST /learn/session/start` - Start new session
- `POST /learn/session/chat` - Send message in session
- `POST /learn/playtime/start` - Enter playtime mode
- `POST /learn/playtime/execute` - Execute code
- `POST /learn/assignment/start` - Start assignments
- `POST /learn/assignment/submit` - Submit assignment

### Progress
- `GET /progress` - Get all user progress

## Creating an Admin

After registering your account:

```sql
INSERT INTO admins (user_id) 
SELECT id FROM users WHERE student_id = 'your_student_id';
```

## License

MIT
