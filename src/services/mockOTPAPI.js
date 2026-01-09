// Mock OTP API for demonstration
// In production, this should be a proper backend service

import { otpService } from './otpService.js';

// Mock API endpoints
export const mockOTPAPI = {
  // Verify OTP endpoint
  verifyOTP: async (email, otp) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = otpService.verifyOTP(email, otp);
    return {
      ok: result.success,
      json: async () => result
    };
  },

  // Send OTP endpoint
  sendOTP: async (email) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = await otpService.sendOTP(email);
    return {
      ok: result.success,
      json: async () => result
    };
  }
};

// Override fetch for OTP endpoints
const originalFetch = window.fetch;
window.fetch = async (url, options) => {
  // Intercept OTP API calls
  if (url === '/api/verify-otp') {
    const body = JSON.parse(options.body);
    return mockOTPAPI.verifyOTP(body.email, body.otp);
  }
  
  if (url === '/api/send-otp') {
    const body = JSON.parse(options.body);
    return mockOTPAPI.sendOTP(body.email);
  }
  
  // Use original fetch for other requests
  return originalFetch(url, options);
};