import React from 'react';
import { Moon, Sun, Settings as SettingsIcon, User, Bell, Shield } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode.js';
import DataManager from './DataManager.jsx';

const Settings = ({ user, habits, onImportHabits }) => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-6 w-6 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <p className="text-gray-900 dark:text-white">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Member since</label>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.metadata?.creationTime ? 
                new Date(user.metadata.creationTime).toLocaleDateString() : 
                'Unknown'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="h-6 w-6 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDark ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
              <span className="sr-only">Toggle dark mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <DataManager habits={habits} onImportHabits={onImportHabits} />

      {/* Notifications (Placeholder) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-6 w-6 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Daily Reminders</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get reminded to complete your habits</p>
            </div>
            <button
              disabled
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 opacity-50 cursor-not-allowed"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🚧 Notification features coming soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;