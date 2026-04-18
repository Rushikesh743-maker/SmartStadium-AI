import { describe, it, expect } from "vitest";
import { generateAlerts } from "../lib/stadium-data";

describe("Alerts System", () => {
  it("should return an array", () => {
    const result = generateAlerts();
    expect(Array.isArray(result)).toBe(true);
  });
});
