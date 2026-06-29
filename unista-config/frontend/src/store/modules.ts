import { computed, ref } from "vue";
import type { MachineModule } from "../types";
import { generateId, makeParams, reindex } from "../utils/helpers";

const makeCleanParams = (prefix: string, count = 16) => {
  return makeParams(prefix, count).map((p, i) => ({
    ...p,
    name: `${prefix} ${i + 1}`,
  }));
};

const makeModule = (index: number, open = false): MachineModule => ({
  id: generateId(),
  index,
  enable: true,
  name: `EM${index}`,
  commentFr: "",
  commentEn: "",
  commentDe: "",
  commentEs: "",
  detail: "",
  reserve1: "",
  reserve2: "",
  isEM: false,
  ui: {
    showModuleProps: open,
    showBools: false,
    showInts: false,
    showReals: false,
    showStrings: false,
  },
  paramBools: makeCleanParams("BOOL"),
  paramInts: makeCleanParams("INT"),
  paramReals: makeCleanParams("REAL"),
  paramStrings: makeCleanParams("STRING"),
});

export const modules = ref<MachineModule[]>([
  { ...makeModule(1), commentFr: "Commentaire", detail: "Details" },
  { ...makeModule(2) },
  { ...makeModule(3) },
  { ...makeModule(4) },
]);

export const addModuleAction = () => {
  // Hard limit locked to 8 Modules maximum
  if (modules.value.length >= 8) return;
  modules.value.push(makeModule(modules.value.length + 1, true));
  reindex(modules.value);
};

export const removeModule = (index: number) => {
  modules.value.splice(index, 1);
  reindex(modules.value);
};

export const syncModuleIndexes = () => reindex(modules.value);

export const getModuleErrors = computed(() => {
  const active = modules.value.filter((m) => m.enable);
  return modules.value.reduce(
    (acc, m) => {
      if (!m.enable) {
        acc[m.id] = false;
        return acc;
      }
      const isDup = active.some(
        (other) => other.id !== m.id && other.name === m.name,
      );
      acc[m.id] = !m.name || m.name.trim() === "" || isDup;
      return acc;
    },
    {} as Record<string, boolean>,
  );
});

export const getModuleErrorMessage = (m: MachineModule) => {
  if (!m.name || m.name.trim() === "") return "Name required";
  return "Name must be unique";
};
