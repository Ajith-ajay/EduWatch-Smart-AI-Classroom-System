# 🚀 Quick Setup Guide - Rate Limiting & Audit Logging

## Installation & Setup

### Step 1: Run Database Migration

```bash
cd app/api

# Generate Prisma client
npx prisma generate

# Run the migration to create AuditLog table
npx prisma migrate deploy

# Or use the migration file directly
npx prisma migrate dev --name create_audit_log
```

### Step 2: Restart Your API Server

```bash
npm run start:dev
# or
npm run start:prod
```

You should see:
```
✅ API Server running on http://localhost:5000
✅ Rate Limiting: Enabled
✅ Audit Logging: Enabled
```

### Step 3: Verify Installation

#### Test Audit Logging:
```bash
# Make any request
curl -X GET http://localhost:5000/teachers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Check if it was logged (as admin)
curl -X GET http://localhost:5000/audit-logs \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### Test Rate Limiting:
```bash
# Make rapid requests to trigger rate limit
for i in {1..6}; do
  curl -X POST http://localhost:5000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test"}'
done

# The 6th request will return 429 (Too Many Requests)
```

---

## ⚙️ Configuration Quick Reference

### Rate Limit Settings
**File:** `src/common/guards/throttle.guard.ts`

Current limits:
- Login: 5 requests per 15 minutes
- Signup: 5 requests per 15 minutes
- Teachers: 50 requests per 15 minutes
- Default: 100 requests per 15 minutes

### Change Login Limits
```typescript
'/auth/login': { limit: 3, window: 10 * 60 * 1000 } // 3 per 10 min
```

---

## 📊 Admin Commands

### View All Logs
```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  "http://localhost:5000/audit-logs"
```

### View Logs for Specific User
```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  "http://localhost:5000/audit-logs?userId=5"
```

### View Logs in Date Range
```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  "http://localhost:5000/audit-logs?startDate=2026-03-01&endDate=2026-03-02"
```

### Get User Activity Summary
```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  "http://localhost:5000/audit-logs/user/5/summary"
```

### Get Logs for Specific Endpoint
```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  "http://localhost:5000/audit-logs/endpoint/%2Fteachers"
```

---

## 🔍 What Gets Logged?

✅ Every API call:
- Successful requests (200, 201, etc.)
- Failed requests (400, 401, 403, 404, 500, etc.)
- Rate limited requests (429)
- Auth endpoints (login, signup)
- All CRUD operations

**Captured Info:**
- User ID & Email
- HTTP Method & Endpoint
- Request/Response data (first 1000 chars)
- Status code & Execution time
- IP Address & User-Agent
- Error messages

---

## 🛑 Rate Limiting Response

When limit exceeded:

```json
HTTP/1.1 429 Too Many Requests

{
  "statusCode": 429,
  "message": "Too many requests. Please try again after 45 seconds",
  "retryAfter": 45
}
```

---

## 📁 New Files Created

```
src/
├── common/
│   ├── services/
│   │   └── audit-log.service.ts
│   ├── interceptors/
│   │   └── audit-log.interceptor.ts
│   ├── guards/
│   │   └── throttle.guard.ts
│   └── modules/
│       ├── audit-log.module.ts
│       └── throttle.module.ts
└── modules/
    └── audit-logs/
        ├── audit-logs.controller.ts
        └── audit-logs.module.ts

prisma/
└── migrations/
    └── 001_create_audit_log_table/
        └── migration.sql
```

---

## ✅ What's Implemented

- ✅ **Rate Limiting**
  - Per-endpoint configuration
  - User-ID and IP-based tracking
  - Automatic cleanup of expired entries
  - Custom limits per endpoint

- ✅ **Audit Logging**
  - Automatic logging of all requests
  - Request/response data capture
  - User & IP tracking
  - Error tracking
  - Admin viewing endpoints

---

## 🔒 Security Notes

1. **Audit logs require Admin role** - Only admins can view logs
2. **Rate limits apply to all users** - No bypassing for privileged users
3. **In-memory storage** - Use Redis for multi-server deployments
4. **Sensitive data** - First 1000 chars of request/response logged

---

## ⚠️ Common Issues & Solutions

### Issue: "AuditLog not defined" error
**Solution:** Run `npx prisma migrate dev`

### Issue: Rate limiter blocking too aggressively
**Solution:** Adjust limits in `src/common/guards/throttle.guard.ts`

### Issue: Audit logs growing too large
**Solution:** Implement log archival/rotation (TODO)

---

## 📞 Support

For detailed documentation, see:
- [RATE_LIMITING_AUDIT_LOGGING_GUIDE.md](./RATE_LIMITING_AUDIT_LOGGING_GUIDE.md)
- [SECURE_API_GUIDE.md](./SECURE_API_GUIDE.md)

---

**Next Steps:** Once you verify this works, we'll implement:
1. Role-Based Access Control (RBAC) with department filtering
2. Refresh Token Functionality
3. Two-Factor Authentication (2FA)
