import { describe, it, expect } from "vitest";
import { generateAlerts } from "../lib/stadium-data";

describe("Alerts System", () => {
  it("should return an array", () => {
    const mockZones = [
      { id: "1", name: "Gate A", type: "gate", crowd: 80 },
      { id: "2", name: "Zone B", type: "area", crowd: 30 }
    ];

    const result = generateAlerts(mockZones);
    expect(Array.isArray(result)).toBe(true);
  });
});
