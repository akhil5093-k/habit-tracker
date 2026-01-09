# Firebase Setup Guide for HabitFlow

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `habit-tracker` (or your preferred name)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project dashboard, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Email/Password"
5. Enable the first toggle (Email/Password)
6. Click "Save"

## Step 3: Set up Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to your users
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Enter app nickname: `habit-tracker-web`
6. Click "Register app"
7. Copy the configuration object

## Step 5: Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-your-measurement-id
```

## Step 6: Set Firestore Security Rules (Optional for Development)

In Firestore Database > Rules, you can use these rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own habits
    match /habits/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Step 7: Restart Development Server

After updating your `.env` file:

1. Stop your development server (Ctrl+C)
2. Run `npm run dev` again
3. Your app should now work with Firebase!

## Firestore Data Structure

The app will create documents in the `habits` collection with this structure:

```javascript
{
  id: "auto-generated-id",
  name: "Drink 8 glasses of water",
  description: "Stay hydrated throughout the day",
  frequency: "daily", // or "weekly"
  userId: "user-auth-id",
  createdAt: Timestamp,
  completions: [
    {
      date: "2024-01-15", // YYYY-MM-DD format
      completed: true
    }
  ]
}
```

## Troubleshooting

- **Blank screen**: Check browser console for errors
- **Firebase errors**: Verify all environment variables are set correctly
- **Authentication issues**: Ensure Email/Password is enabled in Firebase Auth
- **Database errors**: Check Firestore rules and ensure database is created

## Security Notes

- Never commit your `.env` file to version control
- Use Firebase security rules in production
- Consider enabling App Check for additional security