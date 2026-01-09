import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, RefreshCw, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const OTPVerification = ({ email, onVerified, onBack, onResendOTP }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      // Call your OTP verification service
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpString
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Email verified successfully!');
        onVerified();
      } else {
        toast.error(result.message || 'Invalid OTP');
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await onResendOTP();
      setTimeLeft(300); // Reset timer
      setOtp(['', '', '', '', '', '']); // Clear current OTP
      toast.success('New OTP sent to your email!');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Email</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          We've sent a 6-digit code to
        </p>
        <p className="text-purple-600 dark:text-purple-400 font-medium">{email}</p>
      </div>

      {/* OTP Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
            Enter verification code
          </label>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading}
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {timeLeft > 0 ? (
              <>Code expires in <span className="font-medium text-red-500">{formatTime(timeLeft)}</span></>
            ) : (
              <span className="text-red-500">Code has expired</span>
            )}
          </p>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerifyOTP}
          disabled={loading || otp.join('').length !== 6}
          className="w-full flex items-center justify-center py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Shield className="h-5 w-5 mr-2" />
              Verify Email
            </>
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          <button
            onClick={handleResendOTP}
            disabled={resendLoading || timeLeft > 240} // Allow resend after 1 minute
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? (
              <span className="flex items-center justify-center">
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                Sending...
              </span>
            ) : (
              <>
                <Mail className="h-4 w-4 inline mr-1" />
                Resend Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <button
          onClick={onBack}
          className="flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium text-sm transition-colors mx-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Sign Up
        </button>
      </div>

      {/* Info */}
      <div className="text-center mt-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Didn't receive the code? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;