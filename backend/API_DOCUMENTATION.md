# EduBridge API Documentation

> **Industry-Level Educational Platform API**  
> Version 2.0 - Professional Architecture with Dedicated Route Separation

## 🏗️ **Architecture Overview**

The EduBridge API follows **industry best practices** with:
- **Separation of Concerns**: Dedicated route modules for different functionalities
- **Professional Error Handling**: Standardized error responses with correlation IDs
- **Rate Limiting**: Intelligent throttling to prevent abuse
- **Data Integrity**: Industry-level chat storage with full content preservation
- **Security**: JWT authentication, input validation, and sanitization

## 📡 **Base URL**
```
http://localhost:5000/api
```

## 🔐 **Authentication**

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔑 **Authentication Routes** (`/api/auth`)

### **POST** `/auth/login`
User authentication with credentials.

**Request Body:**
```json
{
  "studentId": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "studentId": "student123",
    "name": "John Doe",
    "hasAccess": true,
    "expiresAt": "2026-02-26T10:00:00Z"
  }
}
```

**Error Responses:**
- `400`: Missing credentials
- `401`: Invalid credentials
- `403`: Access not granted or expired

### **GET** `/auth/verify`
Verify JWT token validity.

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "studentId": "student123",
    "name": "John Doe"
  }
}
```

### **POST** `/auth/register`
Create new user account.

**Request Body:**
```json
{
  "studentId": "string",
  "password": "string",
  "name": "string"
}
```

---

## 💬 **Chat Routes** (`/api/chat`)

**Professional chat system with full content preservation and industry-level message storage.**

### **POST** `/chat/session`
Interactive learning conversation with AI tutor.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "string",
  "topicId": "integer",
  "subtopicId": "integer",
  "topicTitle": "string (optional)",
  "subtopicTitle": "string (optional)",
  "learningObjectives": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "response": "AI tutor response with full markdown formatting preserved",
  "messageCount": 15,
  "phase": "session"
}
```

**Rate Limit:** 20 requests per minute per user

### **POST** `/chat/playground`
Coding practice conversation with context-aware assistance.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "string",
  "topicId": "integer",
  "subtopicId": "integer",
  "code": "string (optional)",
  "output": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "response": "Context-aware coding assistance",
  "messageCount": 8,
  "phase": "playtime"
}
```

### **POST** `/chat/assignment/hint`
Get intelligent hints for assignments.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "string",
  "topicId": "integer",
  "subtopicId": "integer",
  "assignmentCode": "string (optional)",
  "difficulty": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "hint": "Intelligent hint based on student's current progress",
  "messageCount": 5,
  "phase": "assignment"
}
```

### **POST** `/chat/feedback`
Detailed code feedback and discussion.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "string",
  "topicId": "integer",
  "subtopicId": "integer",
  "submittedCode": "string (optional)",
  "testResults": "object (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "response": "Detailed feedback and discussion",
  "messageCount": 12,
  "phase": "feedback"
}
```

### **GET** `/chat/history/:topicId/:subtopicId`
Retrieve conversation history with full formatting preservation.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `phase` (optional): Filter by conversation phase
- `limit` (optional): Limit number of messages (default: 50)

**Success Response (200):**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg_1738062847_abc123",
      "role": "assistant",
      "content": "**Welcome!** Here's your lesson with full markdown preserved.",
      "phase": "session",
      "timestamp": "2026-01-26T11:15:47.123Z",
      "metadata": {
        "contentLength": 245,
        "hasMarkdown": true,
        "hasCodeBlocks": false
      }
    }
  ],
  "count": 25,
  "topicId": 1,
  "subtopicId": 2,
  "phase": "session"
}
```

### **DELETE** `/chat/history/:topicId/:subtopicId`
Clear conversation history for a topic.

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Chat history cleared successfully",
  "topicId": 1,
  "subtopicId": 2
}
```

### **GET** `/chat/health`
Chat system health check.

**Success Response (200):**
```json
{
  "success": true,
  "status": "operational",
  "services": {
    "ai": "healthy",
    "rateLimit": "healthy",
    "storage": "healthy"
  },
  "timestamp": "2026-01-26T11:15:47.123Z"
}
```

---

## 📚 **Learning Routes** (`/api/learn`)

**Core learning functionality with progress tracking.**

### **GET** `/learn/state/:topicId/:subtopicId`
Get current learning state and progress.

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "phase": "session",
  "progress": {
    "currentOutcomeIndex": 2,
    "totalOutcomes": 5,
    "completedAt": null
  },
  "readyForPlaytime": false
}
```

### **POST** `/learn/session/start`
Start a new learning session.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "topicId": "integer",
  "subtopicId": "integer",
  "subtopicTitle": "string"
}
```

### **POST** `/learn/playtime/start`
Start playground/practice phase.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "topicId": "integer",
  "subtopicId": "integer",
  "subtopicTitle": "string"
}
```

### **POST** `/learn/playtime/execute`
Execute code in playground.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "code": "string",
  "topicId": "integer",
  "subtopicId": "integer"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "output": "console output",
  "isError": false,
  "logs": ["log1", "log2"]
}
```

### **POST** `/learn/assignment/start`
Start assignment phase.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "topicId": "integer",
  "subtopicId": "integer",
  "assignments": ["array", "of", "assignments"]
}
```

### **POST** `/learn/assignment/run`
Execute assignment code for testing.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "code": "string"
}
```

### **POST** `/learn/assignment/submit`
Submit assignment for evaluation.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "code": "string",
  "topicId": "integer",
  "subtopicId": "integer"
}
```

---

## 📊 **Progress Routes** (`/api/progress`)

**Learning progress tracking and analytics.**

### **GET** `/progress`
Get user's overall learning progress.

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "progress": [
    {
      "topicId": 1,
      "subtopicId": 1,
      "phase": "completed",
      "status": "completed",
      "completedAt": "2026-01-25T10:00:00Z"
    }
  ]
}
```

---

## 🏥 **System Routes**

### **GET** `/health`
Basic system health check.

**Success Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-01-26T11:15:47.123Z",
  "environment": "development"
}
```

---

## 🚨 **Error Handling**

All API endpoints follow standardized error response format:

```json
{
  "success": false,
  "error": {
    "type": "ValidationError",
    "message": "Descriptive error message"
  },
  "correlationId": "req-123-456-789"
}
```

### **Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## 🔒 **Rate Limiting**

Different endpoints have different rate limits:

- **Chat endpoints**: 20 requests/minute per user
- **General API**: 100 requests/minute per user
- **Authentication**: 10 requests/minute per IP
- **Code execution**: 30 requests/minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1738062900
```

---

## 🎯 **Key Features**

### **Industry-Level Chat Storage**
- **Full Content Preservation**: All markdown, formatting, and multi-line content preserved
- **JSONB Storage**: Optimized PostgreSQL storage with proper indexing
- **Automatic Migration**: Legacy string format automatically converted
- **Rich Metadata**: Content analysis and conversation statistics

### **Professional Error Handling**
- **Correlation IDs**: Every request tracked for debugging
- **Standardized Responses**: Consistent error format across all endpoints
- **Graceful Degradation**: Fallback mechanisms for service failures

### **Security & Performance**
- **JWT Authentication**: Secure, stateless authentication
- **Input Validation**: Comprehensive validation with Joi schemas
- **Rate Limiting**: Intelligent throttling per user/endpoint
- **CORS Protection**: Configurable cross-origin policies

---

## 📝 **Migration Notes**

### **Deprecated Endpoints**
The following endpoints have been moved and will return `301` redirects:

- `POST /api/learn/session/chat` → `POST /api/chat/session`
- `POST /api/learn/playtime/chat` → `POST /api/chat/playground`  
- `POST /api/learn/assignment/hint` → `POST /api/chat/assignment/hint`
- `POST /api/learn/feedback/generate` → `POST /api/chat/feedback`
- `POST /api/learn/feedback/continue` → `POST /api/chat/feedback`

### **Frontend Updates Required**
Update your frontend to use the new chat endpoints for optimal performance and features.

---

## 🛠️ **Development**

### **Environment Variables**
```env
NODE_ENV=development
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
GROQ_API_KEY=your_groq_key
JWT_SECRET=your_jwt_secret_32_chars_min
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=info
```

### **Database Setup**
Run the provided SQL scripts in your Supabase dashboard:
1. `database/fresh-schema.sql` - Core schema
2. `database/chat-sessions-schema.sql` - Optimized chat storage
3. `database/fix-chat-storage.sql` - Industry-level enhancements

---

**Built with ❤️ for professional education technology**