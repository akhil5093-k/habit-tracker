// EmailJS Configuration
// You need to replace these with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  // Get these from your EmailJS dashboard
  PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY', // Replace with your public key
  SERVICE_ID: 'service_habitflow', // Replace with your service ID
  TEMPLATE_ID: 'template_otp_verification', // Replace with your template ID
};

// Email template variables that will be sent to EmailJS
export const EMAIL_TEMPLATE_PARAMS = {
  from_name: 'HabitFlow Team',
  from_email: 'habitflow5093@gmail.com',
  reply_to: 'habitflow5093@gmail.com',
};