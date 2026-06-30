export const PARAM_CATEGORIES = [
  { key: "paramBools", label: "BOOL", toggleKey: "showBools", color: "bg-blue-400" },
  { key: "paramInts", label: "INT", toggleKey: "showInts", color: "bg-purple-400" },
  { key: "paramReals", label: "REAL", toggleKey: "showReals", color: "bg-orange-400" },
  { key: "paramStrings", label: "STRING", toggleKey: "showStrings", color: "bg-teal-400" },
] as const;

export type ParamCategoryKey = (typeof PARAM_CATEGORIES)[number]["key"];
