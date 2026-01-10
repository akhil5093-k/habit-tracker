# 🚀 HabitFlow Deployment Guide

## 🔥 Firebase Setup (Required)

### Step 1: Enable Firebase Services
1. Go to [Firebase Console](https://console.firebase.google.com/project/habit-flow-609eb)
2. **Enable Authentication**:
   - Click "Authentication" → "Get started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password" provider
   - Click "Save"

3. **Enable Firestore Database**:
   - Click "Firestore Database" → "Create database"
   - Choose "Start in test mode" (for now)
   - Select your preferred location
   - Click "Done"

### Step 2: Configure Firestore Security Rules
In Firestore → Rules, replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own habits
    match /habits/{habitId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Step 3: Add Authorized Domains (For Production)
In Authentication → Settings → Authorized domains:
- Add your production domain (e.g., `your-app.vercel.app`)
- Keep `localhost` for development

## 📧 Email Setup (Optional)

### Quick EmailJS Setup
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up with `habitflow5093@gmail.com`
3. Add Gmail service (ID: `service_habitflow`)
4. Create email template (ID: `template_otp_verification`)
5. Update `src/config/emailjs.js` with your credentials

**Without email setup**: OTP will show in console (demo mode)
**With email setup**: Real OTP emails sent from `habitflow5093@gmail.com`

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set build command: npm run build
# - Set output directory: dist
```

### Option 2: Netlify
```bash
# Build the project
npm run build

# Upload the 'dist' folder to Netlify
# Or connect your GitHub repo for auto-deployment
```

### Option 3: Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
npm run build
firebase deploy
```

## 🔧 Environment Variables for Production

### For Vercel:
Add these in Vercel dashboard → Settings → Environment Variables:
```
VITE_FIREBASE_API_KEY=AIzaSyABUZul1sl7gCm-k-SdYM65oDYNJ_OlPZo
VITE_FIREBASE_AUTH_DOMAIN=habit-flow-609eb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=habit-flow-609eb
VITE_FIREBASE_STORAGE_BUCKET=habit-flow-609eb.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=270660598014
VITE_FIREBASE_APP_ID=1:270660598014:web:474c0ccb4824fa8bd34daf
VITE_FIREBASE_MEASUREMENT_ID=G-G03GDC6D09
```

### For Netlify:
Add in Site settings → Environment variables

### For Firebase Hosting:
Environment variables are built into the app during build time.

## ✅ Pre-Deployment Checklist

- [ ] Firebase Authentication enabled
- [ ] Firestore Database created
- [ ] Security rules configured
- [ ] Authorized domains added
- [ ] Environment variables set (for hosting platforms)
- [ ] EmailJS configured (optional)
- [ ] App tested locally
- [ ] Build command works (`npm run build`)

## 🧪 Testing Before Deployment

1. **Test Firebase Connection**:
   ```bash
   npm run dev
   ```
   - Should not show "Firebase Setup Required"
   - Should show login/register forms

2. **Test Authentication**:
   - Create a test account
   - Login/logout functionality
   - OTP verification (console or email)

3. **Test Habit Management**:
   - Create, edit, delete habits
   - Mark habits as complete
   - View statistics

4. **Test on Multiple Devices**:
   - Use `--host` flag: `npm run dev -- --host`
   - Access from other devices on same network
   - Test responsive design

## 🚀 Quick Deploy Commands

### Vercel (Fastest)
```bash
npx vercel --prod
```

### Netlify
```bash
npm run build
# Drag 'dist' folder to netlify.com/drop
```

### Firebase
```bash
npm run build
npx firebase deploy
```

## 🔍 Troubleshooting

### "Firebase Setup Required" Error:
- ✅ Check Firebase services are enabled
- ✅ Verify environment variables
- ✅ Check browser console for errors

### Authentication Not Working:
- ✅ Enable Email/Password in Firebase Auth
- ✅ Check authorized domains
- ✅ Verify API keys

### Database Errors:
- ✅ Enable Firestore Database
- ✅ Update security rules
- ✅ Check network connectivity

## 📱 Mobile Access

To test on mobile devices during development:
```bash
npm run dev -- --host
```
Then access via your computer's IP address (shown in terminal).

## 🎯 Production URLs

After deployment, your app will be accessible at:
- **Vercel**: `https://your-app.vercel.app`
- **Netlify**: `https://your-app.netlify.app`
- **Firebase**: `https://your-project.web.app`

Remember to add these domains to Firebase authorized domains!