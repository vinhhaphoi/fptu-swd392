# VSTEP API Endpoint Reference

## 📋 Complete Endpoint List with Request/Response Specifications

---

## 🔐 AUTHENTICATION ENDPOINTS

### 1. LOGIN
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "string",    // Required (1-50 chars)
  "password": "string"     // Required (6-100 chars)
}
```

**Success Response (200):**
```json
{
  "token": "eyJ...",
  "userId": 123,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "User",
  "expiresAt": "2026-01-31T14:30:00Z"
}
```

**Error Response (401):**
```json
{
  "message": "Invalid username or password"
}
```

---

### 2. REGISTER
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "string",        // Required (2-100 chars)
  "username": "string",    // Required (3-50 chars, unique)
  "email": "string",       // Required (valid email, unique)
  "phoneNumber": "string", // Optional (valid phone format)
  "password": "string"     // Required (8-100 chars, complex)
}
```

**Success Response (200):**
```json
{
  "message": "User registered successfully"
}
```

**Error Response (400):**
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Username": ["Username is already taken"],
    "Email": ["Email format is invalid"]
  }
}
```

---

### 3. FORGOT PASSWORD
**POST** `/api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "string"        // Required (valid email)
}
```

**Success Response (200):**
```json
{
  "message": "If the email exists, a reset link has been sent."
}
```

---

### 4. RESET PASSWORD
**POST** `/api/auth/reset-password`

**Request Body:**
```json
{
  "token": "string",       // Required (reset token)
  "newPassword": "string"  // Required (8-100 chars, complex)
}
```

**Success Response (200):**
```json
{
  "message": "Password has been reset successfully."
}
```

**Error Response (400):**
```json
{
  "message": "Invalid or expired reset token"
}
```

---

## 👤 USER PROFILE ENDPOINTS

### 5. GET PROFILE
**GET** `/api/user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "id": 123,
  "name": "John Smith",
  "username": "john_smith",
  "email": "john@example.com",
  "role": "User",
  "targetLevelId": 2,
  "createdAt": "2026-01-31T10:00:00Z",
  "updatedAt": "2026-01-31T12:00:00Z",
  "isActive": true
}
```

**Error Response (401):**
```json
{
  "message": "Authentication required"
}
```

---

### 6. UPDATE PROFILE
**PUT** `/api/user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string",        // Required (2-100 chars)
  "email": "string",       // Required (valid email, unique)
  "phoneNumber": "string"  // Optional (valid phone format)
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully"
}
```

**Error Response (409):**
```json
{
  "message": "Email is already in use"
}
```

---

### 7. CHANGE PASSWORD
**POST** `/api/user/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "string",  // Required (6-100 chars)
  "newPassword": "string"       // Required (8-100 chars, complex)
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Response (400):**
```json
{
  "message": "Current password is incorrect"
}
```

---

## 👮 ADMIN USER MANAGEMENT

### 8. GET ALL USERS
**GET** `/api/admin/users`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer, default: 1)
- `pageSize` (integer, default: 10, max: 100)
- `search` (string, optional)
- `sortBy` (string, optional: name|email|createdAt|role)
- `sortOrder` (string, optional: asc|desc)

**Success Response (200):**
```json
{
  "items": [
    {
      "id": 123,
      "name": "John Smith",
      "username": "john_smith",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "role": "User",
      "targetLevelName": "B1",
      "practiceSessionCount": 5,
      "createdAt": "2026-01-31T10:00:00Z",
      "updatedAt": "2026-01-31T12:00:00Z",
      "isActive": true
    }
  ],
  "totalItems": 25,
  "currentPage": 1,
  "totalPages": 3,
  "pageSize": 10
}
```

**Error Response (403):**
```json
{
  "message": "Insufficient permissions"
}
```

---

### 9. GET USER BY ID
**GET** `/api/admin/users/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "id": 123,
  "name": "John Smith",
  "username": "john_smith",
  "email": "john@example.com",
  "role": "User",
  "targetLevelId": 2,
  "createdAt": "2026-01-31T10:00:00Z",
  "updatedAt": "2026-01-31T12:00:00Z",
  "isActive": true
}
```

**Error Response (404):**
```json
{
  "message": "User not found"
}
```

---

### 10. CREATE USER
**POST** `/api/admin/users`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string",           // Required (2-100 chars)
  "username": "string",       // Required (3-50 chars, unique)
  "email": "string",          // Required (valid email, unique)
  "phoneNumber": "string",    // Optional (valid phone format)
  "password": "string",       // Required (8-100 chars, complex)
  "role": "User",             // Required (Guest|User|Manager|Admin)
  "targetLevelId": 2,         // Optional (integer)
  "isActive": true            // Required (boolean)
}
```

**Success Response (201):**
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

---

### 11. UPDATE USER
**PUT** `/api/admin/users/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string",           // Required (2-100 chars)
  "username": "string",       // Required (3-50 chars, unique)
  "email": "string",          // Required (valid email, unique)
  "phoneNumber": "string",    // Optional (valid phone format)
  "role": "Manager",          // Required (Guest|User|Manager|Admin)
  "targetLevelId": 3,         // Optional (integer)
  "isActive": false           // Required (boolean)
}
```

**Success Response (200):**
```json
{
  "message": "User updated successfully"
}
```

---

### 12. DELETE USER
**DELETE** `/api/admin/users/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Response (400):**
```json
{
  "message": "Cannot delete admin users"
}
```

---

### 13. CHANGE USER PASSWORD
**POST** `/api/admin/users/{id}/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "newPassword": "string"     // Required (8-100 chars, complex)
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

## 📚 LEARNING RESOURCES

### 14. GET ALL LEVELS
**GET** `/api/levels`

**Success Response (200):**
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

### 15. GET LEVEL BY ID
**GET** `/api/levels/{id}`

**Success Response (200):**
```json
{
  "id": 2,
  "levelName": "B1",
  "description": "Intermediate level"
}
```

**Error Response (404):**
```json
{
  "message": "Level not found"
}
```

---

### 16. GET TOPICS BY PART
**GET** `/api/topics/by-part/{partId}`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "partId": 1,
    "topicName": "Email Writing",
    "context": "Business communication",
    "purpose": "Professional correspondence",
    "recipientRole": "Colleague",
    "difficultyLevelId": 2
  }
]
```

---

### 17. GET TOPIC BY ID
**GET** `/api/topics/{id}`

**Success Response (200):**
```json
{
  "id": 1,
  "partId": 1,
  "topicName": "Email Writing",
  "context": "Business communication",
  "purpose": "Professional correspondence",
  "recipientRole": "Colleague",
  "difficultyLevelId": 2
}
```

---

### 18. GET TOPIC LEARNING RESOURCES
**GET** `/api/topics/{id}/learning-resources/{levelId}`

**Success Response (200):**
```json
{
  "topicId": 1,
  "vocabularySets": [
    {
      "id": 1,
      "setName": "Business Vocabulary",
      "description": "Professional terms",
      "vocabularyItems": [
        {
          "id": 1,
          "word": "colleague",
          "definition": "a person with whom one works",
          "example": "I discussed the project with my colleague",
          "partOfSpeech": "noun"
        }
      ]
    }
  ],
  "sampleTexts": [
    {
      "id": 1,
      "title": "Formal Email Template",
      "content": "Dear [Name],\n\nI hope this email finds you well...",
      "sampleType": "template"
    }
  ]
}
```

---

### 19. GET TOPIC HINTS
**GET** `/api/topics/{id}/hints/{levelId}`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "hintText": "Start with a proper greeting",
    "hintType": "opening"
  }
]
```

---

### 20. CREATE TOPIC
**POST** `/api/topics`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "partId": 1,              // Required (integer)
  "topicName": "string",    // Required (1-200 chars)
  "context": "string",      // Optional (max 1000 chars)
  "purpose": "string",      // Optional (max 500 chars)
  "recipientRole": "string", // Optional (max 100 chars)
  "difficultyLevelId": 2    // Required (integer)
}
```

**Success Response (201):**
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

### 21. UPDATE TOPIC
**PUT** `/api/topics/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "partId": 1,
  "topicName": "string",
  "context": "string",
  "purpose": "string",
  "recipientRole": "string",
  "difficultyLevelId": 2
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "partId": 1,
  "topicName": "Updated Topic Name",
  "context": "Updated context",
  "purpose": "Updated purpose",
  "recipientRole": "Colleague",
  "difficultyLevelId": 2
}
```

---

### 22. DELETE TOPIC
**DELETE** `/api/topics/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (204):** No content

---

## 🏥 HEALTH CHECK ENDPOINTS

### 23. PING
**GET** `/api/ping`

**Success Response (200):**
```json
{
  "message": "Pong",
  "timestamp": "2026-01-31T10:30:00Z",
  "service": "VSTEP Writing System API"
}
```

---

### 24. DATABASE HEALTH
**GET** `/api/health/db`

**Success Response (200):**
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

### 25. SYSTEM HEALTH
**GET** `/api/health`

**Success Response (200):**
```json
{
  "status": "healthy",
  "environment": "Development",
  "database": "connected",
  "timestamp": "2026-01-31T10:30:00Z"
}
```

---

## 📊 HTTP STATUS CODES REFERENCE

| Code | Description | Typical Use |
|------|-------------|-------------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Validation errors, invalid data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resources (email/username) |
| 500 | Internal Server Error | Unexpected server errors |
| 503 | Service Unavailable | Database/connection issues |

## 🔐 AUTHORIZATION REQUIREMENTS

| Endpoint | Required Role | Header |
|----------|---------------|---------|
| `/api/auth/*` | None | None |
| `/api/user/*` | User+ | `Authorization: Bearer <token>` |
| `/api/admin/users/*` | Admin | `Authorization: Bearer <token>` |
| `/api/topics` (POST/PUT/DELETE) | Manager+ | `Authorization: Bearer <token>` |
| `/api/levels` | None | None |
| `/api/topics/*` (GET) | None | None |
| `/api/health/*` | None | None |