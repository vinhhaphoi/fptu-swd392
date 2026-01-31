# VSTEP Writing System - Frontend API Specification

## 📋 Document Overview
This document provides detailed API specifications for frontend development including:
- **Request/Response Bodies** for all endpoints
- **Entity Attributes** with data types and constraints
- **Validation Rules** for form inputs
- **Error Response Formats**

---

## 🔐 AUTHENTICATION APIs (`/api/auth`)

### 1.1 LOGIN
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "string",    // Required, 1-50 characters
  "password": "string"     // Required, 6-100 characters
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT Token
  "userId": 123,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "User",           // Enum: "Guest"|"User"|"Manager"|"Admin"
  "expiresAt": "2026-01-31T14:30:00Z"
}
```

**Validation Rules:**
- Username: 1-50 characters, required
- Password: 6-100 characters, required

---

### 1.2 REGISTER
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "string",        // Required, 2-100 characters
  "username": "string",    // Required, 3-50 characters, unique
  "email": "string",       // Required, valid email format, unique
  "phoneNumber": "string", // Optional, valid phone format
  "password": "string"     // Required, 8-100 characters
}
```

**Success Response (200 OK):**
```json
{
  "message": "User registered successfully"
}
```

**Validation Rules:**
- Name: 2-100 characters, letters only
- Username: 3-50 alphanumeric + [_-], must be unique
- Email: Valid email format, max 150 characters, unique
- Phone: Optional, format: +XXXXXXXXXX or 0XXXXXXXXX
- Password: 8+ characters, must include uppercase, lowercase, number, special char

---

### 1.3 FORGOT PASSWORD
**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "string"        // Required, valid email format
}
```

**Success Response (200 OK):**
```json
{
  "message": "If the email exists, a reset link has been sent."
}
```

---

### 1.4 RESET PASSWORD
**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
  "token": "string",       // Required, reset token from email
  "newPassword": "string"  // Required, 8-100 characters
}
```

**Success Response (200 OK):**
```json
{
  "message": "Password has been reset successfully."
}
```

---

## 👤 USER PROFILE APIs (`/api/user`)

### 2.1 GET PROFILE
**Endpoint:** `GET /api/user/profile`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "id": 123,
  "name": "John Smith",
  "username": "john_smith",
  "email": "john@example.com",
  "role": "User",              // Enum: "Guest"|"User"|"Manager"|"Admin"
  "targetLevelId": 2,          // Nullable
  "createdAt": "2026-01-31T10:00:00Z",
  "updatedAt": "2026-01-31T12:00:00Z",  // Nullable
  "isActive": true
}
```

---

### 2.2 UPDATE PROFILE
**Endpoint:** `PUT /api/user/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",        // Required, 2-100 characters
  "email": "string",       // Required, valid email format, unique
  "phoneNumber": "string"  // Optional, valid phone format
}
```

**Success Response (200 OK):**
```json
{
  "message": "Profile updated successfully"
}
```

**Validation Rules:**
- Name: 2-100 characters
- Email: Valid email format, must be unique
- Phone: Optional, valid format

---

### 2.3 CHANGE PASSWORD
**Endpoint:** `POST /api/user/change-password`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "string",  // Required, 6-100 characters
  "newPassword": "string"       // Required, 8-100 characters
}
```

**Success Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**Validation Rules:**
- Current Password: 6-100 characters, must match existing password
- New Password: 8+ characters, must include uppercase, lowercase, number, special char

---

## 👮 ADMIN USER MANAGEMENT (`/api/admin/users`)

### 3.1 GET ALL USERS
**Endpoint:** `GET /api/admin/users?page=1&pageSize=10&search=john&sortBy=name&sortOrder=asc`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Query Parameters:**
- `page`: integer, default=1
- `pageSize`: integer, default=10, max=100
- `search`: string, optional (searches name/username/email)
- `sortBy`: string, optional (name|email|createdAt|role)
- `sortOrder`: string, optional (asc|desc)

**Success Response (200 OK):**
```json
{
  "items": [
    {
      "id": 123,
      "name": "John Smith",
      "username": "john_smith",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",    // Nullable
      "role": "User",                  // Enum: "Guest"|"User"|"Manager"|"Admin"
      "targetLevelName": "B1",         // Nullable
      "practiceSessionCount": 5,
      "createdAt": "2026-01-31T10:00:00Z",
      "updatedAt": "2026-01-31T12:00:00Z",  // Nullable
      "isActive": true
    }
  ],
  "totalItems": 25,
  "currentPage": 1,
  "totalPages": 3,
  "pageSize": 10
}
```

---

### 3.2 CREATE USER
**Endpoint:** `POST /api/admin/users`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Request Body:**
```json
{
  "name": "string",           // Required, 2-100 characters
  "username": "string",       // Required, 3-50 characters, unique
  "email": "string",          // Required, valid email format, unique
  "phoneNumber": "string",    // Optional, valid phone format
  "password": "string",       // Required, 8-100 characters
  "role": "User",             // Required, Enum: "Guest"|"User"|"Manager"|"Admin"
  "targetLevelId": 2,         // Optional, integer
  "isActive": true            // Required, boolean
}
```

**Success Response (201 Created):**
```json
{
  "id": 124,
  "name": "New User",
  "username": "new_user",
  "email": "new@example.com",
  "role": "User",
  "targetLevelId": 2,
  "createdAt": "2026-01-31T13:00:00Z",
  "updatedAt": null,
  "isActive": true
}
```

**Validation Rules:**
- All name/username/email/password rules from registration
- Role: Must be valid enum value
- TargetLevelId: Must reference existing level
- isActive: Boolean value

---

### 3.3 UPDATE USER
**Endpoint:** `PUT /api/admin/users/{id}`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Request Body:**
```json
{
  "name": "string",           // Required, 2-100 characters
  "username": "string",       // Required, 3-50 characters, unique
  "email": "string",          // Required, valid email format, unique
  "phoneNumber": "string",    // Optional, valid phone format
  "role": "Manager",          // Required, Enum: "Guest"|"User"|"Manager"|"Admin"
  "targetLevelId": 3,         // Optional, integer
  "isActive": false           // Required, boolean
}
```

**Success Response (200 OK):**
```json
{
  "message": "User updated successfully"
}
```

---

### 3.4 CHANGE USER PASSWORD
**Endpoint:** `POST /api/admin/users/{id}/change-password`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Request Body:**
```json
{
  "newPassword": "string"     // Required, 8-100 characters
}
```

**Success Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

---

## 📚 LEARNING RESOURCES APIs

### 4.1 GET ALL LEVELS
**Endpoint:** `GET /api/levels`

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "levelName": "A2",
    "description": "Elementary level"
  },
  {
    "id": 2,
    "levelName": "B1", 
    "description": "Intermediate level"
  }
]
```

---

### 4.2 GET TOPICS BY PART
**Endpoint:** `GET /api/topics/by-part/{partId}`

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "partId": 1,
    "topicName": "Email Writing",
    "context": "Business communication",     // Nullable
    "purpose": "Professional correspondence", // Nullable
    "recipientRole": "Colleague",            // Nullable
    "difficultyLevelId": 2
  }
]
```

---

### 4.3 GET TOPIC LEARNING RESOURCES
**Endpoint:** `GET /api/topics/{id}/learning-resources/{levelId}`

**Success Response (200 OK):**
```json
{
  "topicId": 1,
  "vocabularySets": [
    {
      "id": 1,
      "setName": "Business Vocabulary",
      "description": "Professional terms",     // Nullable
      "vocabularyItems": [
        {
          "id": 1,
          "word": "colleague",
          "definition": "a person with whom one works",
          "example": "I discussed the project with my colleague",  // Nullable
          "partOfSpeech": "noun"  // Nullable
        }
      ]
    }
  ],
  "sampleTexts": [
    {
      "id": 1,
      "title": "Formal Email Template",
      "content": "Dear [Name],\n\nI hope this email finds you well...",
      "sampleType": "template"  // Nullable
    }
  ]
}
```

---

### 4.4 CREATE TOPIC
**Endpoint:** `POST /api/topics`

**Headers:** `Authorization: Bearer <token>` (Manager/Admin role required)

**Request Body:**
```json
{
  "partId": 1,              // Required, integer
  "topicName": "string",    // Required, 1-200 characters
  "context": "string",      // Optional, max 1000 characters
  "purpose": "string",      // Optional, max 500 characters
  "recipientRole": "string", // Optional, max 100 characters
  "difficultyLevelId": 2    // Required, integer
}
```

**Success Response (201 Created):**
```json
{
  "id": 2,
  "partId": 1,
  "topicName": "Meeting Request",
  "context": "Scheduling workplace meetings",
  "purpose": "Request meeting with colleagues",
  "recipientRole": "Colleague",
  "difficultyLevelId": 2
}
```

---

## 🏥 HEALTH CHECK APIs

### 5.1 PING
**Endpoint:** `GET /api/ping`

**Success Response (200 OK):**
```json
{
  "message": "Pong",
  "timestamp": "2026-01-31T10:30:00Z",
  "service": "VSTEP Writing System API"
}
```

---

### 5.2 DATABASE HEALTH
**Endpoint:** `GET /api/health/db`

**Success Response (200 OK):**
```json
{
  "database": "connected",
  "message": "MySQL connection OK",
  "elapsedMs": 15,
  "userCount": 10,
  "timestamp": "2026-01-31T10:30:00Z"
}
```

**Error Response (503):**
```json
{
  "database": "disconnected",
  "message": "Cannot connect to database",
  "elapsedMs": 5000,
  "timestamp": "2026-01-31T10:30:00Z"
}
```

---

## ⚠️ ERROR RESPONSE FORMATS

### Validation Error (400 Bad Request)
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Username": ["Username is required", "Username must be at least 3 characters"],
    "Email": ["Email format is invalid"]
  }
}
```

### Authentication Error (401 Unauthorized)
```json
{
  "message": "Authentication required"
}
```

### Authorization Error (403 Forbidden)
```json
{
  "message": "Insufficient permissions"
}
```

### Not Found Error (404 Not Found)
```json
{
  "message": "Resource not found"
}
```

### Server Error (500 Internal Server Error)
```json
{
  "message": "An error occurred while processing your request"
}
```

---

## 📊 ENTITY ATTRIBUTES REFERENCE

### USER ENTITY
| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|-------|
| id | integer | Yes | Auto-generated | Primary key |
| name | string | Yes | 2-100 chars | User's full name |
| username | string | Yes | 3-50 chars, unique | Login identifier |
| email | string | Yes | Valid email, unique | Max 150 chars |
| phoneNumber | string | No | Valid phone format | Nullable |
| password | string | Yes (on create) | 8+ chars | Hashed in database |
| role | enum | Yes | Guest/User/Manager/Admin | Access control |
| targetLevelId | integer | No | References Level.id | Nullable |
| createdAt | datetime | Yes | Auto-generated | UTC timestamp |
| updatedAt | datetime | No | Auto-generated | UTC timestamp |
| isActive | boolean | Yes | true/false | Account status |

### TOPIC ENTITY
| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|-------|
| id | integer | Yes | Auto-generated | Primary key |
| partId | integer | Yes | References Part.id | Exam section |
| topicName | string | Yes | 1-200 chars | Topic title |
| context | string | No | Max 1000 chars | Background info |
| purpose | string | No | Max 500 chars | Writing objective |
| recipientRole | string | No | Max 100 chars | Target audience |
| difficultyLevelId | integer | Yes | References Level.id | Skill level |

### LEVEL ENTITY
| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|-------|
| id | integer | Yes | Auto-generated | Primary key |
| levelName | string | Yes | Unique | A1, A2, B1, B2, C1, C2 |
| description | string | No | Max 500 chars | Level details |

---

## 🔐 AUTHENTICATION FLOW

1. **Login**: Send credentials to `/api/auth/login`
2. **Store Token**: Save JWT token in localStorage/sessionStorage
3. **Use Token**: Add `Authorization: Bearer <token>` header to all protected requests
4. **Token Expiry**: Handle 401 responses by redirecting to login
5. **Token Refresh**: Use refresh endpoint before expiry (if implemented)

## 🛠️ FRONTEND IMPLEMENTATION TIPS

1. **Form Validation**: Implement client-side validation matching backend rules
2. **Error Handling**: Display user-friendly error messages from API responses
3. **Loading States**: Show spinners during API requests
4. **Token Management**: Auto-logout on 401 responses
5. **Pagination**: Implement client-side pagination using response metadata
6. **Search**: Debounce search input to reduce API calls
7. **Caching**: Cache static data like levels and topics

## 📱 RESPONSIVE DESIGN CONSIDERATIONS

- Input field lengths should match validation constraints
- Display validation errors in real-time
- Mobile-friendly forms with proper spacing
- Loading indicators for all async operations
- Offline handling for better UX