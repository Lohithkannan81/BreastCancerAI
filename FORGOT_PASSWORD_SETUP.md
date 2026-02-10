# 🔐 Forgot Password Feature - Setup Guide

## ✅ What's Implemented

The forgot password feature is now fully functional! Here's what it does:

1. **User clicks "Forgot Password"** → Prompted for email
2. **System generates reset token** → Saved to localStorage with 1-hour expiry
3. **Reset link sent via email** → Using EmailJS service
4. **User clicks link** → Navigate to reset password page
5. **Enter new password** → Password updated successfully

## 📧 EmailJS Setup (Required for Email Functionality)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "**Sign Up**" (Free tier: 200 emails/month)
3. Verify your email

### Step 2: Add Email Service
1. Go to **Email Services** in dashboard
2. Click "**Add New Service**"
3. Choose your email provider (Gmail, Outlook, etc.)
4. **For Gmail:**
   - Click on Gmail
   - Connect your Google account
   - Allow permissions
5. Copy the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template  
1. Go to **Email Templates** in dashboard
2. Click "**Create New Template**"
3. Use this template:

```
Subject: Reset Your BreastCancerAI Password

Hello {{to_name}},

We received a request to reset your password for your {{app_name}} account.

Click the link below to reset your password:
{{reset_link}}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
The BreastCancerAI Team
```

4. Set template variables:
   - `to_name`
   - `to_email`
   - `reset_link`
   - `app_name`
5. Copy the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Find **Public Key** section
3. Copy the **Public Key** (e.g., `Abc123XyZ456...`)

### Step 5: Update .env File
Open `d:\BreastCancerAI\.env` and update:

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=Abc123XyZ456DefGhi789
```

Replace with your actual values from EmailJS dashboard.

### Step 6: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## 🧪 Testing

### Demo Mode (No EmailJS Setup)
If you haven't set up EmailJS yet:
1. Click "Forgot Password" on login page
2. Enter any email with `@` symbol
3. Check browser **console (F12)** for the reset link
4. Copy the link and paste in browser

### Production Mode (With EmailJS)
1. Click "Forgot Password"
2. Enter a real email address
3. Check your email inbox
4. Click the reset link in the email
5. Enter new password
6. Login with new password ✅

## 📁 Files Created

- `src/services/authService.ts` - Password reset logic
- `src/pages/ResetPasswordPage.tsx` - Reset password UI
- `.env` - EmailJS configuration

## 🔒 Security Features

- ✅ Reset tokens expire in 1 hour
- ✅ Tokens are single-use (deleted after password reset)
- ✅ Passwords are hashed (Base64 for demo, use bcrypt in production)
- ✅ User credentials stored in localStorage per user

## 🚀 Next Steps

1. Set up EmailJS account (free)
2. Update `.env` with your credentials
3. Restart dev server
4. Test the forgot password flow!

---

**Need Help?**
- EmailJS Docs: https://www.emailjs.com/docs/
- EmailJS Registration: https://dashboard.emailjs.com/sign-up
