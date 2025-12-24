# DevSprout 🌱

An AI-powered interactive learning platform for JavaScript programming. DevSprout uses an intelligent mentor system that adapts to each learner's pace and understanding.

## Features

- **Adaptive AI Mentor**: Guides learners through concepts using discovery-based questioning
- **Two-Phase Learning System**: 
  - 📚 **Learning Phase**: Interactive concept teaching with adaptive questioning
  - 💻 **Assignment Phase**: Hands-on coding tasks with code review
- **Structured Curriculum**: Comprehensive JavaScript curriculum from basics to advanced topics
- **Progress Tracking**: Persistent tracking across devices
- **Subscription System**: Razorpay integration for ₹200/month subscription
- **Admin Dashboard**: Manage users, subscriptions, and view analytics
- **Rate Limiting**: Built-in rate limiting to prevent abuse

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT-based auth
- **AI**: Groq API (LLaMA 3.3 70B)
- **Payments**: Razorpay

## Project Structure

```
DevSprout/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/        # Auth context
│   │   ├── config/          # API configuration
│   │   ├── data/            # Curriculum data
│   │   └── pages/           # Login, Dashboard, Chat, Payment
│   └── netlify.toml
├── backend/
│   ├── database/
│   │   └── schema.sql       # Supabase schema
│   ├── routes/
│   │   ├── auth.js          # Authentication
│   │   ├── chat.js          # AI chat
│   │   ├── progress.js      # Progress tracking
│   │   ├── payment.js       # Razorpay integration
│   │   └── admin.js         # Admin dashboard
│   ├── services/
│   │   ├── supabase.js      # Database operations
│   │   └── razorpay.js      # Payment operations
│   ├── server.js
│   └── render.yaml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase account
- Groq API key
- Razorpay account (for payments)

### 1. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `backend/database/schema.sql`
3. Get your credentials from Project Settings > API:
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_SERVICE_KEY`: The `service_role` key (not anon!)

### 2. Set Up Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Groq AI
GROQ_API_KEY=gsk_your_groq_api_key

# Razorpay
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
```

### 3. Install & Run

```bash
# Install dependencies
npm install

# Run development server (both frontend & backend)
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Deployment

### Frontend (Netlify)

1. Connect GitHub repo to Netlify
2. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Environment variables:
   - `VITE_API_URL`: Your backend URL

### Backend (Render)

1. Connect GitHub repo to Render
2. Create Web Service:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
3. Add all environment variables from `.env`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email
- `GET /api/auth/me` - Get current user

### Chat
- `POST /api/chat` - Send message to AI
- `GET /api/chat/history/:topicId/:subtopicId` - Get chat history
- `DELETE /api/chat/history/:topicId/:subtopicId` - Clear chat

### Progress
- `GET /api/progress` - Get all progress
- `POST /api/progress/:topicId/:subtopicId/start` - Start lesson
- `POST /api/progress/:topicId/:subtopicId/complete` - Complete lesson

### Payments
- `GET /api/payment/pricing` - Get pricing info
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/subscriptions` - List subscriptions

## Curriculum Topics

1. Getting Started (console.log)
2. Variables & State Management
3. Operators
4. Conditional Logic
5. Loops
6. Functions
7. Arrays
8. Objects
9. Array Methods
10. Complex Data Handling
11. Problem-Solving Patterns
12. Mini Projects

## Scaling

| Students | Monthly Cost | Notes |
|----------|--------------|-------|
| 1-50 | ₹0-580 | Free tiers |
| 100 | ₹580-1,250 | Render Starter |
| 1,000 | ₹4,150-6,640 | + Supabase Pro |
| 10,000 | ₹41,500-83,000 | Enterprise setup |

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
