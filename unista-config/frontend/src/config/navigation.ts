export interface StaticNavItem {
  label: string;
  to: { name: string };
  icon: string;
  showsModuleError?: boolean;
}

export const NAV_SECTIONS = {
  global: [
    {
      label: "General Settings",
      to: { name: "general" },
      icon: "settings-2",
    },
    {
      label: "System Limits",
      to: { name: "systemConstants" },
      icon: "database",
    },
    {
      label: "Translations",
      to: { name: "translations" },
      icon: "languages",
    },
    {
      label: "Alarms & Faults",
      to: { name: "faults" },
      icon: "triangle-alert",
    },
    {
      label: "Compliance (21 CFR)",
      to: { name: "cfr21" },
      icon: "shield-check",
    },
    {
      label: "User Management",
      to: { name: "roles" },
      icon: "users",
    },
  ] as StaticNavItem[],
  architecture: [
    {
      label: "Modules",
      to: { name: "module" },
      icon: "boxes",
      showsModuleError: true,
    },
    {
      label: "Process Buttons",
      to: { name: "processButtons" },
      icon: "panel-left",
    },
    {
      label: "Cycle Buttons",
      to: { name: "cycleButtons" },
      icon: "refresh-cw",
    },
    {
      label: "Counters & Cadences",
      to: { name: "counters" },
      icon: "calculator",
    },
    {
      label: "Message Boxes",
      to: { name: "messageBox" },
      icon: "message-square",
    },
  ] as StaticNavItem[],
};
