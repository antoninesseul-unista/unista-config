import { reactive } from "vue";

/**
 * Global state for CFR21 Configuration
 */
export const cfr21SettingsState = reactive({
  loginAttemptsBeforeLock: 3,
  signatureAttemptsBeforeLock: 3,
  minUppercase: 1,
  minLowercase: 1,
  minLength: 5,
  minSpecialChars: 0,
  minNumbers: 1,
  inactivityTimeoutMin: 20,
  adminInactivityTimeoutMin: 10,
  passwordRenewalDays: 100,
  rememberLastPasswords: 3,
  requirePasswordChangeOnFirstLogin: false,
});
