# EmailJS Setup Guide for HabitFlow OTP

## Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Gmail Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail**
4. Service ID: `service_habitflow` (or your preferred ID)
5. Connect your Gmail account: `habitflow5093@gmail.com`
6. Follow the OAuth flow to authorize EmailJS

## Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Template ID: `template_otp_verification`
4. Use this template:

### Subject:
```
🔐 Your HabitFlow Verification Code
```

### Email Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
        }
        .header { 
            background: linear-gradient(135deg, #8B5CF6, #3B82F6); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
            border-radius: 10px 10px 0 0; 
        }
        .content { 
            background: #f8fafc; 
            padding: 30px 20px; 
            border-radius: 0 0 10px 10px; 
        }
        .otp-box { 
            background: white; 
            border: 2px solid #8B5CF6; 
            border-radius: 10px; 
            padding: 20px; 
            text-align: center; 
            margin: 20px 0; 
        }
        .otp-code { 
            font-size: 36px; 
            font-weight: bold; 
            color: #8B5CF6; 
            letter-spacing: 8px; 
            margin: 10px 0; 
        }
        .footer { 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
            margin-top: 20px; 
        }
        .warning { 
            background: #fef3cd; 
            border: 1px solid #fbbf24; 
            border-radius: 5px; 
            padding: 15px; 
            margin: 15px 0; 
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 HabitFlow</h1>
        <p>Email Verification Required</p>
    </div>
    
    <div class="content">
        <h2>Hello {{to_name}}!</h2>
        
        <p>Thank you for signing up for HabitFlow! To complete your registration, please verify your email address using the code below:</p>
        
        <div class="otp-box">
            <p style="margin: 0; font-size: 14px; color: #666;">Your verification code is:</p>
            <div class="otp-code">{{otp_code}}</div>
            <p style="margin: 0; font-size: 12px; color: #666;">This code expires in {{expiry_minutes}} minutes</p>
        </div>
        
        <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This code will expire in {{expiry_minutes}} minutes</li>
                <li>You have 3 attempts to enter the correct code</li>
                <li>If you didn't create an account, please ignore this email</li>
            </ul>
        </div>
        
        <p>Once verified, you'll be able to start building better habits with HabitFlow!</p>
        
        <p>Best regards,<br>
        <strong>The HabitFlow Team</strong></p>
    </div>
    
    <div class="footer">
        <p>© 2024 HabitFlow - Build better habits, one day at a time</p>
        <p>This email was sent from {{from_email}}</p>
    </div>
</body>
</html>
```

## Step 4: Configure Template Variables
Make sure your template uses these variables:
- `{{to_name}}` - Recipient's name
- `{{to_email}}` - Recipient's email
- `{{otp_code}}` - The 6-digit verification code
- `{{expiry_minutes}}` - Expiry time (5)
- `{{from_email}}` - Your email (habitflow5093@gmail.com)
- `{{app_name}}` - App name (HabitFlow)

## Step 5: Get Your Credentials
1. Go to **Account** → **General**
2. Copy your **Public Key**
3. Go to **Email Services** and copy your **Service ID**
4. Go to **Email Templates** and copy your **Template ID**

## Step 6: Update Configuration
Update `src/config/emailjs.js` with your credentials:

```javascript
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'your_actual_public_key_here',
  SERVICE_ID: 'service_habitflow', // or your service ID
  TEMPLATE_ID: 'template_otp_verification', // or your template ID
};
```

## Step 7: Test the Setup
1. Save your configuration
2. Restart your development server
3. Try creating a new account
4. Check your email for the OTP

## Troubleshooting

### Email Not Received?
1. **Check Spam Folder** - EmailJS emails might go to spam initially
2. **Verify Service Connection** - Make sure Gmail service is properly connected
3. **Check Template Variables** - Ensure all variables are correctly mapped
4. **Review Console** - Check browser console for any errors

### Common Issues:
- **Invalid Service ID**: Make sure it matches exactly
- **Template Not Found**: Verify template ID is correct
- **Gmail Authorization**: Re-authorize if needed
- **Rate Limits**: EmailJS has sending limits on free plan

### Testing Tips:
- Use your own email first to test
- Check EmailJS dashboard for send logs
- Monitor browser console for detailed error messages

## Production Considerations
- **Rate Limiting**: Implement proper rate limiting
- **Error Handling**: Add robust error handling
- **Monitoring**: Monitor email delivery rates
- **Backup**: Consider backup email service
- **Security**: Never expose private keys in frontend

## Current Status
✅ EmailJS package installed
✅ OTP service configured
✅ Email template ready
⚠️ Need to configure EmailJS credentials
⚠️ Need to test email delivery

Once configured, users will receive professional OTP emails from `habitflow5093@gmail.com`!