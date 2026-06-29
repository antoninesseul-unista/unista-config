import { reactive } from "vue";

/**
 * Global state for General Configuration.
 * Holds machine identifiers and network settings.
 */
export const generalConfigState = reactive({
  projectNumber: "",
  serialNumber: "00000000",
  machineName: "",
  machineIpAddress: "192.168.200.2",
  machineSubnetMask: "255.255.240.0",
  ethernetIpAddress: "192.168.150.2",
  ethernetSubnetMask: "255.255.255.0",
});
