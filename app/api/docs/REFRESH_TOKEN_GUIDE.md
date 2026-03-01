# 🔄 Refresh Token Functionality - Complete Guide

## Overview

Refresh tokens provide a secure way to extend user sessions without requiring users to re-enter their credentials multiple times. This is essential for long-running applications and mobile apps.

---

## The Problem (Before Refresh Tokens)

### Traditional JWT Flow (Single Token)
```
User logs in
    ↓
Server returns JWT access_token (24 hours validity)
    ↓
User makes requests with access_token
    ↓
After 24 hours: Access token expires
    ↓
User must log in again ❌ (Bad UX)
```

**Issues:**
- ❌ Users lose access after token expires
- ❌ Must remember password to log in again
- ❌ Bad user experience for long sessions
- ❌ Security: Long-lived tokens = higher theft risk

---

## The Solution (With Refresh Tokens)

### Dual-Token Flow (Access Token + Refresh Token)
```
User logs in
    ↓
Server returns 2 tokens:
1. access_token (15 min validity) - Short-lived, safe
2. refresh_token (7 days validity) - Longer-lived, securely stored
    ↓
User makes requests with access_token
    ↓
After 15 min: Access token expires
    ↓
App uses refresh_token to get new access_token (behind the scenes)
    ↓
No user intervention needed ✅ (Great UX)
    ↓
After 7 days: Refresh token expires
    ↓
User must log in again (reasonable timeframe) ✅
```

**Advantages:**
- ✅ Short access token window = lower theft risk
- ✅ Long refresh token duration = good UX
- ✅ Refresh happens automatically in background
- ✅ Can revoke all tokens (logout all devices)
- ✅ Most secure approach for web & mobile

---

## How It Works

### Step 1: Login
```bash
POST /auth/login

Request Body:
{
  "email": "teacher@school.com",
  "password": "SecurePassword123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900  // 15 minutes in seconds
}
```

**What happens behind the scenes:**
1. Password is validated
2. Access token created (15 min expiry)
3. Refresh token created (7 day expiry)
4. Refresh token stored in database
5. Both tokens returned to client

---

### Step 2: Making Requests
```bash
# Within 15 minutes - use access_token
GET /teachers

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response: 200 OK
[{ teacher data }]
```

---

### Step 3: Token Expiration & Refresh
```bash
# After 15 minutes - access token expired

# Client gets 401 Unauthorized response
GET /teachers
Response: 401 Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized"
}

# Client automatically calls refresh endpoint
POST /auth/refresh

Request Body:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900
}

# Client retries the original request with new access_token
GET /teachers
Response: 200 OK
[{ teacher data }]
```

---

### Step 4: Logout
```bash
# User clicks logout

POST /auth/logout

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Request Body:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "message": "Logged out successfully"
}
```

**What happens:**
1. Refresh token is marked as revoked in database
2. User's access token still valid until expiry
3. Next refresh attempt will fail (token revoked)

---

## Token Lifetimes

### Access Token
- **Lifetime:** 15 minutes
- **Used for:** Making API requests
- **Stored in:** Memory (typically)
- **Security:** Short-lived = lower risk if stolen
- **Example:** Used in `Authorization: Bearer <token>` header

### Refresh Token
- **Lifetime:** 7 days
- **Used for:** Getting new access tokens
- **Stored in:** HTTP-only cookie (secure) or local storage
- **Security:** Longer-lived but revocable
- **Example:** Used only when access token expires

### Timeline
```
Time: 0 min
├─ Get new access token (2 hour duration)
├─ Get new refresh token (7 day duration)
└─ Stored in database

Time: 15 min
├─ Access token: EXPIRED ❌
├─ Refresh token: VALID ✅ (6 days 23 hours left)
└─ Can call /auth/refresh

Time: 30 min
├─ Access token: EXPIRED ❌
├─ Refresh token: VALID ✅ (6 days 23 hours 45 min left)
└─ Can call /auth/refresh

Time: 7 days
├─ Access token: EXPIRED ❌
├─ Refresh token: EXPIRED ❌
└─ Must log in again
```

---

## API Endpoints

### 1. Login
```bash
POST /auth/login

Request:
{
  "email": "teacher@school.com",
  "password": "MyPassword123"
}

Response (200 OK):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900
}

Response (401 Unauthorized):
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### 2. Refresh Token
```bash
POST /auth/refresh

Request:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200 OK):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900
}

Response (401 Unauthorized):
{
  "statusCode": 401,
  "message": "Invalid refresh token"
}

Reasons for 401:
- Token doesn't exist in database
- Token expired
- Token was revoked (logged out)
```

### 3. Logout (Single Device)
```bash
POST /auth/logout

Headers:
Authorization: Bearer <access_token>

Request:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200 OK):
{
  "message": "Logged out successfully"
}
```

**What it does:**
- Revokes only the specific refresh token
- User can still use access token until it expires
- Other devices stay logged in (if they have different tokens)

---

### 4. Logout All Devices
```bash
POST /auth/logout-all-devices

Headers:
Authorization: Bearer <access_token>

Response (200 OK):
{
  "message": "Logged out from all devices"
}
```

**What it does:**
- Revokes ALL refresh tokens for this user
- Logs user out from all devices/browsers
- User access token still valid until expiry (~15 minutes)
- Then user must log in again from any device

---

## Security Features

### Database Storage
```
RefreshToken Table:
├─ id (primary key)
├─ userId (foreign key) - Which user owns this token
├─ token (unique) - The actual JWT token
├─ expiresAt - When token expires
├─ revokedAt - When token was revoked (NULL = not revoked)
└─ createdAt - When token was created

Indexes:
├─ userId - Fast lookup by user
├─ token - Fast lookup by token value
└─ For quick revocation checks
```

### Token Revocation
```
Logout Flow:
┌─────────────────────────────────┐
│ User clicks Logout              │
└─────────────────┬───────────────┘
                  ↓
┌─────────────────────────────────┐
│ POST /auth/logout               │
│ + refresh_token in body         │
└─────────────────┬───────────────┘
                  ↓
┌─────────────────────────────────┐
│ Update RefreshToken in DB       │
│ SET revokedAt = NOW()           │
└─────────────────┬───────────────┘
                  ↓
┌─────────────────────────────────┐
│ Next refresh attempt            │
│ Checks: WHERE revokedAt IS NULL │
│ Find: NULL = not revoked        │
│ Result: ❌ Token revoked!      │
└─────────────────────────────────┘
```

### Validation Checks
When refresh token is used, system checks:
1. ✅ Token exists in database
2. ✅ Token hasn't expired (expiresAt > now)
3. ✅ Token hasn't been revoked (revokedAt IS NULL)
4. ✅ User account still active (is_active = true)

If ANY check fails: **401 Unauthorized**

---

## Client Implementation

### React Example
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

let accessToken = null;
let refreshToken = null;

// Login
async function login(email: string, password: string) {
  const response = await api.post('/auth/login', {
    email,
    password
  });
  accessToken = response.data.access_token;
  refreshToken = response.data.refresh_token;
  
  // Save to localStorage (optional)
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

// Add token to requests automatically
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const response = await api.post('/auth/refresh', {
          refresh_token: refreshToken
        });
        
        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token;
        
        // Update localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - need to login again
        console.log('Session expired. Please login again.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Logout
async function logout() {
  if (refreshToken) {
    await api.post('/auth/logout', {
      refresh_token: refreshToken
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
  
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
```

### Flutter Example
```dart
import 'package:http/http.dart' as http;

class AuthService {
  String? _accessToken;
  String? _refreshToken;
  
  final String baseUrl = 'http://localhost:5000';
  
  // Login
  Future<void> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      _accessToken = data['access_token'];
      _refreshToken = data['refresh_token'];
      
      // Save to secure storage
      await _saveTokens();
    }
  }
  
  // Make API call with auto-refresh
  Future<http.Response> authenticatedRequest(
    String method,
    String endpoint,
  ) async {
    var response = await _makeRequest(method, endpoint);
    
    if (response.statusCode == 401) {
      // Try to refresh
      await _refreshAccessToken();
      
      // Retry request
      response = await _makeRequest(method, endpoint);
    }
    
    return response;
  }
  
  Future<http.Response> _makeRequest(
    String method,
    String endpoint,
  ) async {
    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $_accessToken',
    };
    
    final uri = Uri.parse('$baseUrl$endpoint');
    
    if (method == 'GET') {
      return http.get(uri, headers: headers);
    } else if (method == 'POST') {
      return http.post(uri, headers: headers);
    }
    // ... other methods
  }
  
  // Refresh access token
  Future<void> _refreshAccessToken() async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/refresh'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'refresh_token': _refreshToken,
      }),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      _accessToken = data['access_token'];
      _refreshToken = data['refresh_token'];
      await _saveTokens();
    } else {
      // Refresh failed - need to login again
      await logout();
    }
  }
  
  // Logout
  Future<void> logout() async {
    await http.post(
      Uri.parse('$baseUrl/auth/logout'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_accessToken',
      },
      body: jsonEncode({
        'refresh_token': _refreshToken,
      }),
    );
    
    _accessToken = null;
    _refreshToken = null;
    await _clearTokens();
  }
}
```

---

## Database Schema

### RefreshToken Table
```sql
CREATE TABLE "RefreshToken" (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expiresAt TIMESTAMP NOT NULL,
    revokedAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
    KEY idx_refresh_token_user_id (userId),
    KEY idx_refresh_token_token (token)
);
```

### User Table (Updated)
```sql
ALTER TABLE "User" ADD COLUMN refreshTokens RELATIONSHIP RefreshToken;
CREATE INDEX idx_user_email ON "User"(email);
```

---

## Common Scenarios

### Scenario 1: Normal Usage (7 Days)
```
Day 1 - 10:00 AM
├─ User logs in
├─ Gets access_token + refresh_token
└─ access_token expires at 10:15 AM

Day 1 - 10:30 AM
├─ access_token has expired
├─ App uses refresh_token → gets new access_token
├─ access_token expires at 10:45 AM
└─ User doesn't notice anything ✅

Day 7 - 10:00 AM
├─ refresh_token has expired
├─ App tries to refresh → fails
├─ User redirected to login
└─ User logs in again → gets new tokens
```

### Scenario 2: User on Vacation (8 Days Inactive)
```
Day 1
├─ User logs in
├─ Gets tokens
└─ Closes app

Day 8
├─ User opens app
├─ App tries to use old refresh_token
├─ Refresh token expired (7 days ago)
├─ User redirected to login
└─ User logs in again ✅
```

### Scenario 3: Suspicious Activity (Hacked Account)
```
Day 2 - 3:00 PM
├─ User realizes account compromised
├─ Clicks "Logout All Devices"
└─ ALL refresh tokens revoked

Day 2 - 3:15 PM
├─ Hacker tries to use stolen refresh_token
├─ Token check: revokedAt IS NOT NULL
├─ Refresh fails ✅
├─ Hacker's access expires in 15 minutes
└─ User safe!
```

### Scenario 4: Logout from One Device
```
Laptop
├─ User logs out
├─ Specific refresh_token revoked
└─ Laptop: Can't refresh anymore

Phone
├─ Still has different refresh_token
├─ Token not revoked
├─ Phone: Can still use app ✅
└─ User can continue on phone
```

---

## Configuration

### Token Lifetimes (Can be customized)
```typescript
// Access token: 15 minutes
const access_token = this.jwtService.sign(payload, {
  expiresIn: '15m',
});

// Refresh token: 7 days
const refresh_token = this.jwtService.sign(payload, {
  expiresIn: '7d',
});
```

### Custom Configuration
Edit `src/modules/auth/auth.service.ts`:
```typescript
// Change to 1 hour access token
expiresIn: '1h'

// Change to 30 days refresh token
expiresIn: '30d'
```

---

## Error Handling

### Common Errors

#### 401 - Invalid Refresh Token
```json
{
  "statusCode": 401,
  "message": "Invalid refresh token"
}
```
**Causes:**
- Token doesn't exist
- Token expired
- Token revoked

**Solution:** User must log in again

#### 401 - Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Cause:** Access token expired and not refreshed

**Solution:** Call `/auth/refresh` with refresh token

#### 400 - Refresh Token Required
```json
{
  "statusCode": 400,
  "message": "Refresh token is required"
}
```
**Cause:** No refresh token in request body

**Solution:**
```bash
POST /auth/refresh
{
  "refresh_token": "your_token_here"
}
```

---

## Testing

### Test 1: Normal Refresh Flow
```bash
# 1. Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@school.com","password":"pass123"}'

# Response:
# {
#   "access_token": "eyJhbGc...",
#   "refresh_token": "eyJhbGc...",
#   "expires_in": 900
# }

# 2. Use access token (should work)
curl -X GET http://localhost:5000/teachers \
  -H "Authorization: Bearer <access_token>"
# Response: 200 OK

# 3. Wait 15+ minutes (or mock time)
# access_token is now expired

# 4. Try to use expired access token (should fail)
curl -X GET http://localhost:5000/teachers \
  -H "Authorization: Bearer <access_token>"
# Response: 401 Unauthorized

# 5. Use refresh token to get new access token
curl -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "<refresh_token>"}'
# Response: New access_token + refresh_token

# 6. Use new access token (should work)
curl -X GET http://localhost:5000/teachers \
  -H "Authorization: Bearer <new_access_token>"
# Response: 200 OK ✅
```

### Test 2: Revoked Token
```bash
# 1. Login and get tokens
curl -X POST http://localhost:5000/auth/login \
  -d '{"email":"...","password":"..."}'
# Response: access_token + refresh_token

# 2. Logout
curl -X POST http://localhost:5000/auth/logout \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<refresh_token>"}'
# Response: 200 OK

# 3. Try to refresh (should fail)
curl -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<refresh_token>"}'
# Response: 401 Unauthorized
# Message: "Refresh token has been revoked" ✅
```

---

## Best Practices

✅ **DO:**
- Store refresh tokens securely (encrypted)
- Keep access tokens short-lived (15 mins)
- Keep refresh tokens longer (7+ days)
- Revoke all tokens on password change
- Auto-refresh access tokens in background
- Implement "logout all devices" feature
- Validate token signatures
- Check token expiration dates

❌ **DON'T:**
- Store refresh tokens in localStorage (plain text)
- Make access tokens too long (security risk)
- Store sensitive data in tokens
- Use same secret for access & refresh tokens
- Forget to revoke tokens on logout
- Send tokens in URL parameters

---

## Security Comparison

### Before (Single Token)
```
Access token: 24 hours validity
└─ Risk: If stolen, attacker has 24 hours access

After 24 hours:
└─ User must login again (bad UX)
```

### After (Dual Token)
```
Access token: 15 minutes validity
└─ Risk: If stolen, attacker has 15 minutes access (lower risk)

After 15 minutes:
└─ App uses refresh token to get new access token (auto)
└─ User doesn't notice anything (great UX)

After 7 days:
└─ Both tokens expire
└─ User must login again

Logout all devices:
└─ All 100+ refresh tokens revoked immediately
└─ User safe from account takeover
```

---

## Migration from Old System

If you had the old single-token system:

1. **Run migration:**
```bash
npx prisma migrate deploy
```

2. **Update auth service:** ✅ Already done

3. **Update clients:**
```javascript
// Old way (deprecated)
localStorage.setItem('token', response.data.access_token);

// New way (recommended)
localStorage.setItem('accessToken', response.data.access_token);
localStorage.setItem('refreshToken', response.data.refresh_token);
```

4. **Update API calls:** Use auto-refresh interceptor (see client examples above)

---

## Files Created/Modified

### New Files
- `src/modules/auth/dto/refresh-token.dto.ts`
- `src/modules/auth/strategies/refresh-token.strategy.ts`
- `src/modules/auth/guards/refresh-token.guard.ts`
- `prisma/migrations/002_create_refresh_token_table/migration.sql`

### Modified Files
- `src/modules/auth/auth.service.ts` - Added refresh logic
- `src/modules/auth/auth.controller.ts` - Added endpoints
- `src/modules/auth/auth.module.ts` - Added strategy & guard
- `prisma/schema.prisma` - Added RefreshToken model & relation

---

## Next Steps

After testing refresh tokens:
- ✅ Implement RBAC (Step 1) - Department-based filtering
- ✅ Implement 2FA (Step 3) - Two-factor authentication

---

**Status:** ✅ Refresh Tokens Complete - Ready for Testing
