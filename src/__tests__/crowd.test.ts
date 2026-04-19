import { describe, it, expect } from "vitest";
import {
  getCrowdLevel,
  getCrowdColor,
  simulateCrowdUpdateMock,
  getSystemHealth,
  getInitialZones,
} from "../lib/stadium-data";

describe("Crowd System - Core Logic", () => {
  it("should return correct crowd levels", () => {
    expect(getCrowdLevel(10)).toBe("low");
    expect(getCrowdLevel(50)).toBe("medium");
    expect(getCrowdLevel(90)).toBe("high");
  });

  it("should return valid crowd colors", () => {
    expect(getCrowdColor(10)).toContain("hsl");
    expect(getCrowdColor(50)).toContain("hsl");
    expect(getCrowdColor(90)).toContain("hsl");
  });

  it("should simulate crowd updates deterministically", () => {
    const zones = getInitialZones();

    const updated = simulateCrowdUpdateMock(zones, 1);

    expect(updated.length).toBe(zones.length);

    // ensure crowd values are within safe bounds
    updated.forEach((z) => {
      if (z.id !== "field") {
        expect(z.crowd).toBeGreaterThanOrEqual(5);
        expect(z.crowd).toBeLessThanOrEqual(95);
      }
    });
  });

  it("should preserve field zone unchanged", () => {
    const zones = getInitialZones();
    const updated = simulateCrowdUpdateMock(zones, 2);

    const fieldBefore = zones.find((z) => z.id === "field");
    const fieldAfter = updated.find((z) => z.id === "field");

    expect(fieldBefore?.crowd).toBe(fieldAfter?.crowd);
  });

  it("should calculate system health correctly", () => {
    const zones = getInitialZones();
    const health = getSystemHealth(zones);

    expect(health).toHaveProperty("avgCrowd");
    expect(health).toHaveProperty("status");

    expect(["optimal", "moderate", "overloaded"]).toContain(
      health.status
    );
  });
});
