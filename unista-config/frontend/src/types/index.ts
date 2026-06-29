/**
 * Standardized interfaces for parameters, steps, and equipment.
 */

export interface Translations {
  commentFr: string;
  commentEn: string;
  commentDe: string;
  commentEs: string;
}

export interface Reserves {
  reserve1: string;
  reserve2: string;
}

export interface NamedEntity {
  name: string;
}

export interface DescribedEntity extends NamedEntity, Translations, Reserves {
  detail: string;
}

export interface CycleStep extends Translations, Reserves {
  stepId: number;
}

export interface Parameter extends DescribedEntity {
  id: number;
  actif: boolean;
  resetVisible?: boolean;
  robotMask: string;
  // Map: { [robotIndex]: varIndex }
  robotVarIndex: Record<number, number | null>;
  robotVarName?: string;
  steps?: CycleStep[];
  // Attributes for Alarms & Faults
  faultCode?: string;
  severity?: number;
  // Dynamic value based on ConfigField default
  value?: any;
}

export interface SidebarCapabilities {
  showName: boolean;
  showTranslations: boolean;
  showReserves: boolean;
  showRobot: boolean;
  showRobotVarName?: boolean;
  showResetVisible?: boolean;
  showStepsConfig?: boolean;
  showFaultInfo?: boolean;
}

export interface ConfigField {
  label: string;
  field: string;
  type: "select" | "boolean" | "number" | "text";
  options?: readonly string[];
  defaultValue?: string | number | boolean;
}

export interface PageDefinition {
  type: string;
  label: string;
  prefix: string;
  maxSlots: number;
  menuIcon: string;
}

export interface MachinePage extends DescribedEntity {
  id: string;
  index: number;
  enable: boolean;
  isEM: boolean;
  ui: {
    showProps: boolean;
    showBools: boolean;
    showInts: boolean;
    showReals: boolean;
    showStrings: boolean;
  };
  paramBools: Parameter[];
  paramInts: Parameter[];
  paramReals: Parameter[];
  paramStrings: Parameter[];
}

export type MachineProduct = MachinePage;

export interface EquipmentDefinition {
  type: string;
  label: string;
  prefix: string;
  hasEmLink: boolean;
  hasParameters?: boolean;
  menuIcon?: string;
  configIcon?: string;
  configFields: ConfigField[];
  controllerIcon?: string;
  controllerFields?: ConfigField[];
  processIcon?: string;
  processFields?: ConfigField[];
  // Unified parameters approach
  parameterFields?: ConfigField[];
  sidebarCapabilities: SidebarCapabilities;
}

export interface BaseEquipment extends DescribedEntity {
  id: string;
  type: string;
  index: number;
  enable: boolean;
  emId: string | null;
  robotId?: string | null;
  cycleTime: number;
  ui: {
    showProps: boolean;
    showConfiguration: boolean;
    showParams: boolean;
    showController?: boolean;
    showProcess?: boolean;
  };
  parameters: Parameter[];
  // Allow dynamic injection of root configuration fields
  [key: string]: any;
}

export interface MachineModule extends DescribedEntity {
  id: string;
  index: number;
  enable: boolean;
  isEM: boolean;
  ui: {
    showModuleProps: boolean;
    showBools: boolean;
    showInts: boolean;
    showReals: boolean;
    showStrings: boolean;
  };
  paramBools: Parameter[];
  paramInts: Parameter[];
  paramReals: Parameter[];
  paramStrings: Parameter[];
}

export interface ButtonEntity extends NamedEntity {
  id: string;
  linkedTo: string;
  ui: {
    showToggles: boolean;
    showMomentaries: boolean;
  };
  toggleButtons: Parameter[];
  momentaryButtons: Parameter[];
}

export interface CycleButtonEntity extends NamedEntity {
  id: string;
  linkedTo: string;
  ui: {
    showCycles: boolean;
  };
  cycles: Parameter[];
}

export interface CounterGroup extends NamedEntity {
  id: string;
  ui: {
    show: boolean;
  };
  parameters: Parameter[];
}

export interface MessageBoxEntity extends NamedEntity {
  id: string;
  index: number;
  ui: {
    showTitle: boolean;
    showLine1: boolean;
    showLine2: boolean;
    showBtnLeft: boolean;
    showBtnRight: boolean;
  };
  title: Parameter;
  line1: Parameter;
  line2: Parameter;
  btnLeft: Parameter;
  btnRight: Parameter;
}

export interface FaultType extends NamedEntity {
  index: number;
  details: string;
}

export interface ArchitectureLimit extends NamedEntity {
  index: number;
  max: number;
}

/**
 * Alarms and Faults Categories
 */
export interface FaultCategory extends NamedEntity {
  ui: { show: boolean };
  items: Parameter[];
}

export interface FaultGroup extends NamedEntity {
  id: string;
  categories: FaultCategory[];
}
