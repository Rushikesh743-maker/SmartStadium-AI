import { describe, it, expect } from "vitest";
import { getCrowdLevel } from "../utils/stadium-data";

describe("Crowd System", () => {
  it("should return a valid crowd level", () => {
    const level = getCrowdLevel(50);
    expect(level).toBeDefined();
  });
});
