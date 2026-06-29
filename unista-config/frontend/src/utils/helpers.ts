import type { Parameter } from "../types";

/**
 * Generates a unique short string ID.
 */
export const generateId = (): string =>
  Math.random().toString(36).substring(2, 11);

/**
 * Reindexes an array of items, ensuring the visual index matches the array order.
 */
export const reindex = (list: { index: number }[]) =>
  list.forEach((item, i) => (item.index = i + 1));

/**
 * Sanitizes a string to be compliant with PLC variables.
 * Ensures the name starts with a letter or underscore, and contains no special characters.
 */
export const sanitizeVariableName = (rawName: string): string => {
  let cleanName = rawName.replace(/[^a-zA-Z0-9_]/g, "");
  if (/^[0-9]/.test(cleanName)) {
    cleanName = "_" + cleanName;
  }
  return cleanName;
};

/**
 * Factory function to create a new parameter object.
 */
export const makeParam = (name: string, id: number): Parameter => ({
  id,
  name,
  actif: false,
  resetVisible: false,
  commentFr: "",
  commentEn: "",
  commentDe: "",
  commentEs: "",
  reserve1: "",
  reserve2: "",
  detail: "",
  robotMask: "",
  robotVarIndex: {},
  robotVarName: "",
});

/**
 * Generates N numbered parameters with a given prefix.
 */
export const makeParams = (prefix: string, count = 16): Parameter[] =>
  Array.from({ length: count }, (_, i) =>
    makeParam(`${prefix}${i + 1} (${i + 1})`, i + 1),
  );
