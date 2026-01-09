# 🚀 Quick EmailJS Setup (5 Minutes)

## Step 1: EmailJS Account (2 minutes)
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Click "Sign Up" → Use Google to sign in with `habitflow5093@gmail.com`
3. Verify email if needed

## Step 2: Add Gmail Service (1 minute)
1. Dashboard → **Email Services** → **Add New Service**
2. Choose **Gmail**
3. Service ID: `service_habitflow`
4. Click **Connect Account** → Authorize with `habitflow5093@gmail.com`

## Step 3: Create Template (1 minute)
1. Dashboard → **Email Templates** → **Create New Template**
2. Template ID: `template_otp_verification`
3. **Copy-paste this template:**

**Subject:**
```
🔐 Your HabitFlow Verification Code
```

**Content:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1>🎯 HabitFlow</h1>
    <p>Email Verification</p>
  </div>
  
  <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px;">
    <h2>Hello {{to_name}}!</h2>
    <p>Your verification code is:</p>
    
    <div style="background: white; border: 2px solid #8B5CF6; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
      <div style="font-size: 36px; font-weight: bold; color: #8B5CF6; letter-spacing: 8px;">{{otp_code}}</div>
      <p style="color: #666; font-size: 12px;">Expires in {{expiry_minutes}} minutes</p>
    </div>
    
    <p>If you didn't create an account, please ignore this email.</p>
    <p>Best regards,<br><strong>HabitFlow Team</strong></p>
  </div>
</div>
```

## Step 4: Get Credentials (30 seconds)
1. **Public Key**: Dashboard → Account → General → Copy Public Key
2. **Service ID**: Email Services → Copy your service ID (`service_habitflow`)
3. **Template ID**: Email Templates → Copy your template ID (`template_otp_verification`)

## Step 5: Update Code (30 seconds)
Edit `src/config/emailjs.js`:

```javascript
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_COPIED_PUBLIC_KEY_HERE',
  SERVICE_ID: 'service_habitflow',
  TEMPLATE_ID: 'template_otp_verification',
};
```

## Step 6: Test! 🎉
1. Save files
2. Restart dev server: `npm run dev`
3. Try creating account
4. Check email (including spam folder)

## ✅ Success Checklist
- [ ] EmailJS account created
- [ ] Gmail service connected
- [ ] Email template created with correct variables
- [ ] Credentials copied to config file
- [ ] Test email received

## 🔧 If Email Not Working:
1. **Check spam folder** first!
2. **Console errors**: Open browser dev tools
3. **EmailJS logs**: Check EmailJS dashboard → History
4. **Template variables**: Make sure all `{{variables}}` are correct
5. **Service connection**: Re-authorize Gmail if needed

## 📧 Template Variables Used:
- `{{to_name}}` - Recipient name
- `{{to_email}}` - Recipient email  
- `{{otp_code}}` - 6-digit verification code
- `{{expiry_minutes}}` - "5"
- `{{from_email}}` - "habitflow5093@gmail.com"

That's it! Your OTP emails will now be sent from `habitflow5093@gmail.com` 🚀