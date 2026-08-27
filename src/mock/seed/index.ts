import { buildMockSeedData, recomputeDerivedState, type MockSeedData } from "@/mock/seed/build";

let cached: MockSeedData | null = null;

export function getSeedData(): MockSeedData {
  if (!cached) {
    cached = buildMockSeedData();
  }
  return cached;
}

export function resetSeedData(): void {
  cached = null;
}

export { recomputeDerivedState };
export type { MockSeedData };
