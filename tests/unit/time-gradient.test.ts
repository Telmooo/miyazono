import { describe, test, expect } from "vitest";
import { getTimeOfDay, getGradientVar } from "../../src/utils/time-gradient";

describe("getTimeOfDay", () => {
  test.each([
    [6, "morning"],
    [9, "morning"],
    [11, "morning"],
    [12, "afternoon"],
    [15, "afternoon"],
    [17, "afternoon"],
    [18, "sunset"],
    [19, "sunset"],
    [20, "sunset"],
    [21, "night"],
    [23, "night"],
    [0, "night"],
    [3, "night"],
    [5, "night"],
  ] as const)("hour %i maps to %s", (hour, expected) => {
    expect(getTimeOfDay(hour)).toBe(expected);
  });
});

describe("getGradientVar", () => {
  test("returns correct CSS variable for each time of day", () => {
    expect(getGradientVar("morning")).toBe("var(--gradient-morning)");
    expect(getGradientVar("afternoon")).toBe("var(--gradient-afternoon)");
    expect(getGradientVar("sunset")).toBe("var(--gradient-sunset)");
    expect(getGradientVar("night")).toBe("var(--gradient-night)");
  });
});
