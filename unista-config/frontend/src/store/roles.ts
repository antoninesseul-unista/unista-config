import { ref } from "vue";

/**
 * Global state for Roles
 */
export const rolesState = ref([
  { name: "Unista", bitIndex: 8, bitValue: 128 },
  { name: "Admin", bitIndex: 7, bitValue: 64 },
  { name: "Maintenance", bitIndex: 6, bitValue: 32 },
  { name: "Adjuster", bitIndex: 5, bitValue: 16 },
  { name: "Operator1", bitIndex: 4, bitValue: 8 },
  { name: "Operator2", bitIndex: 3, bitValue: 4 },
  { name: "Reserve1", bitIndex: 2, bitValue: 2 },
  { name: "Reserve2", bitIndex: 1, bitValue: 1 },
]);

/**
 * Global state for Permission Matrix
 */
export const permissionMatrixState = ref([
  {
    name: "Production",
    isOpen: true,
    color: "text-blue-500",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />`,
    items: [
      {
        action: "Use cycle buttons",
        values: [true, true, true, true, true, true, false, false],
      },
      {
        action: "Use operation modes",
        values: [true, true, true, true, true, true, false, false],
      },
    ],
  },
  {
    name: "Settings",
    isOpen: true,
    color: "text-purple-500",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>`,
    items: [
      {
        action: "Export recipes",
        values: [true, true, true, true, false, false, false, false],
      },
      {
        action: "Start and stop recipe in production",
        values: [true, true, true, true, true, true, false, false],
      },
      {
        action: "Start, stop, and view recipe in development",
        values: [true, true, true, true, false, false, false, false],
      },
      {
        action: "Rename recipe / change status",
        values: [true, true, true, true, false, false, false, false],
      },
      {
        action: "Create a new recipe",
        values: [true, true, true, true, false, false, false, false],
      },
      {
        action: "Change parameter value",
        values: [true, true, true, true, false, false, false, false],
      },
      {
        action: "Change min/max/IsRecipe of a parameter",
        values: [true, true, false, false, false, false, false, false],
      },
    ],
  },
  {
    name: "Maintenance",
    isOpen: true,
    color: "text-orange-500",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />`,
    items: [
      {
        action: "Access control / diagnostics",
        values: [true, true, true, false, false, false, false, false],
      },
      {
        action: "Reset encoder / Autotune / Brake release / Home",
        values: [true, true, true, false, false, false, false, false],
      },
      {
        action: "Access Synology",
        values: [true, true, true, false, false, false, false, false],
      },
      {
        action: "Access remote connection",
        values: [true, true, true, false, false, false, false, false],
      },
      {
        action: "Access cameras",
        values: [true, true, true, false, false, false, false, false],
      },
    ],
  },
  {
    name: "User",
    isOpen: true,
    color: "text-teal-500",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />`,
    items: [
      {
        action: "View user list",
        values: [true, true, false, false, false, false, false, false],
      },
      {
        action: "Add a user",
        values: [true, true, false, false, false, false, false, false],
      },
      {
        action: "Modify roles",
        values: [true, true, false, false, false, false, false, false],
      },
      {
        action: "Modify profiles",
        values: [true, true, false, false, false, false, false, false],
      },
      {
        action: "Lock a user",
        values: [true, true, false, false, false, false, false, false],
      },
      {
        action: "Deactivate a user",
        values: [true, true, false, false, false, false, false, false],
      },
      {
        action: "View user history",
        values: [true, true, false, false, false, false, false, false],
      },
      {
        action: "Export users",
        values: [true, true, false, false, false, false, false, false],
      },
    ],
  },
]);
