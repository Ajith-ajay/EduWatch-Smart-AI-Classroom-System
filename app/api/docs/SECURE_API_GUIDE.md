# Secure API Documentation

## Authentication Setup

Your NestJS API is now secured with JWT Bearer token authentication. All protected endpoints require a valid JWT token in the Authorization header.

## Getting Started

### 1. Register/Signup (No Authentication Required)

**Endpoint:** `POST /auth/signup`

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "confirm_password": "SecurePassword123",
    "institution": "My University",
    "admin_code": "ADMIN123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login (No Authentication Required)

**Endpoint:** `POST /auth/login`

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Protected Endpoints (Require JWT Token)

All the following endpoints require Bearer token authentication:

### 3. Create Teacher (Protected)

**Endpoint:** `POST /teachers`

```bash
curl -X POST http://localhost:3000/teachers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "full_name=Jane Smith" \
  -F "email=jane@school.com" \
  -F "subject=Mathematics" \
  -F "staff_image=@/path/to/image.jpg"
```

### 4. List All Teachers (Protected)

**Endpoint:** `GET /teachers`

```bash
curl -X GET http://localhost:3000/teachers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Update Teacher (Protected)

**Endpoint:** `PUT /teachers/:id`

```bash
curl -X PUT http://localhost:3000/teachers/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "full_name=Jane Smith Updated" \
  -F "subject=Physics" \
  -F "staff_image=@/path/to/new-image.jpg"
```

### 6. Delete Teacher (Protected)

**Endpoint:** `DELETE /teachers/:id`

```bash
curl -X DELETE http://localhost:3000/teachers/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## How to Use the Token

### In cURL:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3000/teachers
```

### In Postman:
1. Go to the **Authorization** tab
2. Select **Bearer Token** from the dropdown
3. Paste your JWT token in the **Token** field
4. Send your request

### In JavaScript/Axios:
```javascript
const response = await axios.get('http://localhost:3000/teachers', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### In Flutter/Dart:
```dart
final response = await http.get(
  Uri.parse('http://localhost:3000/teachers'),
  headers: {
    'Authorization': 'Bearer $token',
  },
);
```

---

## Token Details

- **Token Type:** JWT (JSON Web Token)
- **Secret Key:** Stored in `.env` as `JWT_SECRET`
- **Expiration:** 1 day (24 hours)
- **Payload includes:**
  - `sub`: User ID
  - `email`: User email
  - `role`: User role
  - `iat`: Issued at time
  - `exp`: Expiration time

---

## Error Responses

### Unauthorized (Missing or Invalid Token)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Forbidden (Bad Token)
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

---

## Files Modified/Created

1. **Created:** `src/modules/auth/strategies/jwt.strategy.ts` - JWT Strategy
2. **Created:** `src/modules/auth/guards/jwt-auth.guard.ts` - JWT Guard
3. **Created:** `src/modules/auth/decorators/current-user.decorator.ts` - Current User Decorator
4. **Updated:** `src/modules/auth/auth.module.ts` - Added exports and providers
5. **Updated:** `src/modules/teachers/teachers.controller.ts` - Added security guards
6. **Updated:** `src/modules/teachers/teachers.module.ts` - Added AuthModule import

---

## Security Best Practices

✅ **Now Implemented:**
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes with guards
- Token expiration (1 day)
- Environment variable for secret key

🔐 **Additional Recommendations:**
- Use HTTPS in production
- Keep JWT_SECRET secure and rotate periodically
- Implement rate limiting for auth endpoints
- Add role-based access control (RBAC) for different user types
- Implement refresh tokens for better security
- Use CORS properly in production
- Implement request validation using DTOs (already done with class-validator)

---

## Testing the API

### Step 1: Start your server
```bash
npm run start:dev
```

### Step 2: Signup a new user
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test@example.com","password":"Test123","confirm_password":"Test123","institution":"Test","admin_code":"ADMIN"}'
```

### Step 3: Copy the access_token from response and use it
```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3000/teachers
```

---

## Next Steps (Optional Enhancements)

1. Implement role-based access control (Admin, Teacher, Student)
2. Add refresh token functionality
3. Implement 2FA (Two-Factor Authentication)
4. Add API rate limiting
5. Create audit logs for all API calls
6. Implement email verification for signup
7. Add password reset functionality
