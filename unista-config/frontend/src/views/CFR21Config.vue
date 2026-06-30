<template>
  <div class="p-8 h-full overflow-y-auto bg-gray-50/50">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
        CFR21 Configuration
      </h1>
      <p class="text-sm text-gray-500 mt-1">
        Manage security policies, password rules, and timeout parameters.
      </p>
    </div>

    <!-- CFR21 Configuration Card -->
    <div
      class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden max-w-4xl"
    >
      <div class="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
        <h2 class="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Security Settings
        </h2>
      </div>
      <div class="p-5">
        <!-- Number Inputs Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          <div v-for="(field, key) in numericCfr21Fields" :key="key">
            <label
              class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 truncate"
              :title="field.label"
            >
              {{ field.label }}
            </label>
            <input
              type="number"
              v-model="cfr21Settings[key as keyof typeof cfr21Settings]"
              class="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <hr class="border-gray-100 my-5" />

        <!-- Boolean Toggles -->
        <div
          class="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 max-w-lg"
        >
          <span
            class="text-xs font-bold text-gray-700 uppercase tracking-wider"
          >
            Force Password Change on First Login
          </span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="cfr21Settings.requirePasswordChangeOnFirstLogin"
              class="sr-only peer"
            />
            <div
              class="w-9 h-5 bg-gray-300 rounded-full peer peer-focus:outline-none peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
            ></div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cfr21SettingsState as cfr21Settings } from "../core";

/**
 * UI mapping dictionary for numeric inputs.
 * This keeps the template DRY (Don't Repeat Yourself).
 */
const numericCfr21Fields = {
  loginAttemptsBeforeLock: { label: "Login Lockout Attempts" },
  signatureAttemptsBeforeLock: { label: "Signature Lockout Attempts" },
  minUppercase: { label: "Min. Uppercase Letters" },
  minLowercase: { label: "Min. Lowercase Letters" },
  minLength: { label: "Min. Total Characters" },
  minSpecialChars: { label: "Min. Special Characters" },
  minNumbers: { label: "Min. Numbers" },
  inactivityTimeoutMin: { label: "Inactivity Timeout (min)" },
  adminInactivityTimeoutMin: { label: "Admin Inactivity Timeout (min)" },
  passwordRenewalDays: { label: "Password Renewal (days)" },
  rememberLastPasswords: { label: "Remember Last Passwords" },
};
</script>
