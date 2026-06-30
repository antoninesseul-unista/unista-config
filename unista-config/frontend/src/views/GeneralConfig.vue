<template>
  <div class="p-8 h-full overflow-y-auto bg-gray-50/50">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
        General Configuration
      </h1>
      <p class="text-sm text-gray-500 mt-1">
        Manage core machine specifications, identifiers, and network settings.
      </p>
    </div>

    <div class="flex flex-col gap-6 max-w-2xl">
      <div
        class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
      >
        <div class="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
          <h2 class="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Information
          </h2>
        </div>
        <div class="p-5 flex flex-col gap-5">
          <div>
            <label
              class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5"
            >
              Project Number
            </label>
            <input
              type="text"
              v-model="config.projectNumber"
              maxlength="10"
              placeholder="e.g. UNxx-xxx"
              class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <p class="text-[10px] text-gray-400 mt-1 text-right">
              {{ config.projectNumber.length }} / 10 characters
            </p>
          </div>

          <div>
            <label
              class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5"
            >
              Serial Number
            </label>
            <input
              type="text"
              v-model="config.serialNumber"
              maxlength="8"
              placeholder="00000000"
              class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label
              class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5"
            >
              Machine Name
            </label>
            <input
              type="text"
              v-model="config.machineName"
              maxlength="30"
              placeholder="e.g. Main Assembly Line"
              class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <p class="text-[10px] text-gray-400 mt-1 text-right">
              {{ config.machineName.length }} / 30 characters
            </p>
          </div>
        </div>
      </div>

      <div
        class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
      >
        <div class="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
          <h2 class="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Machine Network
          </h2>
        </div>
        <div class="p-5 flex flex-col gap-5">
          <div>
            <label
              :class="[
                'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                hasIpError(config.machineIpAddress)
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
            >
              IP Address
            </label>
            <input
              type="text"
              v-model="config.machineIpAddress"
              placeholder="192.168.1.10"
              :class="[
                'w-full px-3 py-2 border rounded-md text-sm outline-none transition-all font-mono',
                hasIpError(config.machineIpAddress)
                  ? 'border-red-400 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-2 focus:ring-blue-500',
              ]"
            />
          </div>

          <div>
            <label
              :class="[
                'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                hasIpError(config.machineSubnetMask)
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
            >
              Subnet Mask
            </label>
            <input
              type="text"
              v-model="config.machineSubnetMask"
              placeholder="255.255.255.0"
              :class="[
                'w-full px-3 py-2 border rounded-md text-sm outline-none transition-all font-mono',
                hasIpError(config.machineSubnetMask)
                  ? 'border-red-400 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-2 focus:ring-blue-500',
              ]"
            />
          </div>
        </div>
      </div>

      <div
        class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
      >
        <div class="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
          <h2 class="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Ethernet IP Network
          </h2>
        </div>
        <div class="p-5 flex flex-col gap-5">
          <div>
            <label
              :class="[
                'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                hasIpError(config.ethernetIpAddress)
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
            >
              IP Address
            </label>
            <input
              type="text"
              v-model="config.ethernetIpAddress"
              placeholder="10.0.0.10"
              :class="[
                'w-full px-3 py-2 border rounded-md text-sm outline-none transition-all font-mono',
                hasIpError(config.ethernetIpAddress)
                  ? 'border-red-400 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-2 focus:ring-blue-500',
              ]"
            />
          </div>

          <div>
            <label
              :class="[
                'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                hasIpError(config.ethernetSubnetMask)
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
            >
              Subnet Mask
            </label>
            <input
              type="text"
              v-model="config.ethernetSubnetMask"
              placeholder="255.255.255.0"
              :class="[
                'w-full px-3 py-2 border rounded-md text-sm outline-none transition-all font-mono',
                hasIpError(config.ethernetSubnetMask)
                  ? 'border-red-400 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-2 focus:ring-blue-500',
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generalConfigState as config } from "../core";

/**
 * Validates IPv4 address format.
 * @param ip - The IP address string to validate
 * @returns boolean - true if the IP is valid
 */
const isValidIP = (ip: string): boolean => {
  const regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
};

/**
 * Determines if an input should be highlighted in red due to an invalid IP address.
 * It ignores empty strings to prevent displaying an error before the user starts typing.
 * @param ip - The IP address string to evaluate
 * @returns boolean - true if the field contains an invalid IP
 */
const hasIpError = (ip: string): boolean => {
  return ip.length > 0 && !isValidIP(ip);
};
</script>
