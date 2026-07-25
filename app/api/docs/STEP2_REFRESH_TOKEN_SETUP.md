# 🔄 Refresh Token Implementation - Quick Setup

## ✅ What's Been Implemented

- ✅ Dual-token system (access + refresh)
- ✅ Database storage for refresh tokens
- ✅ Token revocation on logout
- ✅ Logout all devices feature
- ✅ Automatic token refresh endpoints
- ✅ Secure token validation

---

## 📋 Installation Steps

### Step 1: Update Environment Variables
Add to `.env` file:
```env
# Optional: Use separate secret for refresh tokens (more secure)
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Or it will fallback to JWT_SECRET
```

### Step 2: Run Database Migration
```bash
cd app/api

# Create Prisma client
npx prisma generate

# Run migration to create RefreshToken table
npx prisma migrate deploy

# Or manually run:
npx prisma migrate dev --name create_refresh_token
```

### Step 3: Restart API Server
```bash
npm run start:dev
```

You should see:
```
✅ API Server running on http://localhost:5000
✅ Rate Limiting: Enabled
✅ Audit Logging: Enabled
```

---

## 🔄 How Tokens Work

### Login Response (New)
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

**Token Lifetimes:**
- **Access token:** 15 minutes
- **Refresh token:** 7 days
- Both stored in database for validation

---

## 🌐 API Endpoints

### 1. Login (Existing, Updated)
```bash
POST /auth/login

Request:
{
  "email": "teacher@school.com",
  "password": "MyPassword123"
}

Response:
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

### 2. Refresh Token (NEW)
```bash
POST /auth/refresh

Request:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

### 3. Logout (NEW)
```bash
POST /auth/logout

Headers:
Authorization: Bearer <access_token>

Request:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "message": "Logged out successfully"
}
```

### 4. Logout All Devices (NEW)
```bash
POST /auth/logout-all-devices

Headers:
Authorization: Bearer <access_token>

Response:
{
  "message": "Logged out from all devices"
}
```

---

## 💻 Client Implementation

### JavaScript/React (Axios)
```typescript
const api = axios.create({ baseURL: 'http://localhost:5000' });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        const { data } = await api.post('/auth/refresh', {
          refresh_token: refreshToken
        });
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        error.config.headers.Authorization = `Bearer ${data.access_token}`;
        return api(error.config);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### Flutter/Dart
```dart
if (response.statusCode == 401) {
  final refreshResponse = await http.post(
    Uri.parse('$baseUrl/auth/refresh'),
    body: jsonEncode({'refresh_token': _refreshToken}),
  );
  
  if (refreshResponse.statusCode == 200) {
    final data = jsonDecode(refreshResponse.body);
    _accessToken = data['access_token'];
    _refreshToken = data['refresh_token'];
    // Retry original request with new token
    return authenticatedRequest(method, endpoint);
  } else {
    // Need to login again
    await logout();
  }
}
```

---

## 🧪 Testing

### Test 1: Login & Get Tokens
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.com",
    "password": "MyPassword123"
  }'

# Response includes:
# - access_token (15 min)
# - refresh_token (7 days)
```

### Test 2: Use Access Token
```bash
VER_TOKEN_FROM_ABOVE_RESPONSE

curl -X GET http://localhost:5000/teachers \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Response: 200 OK ✅
```

### Test 3: Refresh Token
```bash
REFRESH_TOKEN_FROM_LOGIN_RESPONSE

curl -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "'$REFRESH_TOKEN'"}'

# Response:
# - New access_token
# - New refresh_token
# - expires_in: 900
```

### Test 4: Logout
```bash
curl -X POST http://localhost:5000/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "'$REFRESH_TOKEN'"}'

# Response: "Logged out successfully"

# Now try to refresh (should fail):
curl -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "'$REFRESH_TOKEN'"}'

# Response: 401 Unauthorized
# Message: "Refresh token has been revoked"
```

---

## 🔐 Database Changes

### New Table: RefreshToken
Stores all issued refresh tokens with:
- `userId` - Which user owns token
- `token` - The JWT token
- `expiresAt` - When it expires
- `revokedAt` - When revoked (NULL = active)
- `createdAt` - When created

### Queries for Admins
```sql
-- Find all active sessions for user
SELECT * FROM "RefreshToken"
WHERE userId = 5 AND revokedAt IS NULL;

-- Find revoked tokens (logged out devices)
SELECT * FROM "RefreshToken"
WHERE userId = 5 AND revokedAt IS NOT NULL;

-- Find expired tokens
SELECT * FROM "RefreshToken"
WHERE expiresAt < NOW();

-- Find all users who are currently logged in
SELECT DISTINCT userId, COUNT(*) as device_count
FROM "RefreshToken"
WHERE revokedAt IS NULL AND expiresAt > NOW()
GROUP BY userId;
```

---

## 📊 Token Workflow Diagram

```
Login
  ↓
Generate access_token (15 min)
Generate refresh_token (7 days)
Store in DB
  ↓
Return both to client
  ↓
Client: Store access_token in memory
Client: Store refresh_token securely
  ↓
Make API requests with access_token
  ↓
After 15 minutes:
  access_token expires
  ↓
Client detects 401 error
  ↓
Client calls POST /auth/refresh
  with refresh_token
  ↓
Server validates refresh_token:
  ✓ Exists in DB
  ✓ Not expired
  ✓ Not revoked
  ↓
Generate new tokens
Store in DB
Return to client
  ↓
Client retries original request
  ↓
After 7 days:
  refresh_token expires
  ↓
User must login again
```

---

## 🎯 Key Features

| Feature | Benefit |
|---------|---------|
| Auto-refresh | Users don't need to re-login |
| Short-lived access token | Lower security risk if stolen |
| Long-lived refresh token | Good UX for regular users |
| Token revocation | Logout works immediately |
| Logout all devices | Revokes all tokens instantly |
| Database tracking | See who's logged in where |

---

## ⚠️ Common Issues & Solutions

### Issue: "Refresh token not found"
**Cause:** Token doesn't exist in database
**Solution:** Make sure migration ran: `npx prisma migrate deploy`

### Issue: "Refresh token has expired"
**Cause:** Refresh token older than 7 days
**Solution:** User must log in again

### Issue: "Refresh token has been revoked"
**Cause:** User logged out
**Solution:** User must log in again

### Issue: New tokens don't save to database
**Cause:** Migration didn't run
**Solution:** Run migration: `npx prisma migrate deploy`

---

## 🔒 Security Best Practices

✅ **Implemented:**
- Token stored in DB for validation
- Revocation flag for logout
- Separate token types (access vs refresh)
- Short access token lifespan
- Audit logging for all token operations

✅ **For Production:**
- Use different secrets for access & refresh tokens
- Store refresh tokens in HTTP-only cookies
- Implement token rotation (get new refresh token on refresh)
- Track token usage patterns
- Alert on unusual login patterns

---

## 📝 Files Changed

### New Files
```
src/modules/auth/dto/refresh-token.dto.ts
src/modules/auth/strategies/refresh-token.strategy.ts
src/modules/auth/guards/refresh-token.guard.ts
prisma/migrations/002_create_refresh_token_table/migration.sql
REFRESH_TOKEN_GUIDE.md
```

### Modified Files
```
src/modules/auth/auth.service.ts
src/modules/auth/auth.controller.ts
src/modules/auth/auth.module.ts
prisma/schema.prisma
```

---

## ✅ Verification Checklist

- [ ] Migration created
- [ ] RefreshToken table exists
- [ ] Server starts without errors
- [ ] Can login and get tokens
- [ ] Access token works for requests
- [ ] Refresh token refreshes access
- [ ] Logout revokes token
- [ ] Old token can't be used after logout
- [ ] Logout all devices works
- [ ] Tokens saved in database

---

## 📚 Complete Documentation

Read full details in [REFRESH_TOKEN_GUIDE.md](./REFRESH_TOKEN_GUIDE.md)

Topics covered:
- How refresh tokens work
- Real-world scenarios
- Client implementation (React, Flutter, etc.)
- Security features
- Database schema
- Testing procedures
- Best practices

---

## 🚀 Next Steps

1. **Test** the refresh token implementation
2. **Update clients** to use auto-refresh (see examples above)
3. **Ready for next step?** We can implement:
   - **Step 1:** RBAC with department filtering
   - **Step 3:** Two-Factor Authentication

---

**Status:** ✅ Refresh Tokens Complete - Ready for Testing

Run the migration and restart your server to get started!
