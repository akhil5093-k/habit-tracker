import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase.js';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import OTPVerification from './OTPVerification.jsx';
import { otpService } from '../services/otpService.js';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);

  // Check if Firebase is configured
  if (!auth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Target className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Firebase Setup Required</h1>
            <div className="text-gray-600 dark:text-gray-400 text-left space-y-3">
              <p className="mb-4">To use this app, please configure Firebase:</p>
              <ol className="space-y-2 text-sm">
                <li>1. Create a Firebase project</li>
                <li>2. Enable Authentication & Firestore</li>
                <li>3. Update your .env file with Firebase config</li>
                <li>4. Restart the development server</li>
              </ol>
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Check the .env file in your project root and replace the placeholder values with your actual Firebase configuration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Direct login without OTP
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back!');
      } else {
        // For registration, first send OTP
        setPendingUserData({ email, password });
        const result = await otpService.sendOTP(email);
        
        if (result.success) {
          setShowOTPVerification(true);
          toast.success('Verification code sent to your email!');
          
          // For demo purposes, show OTP in console
          if (result.demoOTP) {
            toast.success(`Demo OTP: ${result.demoOTP}`, { duration: 10000 });
          }
        } else {
          toast.error('Failed to send verification code');
        }
      }
    } catch (error) {
      let errorMessage = 'Authentication failed';
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists. Please sign in instead.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters long.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        default:
          errorMessage = error.message || 'Authentication failed';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = async () => {
    if (!pendingUserData) return;

    try {
      setLoading(true);
      // Create Firebase account after OTP verification
      await createUserWithEmailAndPassword(auth, pendingUserData.email, pendingUserData.password);
      toast.success('Account created successfully!');
      
      // Reset states
      setShowOTPVerification(false);
      setPendingUserData(null);
    } catch (error) {
      console.error('Account creation error:', error);
      toast.error('Failed to create account. Please try again.');
      
      // Go back to registration form
      setShowOTPVerification(false);
      setPendingUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignup = () => {
    setShowOTPVerification(false);
    setPendingUserData(null);
  };

  const handleResendOTP = async () => {
    if (!pendingUserData) return;
    
    const result = await otpService.sendOTP(pendingUserData.email);
    if (result.demoOTP) {
      toast.success(`Demo OTP: ${result.demoOTP}`, { duration: 10000 });
    }
    return result;
  };

  // Show OTP verification screen
  if (showOTPVerification) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <OTPVerification
          email={pendingUserData?.email}
          onVerified={handleOTPVerified}
          onBack={handleBackToSignup}
          onResendOTP={handleResendOTP}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">HabitFlow</h1>
          <p className="text-gray-600 dark:text-gray-400">Build better habits, one day at a time</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {isLogin ? 'Sign in to continue your journey' : 'Start building amazing habits today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create Account
                    </>
                  )}
                </>
              )}
            </button>

            {/* Toggle Auth Mode */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm transition-colors"
              >
                {isLogin ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>

          {/* OTP Info for Registration */}
          {!isLogin && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                📧 A verification code will be sent to your email for account security
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure authentication powered by Firebase
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;