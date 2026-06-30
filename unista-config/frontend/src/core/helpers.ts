import { models } from "../../wailsjs/go/models";

export const generateId = (): string => Math.random().toString(36).substring(2, 11);

export const reindex = (list: { index: number }[]) => {
  list.forEach((item, i) => {
    item.index = i + 1;
  });
};

export const makeParams = (prefix: string, count: number): models.Parameter[] =>
  Array.from(
    { length: count },
    (_, i) =>
      ({
        id: i + 1,
        name: `${prefix} ${i + 1}`,
        actif: false,
        robotMask: "0",
        robotVarIndex: {},
        commentFr: "",
        commentEn: "",
        commentDe: "",
        commentEs: "",
        detail: "",
        reserve1: "",
        reserve2: "",
      }) as models.Parameter,
  );

export const makeParam = (name: string, id: number): models.Parameter =>
  ({
    id,
    name,
    actif: true,
    robotMask: "0",
    robotVarIndex: {},
    commentFr: "",
    commentEn: "",
    commentDe: "",
    commentEs: "",
    detail: "",
    reserve1: "",
    reserve2: "",
  }) as models.Parameter;

export function countActive(params: readonly models.Parameter[]) {
  return params.reduce((n, p) => n + (p.actif ? 1 : 0), 0);
}

export const makeCleanParams = (prefix: string, count = 16): models.Parameter[] =>
  makeParams(prefix, count).map((p, i) => ({ ...p, name: `${prefix} ${i + 1}` })) as models.Parameter[];

export const makeModule = (index: number, open = false): models.MachineModule =>
  ({
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
  }) as models.MachineModule;

export const generateStepsFor = (emIndex: number, cycleNum: number): models.CycleStep[] =>
  Array.from(
    { length: 5 },
    (_, i) =>
      ({
        stepId: i + 1,
        commentFr: "",
        commentEn: "",
        commentDe: "",
        commentEs: "",
        reserve1: "",
        reserve2: "",
      }) as models.CycleStep,
  );
