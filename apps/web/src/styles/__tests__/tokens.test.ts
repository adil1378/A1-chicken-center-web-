import { describe, it, expect } from "vitest";
import { colors, breakpoints } from "../tokens";

describe("Design System Tokens", () => {
  it("defines brand red tokens accurately", () => {
    expect(colors.brand.primary).toBe("#DC2626");
    expect(colors.brand.crimson).toBe("#991B1B");
    expect(colors.brand.dark).toBe("#7F1D1D");
  });

  it("defines background dark tokens accurately", () => {
    expect(colors.black.deep).toBe("#08080A");
    expect(colors.black.surface).toBe("#121215");
  });

  it("defines responsive breakpoints matching specification", () => {
    expect(breakpoints.sm).toBe("640px");
    expect(breakpoints.md).toBe("768px");
    expect(breakpoints.lg).toBe("1024px");
    expect(breakpoints.xl).toBe("1280px");
    expect(breakpoints["2xl"]).toBe("1536px");
  });
});
