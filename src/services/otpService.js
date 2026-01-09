import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, EMAIL_TEMPLATE_PARAMS } from '../config/emailjs.js';

// OTP Service for email verification
class OTPService {
  constructor() {
    this.otpStorage = new Map(); // In production, use a proper database
    this.otpExpiry = 5 * 60 * 1000; // 5 minutes
    
    // Initialize EmailJS with public key
    if (EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      this.emailConfigured = true;
    } else {
      this.emailConfigured = false;
      console.warn('EmailJS not configured. Please update src/config/emailjs.js with your credentials.');
    }
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Store OTP with expiry
  storeOTP(email, otp) {
    const expiryTime = Date.now() + this.otpExpiry;
    this.otpStorage.set(email, {
      otp,
      expiryTime,
      attempts: 0
    });
  }

  // Verify OTP
  verifyOTP(email, inputOTP) {
    const otpData = this.otpStorage.get(email);
    
    if (!otpData) {
      return { success: false, message: 'OTP not found. Please request a new one.' };
    }

    if (Date.now() > otpData.expiryTime) {
      this.otpStorage.delete(email);
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (otpData.attempts >= 3) {
      this.otpStorage.delete(email);
      return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
    }

    if (otpData.otp !== inputOTP) {
      otpData.attempts++;
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    // OTP verified successfully
    this.otpStorage.delete(email);
    return { success: true, message: 'OTP verified successfully!' };
  }

  // Send OTP via EmailJS
  async sendOTP(email) {
    const otp = this.generateOTP();
    this.storeOTP(email, otp);

    // If EmailJS is not configured, show demo OTP
    if (!this.emailConfigured) {
      console.log(`🔐 Demo OTP for ${email}: ${otp}`);
      return { 
        success: true, 
        message: 'EmailJS not configured. Check console for demo OTP.',
        demoOTP: otp
      };
    }

    try {
      const templateParams = {
        ...EMAIL_TEMPLATE_PARAMS,
        to_email: email,
        to_name: email.split('@')[0], // Use email username as name
        otp_code: otp,
        user_email: email,
        expiry_minutes: '5',
        app_name: 'HabitFlow'
      };

      console.log('Sending email with params:', templateParams);

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );
      
      if (response.status === 200) {
        console.log('✅ Email sent successfully:', response);
        return { 
          success: true, 
          message: 'Verification code sent to your email!' 
        };
      } else {
        throw new Error(`EmailJS returned status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      
      // Fallback: show OTP in console for development
      console.log(`🔐 Fallback Demo OTP for ${email}: ${otp}`);
      
      return { 
        success: true, 
        message: 'Email service unavailable. Check console for demo OTP.',
        demoOTP: otp,
        error: error.message
      };
    }
  }

  // Clean expired OTPs
  cleanExpiredOTPs() {
    const now = Date.now();
    for (const [email, otpData] of this.otpStorage.entries()) {
      if (now > otpData.expiryTime) {
        this.otpStorage.delete(email);
      }
    }
  }
}

export const otpService = new OTPService();

// Clean expired OTPs every minute
setInterval(() => {
  otpService.cleanExpiredOTPs();
}, 60000);