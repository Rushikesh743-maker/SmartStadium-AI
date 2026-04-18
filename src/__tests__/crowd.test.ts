import { describe, it, expect } from "vitest";
import { getCrowdLevel } from "@/utils/stadium-data";

describe("Crowd System", () => {
  it("LOW crowd", () => {
    expect(getCrowdLevel(20)).toBe("LOW");
  });

  it("HIGH crowd", () => {
    expect(getCrowdLevel(90)).toBe("HIGH");
  });
});
