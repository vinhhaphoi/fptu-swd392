# VSTEP Writing System - API Documentation for Frontend

## 🚀 Quick Start Guide

### Base URL
```
http://localhost:5000
```

### Authentication Setup
1. **Get Token**: Call `/api/auth/login` with username/password
2. **Use Token**: Add to Authorization header for protected endpoints:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Token Expiry**: Tokens expire after 2 hours - use refresh endpoint or re-login

### How to Use This Documentation
- 📌 **Purpose**: Each API's main function
- 📥 **Input**: Required data fields and formats
- 📤 **Output**: Response structure
- 🔐 **Auth**: Required permissions
- ⚠️ **Errors**: Common error responses

### 📖 Using Swagger UI

**Access Swagger UI at:** `http://localhost:5000/swagger`

**Auto Token Configuration:**
1. Click the **"Authorize"** button ( 🔐 icon) in the top right
2. Enter your JWT token (without "Bearer " prefix)
3. Click **"Authorize"** and then **"Close"**
4. All protected endpoints will now automatically include your token

**Testing Endpoints:**
1. Expand any endpoint section
2. Click **"Try it out"**
3. Fill in required parameters/JSON body
4. Click **"Execute"**
5. View the response in the panel below

**Example Workflow:**
1. **Login**: `/api/auth/login` → Copy the token from response
2. **Authorize**: Paste token in Swagger Authorization
3. **Test Profile**: `/api/user/profile` → Should return your profile data
4. **Test Admin APIs**: Only works if you have Admin role

## 📊 Data Types Reference
| Type | Description | Example |
|------|-------------|---------|
| **string** | Text values | `"john_doe"` |
| **int** | Integer numbers | `123` |
| **bool** | Boolean values | `true` / `false` |
| **DateTime** | ISO 8601 format | `"2026-01-31T10:30:00Z"` |
| **Role** | User role enum | `"User"`, `"Manager"`, `"Admin"` |

---

## 1. 🔐 Authentication APIs (`/api/auth`)

> **Purpose**: Handle user authentication, registration, and password management

### 1.1 Login
**POST** `/api/auth/login`

📌 **Purpose**: Authenticate user and receive JWT token for subsequent requests

📥 **Input Requirements**:
| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| username | string | ✅ Yes | 1-50 characters | `"john_doe"` |
| password | string | ✅ Yes | 6-100 characters | `"SecurePass123!"` |

📤 **Successful Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Use this for Authorization header
  "userId": 123,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "User",           // Use for UI permission checks
  "expiresAt": "2026-01-31T12:00:00Z"  // Token expiry time
}
```

🔧 **Usage Example**:
```javascript
// Frontend login implementation
const login = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  if (response.ok) {
    const data = await response.json();
    // Store token in localStorage or secure cookie
    localStorage.setItem('token', data.token);
    return data;
  }
};
```

🔐 **Auth Required**: No
⚠️ **Common Errors**:
- 400: Invalid username/password format
- 401: Invalid credentials

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "token": "string",           // JWT token
  "userId": 1,
  "username": "string",
  "email": "string",
  "role": "string",            // "User", "Manager", "Admin"
  "expiresAt": "2026-01-31T12:00:00Z"
}
```

### 1.2 Register
**POST** `/api/auth/register`

📌 **Purpose**: Create a new user account (automatically assigned "User" role)

📥 **Input Requirements**:
| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| name | string | ✅ Yes | 2-100 characters | `"John Smith"` |
| username | string | ✅ Yes | 3-50 characters, unique | `"john_smith"` |
| email | string | ✅ Yes | Valid email format, unique | `"john@example.com"` |
| phoneNumber | string | ❌ No | Valid phone format | `"+1234567890"` |
| password | string | ✅ Yes | 6-100 characters | `"SecurePass123!"` |

📤 **Successful Response (200 OK)**:
```json
{
  "message": "User registered successfully"
}
```

🔧 **Usage Example**:
```javascript
const register = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (response.ok) {
    return { success: true, message: 'Account created successfully' };
  }
};
```

🔐 **Auth Required**: No
⚠️ **Common Errors**:
- 400: Validation errors (duplicate email/username, invalid format)
- 409: Username or email already exists

**Request Body:**
```json
{
  "name": "string",
  "username": "string",
  "email": "string",
  "phoneNumber": "string",     // Optional
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "message": "User registered successfully"
}
```

### 1.3 Validate Token
**POST** `/api/auth/validate`

**Headers Required:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "isValid": true,
  "userId": 1,
  "username": "string",
  "role": "string"
}
```

### 1.4 Forgot Password
**POST** `/api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "string"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset email sent"
}
```

### 1.5 Reset Password
**POST** `/api/auth/reset-password`

**Request Body:**
```json
{
  "token": "string",           // Reset token from email
  "newPassword": "string"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

### 1.6 Refresh Token
**POST** `/api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200 OK):**
```json
{
  "token": "string",
  "refreshToken": "string"
}
```

---

## 2. 👤 User Profile APIs (`/api/user`)

> **Purpose**: Manage authenticated user's profile, settings, and personal data

### 2.1 Get Current User Profile
**GET** `/api/user/profile`

📌 **Purpose**: Retrieve the authenticated user's complete profile information

📥 **Input Requirements**:
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: None

📤 **Successful Response (200 OK)**:
```json
{
  "id": 123,
  "name": "John Smith",
  "username": "john_smith",
  "email": "john@example.com",
  "role": "User",              // Determines UI permissions
  "targetLevelId": 2,          // Current learning level
  "createdAt": "2026-01-31T10:00:00Z",
  "updatedAt": "2026-01-31T11:00:00Z",
  "isActive": true
}
```

🔧 **Usage Example**:
```javascript
const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/user/profile', {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    }
  });
  
  if (response.ok) {
    return await response.json();
  }
};
```

🔐 **Auth Required**: Yes (User role minimum)
⚠️ **Common Errors**:
- 401: Missing or invalid token
- 403: Insufficient permissions

**Headers Required:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "string",
  "username": "string",
  "email": "string",
  "role": "User",              // Enum: Guest/User/Manager/Admin
  "targetLevelId": 1,          // Nullable
  "createdAt": "2026-01-31T10:00:00Z",
  "updatedAt": "2026-01-31T11:00:00Z",  // Nullable
  "isActive": true
}
```

### 2.2 Update Profile
**PUT** `/api/user/profile`

📌 **Purpose**: Update the authenticated user's profile information

📥 **Input Requirements**:
| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| name | string | ✅ Yes | 2-100 characters | `"John Smith"` |
| email | string | ✅ Yes | Valid email format | `"john.new@example.com"` |
| phoneNumber | string | ❌ No | Valid phone format | `"+1987654321"` |

📤 **Successful Response (200 OK)**:
```json
{
  "message": "Profile updated successfully"
}
```

🔧 **Usage Example**:
```javascript
const updateProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(profileData)
  });
  
  return response.ok;
};
```

🔐 **Auth Required**: Yes (User role minimum)
⚠️ **Common Errors**:
- 400: Validation errors
- 401: Invalid token
- 409: Email already in use

**Headers Required:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phoneNumber": "string"      // Optional
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully"
}
```

### 2.3 Change Password
**POST** `/api/user/change-password`

**Headers Required:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

### 2.4 Get Practice History
**GET** `/api/user/practice-history?limit=10`

**Headers Required:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 10)

**Response (200 OK):**
```json
{
  "message": "Practice history endpoint - implementation pending",
  "userId": 1,
  "limit": 10
}
```
*Note: Implementation pending*

### 2.5 Get User Statistics
**GET** `/api/user/statistics`

**Headers Required:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "User statistics endpoint - implementation pending",
  "userId": 1
}
```
*Note: Implementation pending*

### 2.6 Role-based Test Endpoints
**GET** `/api/user/user-only` - Accessible to User, Manager, Admin  
**GET** `/api/user/manager-only` - Accessible to Manager, Admin  
**GET** `/api/user/admin-only` - Accessible to Admin only  

**Headers Required:** `Authorization: Bearer <token>`

---

## 3. 👮 Admin User Management (`/api/admin/users`)

> **Purpose**: Admin-only APIs for managing all users in the system with full CRUD operations

### 3.1 Get All Users
**GET** `/api/admin/users?page=1&pageSize=10&search=john&sortBy=name&sortOrder=asc`

**Headers Required:** `Authorization: Bearer <token>` (Admin role required)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)
- `search` (optional): Search term for name/username/email
- `sortBy` (optional): Field to sort by (name, email, createdAt, etc.)
- `sortOrder` (optional): asc or desc (default: asc)

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": 1,
      "name": "string",
      "username": "string",
      "email": "string",
      "phoneNumber": "string",     // Nullable
      "role": "User",              // Enum: Guest/User/Manager/Admin
      "targetLevelName": "string", // Nullable
      "practiceSessionCount": 0,
      "createdAt": "2026-01-31T10:00:00Z",
      "updatedAt": "2026-01-31T11:00:00Z",  // Nullable
      "isActive": true
    }
  ],
  "totalItems": 25,
  "currentPage": 1,
  "totalPages": 3,
  "pageSize": 10
}
```

### 3.2 Get User By ID
**GET** `/api/admin/users/{id}`

**Headers Required:** `Authorization: Bearer <token>` (Admin role required)

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "string",
  "username": "string",
  "email": "string",
  "role": "User",                // Enum: Guest/User/Manager/Admin
  "targetLevelId": 1,            // Nullable
  "createdAt": "2026-01-31T10:00:00Z",
  "updatedAt": "2026-01-31T11:00:00Z",  // Nullable
  "isActive": true
}
```

### 3.3 Create User
**POST** `/api/admin/users`

**Headers Required:** `Authorization: Bearer <token>` (Admin role required)

**Request Body:**
```json
{
  "name": "string",
  "username": "string",
  "email": "string",
  "phoneNumber": "string",       // Optional
  "password": "string",
  "role": "User",                // Enum: Guest/User/Manager/Admin
  "targetLevelId": 1,            // Optional
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "string",
  "username": "string",
  "email": "string",
  "role": "User",
  "targetLevelId": 1,
  "createdAt": "2026-01-31T10:00:00Z",
  "updatedAt": null,
  "isActive": true
}
```

### 3.4 Update User
**PUT** `/api/admin/users/{id}`

**Headers Required:** `Authorization: Bearer <token>` (Admin role required)

**Request Body:**
```json
{
  "name": "string",
  "username": "string",
  "email": "string",
  "phoneNumber": "string",       // Optional
  "role": "User",                // Enum: Guest/User/Manager/Admin
  "targetLevelId": 1,            // Optional
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "message": "User updated successfully"
}
```

### 3.5 Delete User
**DELETE** `/api/admin/users/{id}`

**Headers Required:** `Authorization: Bearer <token>` (Admin role required)

**Response (204 No Content)**

### 3.6 Change User Password
**POST** `/api/admin/users/{id}/change-password`

**Headers Required:** `Authorization: Bearer <token>` (Admin role required)

**Request Body:**
```json
{
  "newPassword": "string"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

---

## 4. 📚 Learning Resources APIs

> **Purpose**: Manage topics, learning resources, and educational content for VSTEP writing practice

### 4.1 Get All Levels
**GET** `/api/levels`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "levelName": "string",
    "description": "string"
  }
]
```

### 4.2 Get Level By ID
**GET** `/api/levels/{id}`

**Response (200 OK):**
```json
{
  "id": 1,
  "levelName": "string",
  "description": "string"
}
```

### 4.3 Get Topics By Part
**GET** `/api/topics/by-part/{partId}`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "partId": 1,
    "topicName": "string",
    "context": "string",         // Nullable
    "purpose": "string",         // Nullable
    "recipientRole": "string",   // Nullable
    "difficultyLevelId": 1
  }
]
```

### 4.4 Get Topic By ID
**GET** `/api/topics/{id}`

**Response (200 OK):**
```json
{
  "id": 1,
  "partId": 1,
  "topicName": "string",
  "context": "string",           // Nullable
  "purpose": "string",           // Nullable
  "recipientRole": "string",     // Nullable
  "difficultyLevelId": 1
}
```

### 4.5 Get Topic Learning Resources
**GET** `/api/topics/{id}/learning-resources/{levelId}`

**Response (200 OK):**
```json
{
  "topicId": 1,
  "vocabularySets": [
    {
      "id": 1,
      "setName": "string",
      "description": "string",     // Nullable
      "vocabularyItems": [
        {
          "id": 1,
          "word": "string",
          "definition": "string",
          "example": "string",     // Nullable
          "partOfSpeech": "string" // Nullable
        }
      ]
    }
  ],
  "sampleTexts": [
    {
      "id": 1,
      "title": "string",
      "content": "string",
      "sampleType": "string"       // Nullable
    }
  ]
}
```

### 4.6 Get Topic Hints
**GET** `/api/topics/{id}/hints/{levelId}`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "hintText": "string",
    "hintType": "string"           // Enum value
  }
]
```

### 4.7 Create Topic
**POST** `/api/topics`

**Headers Required:** `Authorization: Bearer <token>` (Manager or Admin role required)

**Request Body:**
```json
{
  "partId": 1,
  "topicName": "string",
  "context": "string",           // Optional
  "purpose": "string",           // Optional
  "recipientRole": "string",     // Optional
  "difficultyLevelId": 1
}
```

**Response (201 Created):**
Returns the created topic object

### 4.8 Update Topic
**PUT** `/api/topics/{id}`

**Headers Required:** `Authorization: Bearer <token>` (Manager or Admin role required)

**Request Body:**
```json
{
  "partId": 1,
  "topicName": "string",
  "context": "string",           // Optional
  "purpose": "string",           // Optional
  "recipientRole": "string",     // Optional
  "difficultyLevelId": 1
}
```

**Response (200 OK):**
Returns the updated topic object

### 4.9 Delete Topic
**DELETE** `/api/topics/{id}`

**Headers Required:** `Authorization: Bearer <token>` (Admin role required)

**Response (204 No Content)**

---

## 5. 🏥 Health Check APIs (`/api`)

> **Purpose**: Monitor system health and database connectivity

### 5.1 Ping
**GET** `/api/ping`

**Response (200 OK):**
```json
{
  "message": "Pong",
  "timestamp": "2026-01-31T10:30:00Z",
  "service": "VSTEP Writing System API"
}
```

### 5.2 Database Health Check
**GET** `/api/health/db`

**Response (200 OK):**
```json
{
  "database": "connected",
  "message": "MySQL connection OK",
  "elapsedMs": 15,
  "userCount": 10,
  "timestamp": "2026-01-31T10:30:00Z"
}
```

**Response (503 Service Unavailable):**
```json
{
  "database": "disconnected",
  "message": "Cannot connect to database",
  "elapsedMs": 5000,
  "timestamp": "2026-01-31T10:30:00Z"
}
```

### 5.3 Overall Health
**GET** `/api/health`

**Response (200 OK):**
```json
{
  "status": "healthy",           // or "degraded"
  "environment": "Development",  // or "Production"
  "database": "connected",       // or "disconnected"
  "timestamp": "2026-01-31T10:30:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error details"
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "An error occurred while processing your request"
}
```

---

## Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **Guest** | Limited access, mostly public endpoints |
| **User** | Full access to learning resources, practice sessions, profile management |
| **Manager** | All User permissions + create/update topics, manage content |
| **Admin** | All Manager permissions + user management, system administration |

---

## 🎯 Implementation Status

✅ **Completed APIs:**
- Authentication (Login, Register, Validate, Forgot Password, Reset Password, Refresh)
- User Profile Management
- Admin User Management
- Learning Resources (Levels, Topics, Learning Resources, Hints)
- Health Checks

⏳ **Pending Implementation:**
- Practice Sessions
- User Submissions
- AI Evaluation
- Dashboard Statistics
- Exam Structures
- Part Types
- Practice Modes

## 🛠️ Development Notes

**For Frontend Developers:**
1. **Token Storage**: Store JWT in `localStorage` or `sessionStorage`
2. **Token Refresh**: Implement auto-refresh before expiry
3. **Error Handling**: Check for 401/403 responses and redirect to login
4. **Loading States**: Show loading indicators during API calls
5. **Validation**: Validate input before sending to backend

**For API Testing:**
1. Use Swagger UI for quick testing
2. Use Postman for complex scenarios
3. Test all error cases (400, 401, 403, 404, 500)
4. Verify data validation rules
5. Test pagination and search functionality

---

## Notes for Frontend Developers

1. **Token Management**: Store the JWT token securely (e.g., HTTP-only cookie or localStorage)
2. **Authorization Header**: Always include `Authorization: Bearer <token>` for protected endpoints
3. **Error Handling**: Implement proper error handling for 401/403 responses (redirect to login)
4. **Pagination**: Admin user list supports pagination - implement accordingly
5. **Search & Sort**: Admin user list supports search and sorting parameters
6. **Role Checking**: Use the `role` field from AuthResponse to determine UI permissions
7. **Date Handling**: All dates are in ISO 8601 format - use appropriate date parsing libraries