import type { Parameter } from "../types";

export function countActive(params: readonly Parameter[]) {
  return params.reduce((n, p) => n + (p.actif ? 1 : 0), 0);
}
