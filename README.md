# Habit Tracker App

A beautiful, production-ready habit tracking application built with React, TypeScript, and Firebase.

## Features

- **User Authentication**: Secure email/password authentication with Firebase Auth
- **Real-time Habit Tracking**: Add, edit, delete, and mark habits as complete
- **Progress Visualization**: Weekly progress view and streak counters
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Toast Notifications**: Instant feedback for user actions
- **Modern UI**: Clean, gradient-based design with smooth animations

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Get your Firebase configuration from Project Settings → General → Your apps → Firebase SDK snippet → Config
4. Create a `.env` file in the root directory and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_DATABASE_URL="https://your-project-default-rtdb.firebaseio.com/"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef123456"
VITE_FIREBASE_MEASUREMENT_ID="G-ABCDEF1234"
```

5. Replace the placeholder values with your actual Firebase configuration values
6. Restart the development server after updating the `.env` file
## Database Structure

### Habits Collection
```typescript
interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  createdAt: Date;
  userId: string;
  completions: HabitCompletion[];
}

interface HabitCompletion {
  date: string; // YYYY-MM-DD format
  completed: boolean;
}
```

## Security Rules

Add these Firestore security rules to ensure user data privacy:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /habits/{habitId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update Firebase configuration in `src/lib/firebase.ts`
4. Run the development server:
   ```bash
   npm run dev
   ```

## Build for Production

```bash
npm run build
```

## Features Overview

### Authentication
- Email/password registration and login
- Secure user session management
- Automatic redirect based on auth state

### Habit Management
- Create habits with name, description, and frequency
- Edit existing habits
- Delete habits with confirmation
- Mark habits as complete for specific dates

### Progress Tracking
- Daily completion status
- Weekly progress visualization
- Streak counting
- Completion rate statistics

### User Experience
- Real-time updates across all devices
- Toast notifications for actions
- Responsive design for all screen sizes
- Loading states and error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.