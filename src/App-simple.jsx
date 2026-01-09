import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">HabitFlow</h1>
        <p className="text-gray-600 mb-8">Your habit tracking app is ready!</p>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-4">Setup Required</h2>
          <p className="text-gray-600 mb-4">
            To use this app, you need to configure Firebase:
          </p>
          <ol className="text-left text-sm text-gray-600 space-y-2">
            <li>1. Create a Firebase project at console.firebase.google.com</li>
            <li>2. Enable Authentication and Firestore</li>
            <li>3. Copy your config values to the .env file</li>
            <li>4. Restart the development server</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;