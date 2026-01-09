# 🎯 HabitFlow - Advanced Habit Tracking App

A comprehensive, production-ready habit tracking application built with React, JavaScript, and Firebase. Features advanced analytics, OTP verification, dark mode, and much more!

## ✨ Features

### 🔐 **Authentication & Security**
- **Email/Password Authentication**: Secure Firebase Auth integration
- **OTP Email Verification**: Email verification for new accounts with 6-digit codes
- **Professional Email Templates**: Branded emails sent from `habitflow5093@gmail.com`
- **Session Management**: Automatic login state persistence

### 📊 **Advanced Habit Management**
- **13 Habit Categories**: Health, Fitness, Learning, Work, Mindfulness, and more
- **Habit Templates**: Quick setup with pre-built habit templates
- **Goal Setting**: Set numerical goals with custom units (minutes, glasses, steps, etc.)
- **Smart Sorting**: Sort by creation date, streak length, or completion status
- **Category Filtering**: Filter habits by category for better organization

### 📈 **Comprehensive Analytics**
- **Statistics Dashboard**: Detailed analytics with charts and progress tracking
- **Achievement System**: Unlock badges for milestones and consistency
- **Weekly Progress Charts**: Visual progress tracking with completion rates
- **Streak Tracking**: Monitor daily streaks and best streaks
- **Category Breakdown**: See progress across different habit categories

### 🎨 **Modern User Experience**
- **Dark Mode**: Full dark/light theme support with system preference detection
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern design with gradients, shadows, and smooth animations
- **Toast Notifications**: Instant feedback for all user actions
- **Loading States**: Smooth loading indicators throughout the app

### 💾 **Data Management**
- **Export/Import**: Backup and restore your habit data as JSON files
- **Real-time Sync**: Instant updates across all devices
- **Offline Support**: Works offline with automatic sync when online
- **Data Privacy**: Your data is secure and only accessible by you

## 🛠️ Tech Stack

- **Frontend**: React 18, JavaScript (ES6+), Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Email Service**: EmailJS for OTP verification
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Styling**: Tailwind CSS with custom animations

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd habit-tracker
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password) and **Firestore Database**
3. Update your `.env` file with Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 3. Email Setup (Optional)
For OTP verification emails, follow the `QUICK_EMAIL_SETUP.md` guide to configure EmailJS.

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AuthForm.jsx    # Login/Register with OTP
│   ├── Dashboard.jsx   # Main dashboard with tabs
│   ├── HabitCard.jsx   # Individual habit display
│   ├── HabitModal.jsx  # Add/Edit habit form
│   ├── Statistics.jsx  # Analytics dashboard
│   ├── Settings.jsx    # User settings & preferences
│   ├── DataManager.jsx # Export/Import functionality
│   └── OTPVerification.jsx # Email OTP verification
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication logic
│   ├── useHabits.js    # Habit management
│   └── useDarkMode.js  # Dark mode toggle
├── services/           # External services
│   └── otpService.js   # OTP generation & verification
├── utils/              # Utility functions
│   ├── dateUtils.js    # Date formatting & calculations
│   └── habitCategories.js # Categories & templates
├── lib/                # Configuration
│   └── firebase.js     # Firebase setup
└── config/             # App configuration
    └── emailjs.js      # EmailJS configuration
```

## 🗄️ Database Structure

### Habits Collection
```javascript
{
  id: "auto-generated-id",
  name: "Drink 8 glasses of water",
  description: "Stay hydrated throughout the day",
  category: "hydration",
  frequency: "daily", // or "weekly"
  goal: 8,
  unit: "glasses",
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

## 🔒 Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /habits/{habitId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🎯 Key Features Breakdown

### 📧 **OTP Email Verification**
- 6-digit verification codes
- 5-minute expiry with countdown timer
- Professional email templates
- Resend functionality with rate limiting
- 3-attempt verification limit

### 📊 **Advanced Analytics**
- Total habits and completion rates
- Weekly progress visualization
- Category-wise breakdown
- Achievement badge system
- Streak tracking and best streaks

### 🎨 **13 Habit Categories**
Health, Fitness, Learning, Work, Social, Mindfulness, Mental Health, Nutrition, Hydration, Sleep, Creativity, Hobbies, and Other - each with unique icons and colors.

### 🌙 **Dark Mode**
- System preference detection
- Manual toggle in settings
- Persistent theme selection
- Complete UI coverage

## 🚀 Build for Production

```bash
npm run build
npm run preview
```

## 📱 Features in Detail

### **Dashboard Tabs**
- **Habits**: Main habit management with filtering and sorting
- **Statistics**: Comprehensive analytics and progress tracking
- **Settings**: User preferences, data management, and theme settings

### **Habit Management**
- Create habits from templates or custom
- Set goals with various units
- Track daily/weekly completion
- Visual progress indicators
- Category-based organization

### **Data Export/Import**
- Export all data as JSON backup
- Import habits from backup files
- Preserve completion history and streaks
- Data validation and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase** for backend services
- **EmailJS** for email functionality
- **Tailwind CSS** for styling
- **Lucide React** for beautiful icons
- **Vite** for fast development experience

---

**Built with ❤️ for better habit formation** 🎯