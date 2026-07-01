/**
 * Default state factories — no imports from state/stores to avoid circular dependencies.
 */
import { models } from "../../wailsjs/go/models";
import type { EquipmentInstance } from "../config/equipment";
import {
  generateStepsFor,
  generateId,
  makeModule,
  makeParam,
  makeParams,
} from "./helpers";

export interface TranslationRow {
  id: string;
  fr: string;
  en: string;
  de: string;
  es: string;
  it: string;
  res1: string;
  res2: string;
}

export type FaultTypeSeed = { index: number; name: string; details: string };
export type ArchitectureLimitSeed = {
  index: number;
  name: string;
  max: number;
};

export const createDefaultModules = (): models.MachineModule[] => [
  {
    ...makeModule(1),
    commentFr: "Commentaire",
    detail: "Details",
  } as models.MachineModule,
  { ...makeModule(2) } as models.MachineModule,
  { ...makeModule(3) } as models.MachineModule,
  { ...makeModule(4) } as models.MachineModule,
];

const createButtonParams = (
  prefix: string,
  count: number,
): models.Parameter[] =>
  Array.from(
    { length: count },
    (_, i) => makeParam(`${prefix} ${i + 1}`, i + 1) as models.Parameter,
  );

export const createDefaultButtons = (): models.ButtonEntity[] => [
  {
    id: generateId(),
    linkedTo: "UM",
    name: "UM",
    ui: { showToggles: true, showMomentaries: true },
    toggleButtons: createButtonParams("Toggle Button", 15),
    momentaryButtons: createButtonParams("Momentary Button", 15),
  } as models.ButtonEntity,
];

const createMachineRate = (): models.CounterGroup => {
  const p = makeParam("Machine Rate", 1) as models.Parameter;
  p.actif = false;
  p.commentFr = "Cadence machine";
  p.commentEn = "Machine rate";
  p.commentDe = "Maschinenrate";
  p.commentEs = "Rendimiento de la máquina";
  return {
    id: generateId(),
    name: "Machine Rate",
    ui: { show: true },
    parameters: [p],
  } as models.CounterGroup;
};

const createProductCounters = (): models.CounterGroup => {
  const params = Array.from({ length: 100 }, (_, i) => {
    const p = makeParam(`Counter ${i + 1}`, i + 1) as models.Parameter;
    p.actif = false;
    return p;
  });
  params[0].commentFr = "Compteurs produits";
  params[0].commentEn = "Products counters";
  params[0].commentDe = "Produktzähler";
  params[0].commentEs = "Contadores de productos";
  return {
    id: generateId(),
    name: "Product Counters",
    ui: { show: true },
    parameters: params,
  } as models.CounterGroup;
};

const createGeneralCadences = (): models.CounterGroup => {
  const params = Array.from({ length: 5 }, (_, i) => {
    const p = makeParam(`Cadence ${i + 1}`, i + 1) as models.Parameter;
    p.actif = false;
    if (i === 0) {
      p.commentFr = "Cadence entrée machine";
      p.commentEn = "Infeed rate";
    } else if (i === 1) {
      p.commentFr = "Cadence magasins carton";
      p.commentEn = "Box magazines rate";
    } else if (i === 2) {
      p.commentFr = "Cadence sortie cartons";
      p.commentEn = "Outfeed rate";
    }
    return p;
  });
  return {
    id: generateId(),
    name: "General Cadences",
    ui: { show: true },
    parameters: params,
  } as models.CounterGroup;
};

export const createDefaultCounters = (): models.CounterGroup[] => [
  createMachineRate(),
  createProductCounters(),
  createGeneralCadences(),
];

const createMsgParam = (name: string, id: number): models.Parameter => {
  const p = makeParam(name, id) as models.Parameter;
  p.actif = true;
  return p;
};

export const createDefaultMessageBoxes = (): models.MessageBoxEntity[] =>
  Array.from({ length: 20 }, (_, i) => {
    const index = i + 1;
    return {
      id: generateId(),
      index,
      name: `Message Box ${index}`,
      ui: {
        showTitle: false,
        showLine1: false,
        showLine2: false,
        showBtnLeft: false,
        showBtnRight: false,
      },
      title: createMsgParam("Title", index * 10 + 1),
      line1: createMsgParam("Ligne 1", index * 10 + 2),
      line2: createMsgParam("Ligne 2", index * 10 + 3),
      btnLeft: createMsgParam("Button left", index * 10 + 4),
      btnRight: createMsgParam("Button right", index * 10 + 5),
    } as models.MessageBoxEntity;
  });

const makeFault = (
  id: number,
  faultCode: string,
  severity: number,
  fr: string,
  en = "",
  de = "",
  es = "",
): models.Parameter => {
  const p = makeParam(fr || `Fault ${faultCode}`, id);
  p.faultCode = faultCode;
  p.severity = severity;
  p.commentFr = fr;
  p.commentEn = en;
  p.commentDe = de;
  p.commentEs = es;
  p.actif = true;
  return p;
};

export const createDefaultSafetyCategories = (): models.FaultCategory[] => {
  const estops = Array.from({ length: 40 }, (_, i) => {
    const id = i + 1;
    return makeFault(
      id,
      `1025001${id.toString().padStart(2, "0")}`,
      1,
      `Arret d'urgence ${id}`,
      `Emergency Stop ${id}`,
    );
  });
  const doors = Array.from({ length: 40 }, (_, i) => {
    const id = i + 1;
    const fr = id <= 9 ? `Porte ${id} ouverte` : `Porte XX ouvertes`;
    const en = id <= 9 ? `Door ${id} opened` : `Door XX open`;
    return makeFault(id, `1025002${id.toString().padStart(2, "0")}`, 1, fr, en);
  });
  const safFuncs = Array.from({ length: 40 }, (_, i) =>
    makeFault(i + 1, `1025003${(i + 1).toString().padStart(2, "0")}`, 1, ""),
  );
  const safFaults = Array.from({ length: 40 }, (_, i) =>
    makeFault(i + 1, `1025004${(i + 1).toString().padStart(2, "0")}`, 1, ""),
  );
  return [
    { name: "Emergency Stops (251)", ui: { show: false }, items: estops },
    { name: "Machine Access (252)", ui: { show: false }, items: doors },
    { name: "Safety Functions (253)", ui: { show: false }, items: safFuncs },
    { name: "Safety Faults (254)", ui: { show: false }, items: safFaults },
  ] as models.FaultCategory[];
};

export const createDefaultProcessCategories = (): models.FaultCategory[] => {
  const umItems = Array.from({ length: 40 }, (_, i) => {
    const id = i + 1;
    return makeFault(
      id,
      `020000${id.toString().padStart(2, "0")}`,
      2,
      `UM Défaut process ${id}`,
      `UM Process fault ${id}`,
    );
  });
  const categories: models.FaultCategory[] = [
    { name: "UM Process Faults (EM0)", ui: { show: false }, items: umItems },
  ] as models.FaultCategory[];
  for (let em = 1; em <= 8; em++) {
    const items = Array.from({ length: 40 }, (_, i) => {
      const id = i + 1;
      return makeFault(
        id,
        `${em}20000${id.toString().padStart(2, "0")}`,
        2,
        `EM${em} Défaut process ${id}`,
        `EM${em} Process fault ${id}`,
      );
    });
    categories.push({
      name: `EM${em} Process Faults`,
      ui: { show: false },
      items,
    } as models.FaultCategory);
  }
  return categories;
};

export const createDefaultEquipmentCategories = (): models.FaultCategory[] => {
  const eqMap = [
    { fam: "202", name: "Electrovalve" },
    { fam: "203", name: "Vacuum" },
    { fam: "204", name: "DigInput" },
    { fam: "208", name: "Axis" },
    { fam: "210", name: "Camera" },
    { fam: "211", name: "Robot" },
  ];
  return eqMap.map((eq) => {
    const items = Array.from({ length: 15 }, (_, i) => {
      const id = i + 1;
      return makeFault(
        id,
        `X${eq.fam}YYY${id.toString().padStart(2, "0")}`,
        2,
        `Défaut ${eq.name} ${id}`,
      );
    });
    return {
      name: `${eq.name} Templates (${eq.fam})`,
      ui: { show: false },
      items,
    };
  }) as models.FaultCategory[];
};

export const createDefaultEquipment = (): Record<
  string,
  EquipmentInstance[]
> => ({});

export const createDefaultPages = (): Record<
  string,
  models.MachinePage[]
> => ({});

export const createDefaultFaultTypes = (): FaultTypeSeed[] => [
  { index: 1, name: "FAULT_IMMEDIAT", details: "Bloquant Immediat" },
  { index: 2, name: "FAULT_ENDCYCLE", details: "Bloquant Fin de cycle" },
  { index: 3, name: "ALARM", details: "Non Bloquant" },
  { index: 4, name: "MESSAGE", details: "Message Opérateur" },
];

export const createDefaultArchitectureLimits = (): ArchitectureLimitSeed[] => {
  const limits: ArchitectureLimitSeed[] = [
    { index: 1, name: "ELECTROVALVES", max: 120 },
    { index: 2, name: "VACUUMS", max: 48 },
    { index: 3, name: "DIG_INPUTS", max: 200 },
    { index: 4, name: "ANA_INPUTS", max: 24 },
    { index: 5, name: "ANA_OUTPUTS", max: 24 },
    { index: 6, name: "DIRECT_MOTORS", max: 80 },
    { index: 7, name: "AXIS", max: 60 },
    { index: 8, name: "AXIS_POINTS", max: 200 },
    { index: 9, name: "CAMERAS", max: 20 },
    { index: 10, name: "ROBOTS", max: 8 },
    { index: 11, name: "WORKPLACES", max: 192 },
    { index: 12, name: "ROBOT_POINTS", max: 255 },
    { index: 13, name: "MECHATRO", max: 1 },
    { index: 14, name: "", max: 0 },
    { index: 15, name: "MECHATRO_POINTS", max: 30 },
    { index: 16, name: "", max: 0 },
    { index: 17, name: "", max: 0 },
    { index: 18, name: "", max: 0 },
    { index: 19, name: "PROCESS", max: 1 },
    { index: 20, name: "PRODUCTS", max: 8 },
    { index: 21, name: "SETTINGS", max: 1 },
    { index: 22, name: "FUNCTION", max: 6 },
    { index: 23, name: "CHECKLIST", max: 1 },
    { index: 24, name: "SAFETY", max: 5 },
    { index: 25, name: "", max: 0 },
    { index: 26, name: "", max: 0 },
    { index: 27, name: "", max: 0 },
    { index: 28, name: "", max: 0 },
    { index: 29, name: "HWD_SAF", max: 1 },
    { index: 30, name: "HWD_STD", max: 1 },
    { index: 31, name: "HWD_COM", max: 1 },
    { index: 32, name: "IHM", max: 1 },
  ];
  for (let i = 33; i <= 99; i++) limits.push({ index: i, name: "", max: 0 });
  return limits;
};

export const createDefaultGeneralConfig = () => ({
  projectNumber: "",
  serialNumber: "00000000",
  machineName: "",
  machineIpAddress: "192.168.200.2",
  machineSubnetMask: "255.255.240.0",
  ethernetIpAddress: "192.168.150.2",
  ethernetSubnetMask: "255.255.255.0",
});

export const createDefaultCfr21 = () => ({
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

export const createDefaultRolesList = () => [
  { name: "Unista", bitIndex: 8, bitValue: 128 },
  { name: "Admin", bitIndex: 7, bitValue: 64 },
  { name: "Maintenance", bitIndex: 6, bitValue: 32 },
  { name: "Adjuster", bitIndex: 5, bitValue: 16 },
  { name: "Operator1", bitIndex: 4, bitValue: 8 },
  { name: "Operator2", bitIndex: 3, bitValue: 4 },
  { name: "Reserve1", bitIndex: 2, bitValue: 2 },
  { name: "Reserve2", bitIndex: 1, bitValue: 1 },
];

export const createDefaultPermissionMatrix = () => [
  {
    name: "Production",
    isOpen: true,
    color: "text-blue-500",
    icon: "boxes",
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
    icon: "settings",
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
    icon: "wrench",
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
    icon: "users",
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
];

export const createDefaultTranslations = (): TranslationRow[] => [];

export const createDefaultCycleButtons = (): models.CycleButtonEntity[] => [];

/** Re-export for cycle button factory used by cycleButtons store */
export const createCycleParams = (emIndex: number): models.Parameter[] =>
  Array.from({ length: 15 }, (_, i) => {
    const num = i + 1;
    const param = makeParam(`Cycle ${num}`, num) as models.Parameter;
    param.actif = false;
    param.resetVisible = false;
    param.steps = generateStepsFor(emIndex, num) as models.CycleStep[];
    return param;
  });
