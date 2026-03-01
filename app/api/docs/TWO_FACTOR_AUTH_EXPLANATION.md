# 🔐 Two-Factor Authentication (2FA) - Deep Explanation

## What is Authentication?

**Authentication** = Proving you are who you say you are

**Problem with password-only authentication:**
- Passwords can be stolen, guessed, or leaked
- One piece of evidence = one point of failure
- Anyone with the password can access the account

## Single-Factor vs Multi-Factor Authentication

### Single-Factor (Traditional)
```
User enters: Username & Password
    ↓
System checks: Is password correct?
    ↓
YES → Access granted ✅
NO  → Access denied ❌
```

**Risk:** If password is leaked, attacker gets full access

### Two-Factor (2FA)
```
Step 1 - User enters: Username & Password
             ↓
         System checks: Is password correct?
             ↓
         YES → Continue to Step 2

Step 2 - System asks: Enter your 6-digit code from your phone
             ↓
         User provides: Code from authenticator app
             ↓
         System checks: Is code valid?
             ↓
         YES → Access granted ✅
         NO  → Access denied ❌
```

**Advantage:** Even if password leaked, attacker still needs your phone!

---

## The Two Factors

### Factor 1: "Something You Know"
- Your password
- Your PIN
- Your security questions
- **Your responsibility to keep secret**

### Factor 2: "Something You Have" (or know)
Most common options:

#### Option A: Phone-based Code (TOTP)
- **App:** Google Authenticator, Authy, Microsoft Authenticator
- **How:** App generates 6-digit code every 30 seconds
- **Example:**
  ```
  Current code: 847293 (expires in 10 seconds)
  Next code:   521648 (will be valid in 10 seconds)
  ```
- **Advantage:** Works offline, no internet needed
- **Disadvantage:** Need to install app, backup codes if lost

#### Option B: SMS Text Message
- **Method:** System sends 6-digit code via SMS
- **Example:**
  ```
  "EduWatch verification code: 483921"
  ```
- **Advantage:** Works with any phone, no app needed
- **Disadvantage:** Cloud-based, requires internet/cell service
- **Security Note:** Can be intercepted but still adds security

#### Option C: Email Code
- **Method:** System sends 6-digit code via email
- **Example:**
  ```
  "Your EduWatch login code: 295847"
  ```
- **Advantage:** Works without phone number, uses existing contact
- **Disadvantage:** Requires email access (another password!)

---

## How 2FA Works Step-by-Step

### Day 1: Enabling 2FA

```
1. User goes to security settings
2. Clicks "Enable 2FA"
3. System shows QR code (encoded secret key)
4. User scans QR code with authenticator app
5. App shows 6-digit code
6. User enters 6-digit code to verify app works
7. System generates 8 backup codes 
8. User saves backup codes in safe place ✅
9. 2FA is now ENABLED
```

### Day 2: Login with 2FA

```
Step A: Standard Login
┌─────────────────────────────────┐
│ EduWatch Login                  │
├─────────────────────────────────┤
│ Email: teacher@school.com       │
│ Password: ••••••••••••••       │
└───────────────┬─────────────────┘
                ↓
            Submit
                ↓
        Server checks password
                ↓
            ✅ Correct!
                ↓
    Proceed to Step B

Step B: 2FA Verification
┌─────────────────────────────────┐
│ 2FA Verification                │
├─────────────────────────────────┤
│ Check your phone for a code     │
│                                 │
│ Enter 6-digit code: [847293 ]   │
│                                 │
│ Don't have your phone?          │
│ [Use backup code instead]       │
└───────────────┬─────────────────┘
                ↓
            Submit
                ↓
        Server checks code
                ↓
        ✅ Code is valid!
                ↓
        Access Granted ✅
```

---

## Backup Codes: Your Safety Net

**Problem:** What if you lose your phone?

**Solution:** Backup codes

### What are Backup Codes?

8 single-use codes generated when 2FA is enabled:

```
1. ABCD-1234
2. EFGH-5678
3. IJKL-9012
4. MNOP-3456
5. QRST-7890
6. UVWX-2345
7. XYZA-6789
8. BCDE-0123
```

**Key Points:**
- ✅ One-time use (used = deleted)
- ✅ Work without phone
- ✅ Print and store in safe place
- ⚠️ If you use all 8, you need new ones
- ⚠️ If lost, write down new ones

**Example:**
```
Lost your phone? Use backup code:
ABCD-1234
↓
System marks it as used
↓
Can't use ABCD-1234 again
↓
Still have 7 more backups
↓
Lost another backup? Generate new set
```

---

## 2FA Methods Comparison

| Feature | TOTP App | SMS | Email |
|---------|----------|-----|-------|
| **Requires Phone** | Yes | Yes | No |
| **Requires Internet** | No | No | Yes |
| **App Needed** | Yes | No | No |
| **Works Offline** | Yes | No | No |
| **Fastest Method** | ~5 sec | ~10 sec | ~30 sec |
| **Most Secure** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Cost** | Free | SMS charges | Free |

---

## Real-World Example: Teacher Login

### Day 1: Setting Up 2FA

```
Teacher (Ahmed) wants to enable 2FA:

Step 1: Go to Settings → Security
Step 2: Click "Enable Two-Factor Authentication"
Step 3: Choose method: "Google Authenticator"
Step 4: Scan QR code with phone
Step 5: App shows: 847293
Step 6: Enter 847293 in browser
Step 7: System confirms ✅
Step 8: Print backup codes
        - ABCD-1234
        - EFGH-5678
        - etc.

Ahmed saves codes in safe place (drawer, wallet, encrypted file)
Ahmed's account is now protected with 2FA ✅
```

### Day 2: Ahmed Logs In

```
Ahmed opens EduWatch at school:

Step 1: Enters email: ahmed@school.com
Step 2: Enters password: MySecurePassword123
Step 3: System verifies password ✅
Step 4: System asks: "Check your phone for a 6-digit code"

Ahmed looks at phone:
- Opens Google Authenticator
- Finds "EduWatch"
- Sees code: 521648
- Code expires in: 15 seconds ⏱️

Step 5: Ahmed enters 521648
Step 6: System verifies code ✅
Step 7: Ahmed logged in successfully ✅

Ahmed can now:
- View dashboard
- Take attendance
- Download reports
- View audit logs (if admin)
```

### Scenario: Ahmed Lost His Phone

```
Ahmed's phone is stolen 😱

Ahmed logs in to EduWatch at home:
Step 1: Email: ahmed@school.com
Step 2: Password: MySecurePassword123 ✅
Step 3: System asks for 2FA code

Ahmed doesn't have phone! What to do?

Step 4: Ahmed clicks "Don't have your phone?"
Step 5: Ahmed selects "Use backup code"
Step 6: Ahmed opens drawer, finds backup codes
Step 7: Ahmed enters: ABCD-1234

System marks ABCD-1234 as used ✅
Ahmed logged in successfully ✅

Ahmed now needs to:
1. Go to Security Settings
2. Disable 2FA (since phone is stolen)
3. Generate new backup codes
4. Optional: Get new phone and re-setup 2FA
```

---

## Security Comparison

### Scenario: Attacker Steals Password

#### Without 2FA:
```
Attacker gets password
        ↓
Logs in successfully ❌
        ↓
Accesses all data
        ↓
Changes password
        ↓
Original user locked out
```

#### With 2FA:
```
Attacker gets password
        ↓
Tries to log in
        ↓
System asks for 2FA code
        ↓
Attacker doesn't have the code ✅
        ↓
Login denied
        ↓
Password alone is useless
        ↓
Teacher's account stays safe
```

---

## 2FA Implementation for EduWatch

### What We'll Add

#### 1. Setup Endpoint
```bash
POST /auth/2fa/setup

Request:
{
  "method": "totp"  OR "sms" OR "email"
}

Response:
{
  "secret": "JBSWY3DPEBLW64TMMQ======",
  "qrCode": "data:image/png;base64,...",
  "backupCodes": ["ABCD-1234", "EFGH-5678", ...]
}
```

#### 2. Verify 2FA Code
```bash
POST /auth/2fa/verify

Request:
{
  "code": "847293"
}

Response:
{
  "access_token": "eyJhbGc...",
  "message": "2FA verification successful"
}
```

#### 3. Backup Code Login
```bash
POST /auth/2fa/use-backup

Request:
{
  "backupCode": "ABCD-1234"
}

Response:
{
  "access_token": "eyJhbGc...",
  "message": "Backup code used successfully"
}
```

#### 4. Disable 2FA
```bash
POST /auth/2fa/disable

Request:
{
  "password": "MySecurePassword"  // Verify identity
}

Response:
{
  "message": "2FA disabled successfully"
}
```

### Login Flow Change

**Current Flow:**
```
POST /auth/login
    ↓
{email, password}
    ↓
Verify password
    ↓
Return access_token ✅
```

**New Flow with 2FA:**
```
POST /auth/login
    ↓
{email, password}
    ↓
Verify password
    ↓
Check: Is 2FA enabled?
    ↓
YES → Return {needsAuth: true, sessionId: "xyz"}
      User must call POST /auth/2fa/verify with code
    ↓
NO  → Return {access_token: "..."}
```

---

## Database Schema Changes

### Add 2FA Fields to User Model

```prisma
model User {
  id              Int     @id @default(autoincrement())
  email           String  @unique
  password        String
  role            String  @default("teacher")
  admin_code      String
  
  // 2FA fields
  twoFactorSecret String?           // Secret for TOTP
  twoFactorMethod String?           // "totp" | "sms" | "email"
  twoFactorEnabled Boolean @default(false)
  phone           String?           // For SMS method
  backupCodes     String?           // JSON array of backup codes
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model TwoFactorSession {
  id              String  @id @default(cuid())
  userId          Int
  isVerified      Boolean @default(false)
  expiresAt       DateTime
  createdAt       DateTime @default(now())
}
```

---

## Session Management with 2FA

### When 2FA is Enabled

```
User submits password
    ↓
Create temporary session (5 min expiry)
    ↓
Return: {
  "partial": true,
  "sessionId": "sess_abc123",
  "message": "Enter 2FA code"
}
    ↓
User enters 2FA code
    ↓
Verify code against session
    ↓
If valid: Return full access_token
If invalid: Return 401, sessionId expires
```

---

## Phishing Protection

2FA also protects against phishing attacks:

```
Attacker creates fake login page: "school-portal-fake.com"

Teacher accidentally visits it:
Step 1: Enters email
Step 2: Enters password
Step 3: Attacker has email & password ❌

But 2FA saves the day! ✅

Even though attacker has password, they need:
- Your phone with authenticator app
- Your backup codes
- Your phone number (for SMS method)

All of which attacker doesn't have!

Teacher should be suspicious that they're being asked for 2FA
on a random website and will realize it's a phishing attempt
```

---

## Recovery Procedures

### Lost Phone
```
1. Contact admin
2. Admin verifies identity
3. Admin generates new backup codes
4. User logs in with backup code
5. User re-setup 2FA with new phone
```

### All Backup Codes Used
```
1. Log in with password alone (if allowed)
2. Go to Settings → 2FA
3. Click "Generate new backup codes"
4. Print new codes and save
```

### Completely Locked Out
```
1. Contact admin with proof of identity
2. Admin verifies you're the real teacher
3. Admin temporarily disables 2FA
4. You log in with password
5. You re-enable 2FA
```

---

## 2FA Best Practices

✅ **DO:**
- Enable 2FA on all accounts
- Write down backup codes
- Store backup codes in safe place
- Use TOTP app (most secure)
- Review login activity regularly

❌ **DON'T:**
- Share 2FA codes with anyone
- Screenshot backup codes
- Store backup codes in email
- Use SMS as only method
- Disable 2FA completely

---

## Comparison: Why TOTP is Best (We'll Use This)

### TOTP (Time-based One-Time Password)
```
How it works:
1. Shared secret stored in app & database
2. Current time + secret = 6-digit code
3. Code changes every 30 seconds
4. No network needed
5. Same code on your phone & server at same time

Example timeline:
Time: 12:00:00 + Secret = Code 847293 (valid)
Time: 12:00:15 + Secret = Code 847293 (still valid - same 30-sec window)
Time: 12:00:30 + Secret = Code 521648 (now valid)
Time: 12:01:00 + Secret = Code 521648 (expired)

Advantages:
✅ Works offline
✅ No text messages needed
✅ No email dependency
✅ Most secure
✅ Widely supported (Google Auth, Authy, etc.)
✅ Free
```

---

## Implementation Timeline

When we implement 2FA for EduWatch:

**Week 1:**
- Add database schema changes
- Create TOTP secret generation
- Create backup code system
- Build 2FA setup endpoint

**Week 2:**
- Build 2FA verification endpoint
- Create backup code login
- Update login flow to handle 2FA
- Create disable 2FA endpoint

**Week 3:**
- Add 2FA enforcement rules (optional for teachers, required for admins)
- Create admin dashboard to view 2FA status
- Add recovery procedures
- Testing & documentation

---

## Real Vulnerabilities It Prevents

1. **Credential Stuffing**
   - Attacker uses password from another site
   - Without 2FA: Attacker gets in ❌
   - With 2FA: Attack blocked ✅

2. **Phishing**
   - Attacker tricks teacher into entering password on fake site
   - Without 2FA: Account compromised ❌
   - With 2FA: Still needs phone/codes ✅

3. **Weak Password**
   - Teacher uses "password123"
   - Without 2FA: Easy to guess ❌
   - With 2FA: Guessing password + brute forcing 2FA = nearly impossible ✅

4. **Database Breach**
   - Attacker gets password database
   - Without 2FA: All passwords compromised ❌
   - With 2FA: Even with password, can't access account ✅

---

## Summary

| Aspect | Without 2FA | With 2FA |
|--------|------------|----------|
| Single password stolen | ❌ Account compromised | ✅ Account safe |
| Phishing attack | ❌ Account compromised | ✅ Account safe |
| Brute force | ❌ Risky | ✅ Virtually impossible |
| Compliance | ❌ Low security | ✅ High security (meets GDPR, HIPAA) |
| User Experience | ✅ Simple | ⚠️ One extra step |

---

## When We Implement 2FA

You'll have:
- ✅ Passwords (factor 1)
- ✅ Authenticator codes (factor 2)
- ✅ Backup codes (recovery)
- ✅ Admin controls
- ✅ Login audit trail
- ✅ Highest security level

This will protect your teacher and student data from even sophisticated attacks!

---

**Next Step:** Ready to implement RBAC, refresh tokens, and 2FA?
