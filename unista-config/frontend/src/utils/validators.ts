/**
 * Validates IPv4 address format.
 * Used across the application to ensure DRY validation logic.
 * Replaces the costly regex matching previously done via Wails/Go.
 */
export const isValidIPAddress = (ip?: string | null): boolean => {
  if (!ip || ip.trim() === "") return false;
  const regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip.trim());
};

/**
 * Ensures a variable name respects PLC syntax rules (e.g., no leading digit).
 * Runs instantly on the frontend during user input.
 */
export const sanitizeVariableName = (raw: string): string => {
  let clean = raw.replace(/[^a-zA-Z0-9_]/g, "");
  // Prevent leading digits which break Structured Text compilation
  if (clean.length > 0 && /[0-9]/.test(clean[0])) {
    clean = "_" + clean;
  }
  return clean;
};
