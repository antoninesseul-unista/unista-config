/**
 * Interface contract for Hardware Reference retrieval.
 * Adheres to the Dependency Inversion Principle (DIP).
 */
export interface IHardwareReferenceProvider {
  getReferences(): string[];
}

/**
 * Temporary isolated implementation for default hardware references.
 * Designed to be easily swapped with the real PLC hardware tree provider later.
 */
export class TemporaryHardwareProvider implements IHardwareReferenceProvider {
  public getReferences(): string[] {
    return ["Hardware 1", "Hardware 2", "Hardware 3"];
  }
}

export const hardwareProvider = new TemporaryHardwareProvider();
