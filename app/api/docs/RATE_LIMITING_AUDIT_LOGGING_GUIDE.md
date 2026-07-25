# Rate Limiting & Audit Logging Implementation Guide

## Overview

Your NestJS API now has two critical security features implemented:

1. **Rate Limiting** - Prevents abuse by limiting the number of requests per endpoint
2. **Audit Logging** - Tracks all API calls for compliance, debugging, and security monitoring

---

## 🚦 RATE LIMITING

### What is Rate Limiting?

Rate limiting restricts the number of requests a client can make to an API within a specified time window. This prevents:
- Brute force attacks (especially on login)
- DDoS attacks
- Resource exhaustion
- API abuse

### How It Works

The `ThrottleGuard` tracks requests by:
- **User ID** (if authenticated)
- **IP Address** (if not authenticated)

Each identifier has separate limits, so one user's limit doesn't affect another.

### Default Configuration

| Endpoint | Limit | Time Window |
|----------|-------|-------------|
| `/auth/login` | 5 requests | 15 minutes |
| `/auth/signup` | 5 requests | 15 minutes |
| `/teachers` | 50 requests | 15 minutes |
| Other endpoints | 100 requests | 15 minutes |

### Customizing Rate Limits

Edit `src/common/guards/throttle.guard.ts`:

```typescript
private readonly ENDPOINT_LIMITS: Record<string, { limit: number; window: number }> = {
  '/auth/login': { limit: 5, window: 15 * 60 * 1000 },
  '/your-endpoint': { limit: 10, window: 5 * 60 * 1000 }, // 10 requests per 5 minutes
};
```

### Error Response

When rate limit is exceeded:

```json
{
  "statusCode": 429,
  "message": "Too many requests. Please try again after 45 seconds",
  "retryAfter": 45
}
```

### Testing Rate Limiting

```bash
# This will succeed
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/teachers

# Repeat 50+ times, then this will fail with 429
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/teachers
```

---

## 📋 AUDIT LOGGING

### What is Audit Logging?

Audit logging automatically records ALL API calls, including:
- Who made the request
- What endpoint was called
- When it happened
- Request and response data
- Execution time
- Any errors that occurred

### Fields Logged

| Field | Description |
|-------|-------------|
| `userId` | ID of authenticated user |
| `userEmail` | Email of authenticated user |
| `method` | HTTP method (GET, POST, PUT, DELETE) |
| `endpoint` | API endpoint path |
| `statusCode` | HTTP response status code |
| `requestBody` | Request payload (first 1000 chars) |
| `responseBody` | Response data (first 1000 chars) |
| `ipAddress` | Client IP address |
| `userAgent` | Browser/client info |
| `errorMessage` | Error message (if request failed) |
| `executionTime` | How long the request took (ms) |
| `createdAt` | Timestamp of the request |

### Examples

#### Example 1: Successful Request
```json
{
  "id": 1,
  "userId": 5,
  "userEmail": "teacher@example.com",
  "method": "GET",
  "endpoint": "/teachers",
  "statusCode": 200,
  "responseBody": "[{\"id\":1,\"full_name\":\"Jane Smith\"}]",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "errorMessage": null,
  "executionTime": 125,
  "createdAt": "2026-03-01T10:30:45.123Z"
}
```

#### Example 2: Failed Request (Unauthorized)
```json
{
  "id": 2,
  "userId": null,
  "userEmail": null,
  "method": "POST",
  "endpoint": "/teachers",
  "statusCode": 401,
  "requestBody": "{\"full_name\":\"John\"}",
  "ipAddress": "192.168.1.200",
  "userAgent": "curl/7.64.1",
  "errorMessage": "Unauthorized",
  "executionTime": 45,
  "createdAt": "2026-03-01T10:31:12.456Z"
}
```

#### Example 3: Rate Limited Request
```json
{
  "id": 3,
  "userId": 5,
  "userEmail": "teacher@example.com",
  "method": "POST",
  "endpoint": "/auth/login",
  "statusCode": 429,
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "errorMessage": "Too many requests. Please try again after 45 seconds",
  "executionTime": 12,
  "createdAt": "2026-03-01T10:32:00.789Z"
}
```

---

## 🔍 AUDIT LOG API ENDPOINTS

All audit log endpoints require **Admin role** and **JWT authentication**.

### 1. Get All Audit Logs (Paginated)

**Endpoint:** `GET /audit-logs`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50, max: 500)
- `userId` (optional, filter by user ID)
- `startDate` (optional, ISO date string)
- `endDate` (optional, ISO date string)

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:5000/audit-logs?page=1&limit=100&userId=5"
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "userId": 5,
      "userEmail": "teacher@example.com",
      "method": "GET",
      "endpoint": "/teachers",
      "statusCode": 200,
      "executionTime": 125,
      "createdAt": "2026-03-01T10:30:45.123Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 2500,
    "totalPages": 25
  }
}
```

### 2. Get Logs by Endpoint

**Endpoint:** `GET /audit-logs/endpoint/:endpoint`

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:5000/audit-logs/endpoint/%2Fteachers?limit=50"
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 5,
    "method": "GET",
    "endpoint": "/teachers",
    "statusCode": 200,
    "executionTime": 125,
    "createdAt": "2026-03-01T10:30:45.123Z"
  },
  { ... more logs ... }
]
```

### 3. Get User Activity Summary

**Endpoint:** `GET /audit-logs/user/:userId/summary`

Shows comprehensive summary of a user's API activity.

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:5000/audit-logs/user/5/summary"
```

**Response:**
```json
{
  "totalRequests": 245,
  "successfulRequests": 240,
  "failedRequests": 5,
  "averageResponseTime": 156,
  "recentActivity": [
    {
      "id": 245,
      "method": "GET",
      "endpoint": "/teachers",
      "statusCode": 200,
      "executionTime": 125,
      "createdAt": "2026-03-01T10:30:45.123Z"
    },
    { ... more recent activity ... }
  ]
}
```

---

## 📊 USE CASES & EXAMPLES

### Use Case 1: Track Failed Login Attempts

```bash
# Find all failed login attempts
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:5000/audit-logs/endpoint/%2Fauth%2Flogin" | grep statusCode=401
```

### Use Case 2: Monitor Suspicious User Activity

```bash
# Get summary for a specific user to check for suspicious patterns
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:5000/audit-logs/user/12/summary"

# If failedRequests is too high, investigate further
```

### Use Case 3: Performance Analysis

```bash
# Get recent logs with execution times
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:5000/audit-logs?limit=100" \
  | jq '.data[] | {endpoint, executionTime, statusCode}'
```

### Use Case 4: Compliance & Audit Trail

```bash
# Get all activity for a date range
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:5000/audit-logs?startDate=2026-03-01&endDate=2026-03-02"
```

---

## 🔧 CONFIGURATION & CUSTOMIZATION

### 1. Change Rate Limit Window

**File:** `src/common/guards/throttle.guard.ts`

```typescript
private readonly DEFAULT_WINDOW = 10 * 60 * 1000; // Change from 15 to 10 minutes
```

### 2. Set Different Limits per Endpoint

```typescript
private readonly ENDPOINT_LIMITS: Record<string, { limit: number; window: number }> = {
  '/auth/login': { limit: 3, window: 5 * 60 * 1000 }, // 3 requests per 5 min
  '/teachers': { limit: 100, window: 15 * 60 * 1000 }, // 100 requests per 15 min
  '/audit-logs': { limit: 200, window: 15 * 60 * 1000 }, // 200 requests per 15 min
};
```

### 3. Exclude Endpoints from Rate Limiting

Coming in next update - add `@SkipThrottle()` decorator to endpoints

### 4. Use Redis for Production

The current implementation uses in-memory storage. For production with multiple servers:

```typescript
// TODO: Integrate Redis
// import { createClient } from 'redis';
// const redisClient = createClient();
```

---

## 🛡️ SECURITY BEST PRACTICES

✅ **Implemented:**
- Rate limiting per user/IP
- Comprehensive audit logging
- Admin-only access to audit logs
- Error tracking
- IP & User-Agent logging

🔐 **Recommended Next Steps:**
1. Implement optional Redis for distributed rate limiting
2. Add email alerts for suspicious activity
3. Set up log rotation/archival for old logs
4. Create dashboard for audit log visualization
5. Add 2FA to admin-level endpoints
6. Implement log encryption for sensitive data

---

## 📈 MONITORING & ALERTS

### High Rate of Failed Requests
```sql
-- Check for users with high failure rate
SELECT userId, COUNT(*) as failed_count
FROM "AuditLog"
WHERE statusCode >= 400
AND "createdAt" > NOW() - INTERVAL '1 hour'
GROUP BY userId
HAVING COUNT(*) > 10
ORDER BY failed_count DESC;
```

### Unusual IP Access Pattern
```sql
-- Find unusual IP addresses
SELECT ipAddress, COUNT(*) as request_count
FROM "AuditLog"
WHERE "createdAt" > NOW() - INTERVAL '1 hour'
GROUP BY ipAddress
HAVING COUNT(*) > 500
ORDER BY request_count DESC;
```

### Slow Endpoints
```sql
-- Find slow endpoints
SELECT endpoint, AVG(executionTime) as avg_time, MAX(executionTime) as max_time
FROM "AuditLog"
WHERE "createdAt" > NOW() - INTERVAL '24 hours'
GROUP BY endpoint
ORDER BY avg_time DESC;
```

---

## 🧪 TESTING

### Test Rate Limiting with Postman

1. Open Postman
2. Create a request to `http://localhost:5000/teachers`
3. Add Authorization header: `Bearer YOUR_TOKEN`
4. Click **Send** multiple times rapidly
5. After the limit is reached, you'll get a 429 error

### Test Audit Logging

1. Make any API call (with or without auth)
2. Call `GET /audit-logs` as admin
3. Verify your request is logged with all details

---

## 📝 FILES CREATED/MODIFIED

**New Files:**
- `src/common/services/audit-log.service.ts` - Audit logging service
- `src/common/interceptors/audit-log.interceptor.ts` - Request interceptor
- `src/common/guards/throttle.guard.ts` - Rate limiting guard
- `src/common/modules/audit-log.module.ts` - Audit log module
- `src/common/modules/throttle.module.ts` - Throttle module
- `src/modules/audit-logs/` - Admin endpoints for viewing logs

**Modified Files:**
- `src/app.module.ts` - Added new modules
- `src/main.ts` - Global guards & interceptors
- `prisma/schema.prisma` - Added AuditLog model

---

## 🚀 NEXT STEPS

After completing this, we'll implement:
1. **Role-Based Access Control** - Department-based filtering
2. **Refresh Tokens** - Extended session management
3. **2FA** - Two-factor authentication
