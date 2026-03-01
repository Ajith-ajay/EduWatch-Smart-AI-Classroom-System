# 🚀 Deployment & Testing Guide - Step 2 Complete

**Status:** ✅ All code implemented, ready for testing
**Time to Deploy:** ~5 minutes
**Difficulty:** Easy

---

## 📋 Pre-Deployment Checklist

Before running migrations, verify:

- [ ] PostgreSQL running and accessible
- [ ] API code updated (auth.service.ts, auth.controller.ts, etc.)
- [ ] `.env` file has `DATABASE_URL` set
- [ ] NodeJS and npm installed
- [ ] In project directory: `app/api/`

---

## 🚀 Deployment Steps

### Step 1: Generate Prisma Client (2 min)

```bash
cd app/api

# Generate Prisma client for database access
npx prisma generate

# Output should show:
# ✔ Generated Prisma Client ...
```

### Step 2: Run Database Migrations (1 min)

```bash
# Deploy all pending migrations
npx prisma migrate deploy

# Output should show:
# ✔ Migrations applied successfully
# Migrations applied:
# ├ 001_create_audit_log_table
# ├ 002_create_refresh_token_table
# └ ...
```

**What this does:**
- Creates `AuditLog` table (Step 5)
- Creates `RefreshToken` table (Step 2)
- Sets up proper indexes and foreign keys
- Adds columns to `User` table

### Step 3: Restart API Server (1 min)

```bash
npm run start:dev

# Expected output:
# [Nest] 12345  - 01/15/2024, 10:30:45 AM     LOG [NestFactory] Starting Nest application...
# [Nest] 12345  - 01/15/2024, 10:30:46 AM     LOG [InstanceLoader] AuthModule dependencies initialized
# [Nest] 12345  - 01/15/2024, 10:30:47 AM     LOG [InstanceLoader] AuditLogModule dependencies initialized
# [Nest] 12345  - 01/15/2024, 10:30:47 AM     LOG [InstanceLoader] ThrottleModule dependencies initialized
# [Nest] 12345  - 01/15/2024, 10:30:48 AM     LOG [NestApplication] Nest application successfully started
# ✅ API Server running on http://localhost:5000
```

If you see errors about missing `RefreshToken`, run:
```bash
npx prisma migrate resolve --rolled-back
npx prisma migrate deploy
```

---

## 🧪 Testing the Implementation

### Test 1: Create Test Account (If Needed)

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.com",
    "password": "SecurePass123!"
  }'

# Response:
# {
#   "message": "Account created successfully",
#   "user": {
#     "id": 1,
#     "email": "teacher@school.com"
#   }
# }
```

### Test 2: Login & Get Tokens ✅ CRITICAL

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.com",
    "password": "SecurePass123!"
  }'

# Response (SAVE THESE VALUES):
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "token_type": "Bearer",
#   "expires_in": 900
# }
```

**Save to variables for testing:**
```bash
export ACCESS_TOKEN="eyJhbGc..."   # From response above
export REFRESH_TOKEN="eyJhbGc..."  # From response above
```

### Test 3: Use Access Token on Protected Endpoint

```bash
curl -X GET http://localhost:5000/teachers \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected: 200 OK with teacher list
# If you get 401, the token might have expired
```

### Test 4: Refresh Token (MAIN TEST)

```bash
# Test refreshing the token
curl -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "'$REFRESH_TOKEN'"
  }'

# Response:
# {
#   "access_token": "eyJhbGc... (NEW TOKEN)",
#   "refresh_token": "eyJhbGc... (NEW TOKEN)",
#   "expires_in": 900
# }

# Save the new tokens:
export NEW_ACCESS_TOKEN="eyJhbGc..."
export NEW_REFRESH_TOKEN="eyJhbGc..."
```

### Test 5: Verify New Token Works

```bash
curl -X GET http://localhost:5000/teachers \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN"

# Expected: 200 OK
# Proves: Token refresh is working!
```

### Test 6: Logout (Single Device)

```bash
curl -X POST http://localhost:5000/auth/logout \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "'$NEW_REFRESH_TOKEN'"
  }'

# Response:
# {
#   "message": "Logged out successfully"
# }
```

### Test 7: Verify Token Revoked (Cannot Use Old Token)

```bash
# Try to use the revoked refresh token
curl -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "'$NEW_REFRESH_TOKEN'"
  }'

# Expected Response (401 Unauthorized):
# {
#   "statusCode": 401,
#   "message": "Refresh token has been revoked or does not exist",
#   "error": "Unauthorized"
# }

# This proves: Logout successfully revoked the token! ✅
```

### Test 8: Login From Second Device

```bash
# Login again to simulate second device
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.com",
    "password": "SecurePass123!"
  }'

# Get new tokens for "device 2"
export DEVICE2_ACCESS=$(...response access_token...)
export DEVICE2_REFRESH=$(...response refresh_token...)

# Verify this device still works
curl -X GET http://localhost:5000/teachers \
  -H "Authorization: Bearer $DEVICE2_ACCESS"

# Expected: 200 OK (still logged in on device 2)
```

### Test 9: Logout All Devices

```bash
curl -X POST http://localhost:5000/auth/logout-all-devices \
  -H "Authorization: Bearer $DEVICE2_ACCESS"

# Response:
# {
#   "message": "Logged out from all devices successfully"
# }

# Now both device 1 and device 2 should be logged out
```

### Test 10: Verify All Devices Logged Out

```bash
# Try old refresh token
curl -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "'$NEW_REFRESH_TOKEN'"}'

# Expected: 401 Unauthorized

# Try device 2 refresh token
curl -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "'$DEVICE2_REFRESH'"}'

# Expected: 401 Unauthorized
# Proves: All devices logged out! ✅
```

---

## ✅ Testing Summary

| Test | Command | Expected | Status |
|------|---------|----------|--------|
| Login | POST /auth/login | 200 + tokens | `[ ]` |
| Access Token | GET /teachers + Bearer | 200 + data | `[ ]` |
| Refresh Token | POST /auth/refresh | 200 + new tokens | `[ ]` |
| New Token Works | GET /teachers + new Bearer | 200 + data | `[ ]` |
| Logout | POST /auth/logout | 200 + message | `[ ]` |
| Old Token Invalid | POST /auth/refresh + old token | 401 | `[ ]` |
| Device 2 Login | POST /auth/login | 200 + tokens | `[ ]` |
| Logout All | POST /auth/logout-all-devices | 200 + message | `[ ]` |
| All Revoked | POST /auth/refresh + any old token | 401 | `[ ]` |

---

## 📊 Database Verification

### Check Tokens in Database

```bash
# Open PostgreSQL
psql -U postgres -d eduwatch

# View all refresh tokens
SELECT id, "userId", "token", "expiresAt", "revokedAt", "createdAt" 
FROM "RefreshToken" 
ORDER BY "createdAt" DESC LIMIT 5;

# View active sessions (not revoked, not expired)
SELECT "userId", COUNT(*) as active_sessions
FROM "RefreshToken"
WHERE "revokedAt" IS NULL AND "expiresAt" > NOW()
GROUP BY "userId";

# View audit logs
SELECT id, "userId", method, endpoint, status, "executionTime", "createdAt"
FROM "AuditLog"
ORDER BY "createdAt" DESC LIMIT 10;
```

---

## 🔍 Troubleshooting

### Issue: "RefreshToken table does not exist"

```bash
# Check if migration ran
npx prisma migrate status

# If status says "Pending migrations", run:
npx prisma migrate deploy

# If still issues:
npx prisma migrate reset --force
npm run start:dev
```

### Issue: "Cannot find token in database"

```bash
# Check if RefreshToken table exists:
SELECT * FROM "RefreshToken" LIMIT 1;

# If error: Table doesn't exist, run migration again:
npx prisma migrate deploy

# Check Prisma schema has RefreshToken model:
# File: src/prisma/schema.prisma
# Should contain:
#   model RefreshToken {
#     id        Int     @id @default(autoincrement())
#     userId    Int
#     token     String  @unique
#     ...
#   }
```

### Issue: Tokens not being saved to database

```bash
# Check auth.service.ts line where tokens are generated
# Should have:
#   const refreshTokenRecord = await this.prisma.refreshToken.create({
#     data: {
#       userId: user.id,
#       token: refreshToken,
#       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
#     },
#   });

# Verify Prisma client is connected
# Add console.log in auth.service.ts to debug
```

### Issue: "401 Unauthorized" on all requests

```bash
# Check JWT_SECRET is set in .env:
echo $JWT_SECRET

# Check auth.module.ts has correct secret:
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '15m' },
})

# Verify token format in Authorization header:
Authorization: Bearer eyJhbGc...
# (Word "Bearer" + space + token)
```

### Issue: Rate limiting errors (429 Too Many Requests)

This is actually good - it means rate limiting is working!

```bash
# Limits are:
# Auth endpoints: 5 requests per 15 minutes
# Teachers endpoints: 50 requests per 15 minutes
# Default: 100 requests per 15 minutes

# To test with fewer requests:
# Wait 15 minutes, OR
# Restart the server (clears in-memory limits)
npm run start:dev
```

---

## 🎯 Expected Results After Deployment

### Server Startup
```
✅ API Server running on http://localhost:5000
✅ Database connected
✅ Migrations applied
✅ Rate Limiting: Enabled
✅ Audit Logging: Enabled
```

### Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVhY2hlckBzY2hvb2wuY29tIiwiaWF0IjoxNzA1Mjc0NjQ4LCJleHAiOjE3MDUyNzQ3NDgsInR5cGUiOiJhY2Nlc3MifQ.x2En5Z9KJ3K2dF8T9Q0X5H7M2L1P8R4V6W2X9Y1Z2A",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVhY2hlckBzY2hvb2wuY29tIiwiaWF0IjoxNzA1Mjc0NjQ4LCJleHAiOjE3MDY0ODAwNDgsInR5cGUiOiJyZWZyZXNoIn0.k3Lm9Qp2R5S8T1U4V7W9X2Y3Z5A8B0C1D2E3F4G5H",
  "token_type": "Bearer",
  "expires_in": 900
}
```

### Refresh Response
```json
{
  "access_token": "eyJhbGci... (NEW)",
  "refresh_token": "eyJhbGci... (NEW)",
  "token_type": "Bearer",
  "expires_in": 900
}
```

### Protected Endpoint Works
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@school.com",
      "subject": "Mathematics"
    },
    ...
  ],
  "total": 15
}
```

---

## 🔐 Security Validation

After deployment, verify:

- ✅ **Access Token Expires:** After 15 minutes, GET /teachers returns 401
- ✅ **Refresh Token Works:** POST /auth/refresh returns new tokens
- ✅ **Logout Revokes Token:** After logout, refresh returns 401
- ✅ **Passwords Hashed:** login works but password visible in database should be hashed
- ✅ **Rate Limiting Works:** 6 logins in 15 min returns 429
- ✅ **Audit Logs Recorded:** GET /audit-logs shows all API calls
- ✅ **Tokens in Database:** SELECT from RefreshToken table returns stored tokens
- ✅ **Foreign Key Enforced:** Deleting user should cascade delete refresh tokens

---

## ✨ Next Steps

### Option 1: Update Client Applications
- React/Vue/Angular: Add axios interceptor for auto-refresh
- Flutter/Mobile: Add token refresh logic
- See: [REFRESH_TOKEN_GUIDE.md](./REFRESH_TOKEN_GUIDE.md)

### Option 2: Implement RBAC (Step 1)
- Department filtering based on admin_code
- Role-specific endpoints
- See: [RBAC_EXAMPLE.md](./src/modules/auth/RBAC_EXAMPLE.md)

### Option 3: Implement 2FA (Step 3)
- TOTP setup and verification
- Backup codes
- See: [TWO_FACTOR_AUTH_EXPLANATION.md](./TWO_FACTOR_AUTH_EXPLANATION.md)

### Option 4: Production Deployment
- Change `npm run start:dev` to `npm run build && npm start`
- Set production environment variables
- Increase token expiry times for better UX
- Enable HTTPS/TLS

---

## 📞 Quick Reference

**Port:** `5000`
**API Base:** `http://localhost:5000`

**Endpoints:**
- `POST /auth/signup` - New account
- `POST /auth/login` - Get tokens
- `POST /auth/refresh` - New access token
- `POST /auth/logout` - Logout one device
- `POST /auth/logout-all-devices` - Logout all

**Token Times:**
- Access: 15 minutes
- Refresh: 7 days

**Rate Limits:**
- Auth: 5/15min
- Teachers: 50/15min
- Default: 100/15min

---

## ✅ Completion Checklist

- [ ] Ran `npx prisma migrate deploy`
- [ ] Server started without errors
- [ ] Created test account (signup)
- [ ] Logged in (got tokens)
- [ ] Accessed protected endpoint with access token
- [ ] Refreshed token successfully
- [ ] Verified new token works
- [ ] Tested logout
- [ ] Confirmed old token invalid
- [ ] Checked database for tokens
- [ ] Verified audit logs recorded
- [ ] Ready for client integration

---

**Status:** 🚀 Ready to Deploy!
**Time Estimate:** 5 minutes setup + 15 minutes testing
**Difficulty:** Easy

Good luck! You now have enterprise-grade token management! 🎉
